import { useState } from "react";
import { Menu } from "lucide-react";
import { GameCalendar } from "../../game/calendar/index.ts";
import { Clock } from "../../game/clock/index.ts";
import { DayProgressCircle } from "../primitive/day-progress.tsx";
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
