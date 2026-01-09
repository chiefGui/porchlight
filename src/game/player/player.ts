import type { EntityId } from "../../engine/index.ts";

/**
 * Singleton representing the player.
 * The player controls a character entity in the game world.
 */
export class Player {
	private static _characterId: EntityId | null = null;

	/**
	 * Get the entity ID of the player's character.
	 */
	static getCharacterId(): EntityId | null {
		return Player._characterId;
	}

	/**
	 * Set the entity ID of the player's character.
	 */
	static setCharacterId(id: EntityId): void {
		Player._characterId = id;
	}

	/**
	 * Clear the player's character reference.
	 */
	static clear(): void {
		Player._characterId = null;
	}
}
