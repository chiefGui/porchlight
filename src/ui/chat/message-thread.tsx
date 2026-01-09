import { useEffect, useRef, useState } from "react";
import type { EntityId } from "../../engine/index.ts";
import { ChatUtil, type ChatThread } from "../../game/chat/index.ts";
import { cn } from "../lib/cn.ts";

type MessageThreadProps = {
	thread: ChatThread;
	playerId: EntityId;
	contactName: string;
	onBack: () => void;
	onSendMessage: (content: string) => void;
};

export function MessageThread({
	thread,
	playerId,
	contactName,
	onBack,
	onSendMessage,
}: MessageThreadProps): React.ReactElement {
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [thread.messages.length]);

	// Mark as read when viewing
	useEffect(() => {
		ChatUtil.markThreadAsRead(playerId, thread.participantId);
	}, [playerId, thread.participantId]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = inputValue.trim();
		if (trimmed) {
			onSendMessage(trimmed);
			setInputValue("");
			inputRef.current?.focus();
		}
	};

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<header className="flex items-center gap-3 p-4 border-b border-border">
				<button
					type="button"
					onClick={onBack}
					className="p-1 -ml-1 hover:bg-muted rounded-md transition-colors"
				>
					<ChevronLeftIcon className="w-6 h-6" />
				</button>
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
						<span className="text-sm font-semibold text-secondary-foreground">
							{contactName.charAt(0).toUpperCase()}
						</span>
					</div>
					<div className="min-w-0">
						<h2 className="font-semibold truncate">{contactName}</h2>
						<p className="text-xs text-muted-foreground">Online</p>
					</div>
				</div>
			</header>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{thread.messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<p className="text-sm text-muted-foreground">
							No messages yet. Say hello!
						</p>
					</div>
				) : (
					thread.messages.map((message) => {
						const isFromPlayer = message.senderId === playerId;
						return (
							<div
								key={message.id}
								className={cn(
									"flex",
									isFromPlayer ? "justify-end" : "justify-start",
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
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<form
				onSubmit={handleSubmit}
				className="p-4 border-t border-border flex gap-2"
			>
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="Type a message..."
					className="flex-1 px-4 py-2 rounded-full bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				/>
				<button
					type="submit"
					disabled={!inputValue.trim()}
					className={cn(
						"w-10 h-10 rounded-full flex items-center justify-center transition-colors",
						inputValue.trim()
							? "bg-primary text-primary-foreground hover:bg-primary/90"
							: "bg-muted text-muted-foreground",
					)}
				>
					<SendIcon className="w-5 h-5" />
				</button>
			</form>
		</div>
	);
}

function ChevronLeftIcon({ className }: { className?: string }): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}

function SendIcon({ className }: { className?: string }): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="m22 2-7 20-4-9-9-4Z" />
			<path d="M22 2 11 13" />
		</svg>
	);
}
