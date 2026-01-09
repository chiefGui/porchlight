import type {
	OpinionModifier,
	RelationshipCategory,
	RelationshipType,
	TraitInteraction,
} from "./relationship.types.ts";

// -----------------------------------------------------------------------------
// Relationship Type Registry
// -----------------------------------------------------------------------------

export class RelationshipTypeRegistry {
	private static byId = new Map<string, RelationshipType>();
	private static byCategory = new Map<RelationshipCategory, RelationshipType[]>();

	static register(type: RelationshipType): void {
		RelationshipTypeRegistry.byId.set(type.id, type);

		const category = RelationshipTypeRegistry.byCategory.get(type.category) ?? [];
		category.push(type);
		RelationshipTypeRegistry.byCategory.set(type.category, category);
	}

	static get(id: string): RelationshipType | undefined {
		return RelationshipTypeRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return RelationshipTypeRegistry.byId.has(id);
	}

	static getByCategory(category: RelationshipCategory): RelationshipType[] {
		return RelationshipTypeRegistry.byCategory.get(category) ?? [];
	}

	static all(): IterableIterator<RelationshipType> {
		return RelationshipTypeRegistry.byId.values();
	}

	static ids(): IterableIterator<string> {
		return RelationshipTypeRegistry.byId.keys();
	}

	static count(): number {
		return RelationshipTypeRegistry.byId.size;
	}

	static reset(): void {
		RelationshipTypeRegistry.byId.clear();
		RelationshipTypeRegistry.byCategory.clear();
	}
}

// -----------------------------------------------------------------------------
// Opinion Modifier Registry
// -----------------------------------------------------------------------------

export class OpinionModifierRegistry {
	private static byId = new Map<string, OpinionModifier>();
	private static traitInteractions: TraitInteraction[] = [];

	static register(modifier: OpinionModifier): void {
		OpinionModifierRegistry.byId.set(modifier.id, modifier);

		if (modifier.traitInteraction) {
			OpinionModifierRegistry.traitInteractions.push(modifier.traitInteraction);
		}
	}

	static get(id: string): OpinionModifier | undefined {
		return OpinionModifierRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return OpinionModifierRegistry.byId.has(id);
	}

	static all(): IterableIterator<OpinionModifier> {
		return OpinionModifierRegistry.byId.values();
	}

	static getTraitInteractions(): readonly TraitInteraction[] {
		return OpinionModifierRegistry.traitInteractions;
	}

	static reset(): void {
		OpinionModifierRegistry.byId.clear();
		OpinionModifierRegistry.traitInteractions = [];
	}
}

// -----------------------------------------------------------------------------
// Define Helpers
// -----------------------------------------------------------------------------

export function defineRelationshipType(type: RelationshipType): RelationshipType {
	RelationshipTypeRegistry.register(type);
	return type;
}

export function defineOpinionModifier(modifier: OpinionModifier): OpinionModifier {
	OpinionModifierRegistry.register(modifier);
	return modifier;
}

export function defineTraitInteraction(interaction: TraitInteraction): TraitInteraction {
	OpinionModifierRegistry.register({
		id: `trait-interaction-${Date.now()}`,
		name: "Trait Interaction",
		value: 0,
		traitInteraction: interaction,
	});
	return interaction;
}
