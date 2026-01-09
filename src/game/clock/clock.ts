import { GameCalendar, type DayPeriod, type GameDate } from "../calendar/index.ts";

export class Clock {
	private static current: GameDate = { year: 2026, month: 1, day: 1, hour: 8 };

	static get(): GameDate {
		return Clock.current;
	}

	static set(date: GameDate): void {
		Clock.current = date;
	}

	static advance(hours = 1): void {
		Clock.current = GameCalendar.advance(Clock.current, hours);
	}

	static period(): DayPeriod {
		return GameCalendar.periodOf(Clock.current.hour ?? 0);
	}

	static reset(): void {
		Clock.current = { year: 2026, month: 1, day: 1, hour: 8 };
	}
}
