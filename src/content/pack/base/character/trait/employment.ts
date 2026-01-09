import { World } from "../../../../../engine/index.ts";
import { CharacterJob } from "../../../../../game/job/index.ts";
import { defineInferredTrait } from "../../../../character/trait.ts";

export const employed = defineInferredTrait({
	id: "employed",
	name: "Employed",
	category: "employment",
	exclusive: ["unemployed"],
	infer: (context) => {
		const job = World.getComponent(context.entity, CharacterJob);
		return job?.id != null;
	},
});

export const unemployed = defineInferredTrait({
	id: "unemployed",
	name: "Unemployed",
	category: "employment",
	exclusive: ["employed"],
	infer: (context) => {
		const job = World.getComponent(context.entity, CharacterJob);
		return job?.id == null;
	},
});
