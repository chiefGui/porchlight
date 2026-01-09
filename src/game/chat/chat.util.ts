import { Component, Tag, type EntityId } from "../../engine/index.ts";
import { GameLoop } from "../../engine/loop/index.ts";
import { Random } from "../../engine/random/index.ts";
import { CharacterIdentity } from "../character/identity.ts";
import { Relationships } from "../relationship/relationship.component.ts";
import { RelationshipUtil } from "../relationship/relationship.util.ts";
import { ChatThreads } from "./chat.component.ts";
import type { ChatThread, Contact, Message } from "./chat.types.ts";

/**
 * Utility class for managing the chat system.
 */
export class ChatUtil {
	/**
	 * Get or create the ChatThreads component for an entity.
	 */
	static getOrCreate(entityId: EntityId): ChatThreads {
		let threads = Component.get(entityId, ChatThreads);
		if (!threads) {
			threads = new ChatThreads();
			Component.add(entityId, ChatThreads, threads);
		}
		return threads;
	}

	/**
	 * Send a message from one entity to another.
	 */
	static sendMessage(
		fromId: EntityId,
		toId: EntityId,
		content: string,
		playerId: EntityId,
	): Message {
		const message: Message = {
			id: Random.uuid(),
			senderId: fromId,
			content,
			timestamp: GameLoop.getTickCount(),
			sentAt: Date.now(),
			read: fromId === playerId, // Messages from player are already "read"
			type: "text",
		};

		// Add to player's chat threads (player stores all conversations)
		const playerThreads = ChatUtil.getOrCreate(playerId);
		const participantId = fromId === playerId ? toId : fromId;
		playerThreads.addMessage(participantId, message, GameLoop.getTickCount());

		return message;
	}

	/**
	 * Get contacts for the player based on their relationships.
	 */
	static getContacts(playerId: EntityId): Contact[] {
		const relationships = Component.get(playerId, Relationships);
		if (!relationships) return [];

		const threads = Component.get(playerId, ChatThreads);
		const contacts: Contact[] = [];

		for (const [targetId, relationship] of relationships.entries()) {
			const identity = Component.get(targetId, CharacterIdentity);
			if (!identity) continue;

			const thread = threads?.get(targetId);
			const lastMessage = thread?.messages.at(-1);

			contacts.push({
				entityId: targetId,
				displayName: `${identity.firstName} ${identity.lastName}`,
				lastMessage: lastMessage?.content,
				lastActivityAt: thread?.lastActivityAt ?? relationship.establishedAt,
				unreadCount: thread?.unreadCount ?? 0,
				online: true, // For now, everyone is "online"
			});
		}

		// Sort by last activity (most recent first)
		return contacts.sort((a, b) => b.lastActivityAt - a.lastActivityAt);
	}

	/**
	 * Get the display name for an entity.
	 */
	static getDisplayName(entityId: EntityId): string {
		const identity = Component.get(entityId, CharacterIdentity);
		if (!identity) return "Unknown";
		return `${identity.firstName} ${identity.lastName}`;
	}

	/**
	 * Get the first name for an entity.
	 */
	static getFirstName(entityId: EntityId): string {
		const identity = Component.get(entityId, CharacterIdentity);
		return identity?.firstName ?? "Unknown";
	}

	/**
	 * Generate a contextual message based on relationship and traits.
	 */
	static generateMessage(
		fromId: EntityId,
		toId: EntityId,
	): string {
		const relationship = RelationshipUtil.get(fromId, toId);
		const opinion = relationship
			? RelationshipUtil.getEffectiveOpinion(fromId, toId)
			: 0;

		const senderTraits = new Set(Tag.all(fromId));
		const senderIdentity = Component.get(fromId, CharacterIdentity);
		const targetIdentity = Component.get(toId, CharacterIdentity);

		// Select message pool based on opinion
		let messagePool: string[];

		if (opinion >= 60) {
			messagePool = ChatUtil.getPositiveMessages(senderTraits, senderIdentity, targetIdentity);
		} else if (opinion >= 20) {
			messagePool = ChatUtil.getFriendlyMessages(senderTraits, senderIdentity, targetIdentity);
		} else if (opinion >= -20) {
			messagePool = ChatUtil.getNeutralMessages(senderTraits, senderIdentity, targetIdentity);
		} else {
			messagePool = ChatUtil.getNegativeMessages(senderTraits, senderIdentity, targetIdentity);
		}

		return Random.pick(messagePool) ?? "Hey";
	}

	private static getPositiveMessages(
		traits: Set<string>,
		_sender: CharacterIdentity | undefined,
		target: CharacterIdentity | undefined,
	): string[] {
		const targetName = target?.firstName ?? "friend";
		const messages = [
			`Hey ${targetName}! Just thinking about you`,
			"Miss you! We should hang out soon",
			"You're the best, you know that?",
			"Thanks for always being there for me",
			"Can't wait to see you again!",
			"You always know how to make me smile",
		];

		if (traits.has("romantic")) {
			messages.push(
				"You're on my mind today",
				"Just wanted to say you're amazing",
			);
		}

		if (traits.has("cheerful")) {
			messages.push(
				"Having such a great day and wanted to share it with you!",
				"Life is good! Hope yours is too",
			);
		}

		return messages;
	}

	private static getFriendlyMessages(
		traits: Set<string>,
		_sender: CharacterIdentity | undefined,
		target: CharacterIdentity | undefined,
	): string[] {
		const targetName = target?.firstName ?? "friend";
		const messages = [
			`Hey ${targetName}, how's it going?`,
			"What are you up to today?",
			"We should catch up sometime!",
			"How have you been?",
			"Long time no talk!",
			"Hope you're having a good day",
		];

		if (traits.has("outgoing")) {
			messages.push(
				"Want to hang out this weekend?",
				"There's this cool new place we should check out",
			);
		}

		if (traits.has("bookworm")) {
			messages.push(
				"Read any good books lately?",
				"I just finished this amazing book, you'd love it",
			);
		}

		if (traits.has("athletic")) {
			messages.push(
				"Want to go for a run sometime?",
				"Just finished a workout, feeling great!",
			);
		}

		return messages;
	}

	private static getNeutralMessages(
		traits: Set<string>,
		_sender: CharacterIdentity | undefined,
		_target: CharacterIdentity | undefined,
	): string[] {
		const messages = [
			"Hey",
			"Hi there",
			"What's up?",
			"How are you?",
			"Just saying hi",
		];

		if (traits.has("shy")) {
			messages.push(
				"...",
				"Hi. Hope I'm not bothering you",
			);
		}

		return messages;
	}

	private static getNegativeMessages(
		traits: Set<string>,
		_sender: CharacterIdentity | undefined,
		_target: CharacterIdentity | undefined,
	): string[] {
		const messages = [
			"We need to talk.",
			"Whatever.",
			"Can you just leave me alone?",
			"I'm busy.",
			"Not in the mood to chat.",
		];

		if (traits.has("gloomy")) {
			messages.push(
				"Everything is pointless anyway",
				"Why do you even bother?",
			);
		}

		return messages;
	}

	/**
	 * Simulate receiving messages from NPCs based on their relationships.
	 * Call this periodically (e.g., once per game day).
	 */
	static simulateIncomingMessages(playerId: EntityId): Message[] {
		const relationships = Component.get(playerId, Relationships);
		if (!relationships) return [];

		const newMessages: Message[] = [];

		for (const [targetId, relationship] of relationships.entries()) {
			// Higher opinion = higher chance of messaging
			const opinion = RelationshipUtil.getEffectiveOpinion(targetId, playerId);
			const messageChance = ChatUtil.calculateMessageChance(opinion, relationship.typeId);

			if (Random.float(0, 1) < messageChance) {
				const content = ChatUtil.generateMessage(targetId, playerId);
				const message = ChatUtil.sendMessage(targetId, playerId, content, playerId);
				newMessages.push(message);
			}
		}

		return newMessages;
	}

	/**
	 * Calculate the probability of receiving a message based on opinion and relationship.
	 */
	private static calculateMessageChance(opinion: number, _relationshipTypeId: string): number {
		// Base chance from opinion (0% at -100, 50% at 100)
		const opinionFactor = (opinion + 100) / 400;

		// Add some randomness
		return Math.min(0.5, Math.max(0.02, opinionFactor));
	}

	/**
	 * Get the total unread message count for a player.
	 */
	static getUnreadCount(playerId: EntityId): number {
		const threads = Component.get(playerId, ChatThreads);
		return threads?.getTotalUnreadCount() ?? 0;
	}

	/**
	 * Mark a thread as read.
	 */
	static markThreadAsRead(playerId: EntityId, participantId: EntityId): void {
		const threads = Component.get(playerId, ChatThreads);
		threads?.markAsRead(participantId);
	}

	/**
	 * Get a specific chat thread.
	 */
	static getThread(playerId: EntityId, participantId: EntityId): ChatThread | undefined {
		const threads = Component.get(playerId, ChatThreads);
		return threads?.get(participantId);
	}
}
