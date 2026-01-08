import "reflect-metadata";
import { Component } from "./component.ts";
import { Entity } from "./entity.ts";
import {
	type ComponentClass,
	type ComponentInstance,
	type ComponentMask,
	type EntityId,
	QUERY_METADATA_KEY,
	type QueryDescriptor,
} from "./types.ts";

export class Query<T extends ComponentInstance[] = ComponentInstance[]> {
	private static cache = new Map<string, Query>();

	private readonly allMask: ComponentMask;
	private readonly anyMask: ComponentMask;
	private readonly noneMask: ComponentMask;
	private readonly allComponents: ComponentClass[];

	private cachedResults: EntityId[] | null = null;

	private constructor(descriptor: QueryDescriptor) {
		this.allComponents = descriptor.all ?? [];
		this.allMask = Component.getMask(this.allComponents);
		this.anyMask = Component.getMask(descriptor.any ?? []);
		this.noneMask = Component.getMask(descriptor.none ?? []);
	}

	static create<C extends ComponentClass[]>(
		...components: C
	): Query<InstanceType<C[number]>[]> {
		const key = components.map((c) => c.name).join(",");

		if (Query.cache.has(key)) {
			return Query.cache.get(key) as Query<InstanceType<C[number]>[]>;
		}

		const query = new Query<InstanceType<C[number]>[]>({
			all: components,
		});
		Query.cache.set(key, query as Query);
		return query;
	}

	static fromDescriptor<C extends ComponentInstance[]>(
		descriptor: QueryDescriptor,
	): Query<C> {
		const keyParts: string[] = [];
		if (descriptor.all)
			keyParts.push(`all:${descriptor.all.map((c) => c.name).join(",")}`);
		if (descriptor.any)
			keyParts.push(`any:${descriptor.any.map((c) => c.name).join(",")}`);
		if (descriptor.none)
			keyParts.push(`none:${descriptor.none.map((c) => c.name).join(",")}`);
		const key = keyParts.join("|");

		if (Query.cache.has(key)) {
			return Query.cache.get(key) as Query<C>;
		}

		const query = new Query<C>(descriptor);
		Query.cache.set(key, query as Query);
		return query;
	}

	matches(entityId: EntityId): boolean {
		const entityMask = Component.getEntityMask(entityId);

		if (this.allMask !== 0n && (entityMask & this.allMask) !== this.allMask) {
			return false;
		}

		if (this.anyMask !== 0n && (entityMask & this.anyMask) === 0n) {
			return false;
		}

		if (this.noneMask !== 0n && (entityMask & this.noneMask) !== 0n) {
			return false;
		}

		return true;
	}

	private invalidateIfDirty(): void {
		const dirtyComponents = Component.getDirtyComponents();
		for (const componentClass of this.allComponents) {
			if (dirtyComponents.has(componentClass)) {
				this.cachedResults = null;
				break;
			}
		}
	}

	private getMatchingEntities(): EntityId[] {
		this.invalidateIfDirty();

		if (this.cachedResults !== null) {
			return this.cachedResults;
		}

		const results: EntityId[] = [];

		for (const entityId of Entity.all()) {
			if (this.matches(entityId)) {
				results.push(entityId);
			}
		}

		this.cachedResults = results;
		return results;
	}

	*[Symbol.iterator](): Iterator<[EntityId, ...T]> {
		const entities = this.getMatchingEntities();

		for (const entityId of entities) {
			if (!Entity.isAlive(entityId)) continue;

			const components = this.allComponents.map((componentClass) =>
				Component.get(entityId, componentClass),
			) as T;

			yield [entityId, ...components] as [EntityId, ...T];
		}
	}

	first(): [EntityId, ...T] | undefined {
		for (const result of this) {
			return result;
		}
		return undefined;
	}

	count(): number {
		return this.getMatchingEntities().length;
	}

	isEmpty(): boolean {
		return this.count() === 0;
	}

	toArray(): Array<[EntityId, ...T]> {
		return [...this];
	}

	static clearCache(): void {
		Query.cache.clear();
	}

	static reset(): void {
		Query.clearCache();
	}
}

export function QueryDecorator<C extends ComponentClass[]>(
	...components: C
): ParameterDecorator {
	return (target, _propertyKey, parameterIndex) => {
		const existingQueries: Map<number, ComponentClass[]> =
			Reflect.getMetadata(QUERY_METADATA_KEY, target) || new Map();

		existingQueries.set(parameterIndex, components);
		Reflect.defineMetadata(QUERY_METADATA_KEY, existingQueries, target);
	};
}
