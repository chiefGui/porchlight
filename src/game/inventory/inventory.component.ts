import { component } from "../../engine/index.ts";

@component()
export class Inventory {
	items: Record<string, number> = { money: 30000 };
}
