import { defineRelationshipType } from "../../../../game/relationship/index.ts";

// -----------------------------------------------------------------------------
// Family Relationships
// -----------------------------------------------------------------------------

export const parent = defineRelationshipType({
	id: "parent",
	name: "Parent",
	category: "family",
	baseOpinion: 50,
	mutual: false,
	inverse: "child",
});

export const child = defineRelationshipType({
	id: "child",
	name: "Child",
	category: "family",
	baseOpinion: 50,
	mutual: false,
	inverse: "parent",
});

export const sibling = defineRelationshipType({
	id: "sibling",
	name: "Sibling",
	category: "family",
	baseOpinion: 30,
	mutual: true,
});

export const spouse = defineRelationshipType({
	id: "spouse",
	name: "Spouse",
	category: "family",
	baseOpinion: 70,
	mutual: true,
});

export const grandparent = defineRelationshipType({
	id: "grandparent",
	name: "Grandparent",
	category: "family",
	baseOpinion: 40,
	mutual: false,
	inverse: "grandchild",
});

export const grandchild = defineRelationshipType({
	id: "grandchild",
	name: "Grandchild",
	category: "family",
	baseOpinion: 60,
	mutual: false,
	inverse: "grandparent",
});

export const cousin = defineRelationshipType({
	id: "cousin",
	name: "Cousin",
	category: "family",
	baseOpinion: 20,
	mutual: true,
});

export const uncle = defineRelationshipType({
	id: "uncle",
	name: "Uncle/Aunt",
	category: "family",
	baseOpinion: 25,
	mutual: false,
	inverse: "nephew",
});

export const nephew = defineRelationshipType({
	id: "nephew",
	name: "Nephew/Niece",
	category: "family",
	baseOpinion: 25,
	mutual: false,
	inverse: "uncle",
});

// -----------------------------------------------------------------------------
// Social Relationships
// -----------------------------------------------------------------------------

export const acquaintance = defineRelationshipType({
	id: "acquaintance",
	name: "Acquaintance",
	category: "social",
	baseOpinion: 0,
	mutual: true,
});

export const friend = defineRelationshipType({
	id: "friend",
	name: "Friend",
	category: "social",
	baseOpinion: 40,
	mutual: true,
});

export const closeFriend = defineRelationshipType({
	id: "close-friend",
	name: "Close Friend",
	category: "social",
	baseOpinion: 70,
	mutual: true,
});

export const bestFriend = defineRelationshipType({
	id: "best-friend",
	name: "Best Friend",
	category: "social",
	baseOpinion: 90,
	mutual: true,
});

export const rival = defineRelationshipType({
	id: "rival",
	name: "Rival",
	category: "social",
	baseOpinion: -30,
	mutual: true,
});

export const enemy = defineRelationshipType({
	id: "enemy",
	name: "Enemy",
	category: "social",
	baseOpinion: -70,
	mutual: true,
});

export const coworker = defineRelationshipType({
	id: "coworker",
	name: "Coworker",
	category: "social",
	baseOpinion: 10,
	mutual: true,
});

export const neighbor = defineRelationshipType({
	id: "neighbor",
	name: "Neighbor",
	category: "social",
	baseOpinion: 5,
	mutual: true,
});

export const mentor = defineRelationshipType({
	id: "mentor",
	name: "Mentor",
	category: "social",
	baseOpinion: 35,
	mutual: false,
	inverse: "mentee",
});

export const mentee = defineRelationshipType({
	id: "mentee",
	name: "Mentee",
	category: "social",
	baseOpinion: 30,
	mutual: false,
	inverse: "mentor",
});

// -----------------------------------------------------------------------------
// Romantic Relationships
// -----------------------------------------------------------------------------

export const crush = defineRelationshipType({
	id: "crush",
	name: "Crush",
	category: "romantic",
	baseOpinion: 50,
	mutual: false,
});

export const dating = defineRelationshipType({
	id: "dating",
	name: "Dating",
	category: "romantic",
	baseOpinion: 60,
	mutual: true,
});

export const partner = defineRelationshipType({
	id: "partner",
	name: "Partner",
	category: "romantic",
	baseOpinion: 80,
	mutual: true,
});

export const ex = defineRelationshipType({
	id: "ex",
	name: "Ex",
	category: "romantic",
	baseOpinion: -10,
	mutual: true,
});
