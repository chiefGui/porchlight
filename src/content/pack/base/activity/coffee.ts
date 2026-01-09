import { defineActivity } from "../../../activity/index.ts";

export const coffee = defineActivity({
	id: "coffee",
	name: "Go for a coffee",
	description: "Grab a coffee to start your day.",
	periods: ["morning"],
	duration: 1,
	effects: { stamina: 0.05, money: -5 },
});
