import { motion } from "motion/react";
import { cn } from "../lib/cn.ts";

type PageProps = {
	header?: React.ReactNode;
	footer?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
};

const pageVariants = {
	initial: { x: "100%", opacity: 0 },
	animate: { x: 0, opacity: 1 },
	exit: { x: "-30%", opacity: 0 },
};

const pageTransition = {
	type: "tween" as const,
	ease: "easeInOut" as const,
	duration: 0.25,
};

/**
 * Page shell component that provides consistent layout structure.
 * Routes pass their own header/footer content for full control.
 * Includes iOS-style slide transitions.
 */
export function Page({
	header,
	footer,
	children,
	className,
}: PageProps): React.ReactElement {
	return (
		<motion.div
			className={cn("min-h-screen flex flex-col", className)}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			transition={pageTransition}
		>
			{header}
			<main className={cn("flex-1 flex flex-col", footer && "pb-16")}>{children}</main>
			{footer}
		</motion.div>
	);
}
