import { World } from "../../../../../engine/index.ts";
import { GameCalendar } from "../../../../../game/calendar/index.ts";
import { CharacterIdentity } from "../../../../../game/character/identity.ts";
import { defineInferredTrait } from "../../../../character/trait.ts";

/**
 * Helper to compute age from entity's birthdate.
 * Returns undefined if entity has no CharacterIdentity.
 */
function getAge(context: { entity: number; currentDate: { year: number; month: number; day: number } }): number | undefined {
	const identity = World.getComponent(context.entity, CharacterIdentity);
	if (!identity) return undefined;
	return GameCalendar.age({ birthDate: identity.birthDate, currentDate: context.currentDate });
}

export const child = defineInferredTrait({
	id: "child",
	name: "Child",
	category: "life-stage",
	exclusive: ["teen", "adult", "elder"],
	infer: (context) => {
		const age = getAge(context);
		return age !== undefined && age < 13;
	},
});

export const teen = defineInferredTrait({
	id: "teen",
	name: "Teen",
	category: "life-stage",
	exclusive: ["child", "adult", "elder"],
	infer: (context) => {
		const age = getAge(context);
		return age !== undefined && age >= 13 && age < 18;
	},
});

export const adult = defineInferredTrait({
	id: "adult",
	name: "Adult",
	category: "life-stage",
	exclusive: ["child", "teen", "elder"],
	infer: (context) => {
		const age = getAge(context);
		return age !== undefined && age >= 18 && age < 65;
	},
});

export const elder = defineInferredTrait({
	id: "elder",
	name: "Elder",
	category: "life-stage",
	exclusive: ["child", "teen", "adult"],
	infer: (context) => {
		const age = getAge(context);
		return age !== undefined && age >= 65;
	},
});
