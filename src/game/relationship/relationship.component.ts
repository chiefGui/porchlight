import { component, type EntityId } from "../../engine/index.ts";
import type { Relationship, RelationshipMap } from "./relationship.types.ts";

/**
 * Component that stores all relationships for an entity.
 * Each entity can have multiple relationships with other entities.
 */
@component()
export class Relationships {
	/**
	 * Map of target entity ID to relationship data.
	 * Serialized as an array of [entityId, relationship] tuples.
	 */
	private relationships: RelationshipMap = new Map();

	/**
	 * Get a relationship with a specific entity.
	 */
	get(targetId: EntityId): Relationship | undefined {
		return this.relationships.get(targetId);
	}

	/**
	 * Check if a relationship exists with a specific entity.
	 */
	has(targetId: EntityId): boolean {
		return this.relationships.has(targetId);
	}

	/**
	 * Set or update a relationship with a specific entity.
	 */
	set(targetId: EntityId, relationship: Relationship): void {
		this.relationships.set(targetId, relationship);
	}

	/**
	 * Remove a relationship with a specific entity.
	 */
	remove(targetId: EntityId): boolean {
		return this.relationships.delete(targetId);
	}

	/**
	 * Get all relationships.
	 */
	all(): IterableIterator<[EntityId, Relationship]> {
		return this.relationships.entries();
	}

	/**
	 * Get all relationship entries as an array (for iteration in React).
	 */
	entries(): [EntityId, Relationship][] {
		return Array.from(this.relationships.entries());
	}

	/**
	 * Get the number of relationships.
	 */
	count(): number {
		return this.relationships.size;
	}

	/**
	 * Get all target entity IDs.
	 */
	targetIds(): EntityId[] {
		return Array.from(this.relationships.keys());
	}

	/**
	 * Filter relationships by type.
	 */
	filterByType(typeId: string): [EntityId, Relationship][] {
		return Array.from(this.relationships.entries()).filter(
			([, rel]) => rel.typeId === typeId,
		);
	}

	/**
	 * Get relationships sorted by opinion (highest first).
	 */
	sortedByOpinion(): [EntityId, Relationship][] {
		return Array.from(this.relationships.entries()).sort(
			([, a], [, b]) => b.opinion - a.opinion,
		);
	}

	/**
	 * Serialize for persistence.
	 */
	toJSON(): [EntityId, Relationship][] {
		return Array.from(this.relationships.entries());
	}

	/**
	 * Deserialize from persistence.
	 */
	static fromJSON(data: [EntityId, Relationship][]): Relationships {
		const instance = new Relationships();
		for (const [entityId, relationship] of data) {
			instance.relationships.set(entityId, relationship);
		}
		return instance;
	}
}
