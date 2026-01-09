import { useState } from "react";
import type { EntityId } from "../engine/index.ts";
import { World } from "../engine/index.ts";
import { GameCalendar, type GameDate } from "../game/calendar/index.ts";
import { CharacterGenerator } from "../game/character/character-generator.ts";
import { CharacterIdentity } from "../game/character/identity.ts";
import { Button } from "./component/button.tsx";

import "../content/pack/base/index.ts";

const CURRENT_DATE: GameDate = { year: 2025, month: 6, day: 15 };

type CharacterData = {
	entityId: EntityId;
	firstName: string;
	lastName: string;
	gender: string;
	culture: string;
	age: number;
	birthDate: string;
	traits: string[];
};

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

function CharacterCard({
	character,
}: {
	character: CharacterData;
}): React.ReactElement {
	return (
		<div className="bg-card text-card-foreground rounded-xl border border-border p-6 w-full max-w-md">
			<div className="space-y-4">
				<div className="text-center">
					<h2 className="text-2xl font-bold">
						{character.firstName} {character.lastName}
					</h2>
					<p className="text-muted-foreground capitalize">
						{character.gender} · {character.culture}
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="space-y-1">
						<p className="text-muted-foreground">Age</p>
						<p className="font-medium">{character.age} years old</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground">Birthday</p>
						<p className="font-medium">{character.birthDate}</p>
					</div>
				</div>

				{character.traits.length > 0 && (
					<div className="space-y-2">
						<p className="text-muted-foreground text-sm">Traits</p>
						<div className="flex flex-wrap gap-2">
							{character.traits.map((trait) => (
								<span
									key={trait}
									className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm capitalize"
								>
									{trait}
								</span>
							))}
						</div>
					</div>
				)}

				<div className="pt-2 border-t border-border">
					<p className="text-xs text-muted-foreground">
						Entity ID: {character.entityId}
					</p>
				</div>
			</div>
		</div>
	);
}

export function App(): React.ReactElement {
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
