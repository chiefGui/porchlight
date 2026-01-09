import { defineStaticTrait } from "../../../../character/trait.ts";

export const outgoing = defineStaticTrait({
	id: "outgoing",
	name: "Outgoing",
	category: "personality",
	weight: 0.15,
	exclusive: ["shy"],
});

export const shy = defineStaticTrait({
	id: "shy",
	name: "Shy",
	category: "personality",
	weight: 0.12,
	exclusive: ["outgoing"],
});

export const creative = defineStaticTrait({
	id: "creative",
	name: "Creative",
	category: "personality",
	weight: 0.1,
});

export const athletic = defineStaticTrait({
	id: "athletic",
	name: "Athletic",
	category: "personality",
	weight: 0.1,
	exclusive: ["lazy"],
});

export const lazy = defineStaticTrait({
	id: "lazy",
	name: "Lazy",
	category: "personality",
	weight: 0.08,
	exclusive: ["athletic"],
});

export const romantic = defineStaticTrait({
	id: "romantic",
	name: "Romantic",
	category: "personality",
	weight: 0.1,
});

export const ambitious = defineStaticTrait({
	id: "ambitious",
	name: "Ambitious",
	category: "personality",
	weight: 0.12,
	exclusive: ["carefree"],
});

export const carefree = defineStaticTrait({
	id: "carefree",
	name: "Carefree",
	category: "personality",
	weight: 0.1,
	exclusive: ["ambitious"],
});

export const bookworm = defineStaticTrait({
	id: "bookworm",
	name: "Bookworm",
	category: "personality",
	weight: 0.08,
});

export const cheerful = defineStaticTrait({
	id: "cheerful",
	name: "Cheerful",
	category: "personality",
	weight: 0.12,
	exclusive: ["gloomy"],
});

export const gloomy = defineStaticTrait({
	id: "gloomy",
	name: "Gloomy",
	category: "personality",
	weight: 0.06,
	exclusive: ["cheerful"],
});
