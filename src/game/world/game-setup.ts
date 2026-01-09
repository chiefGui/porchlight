import type { EntityId } from "../../engine/index.ts";
import { CharacterGenerator } from "../character/character-generator.ts";
import { ChatUtil } from "../chat/chat.util.ts";
import { RelationshipUtil } from "../relationship/relationship.util.ts";

/**
 * Handles the initial game setup - creating the narrative context
 * for the player's new life.
 */
export class GameSetup {
	/**
	 * Initialize a new game with the inheritance storyline.
	 * Creates the lawyer NPC and sends the initial message about
	 * the player's deceased uncle's inheritance.
	 */
	static initialize(playerId: EntityId): void {
		// Create the lawyer NPC
		const lawyerId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			traitsPerCategory: 2,
		});

		// Establish a professional acquaintance relationship
		RelationshipUtil.create(playerId, lawyerId, "acquaintance", 15);

		// Send the inheritance message
		const lawyerName = ChatUtil.getFirstName(lawyerId);
		const message = `Hello,

My name is ${lawyerName} and I'm the attorney handling the estate of your late uncle, Harold. I'm sorry for your loss.

As per his will, you are the sole beneficiary of his estate, which includes his home at 42 Maple Drive and a sum of $30,000.

The property transfer has been completed and the funds have been deposited into your account. The house is yours to do with as you please - live in it, renovate it, or sell it.

If you have any questions about the estate or need any legal assistance settling in, don't hesitate to reach out.

Best regards,
${lawyerName}
Attorney at Law`;

		ChatUtil.sendMessage(lawyerId, playerId, message, playerId);
	}
}
