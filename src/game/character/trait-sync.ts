import { Entity, type EntityId, World } from "../../engine/index.ts";
import { TraitRegistry } from "../../content/character/trait.ts";
import type { GameDate } from "../calendar/index.ts";

/**
 * Syncs all inferred traits for a single entity based on the current game date.
 * Adds traits that should be present, removes traits that shouldn't.
 */
export function syncInferredTraitsForEntity(options: {
	entity: EntityId;
	currentDate: GameDate;
}): void {
	const { entity, currentDate } = options;

	for (const trait of TraitRegistry.inferred()) {
		const shouldHave = trait.infer({ entity, currentDate });
		const hasIt = World.hasTag(entity, trait.id);

		if (shouldHave && !hasIt) {
			World.addTag(entity, trait.id);
		} else if (!shouldHave && hasIt) {
			World.removeTag(entity, trait.id);
		}
	}
}

/**
 * Syncs all inferred traits for all living entities.
 * Call this when the game date advances.
 */
export function syncInferredTraits(options: { currentDate: GameDate }): void {
	const { currentDate } = options;

	for (const entity of Entity.all()) {
		syncInferredTraitsForEntity({ entity, currentDate });
	}
}
