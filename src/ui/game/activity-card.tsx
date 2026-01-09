import {
	ActivityRegistry,
	type Activity,
} from "../../content/activity/activity.ts";

type ActivityCardProps = {
	activity: Activity;
	onSelect: () => void;
};

export function ActivityCard({
	activity,
	onSelect,
}: ActivityCardProps): React.ReactElement {
	const effects = activity.effects;
	const hasChildren = ActivityRegistry.getChildren(activity.id).length > 0;

	return (
		<button
			type="button"
			onClick={onSelect}
			className="w-full text-left px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent active:scale-[0.98] transition-all flex items-center gap-3"
		>
			<div className="flex-1 min-w-0">
				<h3 className="font-medium truncate">{activity.name}</h3>
				{activity.description && (
					<p className="text-sm text-muted-foreground truncate">
						{activity.description}
					</p>
				)}
			</div>

			<div className="flex items-center gap-2 shrink-0">
				{effects.stamina !== undefined && effects.stamina !== 0 && (
					<EffectBadge
						value={effects.stamina}
						format={(v) => `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`}
						icon="⚡"
					/>
				)}
				{effects.money !== undefined && effects.money !== 0 && (
					<EffectBadge
						value={effects.money}
						format={(v) => `${v >= 0 ? "+" : ""}$${Math.abs(v)}`}
						icon="$"
					/>
				)}
				{hasChildren && <ChevronRight />}
			</div>
		</button>
	);
}

function EffectBadge({
	value,
	format,
	icon,
}: {
	value: number;
	format: (v: number) => string;
	icon: string;
}): React.ReactElement {
	const isPositive = value >= 0;
	return (
		<span
			className={`text-xs font-medium px-2 py-0.5 rounded-full ${
				isPositive
					? "bg-green-500/15 text-green-600 dark:text-green-400"
					: "bg-red-500/15 text-red-600 dark:text-red-400"
			}`}
			title={`${icon} ${format(value)}`}
		>
			{format(value)}
		</span>
	);
}

function ChevronRight(): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-4 h-4 text-muted-foreground"
		>
			<path d="m9 18 6-6-6-6" />
		</svg>
	);
}
