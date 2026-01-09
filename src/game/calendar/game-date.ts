export type GameDate = {
	year: number;
	month: number;
	day: number;
	hour?: number;
};

export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

export class GameCalendar {
	private static readonly daysInMonth = [
		31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
	];

	static age(options: { birthDate: GameDate; currentDate: GameDate }): number {
		const { birthDate, currentDate } = options;
		let age = currentDate.year - birthDate.year;

		const birthdayNotYet =
			currentDate.month < birthDate.month ||
			(currentDate.month === birthDate.month &&
				currentDate.day < birthDate.day);

		if (birthdayNotYet) {
			age--;
		}

		return Math.max(0, age);
	}

	static isBirthday(options: {
		birthDate: GameDate;
		currentDate: GameDate;
	}): boolean {
		const { birthDate, currentDate } = options;
		return (
			birthDate.month === currentDate.month && birthDate.day === currentDate.day
		);
	}

	static daysInMonthOf(month: number): number {
		return GameCalendar.daysInMonth[month - 1] ?? 30;
	}

	static format(date: GameDate): string {
		const month = String(date.month).padStart(2, "0");
		const day = String(date.day).padStart(2, "0");
		return `${month}/${day}/${date.year}`;
	}

	static formatWithTime(date: GameDate): string {
		const dateStr = GameCalendar.format(date);
		const hour = date.hour ?? 0;
		const period = GameCalendar.periodOf(hour);
		const periodName = period.charAt(0).toUpperCase() + period.slice(1);
		return `${dateStr} - ${periodName}`;
	}

	static compare(a: GameDate, b: GameDate): number {
		if (a.year !== b.year) return a.year - b.year;
		if (a.month !== b.month) return a.month - b.month;
		if (a.day !== b.day) return a.day - b.day;
		return (a.hour ?? 0) - (b.hour ?? 0);
	}

	static isAfter(a: GameDate, b: GameDate): boolean {
		return GameCalendar.compare(a, b) > 0;
	}

	static isBefore(a: GameDate, b: GameDate): boolean {
		return GameCalendar.compare(a, b) < 0;
	}

	static isEqual(a: GameDate, b: GameDate): boolean {
		return GameCalendar.compare(a, b) === 0;
	}

	static periodOf(hour: number): DayPeriod {
		if (hour >= 6 && hour < 12) return "morning";
		if (hour >= 12 && hour < 18) return "afternoon";
		if (hour >= 18 && hour < 22) return "evening";
		return "night";
	}

	static advance(date: GameDate, hours = 1): GameDate {
		let { year, month, day, hour = 0 } = date;

		hour += hours;

		while (hour >= 24) {
			hour -= 24;
			day += 1;

			const daysInCurrentMonth = GameCalendar.daysInMonthOf(month);
			if (day > daysInCurrentMonth) {
				day = 1;
				month += 1;

				if (month > 12) {
					month = 1;
					year += 1;
				}
			}
		}

		while (hour < 0) {
			hour += 24;
			day -= 1;

			if (day < 1) {
				month -= 1;
				if (month < 1) {
					month = 12;
					year -= 1;
				}
				day = GameCalendar.daysInMonthOf(month);
			}
		}

		return { year, month, day, hour };
	}
}
