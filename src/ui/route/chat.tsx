import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ChatUtil } from "../../game/chat/index.ts";
import { Player } from "../../game/player/index.ts";
import { ContactList } from "../chat/index.ts";
import { Footer, FooterButton } from "../layout/footer.tsx";
import { Page } from "../layout/page.tsx";
import { BackButton, PageHeader } from "../layout/page-header.tsx";
import { rootRoute } from "./root.tsx";

export const chatRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	beforeLoad: () => {
		const playerId = Player.getCharacterId();
		if (!playerId) {
			throw redirect({ to: "/" });
		}
		return { playerId };
	},
	component: ChatPage,
});

function ChatPage(): React.ReactElement {
	const { playerId } = chatRoute.useRouteContext();
	const navigate = useNavigate();
	const contacts = ChatUtil.getContacts(playerId);

	return (
		<Page
			header={
				<PageHeader
					left={<BackButton onClick={() => navigate({ to: "/game" })} />}
					center={<h1 className="text-lg font-semibold">Messages</h1>}
				/>
			}
			footer={
				<Footer>
					<FooterButton
						icon={<HomeIcon />}
						label="Home"
						onClick={() => navigate({ to: "/game" })}
					/>
					<FooterButton
						icon={<ChatIcon />}
						label="Chat"
						active
						badge={ChatUtil.getUnreadCount(playerId)}
					/>
				</Footer>
			}
		>
			<ContactList
				contacts={contacts}
				playerId={playerId}
				onSelectContact={(contactId) =>
					navigate({ to: "/chat/$contactId", params: { contactId: String(contactId) } })
				}
			/>
		</Page>
	);
}

function HomeIcon(): React.ReactElement {
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
			<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<polyline points="9 22 9 12 15 12 15 22" />
		</svg>
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
