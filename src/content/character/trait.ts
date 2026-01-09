import type { EntityId } from "../../engine/index.ts";
import type { GameDate } from "../../game/calendar/index.ts";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type BaseTrait = {
	id: string;
	name: string;
	category: string;
	exclusive?: string[];
};

export type StaticTrait = BaseTrait & {
	weight: number;
};

export type InferContext = {
	entity: EntityId;
	currentDate: GameDate;
};

export type InferredTrait = BaseTrait & {
	infer: (context: InferContext) => boolean;
};

export type Trait = StaticTrait | InferredTrait;

// -----------------------------------------------------------------------------
// Type Guards
// -----------------------------------------------------------------------------

export function isStaticTrait(trait: Trait): trait is StaticTrait {
	return "weight" in trait;
}

export function isInferredTrait(trait: Trait): trait is InferredTrait {
	return "infer" in trait;
}

// -----------------------------------------------------------------------------
// Registry
// -----------------------------------------------------------------------------

export class TraitRegistry {
	private static byId = new Map<string, Trait>();
	private static byCategory = new Map<string, Trait[]>();

	static register(trait: Trait): void {
		TraitRegistry.byId.set(trait.id, trait);

		const category = TraitRegistry.byCategory.get(trait.category) ?? [];
		category.push(trait);
		TraitRegistry.byCategory.set(trait.category, category);
	}

	static get(id: string): Trait | undefined {
		return TraitRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return TraitRegistry.byId.has(id);
	}

	static getByCategory(category: string): Trait[] {
		return TraitRegistry.byCategory.get(category) ?? [];
	}

	static getStaticByCategory(category: string): StaticTrait[] {
		return TraitRegistry.getByCategory(category).filter(isStaticTrait);
	}

	static getInferredByCategory(category: string): InferredTrait[] {
		return TraitRegistry.getByCategory(category).filter(isInferredTrait);
	}

	static categories(): IterableIterator<string> {
		return TraitRegistry.byCategory.keys();
	}

	static all(): IterableIterator<Trait> {
		return TraitRegistry.byId.values();
	}

	static static(): StaticTrait[] {
		return Array.from(TraitRegistry.byId.values()).filter(isStaticTrait);
	}

	static inferred(): InferredTrait[] {
		return Array.from(TraitRegistry.byId.values()).filter(isInferredTrait);
	}

	static ids(): IterableIterator<string> {
		return TraitRegistry.byId.keys();
	}

	static count(): number {
		return TraitRegistry.byId.size;
	}

	static reset(): void {
		TraitRegistry.byId.clear();
		TraitRegistry.byCategory.clear();
	}
}

// -----------------------------------------------------------------------------
// Define Helpers
// -----------------------------------------------------------------------------

export function defineStaticTrait(trait: StaticTrait): StaticTrait {
	TraitRegistry.register(trait);
	return trait;
}

export function defineInferredTrait(trait: InferredTrait): InferredTrait {
	TraitRegistry.register(trait);
	return trait;
}

/**
 * @deprecated Use `defineStaticTrait` or `defineInferredTrait` for clarity
 */
export function defineTrait(trait: StaticTrait): StaticTrait {
	return defineStaticTrait(trait);
}
