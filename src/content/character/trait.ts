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
		this.byId.set(trait.id, trait);

		const category = this.byCategory.get(trait.category) ?? [];
		category.push(trait);
		this.byCategory.set(trait.category, category);
	}

	static get(id: string): Trait | undefined {
		return this.byId.get(id);
	}

	static has(id: string): boolean {
		return this.byId.has(id);
	}

	static getByCategory(category: string): Trait[] {
		return this.byCategory.get(category) ?? [];
	}

	static categories(): IterableIterator<string> {
		return this.byCategory.keys();
	}

	static all(): IterableIterator<Trait> {
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
		this.byCategory.clear();
	}
}

export function defineTrait(trait: Trait): Trait {
	TraitRegistry.register(trait);
	return trait;
}
