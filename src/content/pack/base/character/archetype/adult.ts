import { defineCharacterArchetype } from "../../../../character/archetype.ts";

export const adult = defineCharacterArchetype({
	id: "adult",
	name: "Adult",
	ageRange: [20, 65],
	ageDistribution: "prime",
	traitCategories: ["personality"],
	traitsPerCategory: 3,
	// life-stage trait "adult" is now inferred from birthdate
});
