export type GameDate = {
	year: number;
	month: number;
	day: number;
};

export class GameCalendar {
	private static readonly daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	static age(options: { birthDate: GameDate; currentDate: GameDate }): number {
		const { birthDate, currentDate } = options;
		let age = currentDate.year - birthDate.year;

		const birthdayNotYet =
			currentDate.month < birthDate.month ||
			(currentDate.month === birthDate.month && currentDate.day < birthDate.day);

		if (birthdayNotYet) {
			age--;
		}

		return Math.max(0, age);
	}

	static isBirthday(options: { birthDate: GameDate; currentDate: GameDate }): boolean {
		const { birthDate, currentDate } = options;
		return birthDate.month === currentDate.month && birthDate.day === currentDate.day;
	}

	static daysInMonthOf(month: number): number {
		return this.daysInMonth[month - 1] ?? 30;
	}

	static format(date: GameDate): string {
		const month = String(date.month).padStart(2, "0");
		const day = String(date.day).padStart(2, "0");
		return `${month}/${day}/${date.year}`;
	}

	static compare(a: GameDate, b: GameDate): number {
		if (a.year !== b.year) return a.year - b.year;
		if (a.month !== b.month) return a.month - b.month;
		return a.day - b.day;
	}

	static isAfter(a: GameDate, b: GameDate): boolean {
		return this.compare(a, b) > 0;
	}

	static isBefore(a: GameDate, b: GameDate): boolean {
		return this.compare(a, b) < 0;
	}

	static isEqual(a: GameDate, b: GameDate): boolean {
		return this.compare(a, b) === 0;
	}
}
