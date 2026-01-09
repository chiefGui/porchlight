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
	badge?: number;
};

export function FooterButton({
	icon,
	label,
	active,
	onClick,
	badge,
}: FooterButtonProps): React.ReactElement {
	return (
		<button
			type="button"
			className={cn(
				"flex flex-col items-center justify-center gap-1 h-full px-4 relative",
				"text-muted-foreground transition-colors hover:text-foreground",
				active && "text-foreground",
			)}
			onClick={onClick}
		>
			<span className="w-6 h-6 relative">
				{icon}
				{badge !== undefined && badge > 0 && (
					<span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
						{badge > 99 ? "99+" : badge}
					</span>
				)}
			</span>
			<span className="text-xs font-medium">{label}</span>
		</button>
	);
}
