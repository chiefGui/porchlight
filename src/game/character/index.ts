export { CharacterIdentity, type Gender } from "./identity.ts";

export {
	CharacterGenerator,
	type BatchFromArchetypeOptions,
	type BatchOptions,
	type FromArchetypeOptions,
	type GenerateOptions,
} from "./character-generator.ts";

export {
	DefaultBirthdateStrategy,
	DefaultNameStrategy,
	DefaultTraitStrategy,
	type BirthdateCalculateOptions,
	type BirthdateStrategy,
	type NamePickOptions,
	type NameResult,
	type NameStrategy,
	type TraitPickOptions,
	type TraitStrategy,
} from "./strategy/index.ts";
