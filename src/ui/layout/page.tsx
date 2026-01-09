import { cn } from "../lib/cn.ts";

type PageProps = {
	header?: React.ReactNode;
	footer?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
};

/**
 * Page shell component that provides consistent layout structure.
 * Routes pass their own header/footer content for full control.
 */
export function Page({
	header,
	footer,
	children,
	className,
}: PageProps): React.ReactElement {
	return (
		<div className={cn("min-h-screen flex flex-col", className)}>
			{header}
			<main className={cn("flex-1", footer && "pb-16")}>{children}</main>
			{footer}
		</div>
	);
}
