import { defineJob } from "../../../job/index.ts";

export const retailClerk = defineJob({
	id: "retail-clerk",
	name: "Retail Clerk",
	description: "Work at a local store helping customers and stocking shelves.",
	hourlyPay: 15,
	staminaCost: 0.15,
	hoursPerShift: 4,
	schedule: ["morning", "afternoon"],
});
