import { useState } from "react";
import { Component, type EntityId } from "../../engine/index.ts";
import { ChatThreads, ChatUtil } from "../../game/chat/index.ts";
import {
	Drawer,
	DrawerBody,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "../primitive/drawer.tsx";
import { ContactList } from "./contact-list.tsx";
import { MessageThread } from "./message-thread.tsx";

type ChatDrawerProps = {
	playerId: EntityId;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function ChatDrawer({
	playerId,
	open,
	onOpenChange,
}: ChatDrawerProps): React.ReactElement {
	const [selectedContactId, setSelectedContactId] = useState<EntityId | null>(null);
	const [, forceUpdate] = useState(0);

	const contacts = ChatUtil.getContacts(playerId);
	const threads = Component.get(playerId, ChatThreads);
	const selectedThread = selectedContactId ? threads?.get(selectedContactId) : null;
	const selectedContactName = selectedContactId
		? ChatUtil.getDisplayName(selectedContactId)
		: "";

	const handleSelectContact = (contactId: EntityId) => {
		// Ensure thread exists
		const chatThreads = ChatUtil.getOrCreate(playerId);
		if (!chatThreads.has(contactId)) {
			chatThreads.create(contactId, 0);
		}
		setSelectedContactId(contactId);
		forceUpdate((n) => n + 1);
	};

	const handleBack = () => {
		setSelectedContactId(null);
	};

	const handleSendMessage = (content: string) => {
		if (!selectedContactId) return;

		// Send player's message
		ChatUtil.sendMessage(playerId, selectedContactId, content, playerId);

		// Simulate NPC response after a short delay (in real game, this would be event-driven)
		setTimeout(() => {
			const response = ChatUtil.generateMessage(selectedContactId, playerId);
			ChatUtil.sendMessage(selectedContactId, playerId, response, playerId);
			forceUpdate((n) => n + 1);
		}, 500 + Math.random() * 1000);

		forceUpdate((n) => n + 1);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset to contact list when closing
			setSelectedContactId(null);
		}
		onOpenChange(newOpen);
	};

	return (
		<Drawer side="left" open={open} onOpenChange={handleOpenChange}>
			<DrawerContent className="w-full max-w-full sm:w-80 sm:max-w-[85vw]">
				{selectedThread && selectedContactId ? (
					<MessageThread
						thread={selectedThread}
						playerId={playerId}
						contactName={selectedContactName}
						onBack={handleBack}
						onSendMessage={handleSendMessage}
					/>
				) : (
					<>
						<DrawerHeader>
							<DrawerTitle>Messages</DrawerTitle>
							<DrawerClose />
						</DrawerHeader>
						<DrawerBody className="p-0">
							<ContactList
								contacts={contacts}
								playerId={playerId}
								onSelectContact={handleSelectContact}
							/>
						</DrawerBody>
					</>
				)}
			</DrawerContent>
		</Drawer>
	);
}
