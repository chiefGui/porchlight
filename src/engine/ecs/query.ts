import "reflect-metadata";
import {
	Component,
	type ComponentClass,
	type ComponentInstance,
	type ComponentMask,
} from "./component.ts";
import { Entity, type EntityId } from "./entity.ts";
import { Tag, type TagDescriptor } from "./tag.ts";

export type QueryDescriptor = {
	all?: ComponentClass[];
	any?: ComponentClass[];
	none?: ComponentClass[];
};

export type QueryResult<T extends ComponentInstance[]> = Iterable<
	[EntityId, ...T]
>;

export const QUERY_METADATA_KEY = Symbol("ecs:query");

export class Query<T extends ComponentInstance[] = ComponentInstance[]> {
	private static cache = new Map<string, Query>();

	private readonly allMask: ComponentMask;
	private readonly anyMask: ComponentMask;
	private readonly noneMask: ComponentMask;
	private readonly allComponents: ComponentClass[];
	private readonly tagDescriptor: TagDescriptor | null;

	private cachedResults: EntityId[] | null = null;

	private constructor(
		descriptor: QueryDescriptor,
		tagDescriptor: TagDescriptor | null = null,
	) {
		this.allComponents = descriptor.all ?? [];
		this.allMask = Component.getMask(this.allComponents);
		this.anyMask = Component.getMask(descriptor.any ?? []);
		this.noneMask = Component.getMask(descriptor.none ?? []);
		this.tagDescriptor = tagDescriptor;
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

		if (this.tagDescriptor !== null) {
			if (!Tag.matchesDescriptor(entityId, this.tagDescriptor)) {
				return false;
			}
		}

		return true;
	}

	withTags(descriptor: TagDescriptor): Query<T> {
		const tagKeyParts: string[] = [];
		if (descriptor.all)
			tagKeyParts.push(`tagAll:${descriptor.all.sort().join(",")}`);
		if (descriptor.any)
			tagKeyParts.push(`tagAny:${descriptor.any.sort().join(",")}`);
		if (descriptor.none)
			tagKeyParts.push(`tagNone:${descriptor.none.sort().join(",")}`);

		const componentKeyParts: string[] = [];
		if (this.allComponents.length > 0)
			componentKeyParts.push(
				`all:${this.allComponents.map((c) => c.name).join(",")}`,
			);

		const key = [...componentKeyParts, ...tagKeyParts].join("|");

		if (Query.cache.has(key)) {
			return Query.cache.get(key) as Query<T>;
		}

		const query = new Query<T>({ all: this.allComponents }, descriptor);
		Query.cache.set(key, query as Query);
		return query;
	}

	private invalidateIfDirty(): void {
		const dirtyComponents = Component.getDirtyComponents();
		for (const componentClass of this.allComponents) {
			if (dirtyComponents.has(componentClass)) {
				this.cachedResults = null;
				return;
			}
		}

		if (this.tagDescriptor !== null && Tag.isDirty()) {
			this.cachedResults = null;
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

export function query<C extends ComponentClass[]>(
	...components: C
): ParameterDecorator {
	return (target, _propertyKey, parameterIndex) => {
		const existingQueries: Map<number, ComponentClass[]> =
			Reflect.getMetadata(QUERY_METADATA_KEY, target) || new Map();

		existingQueries.set(parameterIndex, components);
		Reflect.defineMetadata(QUERY_METADATA_KEY, existingQueries, target);
	};
}
