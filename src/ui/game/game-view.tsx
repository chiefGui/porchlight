import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { ActivityUtil } from "../../game/activity/index.ts";
import { GameCalendar } from "../../game/calendar/index.ts";
import { ChatUtil } from "../../game/chat/index.ts";
import { Clock } from "../../game/clock/index.ts";
import { ChatDrawer } from "../chat/index.ts";
import { Footer, FooterButton } from "../layout/footer.tsx";
import { ActivityCard } from "./activity-card.tsx";
import { CharacterDrawer } from "./character-drawer.tsx";

type GameViewProps = {
	characterId: EntityId;
};

export function GameView({ characterId }: GameViewProps): React.ReactElement {
	const [characterDrawerOpen, setCharacterDrawerOpen] = useState(false);
	const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
	const [, forceUpdate] = useState(0);

	const handleActivity = (activityId: string) => {
		ActivityUtil.perform(characterId, activityId);
		forceUpdate((n) => n + 1);
	};

	const currentDate = Clock.get();
	const period = Clock.period();
	const availableActivities = ActivityUtil.getAvailable(characterId);

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
					icon={<ChatIcon />}
					label="Chat"
					active={chatDrawerOpen}
					onClick={() => setChatDrawerOpen(true)}
					badge={ChatUtil.getUnreadCount(characterId)}
				/>
				<FooterButton
					icon={<UserIcon />}
					label="Me"
					active={characterDrawerOpen}
					onClick={() => setCharacterDrawerOpen(true)}
				/>
			</Footer>

			<ChatDrawer
				playerId={characterId}
				open={chatDrawerOpen}
				onOpenChange={setChatDrawerOpen}
			/>

			<CharacterDrawer
				characterId={characterId}
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
