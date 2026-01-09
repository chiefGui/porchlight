import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import {
	ActivityRegistry,
	type Activity,
	type ActivityEffects,
} from "../../content/activity/index.ts";
import type { DayPeriod } from "../calendar/index.ts";
import { Clock } from "../clock/index.ts";
import { InventoryUtil } from "../inventory/index.ts";
import { StaminaUtil } from "../stamina/index.ts";
import { JobUtil } from "../job/index.ts";

export class ActivityUtil {
	static getAvailable(entity: EntityId): Activity[] {
		const period = Clock.period();

		const activities = ActivityRegistry.getByPeriod(period);
		return activities.filter((activity) =>
			ActivityUtil.canPerform(entity, activity.id),
		);
	}

	static canPerform(entity: EntityId, activityId: string): boolean {
		const activity = ActivityRegistry.get(activityId);
		if (!activity) return false;

		const period = Clock.period();
		if (!activity.periods.includes(period)) return false;

		const requires = activity.requires;
		if (!requires) return true;

		if (requires.minStamina !== undefined) {
			if (!StaminaUtil.has(entity, requires.minStamina)) return false;
		}

		if (requires.minMoney !== undefined) {
			if (!InventoryUtil.has(entity, "money", requires.minMoney)) return false;
		}

		if (requires.tags) {
			for (const tag of requires.tags) {
				if (!World.hasTag(entity, tag)) return false;
			}
		}

		return true;
	}

	static perform(entity: EntityId, activityId: string): boolean {
		if (!ActivityUtil.canPerform(entity, activityId)) return false;

		const activity = ActivityRegistry.get(activityId);
		if (!activity) return false;

		const effects = ActivityUtil.resolveEffects(entity, activity);

		if (effects.stamina !== undefined) {
			if (effects.stamina < 0) {
				StaminaUtil.remove(entity, Math.abs(effects.stamina));
			} else {
				StaminaUtil.add(entity, effects.stamina);
			}
		}

		if (effects.money !== undefined) {
			if (effects.money < 0) {
				InventoryUtil.remove(entity, "money", Math.abs(effects.money));
			} else {
				InventoryUtil.add(entity, "money", effects.money);
			}
		}

		Clock.advance(activity.duration);

		return true;
	}

	static resolveEffects(entity: EntityId, activity: Activity): ActivityEffects {
		if (activity.id !== "work") {
			return activity.effects;
		}

		const job = JobUtil.get(entity);
		if (!job) {
			return activity.effects;
		}

		return {
			stamina: -job.staminaCost,
			money: job.hourlyPay * job.hoursPerShift,
		};
	}

	static getCurrentPeriod(): DayPeriod {
		return Clock.period();
	}
}
