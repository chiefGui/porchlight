import type { AgeDistribution } from "../../../content/character/archetype.ts";
import { Random } from "../../../engine/index.ts";
import { GameCalendar, type GameDate } from "../../calendar/index.ts";

export type BirthdateCalculateOptions = {
	currentDate: GameDate;
	minAge: number;
	maxAge: number;
	distribution?: AgeDistribution;
};

export type BirthdateStrategy = {
	calculate(options: BirthdateCalculateOptions): GameDate;
};

export class DefaultBirthdateStrategy {
	static calculate(options: BirthdateCalculateOptions): GameDate {
		const { currentDate, minAge, maxAge, distribution = "uniform" } = options;

		const t = DefaultBirthdateStrategy.sample(distribution);
		const age = Math.floor(minAge + (maxAge - minAge) * t);

		const year = currentDate.year - age;
		const month = Random.int(1, 12);
		const day = Random.int(1, GameCalendar.daysInMonthOf(month));

		return { year, month, day };
	}

	private static sample(distribution: AgeDistribution): number {
		switch (distribution) {
			case "uniform":
				return Random.float();
			case "young": {
				// Bias toward 0 (minAge)
				const r = Random.float();
				return r * r;
			}
			case "old": {
				// Bias toward 1 (maxAge)
				const r = Random.float();
				return 1 - r * r;
			}
			case "prime": {
				// Bell curve centered around 0.4 (prime working age)
				const value = Random.gaussian(0.4, 0.2);
				return Math.max(0, Math.min(1, value));
			}
		}
	}
}
