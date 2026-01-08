import { type EntityId, NULL_ENTITY } from "./types.ts";

export class Entity {
	private static nextId: EntityId = 1;
	private static recycled: EntityId[] = [];
	private static alive = new Set<EntityId>();

	static create(): EntityId {
		const id =
			Entity.recycled.length > 0
				? (Entity.recycled.pop() as EntityId)
				: Entity.nextId++;

		Entity.alive.add(id);
		return id;
	}

	static destroy(id: EntityId): boolean {
		if (id === NULL_ENTITY || !Entity.alive.has(id)) {
			return false;
		}

		Entity.alive.delete(id);
		Entity.recycled.push(id);
		return true;
	}

	static isAlive(id: EntityId): boolean {
		return Entity.alive.has(id);
	}

	static count(): number {
		return Entity.alive.size;
	}

	static all(): ReadonlySet<EntityId> {
		return Entity.alive;
	}

	static reset(): void {
		Entity.nextId = 1;
		Entity.recycled = [];
		Entity.alive.clear();
	}
}
