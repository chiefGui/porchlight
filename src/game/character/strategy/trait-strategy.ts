import { type Trait, TraitRegistry } from "../../../content/character/trait.ts";
import { Random } from "../../../engine/index.ts";

export type TraitPickOptions = {
	categories: string[];
	countPerCategory?: number;
	forced?: string[];
	excluded?: string[];
};

export type TraitStrategy = {
	pick(options: TraitPickOptions): string[];
};

export class DefaultTraitStrategy {
	static pick(options: TraitPickOptions): string[] {
		const {
			categories,
			countPerCategory = 1,
			forced = [],
			excluded = [],
		} = options;

		const result: string[] = [...forced];
		const excludedSet = new Set<string>(excluded);

		// Add exclusions from forced traits
		for (const traitId of forced) {
			const trait = TraitRegistry.get(traitId);
			if (trait?.exclusive) {
				trait.exclusive.forEach((ex) => excludedSet.add(ex));
			}
			excludedSet.add(traitId);
		}

		for (const category of categories) {
			const picked = DefaultTraitStrategy.pickFromCategory({
				category,
				count: countPerCategory,
				excluded: excludedSet,
			});

			for (const trait of picked) {
				result.push(trait.id);
				excludedSet.add(trait.id);
				trait.exclusive?.forEach((ex) => excludedSet.add(ex));
			}
		}

		return result;
	}

	private static pickFromCategory(options: {
		category: string;
		count: number;
		excluded: Set<string>;
	}): Trait[] {
		const { category, count, excluded } = options;

		const available = TraitRegistry.getByCategory(category).filter(
			(t) =>
				!excluded.has(t.id) && !t.exclusive?.some((ex) => excluded.has(ex)),
		);

		if (available.length === 0) {
			return [];
		}

		const result: Trait[] = [];
		const pool = [...available];

		for (let i = 0; i < count && pool.length > 0; i++) {
			const picked = DefaultTraitStrategy.pickWeighted(pool);
			if (!picked) break;

			result.push(picked);

			// Remove from pool and mark exclusions
			const idx = pool.indexOf(picked);
			if (idx !== -1) pool.splice(idx, 1);

			if (picked.exclusive) {
				for (let j = pool.length - 1; j >= 0; j--) {
					if (picked.exclusive.includes(pool[j].id)) {
						pool.splice(j, 1);
					}
				}
			}
		}

		return result;
	}

	private static pickWeighted(traits: Trait[]): Trait | undefined {
		if (traits.length === 0) return undefined;

		const options = traits.map((t) => ({ value: t, weight: t.weight }));
		return Random.weighted(options);
	}
}
