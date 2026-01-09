export {
	type BatchFromArchetypeOptions,
	type BatchOptions,
	CharacterGenerator,
	type FromArchetypeOptions,
	type GenerateOptions,
} from "./character-generator.ts";
export { CharacterIdentity, type Gender } from "./identity.ts";
export { CharacterUtil } from "./character.util.ts";

export {
	type BirthdateCalculateOptions,
	type BirthdateStrategy,
	DefaultBirthdateStrategy,
	DefaultEmploymentStrategy,
	DefaultMoneyStrategy,
	DefaultNameStrategy,
	DefaultTraitStrategy,
	type EmploymentCalculateOptions,
	type EmploymentStrategy,
	type MoneyCalculateOptions,
	type MoneyStrategy,
	type NamePickOptions,
	type NameResult,
	type NameStrategy,
	type TraitPickOptions,
	type TraitStrategy,
} from "./strategy/index.ts";

export {
	syncInferredTraits,
	syncInferredTraitsForEntity,
} from "./trait-sync.ts";
