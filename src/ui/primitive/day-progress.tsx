import { Moon, Sun, Sunset } from "lucide-react";
import type { DayPeriod } from "../../game/calendar/index.ts";

type DayProgressCircleProps = {
	/** Progress through the day as percentage (0-100) */
	progress: number;
	/** Current period of day for icon display */
	period: DayPeriod;
	/** Size of the circle in pixels */
	size?: number;
	/** Stroke width in pixels */
	strokeWidth?: number;
};

export function DayProgressCircle({
	progress,
	period,
	size = 36,
	strokeWidth = 3,
}: DayProgressCircleProps): React.ReactElement {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	const PeriodIcon = getPeriodIcon(period);
	const periodLabel = getPeriodLabel(period);
	const progressPercent = Math.round(progress);

	return (
		<div
			className="relative"
			style={{ width: size, height: size }}
			role="progressbar"
			aria-valuenow={progressPercent}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={`Day progress: ${progressPercent}%, currently ${periodLabel}`}
		>
			{/* SVG with gradient definition */}
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="transform -rotate-90"
				aria-hidden="true"
			>
				<defs>
					<linearGradient
						id="dayProgressGradient"
						x1="0%"
						y1="0%"
						x2="100%"
						y2="0%"
					>
						<stop offset="0%" stopColor="var(--color-primary)" />
						<stop offset="100%" stopColor="var(--color-ring)" />
					</linearGradient>
				</defs>

				{/* Background circle */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="currentColor"
					strokeWidth={strokeWidth}
					className="text-secondary"
				/>

				{/* Progress circle with gradient */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="url(#dayProgressGradient)"
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					className="transition-all duration-300"
				/>
			</svg>

			{/* Center icon */}
			<div className="absolute inset-0 flex items-center justify-center">
				<PeriodIcon
					className="w-4 h-4 text-primary"
					aria-hidden="true"
				/>
			</div>
		</div>
	);
}

function getPeriodIcon(period: DayPeriod) {
	switch (period) {
		case "morning":
			return Sun;
		case "afternoon":
			return Sun;
		case "evening":
			return Sunset;
		case "night":
			return Moon;
	}
}

function getPeriodLabel(period: DayPeriod): string {
	switch (period) {
		case "morning":
			return "morning";
		case "afternoon":
			return "afternoon";
		case "evening":
			return "evening";
		case "night":
			return "night";
	}
}
