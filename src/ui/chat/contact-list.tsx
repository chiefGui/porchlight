import type { EntityId } from "../../engine/index.ts";
import type { Contact } from "../../game/chat/index.ts";

type ContactListProps = {
	contacts: Contact[];
	onSelectContact: (contactId: EntityId) => void;
};

export function ContactList({
	contacts,
	onSelectContact,
}: ContactListProps): React.ReactElement {
	if (contacts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full p-8 text-center">
				<MessageCircleIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
				<h3 className="text-lg font-medium text-muted-foreground">
					No contacts yet
				</h3>
				<p className="text-sm text-muted-foreground/70 mt-1">
					Build relationships to start chatting
				</p>
			</div>
		);
	}

	return (
		<div className="divide-y divide-border">
			{contacts.map((contact) => (
				<ContactItem
					key={contact.entityId}
					contact={contact}
					onClick={() => onSelectContact(contact.entityId)}
				/>
			))}
		</div>
	);
}

type ContactItemProps = {
	contact: Contact;
	onClick: () => void;
};

function ContactItem({
	contact,
	onClick,
}: ContactItemProps): React.ReactElement {
	return (
		<button
			type="button"
			className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
			onClick={onClick}
		>
			{/* Avatar */}
			<div className="relative flex-shrink-0">
				<div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
					<span className="text-lg font-semibold text-secondary-foreground">
						{contact.displayName.charAt(0).toUpperCase()}
					</span>
				</div>
				{contact.online && (
					<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
				)}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<h3 className="font-medium truncate">{contact.displayName}</h3>
					{contact.unreadCount > 0 && (
						<span className="flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
							{contact.unreadCount > 99 ? "99+" : contact.unreadCount}
						</span>
					)}
				</div>
				{contact.lastMessage ? (
					<p className="text-sm text-muted-foreground truncate mt-0.5">
						{contact.lastMessage}
					</p>
				) : (
					<p className="text-sm text-muted-foreground/60 italic mt-0.5">
						No messages yet
					</p>
				)}
			</div>
		</button>
	);
}

function MessageCircleIcon({ className }: { className?: string }): React.ReactElement {
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
			<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
		</svg>
	);
}
