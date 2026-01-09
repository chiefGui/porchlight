import type { EntityId } from "../../engine/index.ts";
import { Random } from "../../engine/random/index.ts";
import { CharacterGenerator } from "../character/character-generator.ts";
import { ChatUtil } from "../chat/chat.util.ts";
import { RelationshipUtil } from "../relationship/relationship.util.ts";

/**
 * Options for generating the initial game world.
 */
export type WorldGeneratorOptions = {
	playerId: EntityId;
	/** Number of friends to generate */
	friendCount?: number;
	/** Number of family members to generate */
	familyCount?: number;
	/** Number of acquaintances to generate */
	acquaintanceCount?: number;
};

/**
 * Result of world generation.
 */
export type WorldGeneratorResult = {
	npcs: EntityId[];
	friends: EntityId[];
	family: EntityId[];
	acquaintances: EntityId[];
};

/**
 * Generates the initial game world with NPCs and relationships.
 */
export class WorldGenerator {
	/**
	 * Generate NPCs and establish relationships with the player.
	 */
	static generate(options: WorldGeneratorOptions): WorldGeneratorResult {
		const {
			playerId,
			friendCount = 3,
			familyCount = 2,
			acquaintanceCount = 2,
		} = options;

		const result: WorldGeneratorResult = {
			npcs: [],
			friends: [],
			family: [],
			acquaintances: [],
		};

		// Generate friends
		for (let i = 0; i < friendCount; i++) {
			const npc = WorldGenerator.generateNPC();
			result.npcs.push(npc);
			result.friends.push(npc);

			// Create bidirectional friend relationship
			const relationshipType = Random.pick(["friend", "close-friend"]) ?? "friend";
			const baseOpinion = relationshipType === "close-friend"
				? Random.int(60, 85)
				: Random.int(35, 60);

			RelationshipUtil.create(playerId, npc, relationshipType, baseOpinion);
		}

		// Generate family members
		const familyTypes = ["sibling", "parent", "cousin"];
		for (let i = 0; i < familyCount; i++) {
			const npc = WorldGenerator.generateNPC();
			result.npcs.push(npc);
			result.family.push(npc);

			const relationshipType = familyTypes[i % familyTypes.length];
			const baseOpinion = Random.int(30, 70);

			RelationshipUtil.create(playerId, npc, relationshipType, baseOpinion);
		}

		// Generate acquaintances
		const acquaintanceTypes = ["acquaintance", "coworker", "neighbor"];
		for (let i = 0; i < acquaintanceCount; i++) {
			const npc = WorldGenerator.generateNPC();
			result.npcs.push(npc);
			result.acquaintances.push(npc);

			const relationshipType = acquaintanceTypes[i % acquaintanceTypes.length];
			const baseOpinion = Random.int(-10, 25);

			RelationshipUtil.create(playerId, npc, relationshipType, baseOpinion);
		}

		// Generate some initial messages from NPCs
		WorldGenerator.generateInitialMessages(playerId, result);

		return result;
	}

	/**
	 * Generate a random NPC.
	 */
	private static generateNPC(): EntityId {
		const culture = Random.pick(["american", "canadian"]) ?? "american";
		const archetype = Random.pick(["adult", "adult", "adult", "teenager"]) ?? "adult"; // Bias towards adults

		return CharacterGenerator.fromArchetype({
			archetype,
			culture,
			traitsPerCategory: Random.int(2, 4),
		});
	}

	/**
	 * Generate some initial messages from NPCs to give the chat some life.
	 */
	private static generateInitialMessages(
		playerId: EntityId,
		result: WorldGeneratorResult,
	): void {
		// Friends are more likely to have sent messages
		for (const friendId of result.friends) {
			if (Random.float(0, 1) < 0.7) {
				const message = ChatUtil.generateMessage(friendId, playerId);
				ChatUtil.sendMessage(friendId, playerId, message, playerId);
			}
		}

		// Family sometimes sends messages
		for (const familyId of result.family) {
			if (Random.float(0, 1) < 0.5) {
				const message = ChatUtil.generateMessage(familyId, playerId);
				ChatUtil.sendMessage(familyId, playerId, message, playerId);
			}
		}

		// Acquaintances rarely message first
		for (const acquaintanceId of result.acquaintances) {
			if (Random.float(0, 1) < 0.2) {
				const message = ChatUtil.generateMessage(acquaintanceId, playerId);
				ChatUtil.sendMessage(acquaintanceId, playerId, message, playerId);
			}
		}
	}
}
