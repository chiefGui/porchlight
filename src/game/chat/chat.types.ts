import type { EntityId } from "../../engine/index.ts";

// -----------------------------------------------------------------------------
// Message Types
// -----------------------------------------------------------------------------

/**
 * A single message in a chat thread.
 */
export type Message = {
	/** Unique message ID */
	id: string;
	/** The sender's entity ID (null for system messages) */
	senderId: EntityId | null;
	/** Message content */
	content: string;
	/** Game tick when the message was sent */
	timestamp: number;
	/** Whether the message has been read */
	read: boolean;
	/** Optional: message type for special styling */
	type?: MessageType;
};

export type MessageType = "text" | "system" | "image" | "emoji";

/**
 * A chat thread between the player and another character.
 */
export type ChatThread = {
	/** The other participant's entity ID */
	participantId: EntityId;
	/** All messages in this thread */
	messages: Message[];
	/** When the thread was created (game tick) */
	createdAt: number;
	/** Last activity timestamp (game tick) */
	lastActivityAt: number;
	/** Number of unread messages */
	unreadCount: number;
	/** Whether notifications are muted */
	muted: boolean;
};

/**
 * Represents a contact in the chat app.
 */
export type Contact = {
	/** The contact's entity ID */
	entityId: EntityId;
	/** Display name (cached for quick access) */
	displayName: string;
	/** Last message preview */
	lastMessage?: string;
	/** Last activity timestamp */
	lastActivityAt: number;
	/** Unread message count */
	unreadCount: number;
	/** Whether the contact is online (for future multiplayer) */
	online: boolean;
};

// -----------------------------------------------------------------------------
// Message Templates
// -----------------------------------------------------------------------------

/**
 * Template for generating contextual messages.
 */
export type MessageTemplate = {
	id: string;
	/** Trait requirements for this message to be used */
	senderTraits?: string[];
	/** Relationship type requirements */
	relationshipTypes?: string[];
	/** Opinion range (min, max) for this message */
	opinionRange?: [number, number];
	/** The message templates (randomly selected) */
	templates: string[];
	/** Weight for random selection */
	weight: number;
};
