import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/cn.ts";

// ============================================================================
// Types
// ============================================================================

type NavigationDirection = "forward" | "back";

type NavigationMenuContextValue = {
	currentView: string;
	previousView: string | null;
	direction: NavigationDirection;
	push: (viewId: string) => void;
	pop: () => void;
	reset: () => void;
	canGoBack: boolean;
};

// ============================================================================
// Context
// ============================================================================

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(
	null,
);

export function useNavigationMenu(): NavigationMenuContextValue {
	const context = useContext(NavigationMenuContext);
	if (!context) {
		throw new Error(
			"NavigationMenu components must be used within a NavigationMenu",
		);
	}
	return context;
}

// ============================================================================
// NavigationMenu (Root)
// ============================================================================

type NavigationMenuProps = {
	children: React.ReactNode;
	defaultView?: string;
	className?: string;
};

export function NavigationMenu({
	children,
	defaultView = "root",
	className,
}: NavigationMenuProps): React.ReactElement {
	const [stack, setStack] = useState<string[]>([defaultView]);
	const [direction, setDirection] = useState<NavigationDirection>("forward");

	const currentView = stack[stack.length - 1] ?? defaultView;
	const previousView = stack.length > 1 ? stack[stack.length - 2] ?? null : null;

	const push = useCallback((viewId: string) => {
		setDirection("forward");
		setStack((prev) => [...prev, viewId]);
	}, []);

	const pop = useCallback(() => {
		setDirection("back");
		setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
	}, []);

	const reset = useCallback(() => {
		setDirection("back");
		setStack([defaultView]);
	}, [defaultView]);

	const value = useMemo(
		() => ({
			currentView,
			previousView,
			direction,
			push,
			pop,
			reset,
			canGoBack: stack.length > 1,
		}),
		[currentView, previousView, direction, push, pop, reset, stack.length],
	);

	return (
		<NavigationMenuContext.Provider value={value}>
			<div className={cn("relative overflow-hidden", className)}>
				{children}
			</div>
		</NavigationMenuContext.Provider>
	);
}

// ============================================================================
// NavigationMenuContent
// ============================================================================

type NavigationMenuContentProps = {
	children: React.ReactNode;
	className?: string;
};

const slideVariants = {
	enter: (direction: NavigationDirection) => ({
		x: direction === "forward" ? "100%" : "-100%",
		opacity: 0,
	}),
	center: {
		x: 0,
		opacity: 1,
	},
	exit: (direction: NavigationDirection) => ({
		x: direction === "forward" ? "-100%" : "100%",
		opacity: 0,
	}),
};

export function NavigationMenuContent({
	children,
	className,
}: NavigationMenuContentProps): React.ReactElement {
	const { currentView, direction } = useNavigationMenu();

	return (
		<div className={cn("relative", className)}>
			<AnimatePresence mode="popLayout" custom={direction} initial={false}>
				<motion.div
					key={currentView}
					custom={direction}
					variants={slideVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={{
						type: "spring",
						damping: 30,
						stiffness: 300,
					}}
					className="w-full"
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

// ============================================================================
// NavigationMenuView
// ============================================================================

type NavigationMenuViewProps = {
	id: string;
	children: React.ReactNode;
	className?: string;
};

export function NavigationMenuView({
	id,
	children,
	className,
}: NavigationMenuViewProps): React.ReactElement | null {
	const { currentView } = useNavigationMenu();

	if (currentView !== id) {
		return null;
	}

	return <div className={className}>{children}</div>;
}

// ============================================================================
// NavigationMenuLink
// ============================================================================

type NavigationMenuLinkProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	to: string;
};

export function NavigationMenuLink({
	to,
	children,
	className,
	onClick,
	...props
}: NavigationMenuLinkProps): React.ReactElement {
	const { push } = useNavigationMenu();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		push(to);
		onClick?.(event);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={className}
			{...props}
		>
			{children}
		</button>
	);
}

// ============================================================================
// NavigationMenuBack
// ============================================================================

type NavigationMenuBackProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function NavigationMenuBack({
	children,
	className,
	onClick,
	...props
}: NavigationMenuBackProps): React.ReactElement | null {
	const { pop, canGoBack } = useNavigationMenu();

	if (!canGoBack) {
		return null;
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		pop();
		onClick?.(event);
	};

	return (
		<button
			type="button"
			onClick={handleClick}
			className={className}
			{...props}
		>
			{children ?? (
				<span className="flex items-center gap-1">
					<ChevronLeftIcon className="w-4 h-4" />
					Back
				</span>
			)}
		</button>
	);
}

// ============================================================================
// Icons
// ============================================================================

function ChevronLeftIcon({
	className,
}: { className?: string }): React.ReactElement {
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
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}
