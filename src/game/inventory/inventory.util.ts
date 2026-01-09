import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { Inventory } from "./inventory.component.ts";

export class InventoryUtil {
	static get(entity: EntityId, item: string): number {
		const inventory = World.getComponent(entity, Inventory);
		return inventory?.items[item] ?? 0;
	}

	static has(entity: EntityId, item: string, amount = 1): boolean {
		return InventoryUtil.get(entity, item) >= amount;
	}

	static add(entity: EntityId, item: string, amount: number): void {
		const inventory = World.getComponent(entity, Inventory);
		if (!inventory) return;
		inventory.items[item] = (inventory.items[item] ?? 0) + amount;
	}

	static remove(entity: EntityId, item: string, amount: number): boolean {
		const inventory = World.getComponent(entity, Inventory);
		if (!inventory) return false;

		const current = inventory.items[item] ?? 0;
		if (current < amount) return false;

		inventory.items[item] = current - amount;
		return true;
	}

	static set(entity: EntityId, item: string, amount: number): void {
		const inventory = World.getComponent(entity, Inventory);
		if (!inventory) return;
		inventory.items[item] = amount;
	}

	static all(entity: EntityId): Record<string, number> {
		const inventory = World.getComponent(entity, Inventory);
		return inventory?.items ?? {};
	}
}
