import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { Stamina } from "./stamina.component.ts";

export class StaminaUtil {
	static get(entity: EntityId): number {
		return World.getComponent(entity, Stamina)?.value ?? 0;
	}

	static has(entity: EntityId, amount: number): boolean {
		return StaminaUtil.get(entity) >= amount;
	}

	static add(entity: EntityId, amount: number): void {
		const stamina = World.getComponent(entity, Stamina);
		if (!stamina) return;
		stamina.value = Math.min(1, stamina.value + amount);
	}

	static remove(entity: EntityId, amount: number): boolean {
		const stamina = World.getComponent(entity, Stamina);
		if (!stamina) return false;

		if (stamina.value < amount) return false;

		stamina.value = Math.max(0, stamina.value - amount);
		return true;
	}

	static set(entity: EntityId, value: number): void {
		const stamina = World.getComponent(entity, Stamina);
		if (!stamina) return;
		stamina.value = Math.max(0, Math.min(1, value));
	}
}
