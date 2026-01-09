import type { EntityId } from "../../engine/index.ts";

// -----------------------------------------------------------------------------
// Relationship Types
// -----------------------------------------------------------------------------

/**
 * Categories of relationships between characters.
 * Family relationships are typically permanent, while social relationships can change.
 */
export type RelationshipCategory = "family" | "social" | "romantic";

/**
 * Defines a type of relationship between two characters.
 */
export type RelationshipType = {
	id: string;
	name: string;
	category: RelationshipCategory;
	/** Base opinion modifier for this relationship type */
	baseOpinion: number;
	/** Whether this relationship is mutual (e.g., siblings) or directional (e.g., parent->child) */
	mutual: boolean;
	/** The inverse relationship type (e.g., "parent" -> "child") */
	inverse?: string;
	/** Maximum opinion for this relationship type (defaults to 100) */
	maxOpinion?: number;
	/** Minimum opinion for this relationship type (defaults to -100) */
	minOpinion?: number;
};

/**
 * An individual relationship from one character to another.
 */
export type Relationship = {
	/** The target character entity */
	targetId: EntityId;
	/** The type of relationship */
	typeId: string;
	/** Current opinion value (-100 to 100) */
	opinion: number;
	/** History of significant interactions */
	history: RelationshipEvent[];
	/** When the relationship was established (game date tick) */
	establishedAt: number;
};

/**
 * A significant event in a relationship's history.
 */
export type RelationshipEvent = {
	type: string;
	description: string;
	opinionChange: number;
	timestamp: number;
};

// -----------------------------------------------------------------------------
// Opinion Modifier Types
// -----------------------------------------------------------------------------

/**
 * A modifier that affects opinion between characters.
 */
export type OpinionModifier = {
	id: string;
	name: string;
	/** The opinion change value */
	value: number;
	/** Optional: only apply if source has these traits */
	sourceTraits?: string[];
	/** Optional: only apply if target has these traits */
	targetTraits?: string[];
	/** Optional: trait compatibility (same trait = positive, opposite = negative) */
	traitInteraction?: TraitInteraction;
	/** Whether this modifier decays over time */
	decays?: boolean;
	/** Decay rate per game day (if decays is true) */
	decayRate?: number;
};

/**
 * Defines how traits interact to affect opinions.
 */
export type TraitInteraction = {
	/** Traits that create positive opinion when both characters have them */
	sameTraitBonus?: { traits: string[]; bonus: number };
	/** Traits that create negative opinion when both characters have them */
	sameTraitPenalty?: { traits: string[]; penalty: number };
	/** Trait pairs where having opposite traits creates conflict */
	opposingTraits?: { trait1: string; trait2: string; penalty: number }[];
	/** Trait pairs where different traits create attraction/interest */
	complementaryTraits?: { trait1: string; trait2: string; bonus: number }[];
};

// -----------------------------------------------------------------------------
// Relationship State
// -----------------------------------------------------------------------------

/**
 * The relationships held by a single entity.
 * Maps target entity ID to the relationship data.
 */
export type RelationshipMap = Map<EntityId, Relationship>;
