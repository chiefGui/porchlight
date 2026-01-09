import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { ChatUtil } from "../../game/chat/index.ts";
import { Player } from "../../game/player/index.ts";
import { MessageThread } from "../chat/message-thread.tsx";
import { rootRoute } from "./root.tsx";

export const chatThreadRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat/$contactId",
	beforeLoad: ({ params }) => {
		const playerId = Player.getCharacterId();
		if (!playerId) {
			throw redirect({ to: "/" });
		}
		const contactId = Number.parseInt(params.contactId, 10) as EntityId;
		return { playerId, contactId };
	},
	component: ChatThreadPage,
});

function ChatThreadPage(): React.ReactElement {
	const { playerId, contactId } = chatThreadRoute.useRouteContext();
	const navigate = useNavigate();
	const [, forceUpdate] = useState(0);

	const thread = ChatUtil.getThread(playerId, contactId);
	const contactName = ChatUtil.getDisplayName(contactId);

	const handleSendMessage = (content: string) => {
		ChatUtil.sendMessage(playerId, contactId, content, playerId);
		forceUpdate((n) => n + 1);
	};

	if (!thread) {
		return (
			<main className="min-h-screen flex items-center justify-center">
				<p className="text-muted-foreground">Conversation not found</p>
			</main>
		);
	}

	return (
		<main className="h-screen flex flex-col">
			<MessageThread
				thread={thread}
				playerId={playerId}
				contactName={contactName}
				onBack={() => navigate({ to: "/chat" })}
				onSendMessage={handleSendMessage}
			/>
		</main>
	);
}
