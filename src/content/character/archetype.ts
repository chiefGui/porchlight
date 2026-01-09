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
		this.byId.set(archetype.id, archetype);
	}

	static get(id: string): CharacterArchetype | undefined {
		return this.byId.get(id);
	}

	static has(id: string): boolean {
		return this.byId.has(id);
	}

	static all(): IterableIterator<CharacterArchetype> {
		return this.byId.values();
	}

	static ids(): IterableIterator<string> {
		return this.byId.keys();
	}

	static count(): number {
		return this.byId.size;
	}

	static reset(): void {
		this.byId.clear();
	}
}

export function defineCharacterArchetype(archetype: CharacterArchetype): CharacterArchetype {
	CharacterArchetypeRegistry.register(archetype);
	return archetype;
}
