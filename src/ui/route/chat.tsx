import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ChatUtil } from "../../game/chat/index.ts";
import { Player } from "../../game/player/index.ts";
import { ContactList } from "../chat/index.ts";
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
		>
			<ContactList
				contacts={contacts}
				onSelectContact={(contactId) =>
					navigate({ to: "/chat/$contactId", params: { contactId: String(contactId) } })
				}
			/>
		</Page>
	);
}
