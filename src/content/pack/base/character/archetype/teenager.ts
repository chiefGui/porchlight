import { defineCharacterArchetype } from "../../../../character/archetype.ts";

export const teenager = defineCharacterArchetype({
	id: "teenager",
	name: "Teenager",
	ageRange: [13, 19],
	ageDistribution: "uniform",
	traitCategories: ["personality"],
	traitsPerCategory: 2,
	// life-stage trait "teen" is now inferred from birthdate
});
