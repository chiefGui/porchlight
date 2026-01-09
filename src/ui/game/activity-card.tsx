import { memo, useCallback } from "react";
import type { Activity } from "../../content/activity/activity.ts";

type ActivityCardProps = {
	activity: Activity;
	onSelect: (activityId: string) => void;
};

export const ActivityCard = memo(function ActivityCard({
	activity,
	onSelect,
}: ActivityCardProps): React.ReactElement {
	const effects = activity.effects;

	const handleClick = useCallback(() => {
		onSelect(activity.id);
	}, [onSelect, activity.id]);

	return (
		<button
			type="button"
			onClick={handleClick}
			className="w-full text-left p-4 rounded-lg border border-border bg-card hover:bg-accent active:bg-accent active:scale-[0.98] transition-all touch-manipulation"
		>
			<div className="flex justify-between items-start">
				<div className="space-y-1">
					<h3 className="font-medium">{activity.name}</h3>
					{activity.description && (
						<p className="text-sm text-muted-foreground">
							{activity.description}
						</p>
					)}
				</div>
				<div className="text-right text-sm space-y-1">
					{effects.stamina !== undefined && (
						<p
							className={
								effects.stamina >= 0 ? "text-green-500" : "text-red-500"
							}
						>
							{effects.stamina >= 0 ? "+" : ""}
							{Math.round(effects.stamina * 100)}% stamina
						</p>
					)}
					{effects.money !== undefined && (
						<p
							className={effects.money >= 0 ? "text-green-500" : "text-red-500"}
						>
							{effects.money >= 0 ? "+" : ""}${effects.money}
						</p>
					)}
				</div>
			</div>
		</button>
	);
});
