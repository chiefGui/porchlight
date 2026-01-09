import type { WeightedOption } from "../../engine/index.ts";
import { TraitRegistry } from "./trait.ts";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type NameEntry = WeightedOption<string>;

export type Culture = {
	id: string;
	name: string;
	male: NameEntry[];
	female: NameEntry[];
	surname: NameEntry[];
};

// -----------------------------------------------------------------------------
// Registry
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Define Helper
// -----------------------------------------------------------------------------

/**
 * Defines a culture and automatically registers it as a trait in the "culture" category.
 * This unifies cultures into the trait system while preserving name generation data.
 */
export function defineCulture(culture: Culture): Culture {
	CultureRegistry.register(culture);

	// Auto-register as a static trait in the "culture" category
	TraitRegistry.register({
		id: culture.id,
		name: culture.name,
		category: "culture",
		weight: 1,
	});

	return culture;
}
