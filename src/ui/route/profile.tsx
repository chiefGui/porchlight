import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Component, Tag, type EntityId } from "../../engine/index.ts";
import { CharacterIdentity } from "../../game/character/index.ts";
import { Player } from "../../game/player/index.ts";
import { RelationshipUtil } from "../../game/relationship/index.ts";
import { Page } from "../layout/page.tsx";
import { BackButton, PageHeader } from "../layout/page-header.tsx";
import { rootRoute } from "./root.tsx";

export const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/profile/$characterId",
	beforeLoad: ({ params }) => {
		const playerId = Player.getCharacterId();
		if (!playerId) {
			throw redirect({ to: "/" });
		}
		const characterId = Number.parseInt(params.characterId, 10) as EntityId;
		return { playerId, characterId };
	},
	component: ProfilePage,
});

function ProfilePage(): React.ReactElement {
	const { playerId, characterId } = profileRoute.useRouteContext();
	const navigate = useNavigate();

	const identity = Component.get(characterId, CharacterIdentity);
	const relationship = RelationshipUtil.get(playerId, characterId);
	const opinion = RelationshipUtil.getEffectiveOpinion(playerId, characterId);
	const opinionColor = RelationshipUtil.getOpinionColor(opinion);
	const traits = Tag.all(characterId);

	const displayName = identity
		? `${identity.firstName} ${identity.lastName}`
		: "Unknown";

	return (
		<Page
			header={
				<PageHeader
					left={<BackButton onClick={() => navigate({ to: "/chat/$contactId", params: { contactId: String(characterId) } })} />}
					center={<h1 className="text-lg font-semibold">Profile</h1>}
				/>
			}
		>
			<div className="p-4 space-y-6">
				{/* Avatar and Name */}
				<div className="flex flex-col items-center text-center pt-4">
					<div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
						<span className="text-3xl font-bold text-secondary-foreground">
							{displayName.charAt(0).toUpperCase()}
						</span>
					</div>
					<h2 className="text-2xl font-bold">{displayName}</h2>
					{relationship && (
						<p className="text-sm text-muted-foreground capitalize">
							{relationship.typeId.replace(/_/g, " ")}
						</p>
					)}
				</div>

				{/* Opinion */}
				<section className="rounded-lg border border-border p-4">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
						Your Opinion
					</h3>
					<div className="flex items-center justify-between">
						<span className="text-sm">How you feel about them</span>
						<span className={`text-lg font-bold ${opinionColor}`}>
							{opinion > 0 ? "+" : ""}{opinion}
						</span>
					</div>
					<div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
							style={{ width: `${((opinion + 100) / 200) * 100}%` }}
						/>
					</div>
					<div className="flex justify-between text-xs text-muted-foreground mt-1">
						<span>Hostile</span>
						<span>Neutral</span>
						<span>Friendly</span>
					</div>
				</section>

				{/* Traits */}
				{traits.length > 0 && (
					<section className="rounded-lg border border-border p-4">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
							Traits
						</h3>
						<div className="flex flex-wrap gap-2">
							{traits.map((trait) => (
								<span
									key={trait}
									className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm capitalize"
								>
									{trait.replace(/_/g, " ")}
								</span>
							))}
						</div>
					</section>
				)}

				{/* Relationship Details */}
				{relationship && (
					<section className="rounded-lg border border-border p-4">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
							Relationship
						</h3>
						<dl className="space-y-2 text-sm">
							<div className="flex justify-between">
								<dt className="text-muted-foreground">Type</dt>
								<dd className="font-medium capitalize">
									{relationship.typeId.replace(/_/g, " ")}
								</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-muted-foreground">Base Opinion</dt>
								<dd className="font-medium">{relationship.opinion}</dd>
							</div>
						</dl>
					</section>
				)}
			</div>
		</Page>
	);
}
