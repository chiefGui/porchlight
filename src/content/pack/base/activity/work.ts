import { defineActivity } from "../../../activity/index.ts";

export const work = defineActivity({
	id: "work",
	name: "Work",
	description: "Go to work and earn money.",
	periods: ["morning", "afternoon"],
	duration: 4,
	effects: { stamina: -0.15, money: 60 },
	requires: { tags: ["employed"], minStamina: 0.2 },
});
