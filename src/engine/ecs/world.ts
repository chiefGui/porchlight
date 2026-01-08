import { type Constructor, Container } from "../di/index.ts";
import { Timer, type TimerEntry } from "../timer/index.ts";
import {
	Component,
	type ComponentClass,
	type ComponentInstance,
} from "./component.ts";
import { Entity, type EntityId } from "./entity.ts";
import { Query, type QueryDescriptor } from "./query.ts";
import { Tag } from "./tag.ts";

export class World {
	static createEntity(): EntityId {
		return Entity.create();
	}

	static destroyEntity(entityId: EntityId): boolean {
		if (!Entity.isAlive(entityId)) {
			return false;
		}

		Component.removeAllFromEntity(entityId);
		Tag.removeAllFromEntity(entityId);
		Timer.removeAllFromEntity(entityId);
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

	static addTag(entityId: EntityId, ...tags: string[]): void {
		if (!Entity.isAlive(entityId)) {
			throw new Error(`Entity ${entityId} is not alive`);
		}
		Tag.add(entityId, ...tags);
	}

	static removeTag(entityId: EntityId, ...tags: string[]): void {
		Tag.remove(entityId, ...tags);
	}

	static hasTag(entityId: EntityId, tag: string): boolean {
		return Tag.has(entityId, tag);
	}

	static hasAllTags(entityId: EntityId, ...tags: string[]): boolean {
		return Tag.hasAll(entityId, ...tags);
	}

	static hasAnyTag(entityId: EntityId, ...tags: string[]): boolean {
		return Tag.hasAny(entityId, ...tags);
	}

	static getTags(entityId: EntityId): string[] {
		return Tag.all(entityId);
	}

	static setTimer(entityId: EntityId, key: string, ticks: number): void {
		if (!Entity.isAlive(entityId)) {
			throw new Error(`Entity ${entityId} is not alive`);
		}
		Timer.set(entityId, key, ticks);
	}

	static getTimer(entityId: EntityId, key: string): number | undefined {
		return Timer.get(entityId, key);
	}

	static hasTimer(entityId: EntityId, key: string): boolean {
		return Timer.has(entityId, key);
	}

	static removeTimer(entityId: EntityId, key: string): boolean {
		return Timer.remove(entityId, key);
	}

	static extendTimer(
		entityId: EntityId,
		key: string,
		additionalTicks: number,
	): void {
		Timer.extend(entityId, key, additionalTicks);
	}

	static getTimers(entityId: EntityId): TimerEntry[] {
		return Timer.all(entityId);
	}

	static reset(): void {
		Entity.reset();
		Component.reset();
		Query.reset();
		Tag.reset();
		Timer.reset();
	}

	static flushDirty(): void {
		Component.clearDirty();
		Tag.clearDirty();
	}
}

Container.registerValue(World as unknown as Constructor<World>, World);
