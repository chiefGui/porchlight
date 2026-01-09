import { createRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Component, Tag, type EntityId } from "../../engine/index.ts";
import { TraitRegistry } from "../../content/character/trait.ts";
import { CharacterIdentity } from "../../game/character/index.ts";
import { Player } from "../../game/player/index.ts";
import { RelationshipUtil } from "../../game/relationship/index.ts";
import { cn } from "../lib/cn.ts";
import { Page } from "../layout/page.tsx";
import { BackButton, PageHeader } from "../layout/page-header.tsx";
import { rootRoute } from "./root.tsx";

const CULTURE_FLAGS: Record<string, string> = {
	american: "🇺🇸",
	canadian: "🇨🇦",
};

const GENDER_ICONS: Record<string, string> = {
	male: "♂",
	female: "♀",
};

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
	const allTraits = Tag.all(characterId);

	// Filter to only personality traits
	const personalityTraits = allTraits.filter((traitId) => {
		const trait = TraitRegistry.get(traitId);
		return trait?.category === "personality";
	});

	const displayName = identity
		? `${identity.firstName} ${identity.lastName}`
		: "Unknown";

	const genderIcon = identity ? GENDER_ICONS[identity.gender] : null;
	const cultureFlag = identity ? CULTURE_FLAGS[identity.culture] : null;

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
				{/* Avatar, Name, and Identity */}
				<div className="flex flex-col items-center text-center pt-4">
					<div className="relative">
						<div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
							<span className="text-3xl font-bold text-secondary-foreground">
								{displayName.charAt(0).toUpperCase()}
							</span>
						</div>
						{cultureFlag && (
							<span className="absolute -bottom-1 -right-1 text-2xl">
								{cultureFlag}
							</span>
						)}
					</div>

					<div className="mt-4 flex items-center gap-2">
						<h2 className="text-2xl font-bold">{displayName}</h2>
						{genderIcon && (
							<span className={cn(
								"text-xl",
								identity?.gender === "male" ? "text-blue-400" : "text-pink-400"
							)}>
								{genderIcon}
							</span>
						)}
					</div>

					{relationship && (
						<p className="text-sm text-muted-foreground capitalize mt-1">
							{relationship.typeId.replace(/_/g, " ")}
						</p>
					)}
				</div>

				{/* Opinion Card */}
				<section className="rounded-xl bg-card p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<span className="text-sm font-medium text-muted-foreground">
							Opinion
						</span>
						<span className={cn(
							"text-2xl font-bold",
							opinion >= 0 ? "text-green-500" : "text-red-500"
						)}>
							{opinion > 0 ? "+" : ""}{opinion}
						</span>
					</div>

					{/* Progress bar */}
					<div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
						<div
							className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
							style={{ width: `${((opinion + 100) / 200) * 100}%` }}
						/>
					</div>
					<p className="text-xs text-muted-foreground text-right">{opinionLabel}</p>

					{/* Breakdown */}
					{opinionBreakdown.length > 0 && (
						<div className="space-y-2 pt-3 mt-3 border-t border-border">
							{opinionBreakdown.map((source, i) => (
								<div key={i} className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{source.label}
									</span>
									<span className={cn(
										"font-medium tabular-nums",
										source.type === "positive" ? "text-green-500" : "text-red-500"
									)}>
										{source.value > 0 ? "+" : ""}{source.value}
									</span>
								</div>
							))}
						</div>
					)}
				</section>

				{/* Personality Traits */}
				{personalityTraits.length > 0 && (
					<section>
						<h3 className="text-sm font-medium text-muted-foreground mb-3">
							Personality
						</h3>
						<div className="flex flex-wrap gap-2">
							{personalityTraits.map((traitId) => {
								const trait = TraitRegistry.get(traitId);
								return (
									<span
										key={traitId}
										className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
									>
										{trait?.name ?? traitId}
									</span>
								);
							})}
						</div>
					</section>
				)}
			</div>
		</Page>
	);
}
