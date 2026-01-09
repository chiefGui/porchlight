import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Component, Tag, type EntityId } from "../../engine/index.ts";
import { CharacterIdentity } from "../../game/character/index.ts";
import { Player } from "../../game/player/index.ts";
import { RelationshipUtil } from "../../game/relationship/index.ts";
import { cn } from "../lib/cn.ts";
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
	const opinionLabel = RelationshipUtil.getOpinionLabel(opinion);
	const opinionBreakdown = RelationshipUtil.getOpinionBreakdown(playerId, characterId);
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

				{/* Opinion with breakdown */}
				<section className="rounded-lg border border-border p-4">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Your Opinion
						</h3>
						<span className="text-sm text-muted-foreground">{opinionLabel}</span>
					</div>

					{/* Total */}
					<div className="flex items-center justify-between mb-2">
						<span className="font-medium">Total</span>
						<span className={cn(
							"text-xl font-bold",
							opinion >= 0 ? "text-green-500" : "text-red-500"
						)}>
							{opinion > 0 ? "+" : ""}{opinion}
						</span>
					</div>

					{/* Progress bar */}
					<div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
						<div
							className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
							style={{ width: `${((opinion + 100) / 200) * 100}%` }}
						/>
					</div>

					{/* Breakdown */}
					{opinionBreakdown.length > 0 && (
						<div className="space-y-2 pt-3 border-t border-border">
							{opinionBreakdown.map((source, i) => (
								<div key={i} className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground capitalize">
										{source.label}
									</span>
									<span className={cn(
										"font-medium",
										source.type === "positive" ? "text-green-500" : "text-red-500"
									)}>
										{source.value > 0 ? "+" : ""}{source.value}
									</span>
								</div>
							))}
						</div>
					)}
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
			</div>
		</Page>
	);
}
