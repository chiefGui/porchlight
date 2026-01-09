import type { EntityId } from "../../engine/index.ts";

export class Player {
	private static entityId: EntityId | null = null;

	static get(): EntityId | null {
		return Player.entityId;
	}

	static set(id: EntityId): void {
		Player.entityId = id;
	}

	static clear(): void {
		Player.entityId = null;
	}
}
