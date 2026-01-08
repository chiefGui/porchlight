import { Entity, type EntityId } from "../ecs/index.ts";

export type TimerExpireCallback = (entityId: EntityId, key: string) => void;

export type TimerEntry = {
	key: string;
	remaining: number;
};

export class Timer {
	private static timers = new Map<EntityId, Map<string, number>>();
	private static keyCallbacks = new Map<string, Set<TimerExpireCallback>>();
	private static globalCallbacks = new Set<TimerExpireCallback>();

	static set(entityId: EntityId, key: string, ticks: number): void {
		if (!Entity.isAlive(entityId)) {
			return;
		}

		if (ticks <= 0) {
			Timer.remove(entityId, key);
			return;
		}

		let entityTimers = Timer.timers.get(entityId);
		if (!entityTimers) {
			entityTimers = new Map();
			Timer.timers.set(entityId, entityTimers);
		}

		entityTimers.set(key, ticks);
	}

	static get(entityId: EntityId, key: string): number | undefined {
		return Timer.timers.get(entityId)?.get(key);
	}

	static has(entityId: EntityId, key: string): boolean {
		return Timer.timers.get(entityId)?.has(key) ?? false;
	}

	static remove(entityId: EntityId, key: string): boolean {
		const entityTimers = Timer.timers.get(entityId);
		if (!entityTimers) {
			return false;
		}

		const removed = entityTimers.delete(key);

		if (entityTimers.size === 0) {
			Timer.timers.delete(entityId);
		}

		return removed;
	}

	static all(entityId: EntityId): TimerEntry[] {
		const entityTimers = Timer.timers.get(entityId);
		if (!entityTimers) {
			return [];
		}

		const entries: TimerEntry[] = [];
		for (const [key, remaining] of entityTimers) {
			entries.push({ key, remaining });
		}
		return entries;
	}

	static removeAllFromEntity(entityId: EntityId): void {
		Timer.timers.delete(entityId);
	}

	static onExpire(callback: TimerExpireCallback): () => void;
	static onExpire(key: string, callback: TimerExpireCallback): () => void;
	static onExpire(
		keyOrCallback: string | TimerExpireCallback,
		callback?: TimerExpireCallback,
	): () => void {
		if (typeof keyOrCallback === "function") {
			Timer.globalCallbacks.add(keyOrCallback);
			return () => {
				Timer.globalCallbacks.delete(keyOrCallback);
			};
		}

		const key = keyOrCallback;
		const cb = callback as TimerExpireCallback;

		let callbacks = Timer.keyCallbacks.get(key);
		if (!callbacks) {
			callbacks = new Set();
			Timer.keyCallbacks.set(key, callbacks);
		}

		callbacks.add(cb);

		return () => {
			callbacks?.delete(cb);
			if (callbacks?.size === 0) {
				Timer.keyCallbacks.delete(key);
			}
		};
	}

	static tick(): void {
		const expired: Array<{ entityId: EntityId; key: string }> = [];

		for (const [entityId, entityTimers] of Timer.timers) {
			if (!Entity.isAlive(entityId)) {
				Timer.timers.delete(entityId);
				continue;
			}

			for (const [key, remaining] of entityTimers) {
				const newRemaining = remaining - 1;

				if (newRemaining <= 0) {
					expired.push({ entityId, key });
					entityTimers.delete(key);
				} else {
					entityTimers.set(key, newRemaining);
				}
			}

			if (entityTimers.size === 0) {
				Timer.timers.delete(entityId);
			}
		}

		for (const { entityId, key } of expired) {
			const keyCallbacks = Timer.keyCallbacks.get(key);
			if (keyCallbacks) {
				for (const callback of keyCallbacks) {
					callback(entityId, key);
				}
			}

			for (const callback of Timer.globalCallbacks) {
				callback(entityId, key);
			}
		}
	}

	static extend(
		entityId: EntityId,
		key: string,
		additionalTicks: number,
	): void {
		const current = Timer.get(entityId, key);
		if (current !== undefined) {
			Timer.set(entityId, key, current + additionalTicks);
		}
	}

	static reset(): void {
		Timer.timers.clear();
		Timer.keyCallbacks.clear();
		Timer.globalCallbacks.clear();
	}
}
