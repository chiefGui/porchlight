import { createRoute, useNavigate } from "@tanstack/react-router";
import { CharacterGenerator } from "../../game/character/character-generator.ts";
import { Player } from "../../game/player/index.ts";
import { Button } from "../primitive/button.tsx";
import { rootRoute } from "./root.tsx";

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: IndexPage,
});

function IndexPage(): React.ReactElement {
	const navigate = useNavigate();
	const existingPlayer = Player.get();

	const handleNewGame = () => {
		const entityId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			traitsPerCategory: 3,
		});
		Player.set(entityId);
		navigate({ to: "/game" });
	};

	const handleContinue = () => {
		navigate({ to: "/game" });
	};

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-8 gap-8">
			<div className="text-center space-y-2">
				<h1 className="text-4xl font-bold">Porchlight</h1>
				<p className="text-muted-foreground">A life simulation game</p>
			</div>
			<div className="flex flex-col gap-3">
				{existingPlayer && (
					<Button size="lg" onClick={handleContinue}>
						Continue
					</Button>
				)}
				<Button size="lg" variant={existingPlayer ? "outline" : "default"} onClick={handleNewGame}>
					New Game
				</Button>
			</div>
		</main>
	);
}
