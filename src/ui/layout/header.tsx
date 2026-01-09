import { useState } from "react";
import { Menu, Moon, Sun, Sunset } from "lucide-react";
import { GameCalendar, type DayPeriod } from "../../game/calendar/index.ts";
import { Clock } from "../../game/clock/index.ts";
import { SystemMenu } from "./system-menu.tsx";

export function Header(): React.ReactElement {
	const [menuOpen, setMenuOpen] = useState(false);

	const currentDate = Clock.get();
	const period = Clock.period();
	const dateFormatted = GameCalendar.formatHuman(currentDate);

	// Calculate day progress (0-100%)
	const hour = currentDate.hour ?? 0;
	const progress = (hour / 24) * 100;

	return (
		<>
			<header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background border-b border-border">
				<div className="flex items-center gap-3">
					<DayProgressCircle progress={progress} period={period} />
					<span className="text-sm font-medium">{dateFormatted}</span>
				</div>
				<button
					type="button"
					onClick={() => setMenuOpen(true)}
					className="p-2 -mr-2 rounded-md hover:bg-secondary transition-colors"
					aria-label="Open menu"
				>
					<Menu className="w-5 h-5" />
				</button>
			</header>

			<SystemMenu open={menuOpen} onOpenChange={setMenuOpen} />
		</>
	);
}

type DayProgressCircleProps = {
	progress: number;
	period: DayPeriod;
};

function DayProgressCircle({
	progress,
	period,
}: DayProgressCircleProps): React.ReactElement {
	const size = 36;
	const strokeWidth = 3;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (progress / 100) * circumference;

	const PeriodIcon = getPeriodIcon(period);

	return (
		<div className="relative" style={{ width: size, height: size }}>
			{/* SVG with gradient definition */}
			<svg
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className="transform -rotate-90"
			>
				<defs>
					<linearGradient id="dayProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
				<PeriodIcon className="w-4 h-4 text-primary" />
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
