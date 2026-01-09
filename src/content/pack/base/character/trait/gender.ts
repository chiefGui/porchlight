import { World } from "../../../../../engine/index.ts";
import { CharacterIdentity } from "../../../../../game/character/identity.ts";
import { defineInferredTrait } from "../../../../character/trait.ts";

export const male = defineInferredTrait({
	id: "male",
	name: "Male",
	category: "gender",
	exclusive: ["female"],
	infer: (context) => {
		const identity = World.getComponent(context.entity, CharacterIdentity);
		return identity?.gender === "male";
	},
});

export const female = defineInferredTrait({
	id: "female",
	name: "Female",
	category: "gender",
	exclusive: ["male"],
	infer: (context) => {
		const identity = World.getComponent(context.entity, CharacterIdentity);
		return identity?.gender === "female";
	},
});
