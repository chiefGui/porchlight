import { cn } from "../lib/cn.ts";

type PageHeaderProps = {
	left?: React.ReactNode;
	center?: React.ReactNode;
	right?: React.ReactNode;
	className?: string;
};

/**
 * Flexible page header with left/center/right slots.
 */
export function PageHeader({
	left,
	center,
	right,
	className,
}: PageHeaderProps): React.ReactElement {
	return (
		<header
			className={cn(
				"sticky top-0 z-40 flex items-center h-14 px-4 bg-background border-b border-border",
				className,
			)}
		>
			<div className="flex items-center justify-start w-16">{left}</div>
			<div className="flex-1 flex items-center justify-center min-w-0">
				{center}
			</div>
			<div className="flex items-center justify-end w-16">{right}</div>
		</header>
	);
}

type BackButtonProps = {
	onClick: () => void;
	className?: string;
};

export function BackButton({ onClick, className }: BackButtonProps): React.ReactElement {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"p-2 -ml-2 rounded-md hover:bg-muted transition-colors",
				className,
			)}
			aria-label="Go back"
		>
			<ChevronLeftIcon className="w-5 h-5" />
		</button>
	);
}

function ChevronLeftIcon({ className }: { className?: string }): React.ReactElement {
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
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}
