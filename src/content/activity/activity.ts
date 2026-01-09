import type { DayPeriod } from "../../game/calendar/index.ts";

export type ActivityEffects = {
	stamina?: number;
	money?: number;
};

export type ActivityRequirements = {
	tags?: string[];
	minStamina?: number;
	minMoney?: number;
};

export type Activity = {
	id: string;
	name: string;
	description?: string;
	periods: DayPeriod[];
	duration: number;
	effects: ActivityEffects;
	requires?: ActivityRequirements;
};

export class ActivityRegistry {
	private static byId = new Map<string, Activity>();
	private static byPeriod = new Map<DayPeriod, Activity[]>();

	static register(activity: Activity): void {
		ActivityRegistry.byId.set(activity.id, activity);

		for (const period of activity.periods) {
			const list = ActivityRegistry.byPeriod.get(period) ?? [];
			list.push(activity);
			ActivityRegistry.byPeriod.set(period, list);
		}
	}

	static get(id: string): Activity | undefined {
		return ActivityRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return ActivityRegistry.byId.has(id);
	}

	static getByPeriod(period: DayPeriod): Activity[] {
		return ActivityRegistry.byPeriod.get(period) ?? [];
	}

	static all(): IterableIterator<Activity> {
		return ActivityRegistry.byId.values();
	}

	static ids(): IterableIterator<string> {
		return ActivityRegistry.byId.keys();
	}

	static count(): number {
		return ActivityRegistry.byId.size;
	}

	static reset(): void {
		ActivityRegistry.byId.clear();
		ActivityRegistry.byPeriod.clear();
	}
}

export function defineActivity(activity: Activity): Activity {
	ActivityRegistry.register(activity);
	return activity;
}
