import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { ChatUtil } from "../../game/chat/index.ts";
import { Player } from "../../game/player/index.ts";
import { MessageInput, MessageList } from "../chat/index.ts";
import { Page } from "../layout/page.tsx";
import { BackButton, CompactHeader } from "../layout/page-header.tsx";
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
			<Page>
				<div className="flex-1 flex items-center justify-center">
					<p className="text-muted-foreground">Conversation not found</p>
				</div>
			</Page>
		);
	}

	return (
		<Page
			header={
				<CompactHeader left={<BackButton onClick={() => navigate({ to: "/chat" })} />}>
					<button
						type="button"
						onClick={() =>
							navigate({
								to: "/profile/$characterId",
								params: { characterId: String(contactId) },
							})
						}
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
							<span className="text-sm font-semibold text-secondary-foreground">
								{contactName.charAt(0).toUpperCase()}
							</span>
						</div>
						<div className="text-left min-w-0">
							<h1 className="text-sm font-semibold leading-tight truncate">{contactName}</h1>
							<p className="text-xs text-muted-foreground">Tap for info</p>
						</div>
					</button>
				</CompactHeader>
			}
			footer={<MessageInput onSend={handleSendMessage} />}
		>
			<MessageList thread={thread} playerId={playerId} />
		</Page>
	);
}
