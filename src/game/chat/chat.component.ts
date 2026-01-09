import { component, type EntityId } from "../../engine/index.ts";
import type { ChatThread, Message } from "./chat.types.ts";

/**
 * Component that stores all chat threads for an entity (typically the player).
 * Each thread represents a conversation with another character.
 */
@component()
export class ChatThreads {
	/**
	 * Map of participant entity ID to chat thread.
	 */
	private threads = new Map<EntityId, ChatThread>();

	/**
	 * Get a chat thread with a specific character.
	 */
	get(participantId: EntityId): ChatThread | undefined {
		return this.threads.get(participantId);
	}

	/**
	 * Check if a chat thread exists with a specific character.
	 */
	has(participantId: EntityId): boolean {
		return this.threads.has(participantId);
	}

	/**
	 * Create a new chat thread with a character.
	 */
	create(participantId: EntityId, createdAt: number): ChatThread {
		if (this.threads.has(participantId)) {
			return this.threads.get(participantId)!;
		}

		const thread: ChatThread = {
			participantId,
			messages: [],
			createdAt,
			lastActivityAt: createdAt,
			unreadCount: 0,
			muted: false,
		};

		this.threads.set(participantId, thread);
		return thread;
	}

	/**
	 * Add a message to a thread. Creates the thread if it doesn't exist.
	 */
	addMessage(participantId: EntityId, message: Message, currentTick: number): void {
		let thread = this.threads.get(participantId);
		if (!thread) {
			thread = this.create(participantId, currentTick);
		}

		thread.messages.push(message);
		thread.lastActivityAt = currentTick;

		// Update unread count if the message is from the other participant
		if (!message.read && message.senderId === participantId) {
			thread.unreadCount++;
		}

		this.threads.set(participantId, thread);
	}

	/**
	 * Mark all messages in a thread as read.
	 */
	markAsRead(participantId: EntityId): void {
		const thread = this.threads.get(participantId);
		if (!thread) return;

		for (const message of thread.messages) {
			message.read = true;
		}
		thread.unreadCount = 0;
		this.threads.set(participantId, thread);
	}

	/**
	 * Get the total unread count across all threads.
	 */
	getTotalUnreadCount(): number {
		let total = 0;
		for (const thread of this.threads.values()) {
			if (!thread.muted) {
				total += thread.unreadCount;
			}
		}
		return total;
	}

	/**
	 * Get all threads sorted by last activity (most recent first).
	 */
	getAllSorted(): ChatThread[] {
		return Array.from(this.threads.values()).sort(
			(a, b) => b.lastActivityAt - a.lastActivityAt,
		);
	}

	/**
	 * Get all thread entries as an array.
	 */
	entries(): [EntityId, ChatThread][] {
		return Array.from(this.threads.entries());
	}

	/**
	 * Get the number of threads.
	 */
	count(): number {
		return this.threads.size;
	}

	/**
	 * Delete a chat thread.
	 */
	delete(participantId: EntityId): boolean {
		return this.threads.delete(participantId);
	}

	/**
	 * Toggle mute status for a thread.
	 */
	toggleMute(participantId: EntityId): boolean {
		const thread = this.threads.get(participantId);
		if (!thread) return false;

		thread.muted = !thread.muted;
		this.threads.set(participantId, thread);
		return thread.muted;
	}

	/**
	 * Serialize for persistence.
	 */
	toJSON(): [EntityId, ChatThread][] {
		return Array.from(this.threads.entries());
	}

	/**
	 * Deserialize from persistence.
	 */
	static fromJSON(data: [EntityId, ChatThread][]): ChatThreads {
		const instance = new ChatThreads();
		for (const [entityId, thread] of data) {
			instance.threads.set(entityId, thread);
		}
		return instance;
	}
}
