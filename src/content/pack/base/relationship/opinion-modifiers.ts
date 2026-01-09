import { defineTraitInteraction } from "../../../../game/relationship/index.ts";

// -----------------------------------------------------------------------------
// Personality Trait Interactions
// -----------------------------------------------------------------------------

/**
 * Similar personalities tend to get along better.
 */
export const similarPersonalities = defineTraitInteraction({
	sameTraitBonus: {
		traits: [
			"outgoing",
			"creative",
			"athletic",
			"romantic",
			"ambitious",
			"bookworm",
			"cheerful",
		],
		bonus: 10,
	},
});

/**
 * Some traits cause friction when both people have them.
 */
export const competitiveTraits = defineTraitInteraction({
	sameTraitPenalty: {
		traits: ["ambitious"],
		penalty: 5,
	},
});

/**
 * Opposing personality traits create natural conflict.
 */
export const opposingPersonalities = defineTraitInteraction({
	opposingTraits: [
		{ trait1: "outgoing", trait2: "shy", penalty: 15 },
		{ trait1: "athletic", trait2: "lazy", penalty: 10 },
		{ trait1: "ambitious", trait2: "carefree", penalty: 10 },
		{ trait1: "cheerful", trait2: "gloomy", penalty: 15 },
	],
});

/**
 * Some trait combinations work well together.
 */
export const complementaryPersonalities = defineTraitInteraction({
	complementaryTraits: [
		{ trait1: "outgoing", trait2: "shy", bonus: 0 }, // Actually can work well
		{ trait1: "creative", trait2: "bookworm", bonus: 8 },
		{ trait1: "romantic", trait2: "cheerful", bonus: 10 },
		{ trait1: "ambitious", trait2: "athletic", bonus: 5 },
	],
});

// -----------------------------------------------------------------------------
// Life Stage Interactions
// -----------------------------------------------------------------------------

/**
 * Similar life stages create common ground.
 */
export const similarLifeStages = defineTraitInteraction({
	sameTraitBonus: {
		traits: ["teen", "adult", "elder"],
		bonus: 5,
	},
});
