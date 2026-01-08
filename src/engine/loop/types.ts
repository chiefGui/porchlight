import type { SystemClass } from "../ecs/index.ts";

export type TickContext = {
	tick: number;
	timestamp: number;
	deltaTime: number;
};

export type TickCallback = (context: TickContext) => void;

export type GameLoopConfig = {
	onBeforeTick?: TickCallback;
	onAfterTick?: TickCallback;
	systems?: SystemClass[];
	phases?: string[];
};
