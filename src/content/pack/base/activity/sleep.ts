import { defineActivity } from "../../../activity/index.ts";

export const sleep = defineActivity({
	id: "sleep",
	name: "Sleep",
	description: "Rest and recover energy for the next day.",
	periods: ["night"],
	duration: 8,
	effects: { stamina: 0.4 },
});
