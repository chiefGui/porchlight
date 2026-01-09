import type { Culture } from "../../../content/character/culture.ts";
import type { Gender } from "../identity.ts";

export type MoneyCalculateOptions = {
	culture: Culture;
	gender: Gender;
	age: number;
};

export type MoneyStrategy = {
	calculate(options: MoneyCalculateOptions): number;
};

export class DefaultMoneyStrategy {
	static calculate(_options: MoneyCalculateOptions): number {
		return 0;
	}
}
