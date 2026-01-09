import {
	createContext,
	forwardRef,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import {
	Dialog,
	DialogDisclosure,
	DialogDismiss,
	DialogHeading,
	DialogDescription as AriaDialogDescription,
	useDialogStore,
	type DialogStore,
} from "@ariakit/react";
import { AnimatePresence, motion } from "motion/react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../lib/cn.ts";
import { useBackdrop } from "./backdrop.tsx";

// ============================================================================
// Variants
// ============================================================================

export const drawerContentVariants = tv({
	base: [
		"fixed z-50 flex flex-col",
		"bg-card text-card-foreground",
		"shadow-xl",
		"focus:outline-none",
	],
	variants: {
		side: {
			left: "inset-y-0 left-0 h-full w-80 max-w-[85vw] border-r border-border",
			right: "inset-y-0 right-0 h-full w-80 max-w-[85vw] border-l border-border",
		},
	},
	defaultVariants: {
		side: "left",
	},
});

export type DrawerContentVariants = VariantProps<typeof drawerContentVariants>;

export const drawerHeaderVariants = tv({
	base: ["flex flex-col gap-1.5 p-4 border-b border-border"],
});

export const drawerTitleVariants = tv({
	base: ["text-lg font-semibold leading-none tracking-tight"],
});

export const drawerDescriptionVariants = tv({
	base: ["text-sm text-muted-foreground"],
});

export const drawerFooterVariants = tv({
	base: ["flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 border-t border-border mt-auto"],
});

export const drawerCloseVariants = tv({
	base: [
		"absolute right-4 top-4",
		"rounded-sm opacity-70 ring-offset-background transition-opacity",
		"hover:opacity-100",
		"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		"disabled:pointer-events-none",
	],
});

// ============================================================================
// Context
// ============================================================================

type DrawerContextValue = {
	store: DialogStore;
	side: "left" | "right";
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(): DrawerContextValue {
	const context = useContext(DrawerContext);
	if (!context) {
		throw new Error("Drawer components must be used within a Drawer");
	}
	return context;
}

// ============================================================================
// Animation Variants
// ============================================================================

const slideVariants = {
	left: {
		initial: { x: "-100%" },
		animate: { x: 0 },
		exit: { x: "-100%" },
	},
	right: {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
	},
} as const;

// ============================================================================
// Drawer (Root)
// ============================================================================

type DrawerProps = {
	children: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	defaultOpen?: boolean;
	side?: "left" | "right";
};

/**
 * Root drawer component that provides context and state management.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open Menu</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Menu</DrawerTitle>
 *     </DrawerHeader>
 *     <div className="p-4">Content here</div>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function Drawer({
	children,
	open,
	onOpenChange,
	defaultOpen = false,
	side = "left",
}: DrawerProps): React.ReactElement {
	const store = useDialogStore({
		open,
		setOpen: onOpenChange,
		defaultOpen,
	});

	const value = useMemo(() => ({ store, side }), [store, side]);

	return (
		<DrawerContext.Provider value={value}>
			{children}
		</DrawerContext.Provider>
	);
}

// ============================================================================
// DrawerTrigger
// ============================================================================

type DrawerTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	asChild?: boolean;
};

/**
 * Button that triggers the drawer to open.
 * Can wrap custom elements with `asChild`.
 */
export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(
	function DrawerTrigger({ children, asChild, ...props }, ref) {
		const { store } = useDrawerContext();

		if (asChild && children) {
			return (
				<DialogDisclosure
					ref={ref}
					store={store}
					render={children as React.ReactElement}
					{...props}
				/>
			);
		}

		return (
			<DialogDisclosure ref={ref} store={store} {...props}>
				{children}
			</DialogDisclosure>
		);
	},
);

// ============================================================================
// DrawerContent
// ============================================================================

type DrawerContentProps = Omit<React.ComponentProps<typeof Dialog>, "store"> &
	DrawerContentVariants & {
		/** Override the side from Drawer context */
		side?: "left" | "right";
	};

/**
 * The sliding panel content of the drawer.
 * Automatically integrates with the singleton backdrop.
 */
export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
	function DrawerContent({ children, className, side: sideProp, ...props }, ref) {
		const { store, side: contextSide } = useDrawerContext();
		const side = sideProp ?? contextSide;
		const isOpen = store.useState("open");
		const contentRef = useRef<HTMLDivElement>(null);

		// Register with singleton backdrop
		useBackdrop(isOpen);

		// Handle click outside to close
		useEffect(() => {
			if (!isOpen) return;

			function handleClick(event: MouseEvent) {
				const content = contentRef.current;
				if (content && !content.contains(event.target as Node)) {
					store.setOpen(false);
				}
			}

			// Delay to avoid immediate close from trigger click
			const timeoutId = setTimeout(() => {
				document.addEventListener("click", handleClick);
			}, 0);

			return () => {
				clearTimeout(timeoutId);
				document.removeEventListener("click", handleClick);
			};
		}, [isOpen, store]);

		const animation = slideVariants[side];

		return (
			<AnimatePresence>
				{isOpen && (
					<motion.div
						key="drawer-content"
						ref={contentRef}
						initial={animation.initial}
						animate={animation.animate}
						exit={animation.exit}
						transition={{
							type: "spring",
							damping: 30,
							stiffness: 300,
						}}
						className={cn(drawerContentVariants({ side }), className)}
					>
						<Dialog
							ref={ref}
							store={store}
							modal={false}
							backdrop={false}
							preventBodyScroll={false}
							render={<div className="flex flex-col h-full" />}
							{...props}
						>
							{children}
						</Dialog>
					</motion.div>
				)}
			</AnimatePresence>
		);
	},
);

// ============================================================================
// DrawerHeader
// ============================================================================

type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Container for the drawer header content (title, description).
 */
export function DrawerHeader({
	className,
	...props
}: DrawerHeaderProps): React.ReactElement {
	return <div className={cn(drawerHeaderVariants(), className)} {...props} />;
}

// ============================================================================
// DrawerTitle
// ============================================================================

type DrawerTitleProps = React.ComponentProps<typeof DialogHeading>;

/**
 * The title of the drawer. Uses proper heading semantics.
 */
export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
	function DrawerTitle({ className, ...props }, ref) {
		const { store } = useDrawerContext();

		return (
			<DialogHeading
				ref={ref}
				store={store}
				className={cn(drawerTitleVariants(), className)}
				{...props}
			/>
		);
	},
);

// ============================================================================
// DrawerDescription
// ============================================================================

type DrawerDescriptionProps = React.ComponentProps<typeof AriaDialogDescription>;

/**
 * A description for the drawer content.
 */
export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
	function DrawerDescription({ className, ...props }, ref) {
		const { store } = useDrawerContext();

		return (
			<AriaDialogDescription
				ref={ref}
				store={store}
				className={cn(drawerDescriptionVariants(), className)}
				{...props}
			/>
		);
	},
);

// ============================================================================
// DrawerClose
// ============================================================================

type DrawerCloseProps = React.ComponentProps<typeof DialogDismiss>;

/**
 * Button that closes the drawer.
 */
export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
	function DrawerClose({ className, children, ...props }, ref) {
		const { store } = useDrawerContext();

		return (
			<DialogDismiss
				ref={ref}
				store={store}
				className={cn(drawerCloseVariants(), className)}
				{...props}
			>
				{children ?? (
					<>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<path d="M18 6 6 18" />
							<path d="m6 6 12 12" />
						</svg>
						<span className="sr-only">Close</span>
					</>
				)}
			</DialogDismiss>
		);
	},
);

// ============================================================================
// DrawerFooter
// ============================================================================

type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Container for drawer footer actions.
 */
export function DrawerFooter({
	className,
	...props
}: DrawerFooterProps): React.ReactElement {
	return <div className={cn(drawerFooterVariants(), className)} {...props} />;
}

// ============================================================================
// DrawerBody
// ============================================================================

export const drawerBodyVariants = tv({
	base: ["flex-1 overflow-y-auto p-4"],
});

type DrawerBodyProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Scrollable body section for drawer content.
 */
export function DrawerBody({
	className,
	...props
}: DrawerBodyProps): React.ReactElement {
	return <div className={cn(drawerBodyVariants(), className)} {...props} />;
}
