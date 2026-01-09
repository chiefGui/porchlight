import { ComponentDecorator } from "../../engine/index.ts";
import type { GameDate } from "../calendar/index.ts";

export type Gender = "male" | "female";

@ComponentDecorator()
export class CharacterIdentity {
	firstName = "";
	lastName = "";
	birthDate: GameDate = { year: 0, month: 1, day: 1 };
	gender: Gender = "male";
	culture = "";
}
