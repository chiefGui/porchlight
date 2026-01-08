import "reflect-metadata";
import type { Constructor } from "../di/index.ts";
import type { EntityId } from "./entity.ts";

export type ComponentClass<T = object> = Constructor<T>;

export type ComponentInstance = object;

export type ComponentMask = bigint;

export const COMPONENT_METADATA_KEY = Symbol("ecs:component");

export type ComponentRegistrationCallback = (
	componentClass: ComponentClass,
) => void;

export class Component {
	private static nextBit = 0;
	private static registry = new Map<ComponentClass, number>();
	private static storage = new Map<
		ComponentClass,
		Map<EntityId, ComponentInstance>
	>();
	private static entityMasks = new Map<EntityId, ComponentMask>();
	private static dirty = new Set<ComponentClass>();
	private static registrationCallbacks: ComponentRegistrationCallback[] = [];

	static onRegister(callback: ComponentRegistrationCallback): () => void {
		Component.registrationCallbacks.push(callback);

		for (const componentClass of Component.registry.keys()) {
			callback(componentClass);
		}

		return () => {
			const index = Component.registrationCallbacks.indexOf(callback);
			if (index !== -1) {
				Component.registrationCallbacks.splice(index, 1);
			}
		};
	}

	static register<T extends ComponentInstance>(
		componentClass: ComponentClass<T>,
	): number {
		if (Component.registry.has(componentClass)) {
			return Component.registry.get(componentClass) as number;
		}

		const bit = Component.nextBit++;
		Component.registry.set(componentClass, bit);
		Component.storage.set(componentClass, new Map());

		Reflect.defineMetadata(COMPONENT_METADATA_KEY, bit, componentClass);

		for (const callback of Component.registrationCallbacks) {
			callback(componentClass);
		}

		return bit;
	}

	static getBit(componentClass: ComponentClass): number {
		const bit = Component.registry.get(componentClass);
		if (bit === undefined) {
			return Component.register(componentClass);
		}
		return bit;
	}

	static getMask(componentClasses: ComponentClass[]): ComponentMask {
		let mask = 0n;
		for (const componentClass of componentClasses) {
			mask |= 1n << BigInt(Component.getBit(componentClass));
		}
		return mask;
	}

	static add<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
		instance: T,
	): void {
		const storage = Component.getStorage(componentClass);
		storage.set(entityId, instance);

		const currentMask = Component.entityMasks.get(entityId) ?? 0n;
		const bit = Component.getBit(componentClass);
		Component.entityMasks.set(entityId, currentMask | (1n << BigInt(bit)));

		Component.dirty.add(componentClass);
	}

	static remove<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	): boolean {
		const storage = Component.storage.get(componentClass);
		if (!storage?.has(entityId)) {
			return false;
		}

		storage.delete(entityId);

		const currentMask = Component.entityMasks.get(entityId) ?? 0n;
		const bit = Component.getBit(componentClass);
		const newMask = currentMask & ~(1n << BigInt(bit));

		if (newMask === 0n) {
			Component.entityMasks.delete(entityId);
		} else {
			Component.entityMasks.set(entityId, newMask);
		}

		Component.dirty.add(componentClass);
		return true;
	}

	static get<T extends ComponentInstance>(
		entityId: EntityId,
		componentClass: ComponentClass<T>,
	): T | undefined {
		const storage = Component.storage.get(componentClass);
		return storage?.get(entityId) as T | undefined;
	}

	static has(entityId: EntityId, componentClass: ComponentClass): boolean {
		const storage = Component.storage.get(componentClass);
		return storage?.has(entityId) ?? false;
	}

	static getEntityMask(entityId: EntityId): ComponentMask {
		return Component.entityMasks.get(entityId) ?? 0n;
	}

	static getStorage<T extends ComponentInstance>(
		componentClass: ComponentClass<T>,
	): Map<EntityId, T> {
		let storage = Component.storage.get(componentClass);
		if (!storage) {
			Component.register(componentClass);
			storage = Component.storage.get(componentClass);
		}
		return storage as Map<EntityId, T>;
	}

	static removeAllFromEntity(entityId: EntityId): void {
		for (const [componentClass, storage] of Component.storage) {
			if (storage.has(entityId)) {
				storage.delete(entityId);
				Component.dirty.add(componentClass);
			}
		}
		Component.entityMasks.delete(entityId);
	}

	static isDirty(componentClass: ComponentClass): boolean {
		return Component.dirty.has(componentClass);
	}

	static clearDirty(): void {
		Component.dirty.clear();
	}

	static getDirtyComponents(): ReadonlySet<ComponentClass> {
		return Component.dirty;
	}

	static reset(): void {
		Component.nextBit = 0;
		Component.registry.clear();
		Component.storage.clear();
		Component.entityMasks.clear();
		Component.dirty.clear();
		Component.registrationCallbacks = [];
	}
}

export function ComponentDecorator(): ClassDecorator {
	return (target) => {
		Component.register(target as unknown as ComponentClass);
	};
}
