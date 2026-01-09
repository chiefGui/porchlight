import type { Culture, NameEntry } from "../../../content/character/culture.ts";
import { Random } from "../../../engine/index.ts";
import type { Gender } from "../identity.ts";

export type NameResult = {
	first: string;
	last: string;
};

export type NamePickOptions = {
	culture: Culture;
	gender: Gender;
};

export type NameStrategy = {
	pick(options: NamePickOptions): NameResult;
};

export class DefaultNameStrategy {
	static pick(options: NamePickOptions): NameResult {
		const { culture, gender } = options;
		const firstNames = gender === "male" ? culture.male : culture.female;

		return {
			first: DefaultNameStrategy.pickWeighted(firstNames),
			last: DefaultNameStrategy.pickWeighted(culture.surname),
		};
	}

	private static pickWeighted(entries: NameEntry[]): string {
		return Random.weighted(entries) ?? entries[0]?.value ?? "";
	}
}
