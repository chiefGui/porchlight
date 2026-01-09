import type { EntityId } from "../../engine/index.ts";
import { useEntity } from "../../engine/react/index.ts";
import { GameCalendar } from "../../game/calendar/index.ts";
import { CharacterIdentity } from "../../game/character/identity.ts";
import { Clock } from "../../game/clock/index.ts";
import {
	Drawer,
	DrawerBody,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "../primitive/drawer.tsx";

type CharacterDrawerProps = {
	characterId: EntityId;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function CharacterDrawer({
	characterId,
	open,
	onOpenChange,
}: CharacterDrawerProps): React.ReactElement {
	const entity = useEntity(characterId);
	const identity = entity.getComponent(CharacterIdentity);

	if (!identity) {
		return (
			<Drawer side="right" open={open} onOpenChange={onOpenChange}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Character</DrawerTitle>
						<DrawerClose />
					</DrawerHeader>
					<DrawerBody>
						<p className="text-muted-foreground">No character data</p>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		);
	}

	const age = GameCalendar.age({
		birthDate: identity.birthDate,
		currentDate: Clock.get(),
	});

	const tags = entity.getTags();

	// Categorize traits
	const lifeStage = tags.find((t) =>
		["child", "teen", "adult", "elder"].includes(t),
	);
	const culture = tags.find((t) => ["american", "canadian"].includes(t));
	const personalityTraits = tags.filter(
		(t) =>
			t !== lifeStage &&
			t !== culture &&
			!["employed", "unemployed"].includes(t),
	);

	return (
		<Drawer side="right" open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>
						{identity.firstName} {identity.lastName}
					</DrawerTitle>
					<DrawerClose />
				</DrawerHeader>
				<DrawerBody className="space-y-6">
					{/* Basic Info */}
					<section className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Info
						</h3>
						<div className="space-y-2">
							<InfoRow label="Age" value={`${age} years old`} />
							<InfoRow label="Gender" value={identity.gender} />
							<InfoRow
								label="Birthday"
								value={GameCalendar.format(identity.birthDate)}
							/>
						</div>
					</section>

					{/* Life Stage & Culture */}
					<section className="space-y-3">
						<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
							Background
						</h3>
						<div className="flex flex-wrap gap-2">
							{lifeStage && <TraitBadge trait={lifeStage} variant="life-stage" />}
							{culture && <TraitBadge trait={culture} variant="culture" />}
						</div>
					</section>

					{/* Personality */}
					{personalityTraits.length > 0 && (
						<section className="space-y-3">
							<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
								Personality
							</h3>
							<div className="flex flex-wrap gap-2">
								{personalityTraits.map((trait) => (
									<TraitBadge key={trait} trait={trait} variant="personality" />
								))}
							</div>
						</section>
					)}
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
}

function InfoRow({
	label,
	value,
}: { label: string; value: string }): React.ReactElement {
	return (
		<div className="flex justify-between items-center">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span className="text-sm font-medium capitalize">{value}</span>
		</div>
	);
}

type TraitBadgeProps = {
	trait: string;
	variant: "personality" | "culture" | "life-stage";
};

function TraitBadge({ trait, variant }: TraitBadgeProps): React.ReactElement {
	const variantClasses = {
		personality: "bg-secondary text-secondary-foreground",
		culture: "bg-blue-500/10 text-blue-500",
		"life-stage": "bg-amber-500/10 text-amber-500",
	};

	return (
		<span
			className={`px-3 py-1 rounded-full text-sm capitalize ${variantClasses[variant]}`}
		>
			{trait}
		</span>
	);
}
