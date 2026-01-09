import { useEffect, useRef } from "react";
import type { EntityId } from "../../engine/index.ts";
import { ChatUtil, type ChatThread } from "../../game/chat/index.ts";
import { cn } from "../lib/cn.ts";
import { formatMessageTime } from "../lib/time.ts";

type MessageListProps = {
	thread: ChatThread;
	playerId: EntityId;
};

/**
 * Displays the list of messages in a chat thread.
 * Header and input are handled separately by the route.
 */
export function MessageList({
	thread,
	playerId,
}: MessageListProps): React.ReactElement {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [thread.messages.length]);

	// Mark as read when viewing
	useEffect(() => {
		ChatUtil.markThreadAsRead(playerId, thread.participantId);
	}, [playerId, thread.participantId]);

	if (thread.messages.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-4">
				<p className="text-sm text-muted-foreground">
					No messages yet. Say hello!
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto p-4 space-y-3">
			{thread.messages.map((message) => {
				const isFromPlayer = message.senderId === playerId;
				return (
					<div
						key={message.id}
						className={cn(
							"flex flex-col",
							isFromPlayer ? "items-end" : "items-start",
						)}
					>
						<div
							className={cn(
								"max-w-[80%] px-4 py-2 rounded-2xl",
								isFromPlayer
									? "bg-primary text-primary-foreground rounded-br-md"
									: "bg-muted text-foreground rounded-bl-md",
							)}
						>
							<p className="text-sm whitespace-pre-wrap break-words">
								{message.content}
							</p>
						</div>
						<span className="text-[10px] text-muted-foreground mt-1 px-1">
							{formatMessageTime(message.sentAt)}
						</span>
					</div>
				);
			})}
			<div ref={messagesEndRef} />
		</div>
	);
}
