export {
	type BatchFromArchetypeOptions,
	type BatchOptions,
	CharacterGenerator,
	type FromArchetypeOptions,
	type GenerateOptions,
} from "./character-generator.ts";
export { CharacterIdentity, type Gender } from "./identity.ts";

export {
	type BirthdateCalculateOptions,
	type BirthdateStrategy,
	DefaultBirthdateStrategy,
	DefaultNameStrategy,
	DefaultTraitStrategy,
	type NamePickOptions,
	type NameResult,
	type NameStrategy,
	type TraitPickOptions,
	type TraitStrategy,
} from "./strategy/index.ts";
