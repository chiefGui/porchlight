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

	const getOpinionColor = (value: number): string => {
		if (value >= 50) return "text-emerald-400";
		if (value >= 20) return "text-green-400";
		if (value >= 0) return "text-muted-foreground";
		if (value >= -20) return "text-amber-400";
		if (value >= -50) return "text-orange-400";
		return "text-red-400";
	};

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

					<h2 className="mt-4 text-2xl font-bold">{displayName}</h2>

					{relationship && (
						<p className="text-sm text-muted-foreground capitalize mt-1 flex items-center gap-1.5">
							{genderIcon && (
								<span className={identity?.gender === "male" ? "text-blue-400" : "text-pink-400"}>
									{genderIcon}
								</span>
							)}
							{relationship.typeId.replace(/_/g, " ")}
						</p>
					)}
				</div>

				{/* Opinion Section - CK3 style */}
				<section className="rounded-xl bg-card p-4 shadow-sm">
					<div className="flex items-baseline justify-between mb-4">
						<span className="text-sm text-muted-foreground">
							{identity?.firstName}'s Opinion of You
						</span>
						<span className={cn("text-2xl font-bold tabular-nums", getOpinionColor(opinion))}>
							{opinion > 0 ? "+" : ""}{opinion}
						</span>
					</div>

					{/* Breakdown */}
					{opinionBreakdown.length > 0 && (
						<div className="space-y-1.5">
							{opinionBreakdown.map((source, i) => (
								<div key={i} className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">
										{source.label}
									</span>
									<span className={cn(
										"font-medium tabular-nums",
										source.type === "positive" ? "text-emerald-400" : "text-red-400"
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
