export type Trait = {
	id: string;
	name: string;
	category: string;
	weight: number;
	exclusive?: string[];
};

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

	static categories(): IterableIterator<string> {
		return TraitRegistry.byCategory.keys();
	}

	static all(): IterableIterator<Trait> {
		return TraitRegistry.byId.values();
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

export function defineTrait(trait: Trait): Trait {
	TraitRegistry.register(trait);
	return trait;
}
