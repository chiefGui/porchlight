import { component } from "../../engine/index.ts";
import type { GameDate } from "../calendar/index.ts";

@component()
export class Clock {
	date: GameDate = { year: 2026, month: 1, day: 1, hour: 8 };
}
