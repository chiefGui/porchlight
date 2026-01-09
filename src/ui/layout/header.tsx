import { useState } from "react";
import { GameCalendar } from "../../game/calendar/index.ts";
import { Clock } from "../../game/clock/index.ts";
import { SystemMenu } from "./system-menu.tsx";

export function Header(): React.ReactElement {
	const [menuOpen, setMenuOpen] = useState(false);

	const currentDate = Clock.get();
	const period = Clock.period();
	const periodCapitalized = period.charAt(0).toUpperCase() + period.slice(1);
	const dateFormatted = GameCalendar.formatHuman(currentDate);

	return (
		<>
			<header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-background border-b border-border">
				<div className="text-sm font-medium">
					{periodCapitalized}, {dateFormatted}
				</div>
				<button
					type="button"
					onClick={() => setMenuOpen(true)}
					className="p-2 -mr-2 rounded-md hover:bg-secondary transition-colors"
					aria-label="Open menu"
				>
					<MenuIcon className="w-5 h-5" />
				</button>
			</header>

			<SystemMenu open={menuOpen} onOpenChange={setMenuOpen} />
		</>
	);
}

function MenuIcon({ className }: { className?: string }): React.ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	);
}
