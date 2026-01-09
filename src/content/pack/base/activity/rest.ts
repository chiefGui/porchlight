import { defineActivity } from "../../../activity/index.ts";

export const rest = defineActivity({
	id: "rest",
	name: "Rest",
	description: "Take it easy and recover some energy.",
	periods: ["morning", "afternoon", "evening"],
	duration: 2,
	effects: { stamina: 0.1 },
});
