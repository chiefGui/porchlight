import { type Constructor, Container } from "../di/index.ts";
import { Component } from "./component.ts";
import { Entity } from "./entity.ts";
import { Query } from "./query.ts";
import type {
	ComponentClass,
	ComponentInstance,
	EntityId,
	QueryDescriptor,
} from "./types.ts";

export class World {
	static createEntity(): EntityId {
		return Entity.create();
	}

	static destroyEntity(entityId: EntityId): boolean {
		if (!Entity.isAlive(entityId)) {
			return false;
		}

		Component.removeAllFromEntity(entityId);
		return Entity.destroy(entityId);
	}

	static addComponent<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
		instance?: T,
	): T {
		if (!Entity.isAlive(entityId)) {
			throw new Error(`Entity ${entityId} is not alive`);
		}

		const component = instance ?? Container.resolve(componentClass);
		Component.add(entityId, componentClass, component);
		return component;
	}

	static removeComponent<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	): boolean {
		return Component.remove(entityId, componentClass);
	}

	static getComponent<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	): T | undefined {
		return Component.get(entityId, componentClass);
	}

	static hasComponent(
		entityId: EntityId,
		componentClass: ComponentClass,
	): boolean {
		return Component.has(entityId, componentClass);
	}

	static query<C extends ComponentClass[]>(
		...components: C
	): Query<InstanceType<C[number]>[]> {
		return Query.create(...components);
	}

	static queryWith<C extends ComponentInstance[]>(
		descriptor: QueryDescriptor,
	): Query<C> {
		return Query.fromDescriptor(descriptor);
	}

	static isAlive(entityId: EntityId): boolean {
		return Entity.isAlive(entityId);
	}

	static entityCount(): number {
		return Entity.count();
	}

	static spawn(
		...components: Array<[ComponentClass, ComponentInstance] | ComponentClass>
	): EntityId {
		const entityId = World.createEntity();

		for (const item of components) {
			if (Array.isArray(item)) {
				const [componentClass, instance] = item;
				World.addComponent(entityId, componentClass, instance);
			} else {
				World.addComponent(entityId, item);
			}
		}

		return entityId;
	}

	static reset(): void {
		Entity.reset();
		Component.reset();
		Query.reset();
	}

	static flushDirty(): void {
		Component.clearDirty();
	}
}

Container.registerValue(World as unknown as Constructor<World>, World);
