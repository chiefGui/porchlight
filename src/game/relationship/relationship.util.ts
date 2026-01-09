import { Component, Tag, type EntityId } from "../../engine/index.ts";
import { GameLoop } from "../../engine/loop/index.ts";
import { Relationships } from "./relationship.component.ts";
import {
	OpinionModifierRegistry,
	RelationshipTypeRegistry,
} from "./relationship.registry.ts";
import type { OpinionSource, Relationship, RelationshipEvent } from "./relationship.types.ts";

/**
 * Utility class for managing relationships between characters.
 */
export class RelationshipUtil {
	/**
	 * Get or create the Relationships component for an entity.
	 */
	static getOrCreate(entityId: EntityId): Relationships {
		let relationships = Component.get(entityId, Relationships);
		if (!relationships) {
			relationships = new Relationships();
			Component.add(entityId, Relationships, relationships);
		}
		return relationships;
	}

	/**
	 * Create a new relationship between two entities.
	 */
	static create(
		sourceId: EntityId,
		targetId: EntityId,
		typeId: string,
		initialOpinion?: number,
	): Relationship | null {
		const relationType = RelationshipTypeRegistry.get(typeId);
		if (!relationType) {
			console.warn(`Unknown relationship type: ${typeId}`);
			return null;
		}

		const relationships = RelationshipUtil.getOrCreate(sourceId);

		// Don't overwrite existing relationship
		if (relationships.has(targetId)) {
			return relationships.get(targetId) ?? null;
		}

		const opinion = initialOpinion ?? relationType.baseOpinion;
		const clampedOpinion = RelationshipUtil.clampOpinion(opinion, relationType.id);

		const relationship: Relationship = {
			targetId,
			typeId,
			opinion: clampedOpinion,
			history: [],
			establishedAt: GameLoop.getTickCount(),
		};

		relationships.set(targetId, relationship);

		// If mutual, create the inverse relationship
		if (relationType.mutual) {
			const inverseTypeId = relationType.inverse ?? typeId;
			const targetRelationships = RelationshipUtil.getOrCreate(targetId);
			if (!targetRelationships.has(sourceId)) {
				const inverseRelationship: Relationship = {
					targetId: sourceId,
					typeId: inverseTypeId,
					opinion: clampedOpinion,
					history: [],
					establishedAt: GameLoop.getTickCount(),
				};
				targetRelationships.set(sourceId, inverseRelationship);
			}
		}

		return relationship;
	}

	/**
	 * Get the relationship between two entities.
	 */
	static get(sourceId: EntityId, targetId: EntityId): Relationship | undefined {
		const relationships = Component.get(sourceId, Relationships);
		return relationships?.get(targetId);
	}

	/**
	 * Check if a relationship exists between two entities.
	 */
	static has(sourceId: EntityId, targetId: EntityId): boolean {
		const relationships = Component.get(sourceId, Relationships);
		return relationships?.has(targetId) ?? false;
	}

	/**
	 * Get all relationships for an entity.
	 */
	static getAll(entityId: EntityId): [EntityId, Relationship][] {
		const relationships = Component.get(entityId, Relationships);
		return relationships?.entries() ?? [];
	}

	/**
	 * Modify the opinion in a relationship.
	 */
	static modifyOpinion(
		sourceId: EntityId,
		targetId: EntityId,
		change: number,
		eventDescription?: string,
	): number | null {
		const relationships = Component.get(sourceId, Relationships);
		const relationship = relationships?.get(targetId);
		if (!relationship) return null;

		const oldOpinion = relationship.opinion;
		const newOpinion = RelationshipUtil.clampOpinion(
			oldOpinion + change,
			relationship.typeId,
		);

		relationship.opinion = newOpinion;

		// Record the event if there's a description
		if (eventDescription && change !== 0) {
			const event: RelationshipEvent = {
				type: change > 0 ? "positive" : "negative",
				description: eventDescription,
				opinionChange: change,
				timestamp: GameLoop.getTickCount(),
			};
			relationship.history.push(event);

			// Keep only the last 20 events
			if (relationship.history.length > 20) {
				relationship.history.shift();
			}
		}

		relationships?.set(targetId, relationship);
		return newOpinion;
	}

	/**
	 * Calculate the total opinion modifier based on traits.
	 */
	static calculateTraitOpinionModifier(
		sourceId: EntityId,
		targetId: EntityId,
	): number {
		const sourceTraits = new Set(Tag.all(sourceId));
		const targetTraits = new Set(Tag.all(targetId));

		let modifier = 0;

		for (const interaction of OpinionModifierRegistry.getTraitInteractions()) {
			// Same trait bonus
			if (interaction.sameTraitBonus) {
				for (const trait of interaction.sameTraitBonus.traits) {
					if (sourceTraits.has(trait) && targetTraits.has(trait)) {
						modifier += interaction.sameTraitBonus.bonus;
					}
				}
			}

			// Same trait penalty
			if (interaction.sameTraitPenalty) {
				for (const trait of interaction.sameTraitPenalty.traits) {
					if (sourceTraits.has(trait) && targetTraits.has(trait)) {
						modifier -= interaction.sameTraitPenalty.penalty;
					}
				}
			}

			// Opposing traits penalty
			if (interaction.opposingTraits) {
				for (const pair of interaction.opposingTraits) {
					if (
						(sourceTraits.has(pair.trait1) && targetTraits.has(pair.trait2)) ||
						(sourceTraits.has(pair.trait2) && targetTraits.has(pair.trait1))
					) {
						modifier -= pair.penalty;
					}
				}
			}

			// Complementary traits bonus
			if (interaction.complementaryTraits) {
				for (const pair of interaction.complementaryTraits) {
					if (
						(sourceTraits.has(pair.trait1) && targetTraits.has(pair.trait2)) ||
						(sourceTraits.has(pair.trait2) && targetTraits.has(pair.trait1))
					) {
						modifier += pair.bonus;
					}
				}
			}
		}

		return modifier;
	}

	/**
	 * Get the effective opinion (base + trait modifiers).
	 */
	static getEffectiveOpinion(sourceId: EntityId, targetId: EntityId): number {
		const relationship = RelationshipUtil.get(sourceId, targetId);
		if (!relationship) return 0;

		const traitModifier = RelationshipUtil.calculateTraitOpinionModifier(
			sourceId,
			targetId,
		);

		return RelationshipUtil.clampOpinion(
			relationship.opinion + traitModifier,
			relationship.typeId,
		);
	}

	/**
	 * Get a detailed breakdown of opinion sources.
	 */
	static getOpinionBreakdown(
		sourceId: EntityId,
		targetId: EntityId,
	): OpinionSource[] {
		const relationship = RelationshipUtil.get(sourceId, targetId);
		if (!relationship) return [];

		const sources: OpinionSource[] = [];
		const sourceTraits = new Set(Tag.all(sourceId));
		const targetTraits = new Set(Tag.all(targetId));

		// Base relationship opinion
		sources.push({
			label: "Base",
			value: relationship.opinion,
			type: relationship.opinion >= 0 ? "positive" : "negative",
		});

		// Trait interactions
		for (const interaction of OpinionModifierRegistry.getTraitInteractions()) {
			// Same trait bonus
			if (interaction.sameTraitBonus) {
				for (const trait of interaction.sameTraitBonus.traits) {
					if (sourceTraits.has(trait) && targetTraits.has(trait)) {
						sources.push({
							label: `Shared ${trait} trait`,
							value: interaction.sameTraitBonus.bonus,
							type: "positive",
						});
					}
				}
			}

			// Same trait penalty
			if (interaction.sameTraitPenalty) {
				for (const trait of interaction.sameTraitPenalty.traits) {
					if (sourceTraits.has(trait) && targetTraits.has(trait)) {
						sources.push({
							label: `Shared ${trait} trait`,
							value: -interaction.sameTraitPenalty.penalty,
							type: "negative",
						});
					}
				}
			}

			// Opposing traits
			if (interaction.opposingTraits) {
				for (const pair of interaction.opposingTraits) {
					if (sourceTraits.has(pair.trait1) && targetTraits.has(pair.trait2)) {
						sources.push({
							label: `Your ${pair.trait1} vs their ${pair.trait2}`,
							value: -pair.penalty,
							type: "negative",
						});
					} else if (sourceTraits.has(pair.trait2) && targetTraits.has(pair.trait1)) {
						sources.push({
							label: `Your ${pair.trait2} vs their ${pair.trait1}`,
							value: -pair.penalty,
							type: "negative",
						});
					}
				}
			}

			// Complementary traits
			if (interaction.complementaryTraits) {
				for (const pair of interaction.complementaryTraits) {
					if (sourceTraits.has(pair.trait1) && targetTraits.has(pair.trait2)) {
						sources.push({
							label: `Your ${pair.trait1} + their ${pair.trait2}`,
							value: pair.bonus,
							type: "positive",
						});
					} else if (sourceTraits.has(pair.trait2) && targetTraits.has(pair.trait1)) {
						sources.push({
							label: `Your ${pair.trait2} + their ${pair.trait1}`,
							value: pair.bonus,
							type: "positive",
						});
					}
				}
			}
		}

		return sources;
	}

	/**
	 * Clamp opinion to the valid range for a relationship type.
	 */
	static clampOpinion(opinion: number, typeId: string): number {
		const relationType = RelationshipTypeRegistry.get(typeId);
		const min = relationType?.minOpinion ?? -100;
		const max = relationType?.maxOpinion ?? 100;
		return Math.max(min, Math.min(max, opinion));
	}

	/**
	 * Get a descriptive label for an opinion value.
	 */
	static getOpinionLabel(opinion: number): string {
		if (opinion >= 80) return "Best Friend";
		if (opinion >= 60) return "Close Friend";
		if (opinion >= 40) return "Friend";
		if (opinion >= 20) return "Friendly";
		if (opinion >= 0) return "Neutral";
		if (opinion >= -20) return "Cold";
		if (opinion >= -40) return "Unfriendly";
		if (opinion >= -60) return "Hostile";
		if (opinion >= -80) return "Enemy";
		return "Nemesis";
	}

	/**
	 * Get the color class for an opinion value.
	 */
	static getOpinionColor(opinion: number): string {
		if (opinion >= 60) return "text-green-500";
		if (opinion >= 20) return "text-green-400";
		if (opinion >= 0) return "text-muted-foreground";
		if (opinion >= -20) return "text-yellow-500";
		if (opinion >= -60) return "text-orange-500";
		return "text-red-500";
	}

	/**
	 * Remove a relationship between two entities.
	 */
	static remove(sourceId: EntityId, targetId: EntityId): boolean {
		const relationships = Component.get(sourceId, Relationships);
		if (!relationships) return false;

		const relationship = relationships.get(targetId);
		if (!relationship) return false;

		// If mutual, also remove the inverse
		const relationType = RelationshipTypeRegistry.get(relationship.typeId);
		if (relationType?.mutual) {
			const targetRelationships = Component.get(targetId, Relationships);
			targetRelationships?.remove(sourceId);
		}

		return relationships.remove(targetId);
	}

	/**
	 * Change the type of an existing relationship.
	 */
	static changeType(
		sourceId: EntityId,
		targetId: EntityId,
		newTypeId: string,
	): boolean {
		const relationships = Component.get(sourceId, Relationships);
		const relationship = relationships?.get(targetId);
		if (!relationship) return false;

		const newType = RelationshipTypeRegistry.get(newTypeId);
		if (!newType) return false;

		relationship.typeId = newTypeId;
		relationship.opinion = RelationshipUtil.clampOpinion(
			relationship.opinion,
			newTypeId,
		);

		relationships?.set(targetId, relationship);
		return true;
	}
}
