import type { Culture } from "../../../content/character/culture.ts";
import type { Gender } from "../identity.ts";

export type EmploymentCalculateOptions = {
	culture: Culture;
	gender: Gender;
	age: number;
};

export type EmploymentStrategy = {
	calculate(options: EmploymentCalculateOptions): string | null;
};

export class DefaultEmploymentStrategy {
	static calculate(_options: EmploymentCalculateOptions): string | null {
		return null;
	}
}
