import { GameCalendar, type DayPeriod, type GameDate } from "../calendar/index.ts";

type ClockListener = () => void;

export class Clock {
	private static current: GameDate = { year: 2026, month: 1, day: 1, hour: 6 };
	private static listeners: Set<ClockListener> = new Set();

	static get(): GameDate {
		return Clock.current;
	}

	static set(date: GameDate): void {
		Clock.current = date;
		Clock.notify();
	}

	static advance(hours = 1): void {
		Clock.current = GameCalendar.advance(Clock.current, hours);
		Clock.notify();
	}

	static period(): DayPeriod {
		return GameCalendar.periodOf(Clock.current.hour ?? 0);
	}

	static reset(): void {
		Clock.current = { year: 2026, month: 1, day: 1, hour: 6 };
		Clock.notify();
	}

	static subscribe(listener: ClockListener): () => void {
		Clock.listeners.add(listener);
		return () => {
			Clock.listeners.delete(listener);
		};
	}

	private static notify(): void {
		for (const listener of Clock.listeners) {
			listener();
		}
	}
}
