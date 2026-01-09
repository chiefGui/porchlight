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
		this.byId.set(culture.id, culture);
	}

	static get(id: string): Culture | undefined {
		return this.byId.get(id);
	}

	static has(id: string): boolean {
		return this.byId.has(id);
	}

	static all(): IterableIterator<Culture> {
		return this.byId.values();
	}

	static ids(): IterableIterator<string> {
		return this.byId.keys();
	}

	static count(): number {
		return this.byId.size;
	}

	static reset(): void {
		this.byId.clear();
	}
}

export function defineCulture(culture: Culture): Culture {
	CultureRegistry.register(culture);
	return culture;
}
