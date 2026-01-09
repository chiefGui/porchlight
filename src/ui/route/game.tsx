import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ActivityUtil } from "../../game/activity/index.ts";
import { ChatUtil } from "../../game/chat/index.ts";
import { Player } from "../../game/player/index.ts";
import { Footer, FooterButton } from "../layout/footer.tsx";
import { ActivityCard } from "../game/activity-card.tsx";
import { CharacterDrawer } from "../game/character-drawer.tsx";
import { rootRoute } from "./root.tsx";

export const gameRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/game",
	beforeLoad: () => {
		const playerId = Player.getCharacterId();
		if (!playerId) {
			throw redirect({ to: "/" });
		}
		return { playerId };
	},
	component: GamePage,
});

function GamePage(): React.ReactElement {
	const { playerId } = gameRoute.useRouteContext();
	const navigate = useNavigate();
	const [characterDrawerOpen, setCharacterDrawerOpen] = useState(false);
	const [, forceUpdate] = useState(0);

	const handleActivity = (activityId: string) => {
		ActivityUtil.perform(playerId, activityId);
		forceUpdate((n) => n + 1);
	};

	const availableActivities = ActivityUtil.getAvailable(playerId);

	return (
		<>
			<main className="pb-16">
				<div className="p-4 space-y-6">
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
					icon={<ChatIcon />}
					label="Chat"
					onClick={() => navigate({ to: "/chat" })}
					badge={ChatUtil.getUnreadCount(playerId)}
				/>
				<FooterButton
					icon={<UserIcon />}
					label="Me"
					active={characterDrawerOpen}
					onClick={() => setCharacterDrawerOpen(true)}
				/>
			</Footer>

			<CharacterDrawer
				characterId={playerId}
				open={characterDrawerOpen}
				onOpenChange={setCharacterDrawerOpen}
			/>
		</>
	);
}

function ChatIcon(): React.ReactElement {
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
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
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
