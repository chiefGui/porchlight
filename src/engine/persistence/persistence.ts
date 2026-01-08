import { type SerializedGameState, Serializer } from "./serializer.ts";
import type { StorageAdapter } from "./storage-adapter.ts";

export type PersistenceStrategy = "per-tick" | "manual";

export type PersistenceConfig = {
	adapter: StorageAdapter;
	strategy?: PersistenceStrategy;
	saveOnHidden?: boolean;
	saveOnUnload?: boolean;
	stateKey?: string;
};

export class Persistence {
	private static adapter: StorageAdapter | null = null;
	private static strategy: PersistenceStrategy = "per-tick";
	private static saveOnHidden = true;
	private static saveOnUnload = true;
	private static stateKey = "gameState";
	private static metadata: Record<string, unknown> = {};
	private static initialized = false;
	private static saving = false;

	static initialize(config: PersistenceConfig): void {
		Persistence.adapter = config.adapter;
		Persistence.strategy = config.strategy ?? "per-tick";
		Persistence.saveOnHidden = config.saveOnHidden ?? true;
		Persistence.saveOnUnload = config.saveOnUnload ?? true;
		Persistence.stateKey = config.stateKey ?? "gameState";

		Serializer.initialize();
		Persistence.setupEventListeners();
		Persistence.initialized = true;
	}

	private static setupEventListeners(): void {
		if (typeof document !== "undefined" && Persistence.saveOnHidden) {
			document.addEventListener("visibilitychange", () => {
				if (document.visibilityState === "hidden") {
					Persistence.saveSync();
				}
			});
		}

		if (typeof window !== "undefined" && Persistence.saveOnUnload) {
			window.addEventListener("beforeunload", () => {
				Persistence.saveSync();
			});
		}
	}

	static async save(): Promise<void> {
		if (!Persistence.adapter || Persistence.saving) {
			return;
		}

		Persistence.saving = true;

		try {
			const state = Serializer.serialize(Persistence.metadata);
			await Persistence.adapter.save(Persistence.stateKey, state);
		} finally {
			Persistence.saving = false;
		}
	}

	private static saveSync(): void {
		if (!Persistence.adapter || Persistence.saving) {
			return;
		}

		const state = Serializer.serialize(Persistence.metadata);
		const data = JSON.stringify(state);
		localStorage.setItem(`${Persistence.stateKey}_backup`, data);
	}

	static async load(): Promise<boolean> {
		if (!Persistence.adapter) {
			return false;
		}

		let state = await Persistence.adapter.load<SerializedGameState>(
			Persistence.stateKey,
		);

		if (!state) {
			const backup = localStorage.getItem(`${Persistence.stateKey}_backup`);
			if (backup) {
				state = JSON.parse(backup) as SerializedGameState;
				localStorage.removeItem(`${Persistence.stateKey}_backup`);
			}
		}

		if (!state) {
			return false;
		}

		Serializer.deserialize(state);
		Persistence.metadata = state.metadata;
		return true;
	}

	static async clear(): Promise<void> {
		if (Persistence.adapter) {
			await Persistence.adapter.clear();
		}
		localStorage.removeItem(`${Persistence.stateKey}_backup`);
	}

	static setMeta<T>(key: string, value: T): void {
		Persistence.metadata[key] = value;
	}

	static getMeta<T>(key: string): T | undefined {
		return Persistence.metadata[key] as T | undefined;
	}

	static clearMeta(): void {
		Persistence.metadata = {};
	}

	static isInitialized(): boolean {
		return Persistence.initialized;
	}

	static getStrategy(): PersistenceStrategy {
		return Persistence.strategy;
	}

	static shouldAutoSave(): boolean {
		return Persistence.initialized && Persistence.strategy === "per-tick";
	}

	static reset(): void {
		Persistence.adapter = null;
		Persistence.strategy = "per-tick";
		Persistence.saveOnHidden = true;
		Persistence.saveOnUnload = true;
		Persistence.stateKey = "gameState";
		Persistence.metadata = {};
		Persistence.initialized = false;
		Persistence.saving = false;
	}
}
