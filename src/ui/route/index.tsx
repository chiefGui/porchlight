import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { CharacterGenerator } from "../../game/character/character-generator.ts";
import { Player } from "../../game/player/index.ts";
import { GameView } from "../game/game-view.tsx";
import { Button } from "../primitive/button.tsx";
import { rootRoute } from "./root.tsx";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexPage,
});

function IndexPage(): React.ReactElement {
	const [characterId, setCharacterId] = useState<EntityId | null>(
		() => Player.get(),
	);

	const handleNewGame = () => {
		const entityId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			traitsPerCategory: 3,
		});
		Player.set(entityId);
		setCharacterId(entityId);
	};

	if (!characterId) {
		return (
			<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold">Porchlight</h1>
					<p className="text-muted-foreground">A life simulation game</p>
				</div>
				<Button size="lg" onClick={handleNewGame}>
					New Game
				</Button>
			</main>
		);
	}

	return <GameView characterId={characterId} />;
}
