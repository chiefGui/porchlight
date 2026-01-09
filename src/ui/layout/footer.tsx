import { cn } from "../lib/cn.ts";

type FooterProps = {
	children: React.ReactNode;
	className?: string;
};

export function Footer({ children, className }: FooterProps): React.ReactElement {
	return (
		<footer
			className={cn(
				"fixed bottom-0 inset-x-0 z-40 h-16 border-t border-border",
				"bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				className,
			)}
		>
			<nav className="flex justify-around items-center h-full max-w-md mx-auto">
				{children}
			</nav>
		</footer>
	);
}

type FooterButtonProps = {
	icon: React.ReactNode;
	label: string;
	active?: boolean;
	onClick?: () => void;
};

export function FooterButton({
	icon,
	label,
	active,
	onClick,
}: FooterButtonProps): React.ReactElement {
	return (
		<button
			type="button"
			className={cn(
				"flex flex-col items-center justify-center gap-1 h-full px-4",
				"text-muted-foreground transition-colors hover:text-foreground",
				active && "text-foreground",
			)}
			onClick={onClick}
		>
			<span className="w-6 h-6">{icon}</span>
			<span className="text-xs font-medium">{label}</span>
		</button>
	);
}
