import { defineTrait } from "../../../../character/trait.ts";

export const outgoing = defineTrait({
	id: "outgoing",
	name: "Outgoing",
	category: "personality",
	weight: 0.15,
	exclusive: ["shy"],
});

export const shy = defineTrait({
	id: "shy",
	name: "Shy",
	category: "personality",
	weight: 0.12,
	exclusive: ["outgoing"],
});

export const creative = defineTrait({
	id: "creative",
	name: "Creative",
	category: "personality",
	weight: 0.1,
});

export const athletic = defineTrait({
	id: "athletic",
	name: "Athletic",
	category: "personality",
	weight: 0.1,
	exclusive: ["lazy"],
});

export const lazy = defineTrait({
	id: "lazy",
	name: "Lazy",
	category: "personality",
	weight: 0.08,
	exclusive: ["athletic"],
});

export const romantic = defineTrait({
	id: "romantic",
	name: "Romantic",
	category: "personality",
	weight: 0.1,
});

export const ambitious = defineTrait({
	id: "ambitious",
	name: "Ambitious",
	category: "personality",
	weight: 0.12,
	exclusive: ["carefree"],
});

export const carefree = defineTrait({
	id: "carefree",
	name: "Carefree",
	category: "personality",
	weight: 0.1,
	exclusive: ["ambitious"],
});

export const bookworm = defineTrait({
	id: "bookworm",
	name: "Bookworm",
	category: "personality",
	weight: 0.08,
});

export const cheerful = defineTrait({
	id: "cheerful",
	name: "Cheerful",
	category: "personality",
	weight: 0.12,
	exclusive: ["gloomy"],
});

export const gloomy = defineTrait({
	id: "gloomy",
	name: "Gloomy",
	category: "personality",
	weight: 0.06,
	exclusive: ["cheerful"],
});
