import { createRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Activity } from "../../content/activity/activity.ts";
import type { EntityId } from "../../engine/index.ts";
import { ActivityUtil } from "../../game/activity/index.ts";
import { GameCalendar } from "../../game/calendar/index.ts";
import { CharacterGenerator } from "../../game/character/character-generator.ts";
import { Clock } from "../../game/clock/index.ts";
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
	const [, forceUpdate] = useState(0);

	const handleNewGame = () => {
		const entityId = CharacterGenerator.fromArchetype({
			archetype: "adult",
			culture: "american",
			traitsPerCategory: 3,
		});
		Player.set(entityId);
		setCharacterId(entityId);
	};

	const handleActivity = (activityId: string) => {
		if (!characterId) return;
		ActivityUtil.perform(characterId, activityId);
		forceUpdate((n) => n + 1);
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

	const currentDate = Clock.get();
	const period = Clock.period();
	const availableActivities = ActivityUtil.getAvailable(characterId);

	// Game view
	return (
		<>
			<main className="min-h-screen pb-16">
				<div className="p-4 space-y-6">
					{/* Time display */}
					<header className="text-center space-y-1">
						<p className="text-sm text-muted-foreground">
							{GameCalendar.format(currentDate)}
						</p>
						<h1 className="text-2xl font-bold capitalize">{period}</h1>
					</header>

					{/* Activity selection */}
					<section className="space-y-3">
						<h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							What would you like to do?
						</h2>
						<div className="space-y-2">
							{availableActivities.map((activity) => (
								<ActivityCard
									key={activity.id}
									activity={activity}
									onSelect={() => handleActivity(activity.id)}
								/>
							))}
							{availableActivities.length === 0 && (
								<p className="text-muted-foreground text-sm">
									No activities available right now.
								</p>
							)}
						</div>
					</section>
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

type ActivityCardProps = {
	activity: Activity;
	onSelect: () => void;
};

function ActivityCard({
	activity,
	onSelect,
}: ActivityCardProps): React.ReactElement {
	const effects = activity.effects;

	return (
		<button
			type="button"
			onClick={onSelect}
			className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
		>
			<div className="flex justify-between items-start">
				<div className="space-y-1">
					<h3 className="font-medium">{activity.name}</h3>
					{activity.description && (
						<p className="text-sm text-muted-foreground">
							{activity.description}
						</p>
					)}
				</div>
				<div className="text-right text-sm space-y-1">
					{effects.stamina !== undefined && (
						<p
							className={
								effects.stamina >= 0 ? "text-green-500" : "text-red-500"
							}
						>
							{effects.stamina >= 0 ? "+" : ""}
							{Math.round(effects.stamina * 100)}% stamina
						</p>
					)}
					{effects.money !== undefined && (
						<p
							className={effects.money >= 0 ? "text-green-500" : "text-red-500"}
						>
							{effects.money >= 0 ? "+" : ""}${effects.money}
						</p>
					)}
				</div>
			</div>
		</button>
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
