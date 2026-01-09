import {
	type AgeDistribution,
	CharacterArchetypeRegistry,
} from "../../content/character/archetype.ts";
import { CultureRegistry } from "../../content/character/culture.ts";
import { type EntityId, Random, World } from "../../engine/index.ts";
import { GameCalendar } from "../calendar/index.ts";
import { Clock } from "../clock/index.ts";
import { Employment } from "../employment/index.ts";
import { Inventory } from "../inventory/index.ts";
import { Stamina } from "../stamina/index.ts";
import { CharacterIdentity, type Gender } from "./identity.ts";
import {
	type BirthdateStrategy,
	DefaultBirthdateStrategy,
	DefaultEmploymentStrategy,
	DefaultMoneyStrategy,
	DefaultNameStrategy,
	DefaultTraitStrategy,
	type EmploymentStrategy,
	type MoneyStrategy,
	type NameStrategy,
	type TraitStrategy,
} from "./strategy/index.ts";
import { syncInferredTraitsForEntity } from "./trait-sync.ts";

type BaseCharacterOptions = {
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
	moneyStrategy?: MoneyStrategy;
	employmentStrategy?: EmploymentStrategy;
};

export type GenerateOptions = BaseCharacterOptions & {
	culture: string;
};

export type FromArchetypeOptions = BaseCharacterOptions & {
	archetype: string;
	culture?: string;
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

		const currentDate = Clock.get();

		const nameStrategy = options.nameStrategy ?? DefaultNameStrategy;
		const birthdateStrategy =
			options.birthdateStrategy ?? DefaultBirthdateStrategy;
		const traitStrategy = options.traitStrategy ?? DefaultTraitStrategy;
		const moneyStrategy = options.moneyStrategy ?? DefaultMoneyStrategy;
		const employmentStrategy =
			options.employmentStrategy ?? DefaultEmploymentStrategy;

		const gender = options.gender ?? (Random.bool() ? "male" : "female");
		const [minAge, maxAge] = options.ageRange ?? [18, 65];

		const name = nameStrategy.pick({ culture, gender });

		const birthDate = birthdateStrategy.calculate({
			currentDate,
			minAge,
			maxAge,
			distribution: options.ageDistribution,
		});

		const age = GameCalendar.age({ birthDate, currentDate });

		const traits = traitStrategy.pick({
			categories: options.traitCategories ?? ["personality"],
			countPerCategory: options.traitsPerCategory ?? 1,
			forced: options.forcedTraits,
			excluded: options.excludedTraits,
		});

		const money = moneyStrategy.calculate({ culture, gender, age });
		const jobId = employmentStrategy.calculate({ culture, gender, age });

		const entity = World.createEntity();

		World.addComponent(entity, CharacterIdentity, {
			firstName: name.first,
			lastName: name.last,
			gender,
			culture: culture.id,
			birthDate,
		});

		World.addComponent(entity, Inventory, {
			items: { money },
		});

		World.addComponent(entity, Stamina, {
			value: 1,
		});

		World.addComponent(entity, Employment, {
			jobId,
		});

		for (const traitId of traits) {
			World.addTag(entity, traitId);
		}

		// Add culture as a trait
		World.addTag(entity, culture.id);

		for (const tag of options.extraTags ?? []) {
			World.addTag(entity, tag);
		}

		// Sync inferred traits (e.g., life-stage based on birthdate)
		syncInferredTraitsForEntity({ entity, currentDate });

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

		return CharacterGenerator.generate({
			culture,
			gender: options.gender ?? archetype.gender,
			ageRange: options.ageRange ?? archetype.ageRange,
			ageDistribution: options.ageDistribution ?? archetype.ageDistribution,
			traitCategories: options.traitCategories ?? archetype.traitCategories,
			traitsPerCategory:
				options.traitsPerCategory ?? archetype.traitsPerCategory,
			forcedTraits: options.forcedTraits ?? archetype.forcedTraits,
			excludedTraits: options.excludedTraits ?? archetype.excludedTraits,
			extraTags: [...(archetype.tags ?? []), ...(options.extraTags ?? [])],
			nameStrategy: options.nameStrategy,
			birthdateStrategy: options.birthdateStrategy,
			traitStrategy: options.traitStrategy,
			moneyStrategy: options.moneyStrategy,
			employmentStrategy: options.employmentStrategy,
		});
	}

	static batch(options: BatchOptions): EntityId[] {
		const { count, ...generateOptions } = options;
		return Array.from({ length: count }, () =>
			CharacterGenerator.generate(generateOptions),
		);
	}

	static batchFromArchetype(options: BatchFromArchetypeOptions): EntityId[] {
		const { count, ...archetypeOptions } = options;
		return Array.from({ length: count }, () =>
			CharacterGenerator.fromArchetype(archetypeOptions),
		);
	}
}
