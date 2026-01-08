import { System, type SystemClass, World } from "../ecs/index.ts";
import { Persistence } from "../persistence/index.ts";
import { Timer } from "../timer/index.ts";
import type { GameLoopConfig, TickCallback, TickContext } from "./types.ts";

export class GameLoop {
	private static tickCount = 0;
	private static lastTimestamp = 0;
	private static config: GameLoopConfig = {};

	private static beforeTickCallbacks: TickCallback[] = [];
	private static afterTickCallbacks: TickCallback[] = [];

	static configure(config: GameLoopConfig): void {
		GameLoop.config = config;

		if (config.onBeforeTick) {
			GameLoop.beforeTickCallbacks.push(config.onBeforeTick);
		}
		if (config.onAfterTick) {
			GameLoop.afterTickCallbacks.push(config.onAfterTick);
		}
	}

	static onBeforeTick(callback: TickCallback): () => void {
		GameLoop.beforeTickCallbacks.push(callback);
		return () => {
			const index = GameLoop.beforeTickCallbacks.indexOf(callback);
			if (index !== -1) {
				GameLoop.beforeTickCallbacks.splice(index, 1);
			}
		};
	}

	static onAfterTick(callback: TickCallback): () => void {
		GameLoop.afterTickCallbacks.push(callback);
		return () => {
			const index = GameLoop.afterTickCallbacks.indexOf(callback);
			if (index !== -1) {
				GameLoop.afterTickCallbacks.splice(index, 1);
			}
		};
	}

	private static autoSave(): void {
		if (Persistence.shouldAutoSave()) {
			Persistence.save();
		}
	}

	static tick(): TickContext {
		const now = performance.now();
		const deltaTime =
			GameLoop.lastTimestamp === 0 ? 0 : now - GameLoop.lastTimestamp;

		const context: TickContext = {
			tick: ++GameLoop.tickCount,
			timestamp: now,
			deltaTime,
		};

		for (const callback of GameLoop.beforeTickCallbacks) {
			callback(context);
		}

		Timer.tick();

		if (GameLoop.config.phases?.length) {
			for (const phase of GameLoop.config.phases) {
				System.runPhase(phase);
			}
		} else if (GameLoop.config.systems?.length) {
			System.run(...GameLoop.config.systems);
		}

		World.flushDirty();

		for (const callback of GameLoop.afterTickCallbacks) {
			callback(context);
		}

		GameLoop.lastTimestamp = now;
		GameLoop.autoSave();

		return context;
	}

	static run(...systems: SystemClass[]): TickContext {
		const now = performance.now();
		const deltaTime =
			GameLoop.lastTimestamp === 0 ? 0 : now - GameLoop.lastTimestamp;

		const context: TickContext = {
			tick: ++GameLoop.tickCount,
			timestamp: now,
			deltaTime,
		};

		for (const callback of GameLoop.beforeTickCallbacks) {
			callback(context);
		}

		Timer.tick();

		System.run(...systems);
		World.flushDirty();

		for (const callback of GameLoop.afterTickCallbacks) {
			callback(context);
		}

		GameLoop.lastTimestamp = now;
		GameLoop.autoSave();

		return context;
	}

	static runPhase(phase: string): TickContext {
		const now = performance.now();
		const deltaTime =
			GameLoop.lastTimestamp === 0 ? 0 : now - GameLoop.lastTimestamp;

		const context: TickContext = {
			tick: ++GameLoop.tickCount,
			timestamp: now,
			deltaTime,
		};

		for (const callback of GameLoop.beforeTickCallbacks) {
			callback(context);
		}

		Timer.tick();

		System.runPhase(phase);
		World.flushDirty();

		for (const callback of GameLoop.afterTickCallbacks) {
			callback(context);
		}

		GameLoop.lastTimestamp = now;
		GameLoop.autoSave();

		return context;
	}

	static getTickCount(): number {
		return GameLoop.tickCount;
	}

	static reset(): void {
		GameLoop.tickCount = 0;
		GameLoop.lastTimestamp = 0;
		GameLoop.config = {};
		GameLoop.beforeTickCallbacks = [];
		GameLoop.afterTickCallbacks = [];
		Timer.reset();
	}
}
