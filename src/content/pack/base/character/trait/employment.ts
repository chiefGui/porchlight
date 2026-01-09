import { World } from "../../../../../engine/index.ts";
import { Employment } from "../../../../../game/employment/index.ts";
import { defineInferredTrait } from "../../../../character/trait.ts";

export const employed = defineInferredTrait({
	id: "employed",
	name: "Employed",
	category: "employment",
	exclusive: ["unemployed"],
	infer: (context) => {
		const employment = World.getComponent(context.entity, Employment);
		return employment?.jobId != null;
	},
});

export const unemployed = defineInferredTrait({
	id: "unemployed",
	name: "Unemployed",
	category: "employment",
	exclusive: ["employed"],
	infer: (context) => {
		const employment = World.getComponent(context.entity, Employment);
		return employment?.jobId == null;
	},
});
