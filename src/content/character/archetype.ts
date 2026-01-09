import type { Gender } from "../../game/character/identity.ts";

export type AgeDistribution = "uniform" | "young" | "old" | "prime";

export type CharacterArchetype = {
	id: string;
	name: string;
	culture?: string;
	gender?: Gender;
	ageRange?: [number, number];
	ageDistribution?: AgeDistribution;
	traitCategories?: string[];
	traitsPerCategory?: number;
	forcedTraits?: string[];
	excludedTraits?: string[];
	tags?: string[];
};

export class CharacterArchetypeRegistry {
	private static byId = new Map<string, CharacterArchetype>();

	static register(archetype: CharacterArchetype): void {
		CharacterArchetypeRegistry.byId.set(archetype.id, archetype);
	}

	static get(id: string): CharacterArchetype | undefined {
		return CharacterArchetypeRegistry.byId.get(id);
	}

	static has(id: string): boolean {
		return CharacterArchetypeRegistry.byId.has(id);
	}

	static all(): IterableIterator<CharacterArchetype> {
		return CharacterArchetypeRegistry.byId.values();
	}

	static ids(): IterableIterator<string> {
		return CharacterArchetypeRegistry.byId.keys();
	}

	static count(): number {
		return CharacterArchetypeRegistry.byId.size;
	}

	static reset(): void {
		CharacterArchetypeRegistry.byId.clear();
	}
}

export function defineCharacterArchetype(
	archetype: CharacterArchetype,
): CharacterArchetype {
	CharacterArchetypeRegistry.register(archetype);
	return archetype;
}
