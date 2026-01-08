import {
	Component,
	type ComponentClass,
	type ComponentInstance,
	Entity,
	type EntityId,
} from "../ecs/index.ts";

export type SerializedComponent = {
	type: string;
	data: Record<string, unknown>;
};

export type SerializedEntity = {
	id: EntityId;
	components: SerializedComponent[];
};

export type SerializedGameState = {
	version: number;
	timestamp: number;
	entities: SerializedEntity[];
	metadata: Record<string, unknown>;
};

export class Serializer {
	private static componentRegistry = new Map<string, ComponentClass>();
	private static version = 1;
	private static unsubscribe: (() => void) | null = null;

	static initialize(): void {
		if (Serializer.unsubscribe) {
			return;
		}

		Serializer.unsubscribe = Component.onRegister((componentClass) => {
			Serializer.componentRegistry.set(componentClass.name, componentClass);
		});
	}

	static registerComponent(componentClass: ComponentClass): void {
		Serializer.componentRegistry.set(componentClass.name, componentClass);
	}

	static setVersion(version: number): void {
		Serializer.version = version;
	}

	static serialize(
		metadata: Record<string, unknown> = {},
	): SerializedGameState {
		const entities: SerializedEntity[] = [];

		for (const entityId of Entity.all()) {
			const serializedEntity = Serializer.serializeEntity(entityId);
			if (serializedEntity.components.length > 0) {
				entities.push(serializedEntity);
			}
		}

		return {
			version: Serializer.version,
			timestamp: Date.now(),
			entities,
			metadata,
		};
	}

	private static serializeEntity(entityId: EntityId): SerializedEntity {
		const components: SerializedComponent[] = [];

		for (const [name, componentClass] of Serializer.componentRegistry) {
			const instance = Component.get(entityId, componentClass);
			if (instance) {
				components.push({
					type: name,
					data: Serializer.serializeComponent(instance),
				});
			}
		}

		return { id: entityId, components };
	}

	private static serializeComponent(
		instance: ComponentInstance,
	): Record<string, unknown> {
		const data: Record<string, unknown> = {};

		for (const key of Object.keys(instance)) {
			const value = (instance as Record<string, unknown>)[key];
			if (Serializer.isSerializable(value)) {
				data[key] = value;
			}
		}

		return data;
	}

	private static isSerializable(value: unknown): boolean {
		if (value === null || value === undefined) return true;
		const type = typeof value;
		if (type === "string" || type === "number" || type === "boolean")
			return true;
		if (Array.isArray(value)) return value.every(Serializer.isSerializable);
		if (type === "object") {
			return Object.values(value as object).every(Serializer.isSerializable);
		}
		return false;
	}

	static deserialize(state: SerializedGameState): void {
		Entity.reset();
		Component.reset();

		Serializer.initialize();

		for (const serializedEntity of state.entities) {
			const newId = Entity.create();

			for (const serializedComponent of serializedEntity.components) {
				const componentClass = Serializer.componentRegistry.get(
					serializedComponent.type,
				);

				if (!componentClass) {
					console.warn(
						`Unknown component type: ${serializedComponent.type}. Skipping.`,
					);
					continue;
				}

				const instance = Object.assign(
					Object.create(componentClass.prototype),
					serializedComponent.data,
				);

				Component.add(newId, componentClass, instance);
			}
		}
	}

	static getMetadata(state: SerializedGameState): Record<string, unknown> {
		return state.metadata;
	}

	static reset(): void {
		if (Serializer.unsubscribe) {
			Serializer.unsubscribe();
			Serializer.unsubscribe = null;
		}
		Serializer.componentRegistry.clear();
	}
}
