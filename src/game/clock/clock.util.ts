import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { GameCalendar, type DayPeriod, type GameDate } from "../calendar/index.ts";
import { Clock } from "./clock.component.ts";

export class ClockUtil {
	static get(entity: EntityId): GameDate | undefined {
		return World.getComponent(entity, Clock)?.date;
	}

	static period(entity: EntityId): DayPeriod | undefined {
		const clock = World.getComponent(entity, Clock);
		if (!clock) return undefined;
		return GameCalendar.periodOf(clock.date.hour ?? 0);
	}

	static advance(entity: EntityId, hours = 1): void {
		const clock = World.getComponent(entity, Clock);
		if (!clock) return;
		clock.date = GameCalendar.advance(clock.date, hours);
	}

	static advancePeriod(entity: EntityId): void {
		const clock = World.getComponent(entity, Clock);
		if (!clock) return;

		const hour = clock.date.hour ?? 0;
		const currentPeriod = GameCalendar.periodOf(hour);

		let targetHour: number;
		switch (currentPeriod) {
			case "morning":
				targetHour = 12;
				break;
			case "afternoon":
				targetHour = 18;
				break;
			case "evening":
				targetHour = 22;
				break;
			case "night":
				targetHour = 6 + 24;
				break;
		}

		const hoursToAdvance = targetHour - hour;
		clock.date = GameCalendar.advance(clock.date, hoursToAdvance);
	}

	static set(entity: EntityId, date: GameDate): void {
		const clock = World.getComponent(entity, Clock);
		if (!clock) return;
		clock.date = date;
	}
}
