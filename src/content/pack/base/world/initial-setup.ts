import { CharacterGenerator } from "../../../../game/character/character-generator.ts";
import { ChatUtil } from "../../../../game/chat/chat.util.ts";
import { Player } from "../../../../game/player/index.ts";
import { RelationshipUtil } from "../../../../game/relationship/relationship.util.ts";

/**
 * Initial game content - the inheritance storyline.
 * Edit this file to customize the game's opening narrative.
 */
export function setupInitialContent(): void {
	const playerId = Player.get();
	if (!playerId) return;

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
