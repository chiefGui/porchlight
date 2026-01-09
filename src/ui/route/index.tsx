import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { CharacterGenerator } from "../../game/character/character-generator.ts";
import { Player } from "../../game/player/index.ts";
import { CharacterDrawer } from "../game/character-drawer.tsx";
import { Footer, FooterButton } from "../layout/footer.tsx";
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
	const [drawerOpen, setDrawerOpen] = useState(false);

	const handleNewGame = () => {
		const entityId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			traitsPerCategory: 3,
		});
		Player.set(entityId);
		setCharacterId(entityId);
	};

	// New Game screen
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

	// Game view
	return (
		<>
			<main className="min-h-screen pb-16">
				{/* Main game content goes here */}
				<div className="p-4">
					<p className="text-muted-foreground">Game started</p>
				</div>
			</main>

			<Footer>
				<FooterButton
					icon={<UserIcon />}
					label="Me"
					active={drawerOpen}
					onClick={() => setDrawerOpen(true)}
				/>
			</Footer>

			<CharacterDrawer
				characterId={characterId}
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
			/>
		</>
	);
}

function UserIcon(): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-full h-full"
		>
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}
