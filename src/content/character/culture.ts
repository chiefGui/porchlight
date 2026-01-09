import type { WeightedOption } from "../../engine/index.ts";

export type NameEntry = WeightedOption<string>;

export type Culture = {
	id: string;
	male: NameEntry[];
	female: NameEntry[];
	surname: NameEntry[];
};

export class CultureRegistry {
	private static byId = new Map<string, Culture>();

	static register(culture: Culture): void {
		CultureRegistry.byId.set(culture.id, culture);
	}

	static get(id: string): Culture | undefined {
		return CultureRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return CultureRegistry.byId.has(id);
	}

	static all(): IterableIterator<Culture> {
		return CultureRegistry.byId.values();
	}

	static ids(): IterableIterator<string> {
		return CultureRegistry.byId.keys();
	}

	static count(): number {
		return CultureRegistry.byId.size;
	}

	static reset(): void {
		CultureRegistry.byId.clear();
	}
}

export function defineCulture(culture: Culture): Culture {
	CultureRegistry.register(culture);
	return culture;
}
