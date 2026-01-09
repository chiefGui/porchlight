import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { World } from "../../engine/index.ts";
import { GameCalendar, type GameDate } from "../../game/calendar/index.ts";
import { CharacterGenerator } from "../../game/character/character-generator.ts";
import { CharacterIdentity } from "../../game/character/identity.ts";
import { CharacterCard, type CharacterData } from "../game/character-card.tsx";
import { Button } from "../primitive/button.tsx";
import { rootRoute } from "./root.tsx";

const CURRENT_DATE: GameDate = { year: 2025, month: 6, day: 15 };

function getCharacterData(entityId: EntityId): CharacterData | null {
	const identity = World.getComponent(entityId, CharacterIdentity);
	if (!identity) return null;

	return {
		entityId,
		firstName: identity.firstName,
		lastName: identity.lastName,
		gender: identity.gender,
		culture: identity.culture,
		age: GameCalendar.age({
			birthDate: identity.birthDate,
			currentDate: CURRENT_DATE,
		}),
		birthDate: GameCalendar.format(identity.birthDate),
		traits: World.getTags(entityId),
	};
}

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexPage,
});

function IndexPage(): React.ReactElement {
	const [character, setCharacter] = useState<CharacterData | null>(null);

	const handleGenerateCharacter = () => {
		const entityId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			currentDate: CURRENT_DATE,
			traitsPerCategory: 3,
		});

		const data = getCharacterData(entityId);
		setCharacter(data);
	};

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
			<div className="text-center space-y-2">
				<h1 className="text-4xl font-bold">Porchlight</h1>
				<p className="text-muted-foreground">Character Generation Demo</p>
			</div>

			<Button size="lg" onClick={handleGenerateCharacter}>
				Generate Character
			</Button>

			{character && <CharacterCard character={character} />}
		</main>
	);
}
