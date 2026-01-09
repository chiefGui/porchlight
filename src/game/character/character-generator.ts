import { World, Random, type EntityId } from "../../engine/index.ts";
import { CultureRegistry } from "../../content/character/culture.ts";
import {
	CharacterArchetypeRegistry,
	type AgeDistribution,
} from "../../content/character/archetype.ts";
import type { GameDate } from "../calendar/index.ts";
import { CharacterIdentity, type Gender } from "./identity.ts";
import {
	DefaultNameStrategy,
	DefaultBirthdateStrategy,
	DefaultTraitStrategy,
	type NameStrategy,
	type BirthdateStrategy,
	type TraitStrategy,
} from "./strategy/index.ts";

export type GenerateOptions = {
	culture: string;
	currentDate: GameDate;
	gender?: Gender;
	ageRange?: [number, number];
	ageDistribution?: AgeDistribution;
	traitCategories?: string[];
	traitsPerCategory?: number;
	forcedTraits?: string[];
	excludedTraits?: string[];
	extraTags?: string[];
	nameStrategy?: NameStrategy;
	birthdateStrategy?: BirthdateStrategy;
	traitStrategy?: TraitStrategy;
};

export type FromArchetypeOptions = {
	archetype: string;
	currentDate: GameDate;
	culture?: string;
	gender?: Gender;
	ageRange?: [number, number];
	ageDistribution?: AgeDistribution;
	traitCategories?: string[];
	traitsPerCategory?: number;
	forcedTraits?: string[];
	excludedTraits?: string[];
	extraTags?: string[];
	nameStrategy?: NameStrategy;
	birthdateStrategy?: BirthdateStrategy;
	traitStrategy?: TraitStrategy;
};

export type BatchOptions = GenerateOptions & {
	count: number;
};

export type BatchFromArchetypeOptions = FromArchetypeOptions & {
	count: number;
};

export class CharacterGenerator {
	static generate(options: GenerateOptions): EntityId {
		const culture = CultureRegistry.get(options.culture);
		if (!culture) {
			throw new Error(`Unknown culture: ${options.culture}`);
		}

		const nameStrategy = options.nameStrategy ?? DefaultNameStrategy;
		const birthdateStrategy = options.birthdateStrategy ?? DefaultBirthdateStrategy;
		const traitStrategy = options.traitStrategy ?? DefaultTraitStrategy;

		const gender = options.gender ?? (Random.bool() ? "male" : "female");
		const [minAge, maxAge] = options.ageRange ?? [18, 65];

		const name = nameStrategy.pick({ culture, gender });

		const birthDate = birthdateStrategy.calculate({
			currentDate: options.currentDate,
			minAge,
			maxAge,
			distribution: options.ageDistribution,
		});

		const traits = traitStrategy.pick({
			categories: options.traitCategories ?? ["personality"],
			countPerCategory: options.traitsPerCategory ?? 1,
			forced: options.forcedTraits,
			excluded: options.excludedTraits,
		});

		const entity = World.createEntity();

		World.addComponent(entity, CharacterIdentity, {
			firstName: name.first,
			lastName: name.last,
			gender,
			culture: culture.id,
			birthDate,
		});

		for (const traitId of traits) {
			World.addTag(entity, traitId);
		}

		for (const tag of options.extraTags ?? []) {
			World.addTag(entity, tag);
		}

		return entity;
	}

	static fromArchetype(options: FromArchetypeOptions): EntityId {
		const archetype = CharacterArchetypeRegistry.get(options.archetype);
		if (!archetype) {
			throw new Error(`Unknown archetype: ${options.archetype}`);
		}

		const culture = options.culture ?? archetype.culture;
		if (!culture) {
			throw new Error(`Culture required for archetype: ${options.archetype}`);
		}

		return this.generate({
			culture,
			currentDate: options.currentDate,
			gender: options.gender ?? archetype.gender,
			ageRange: options.ageRange ?? archetype.ageRange,
			ageDistribution: options.ageDistribution ?? archetype.ageDistribution,
			traitCategories: options.traitCategories ?? archetype.traitCategories,
			traitsPerCategory: options.traitsPerCategory ?? archetype.traitsPerCategory,
			forcedTraits: options.forcedTraits ?? archetype.forcedTraits,
			excludedTraits: options.excludedTraits ?? archetype.excludedTraits,
			extraTags: [...(archetype.tags ?? []), ...(options.extraTags ?? [])],
			nameStrategy: options.nameStrategy,
			birthdateStrategy: options.birthdateStrategy,
			traitStrategy: options.traitStrategy,
		});
	}

	static batch(options: BatchOptions): EntityId[] {
		const { count, ...generateOptions } = options;
		return Array.from({ length: count }, () => this.generate(generateOptions));
	}

	static batchFromArchetype(options: BatchFromArchetypeOptions): EntityId[] {
		const { count, ...archetypeOptions } = options;
		return Array.from({ length: count }, () => this.fromArchetype(archetypeOptions));
	}
}
