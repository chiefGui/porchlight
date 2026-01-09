import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../lib/cn.ts";

export const backdropVariants = tv({
	base: [
		"fixed inset-0 z-40",
		"bg-black/60 backdrop-blur-sm",
	],
});

export type BackdropVariants = VariantProps<typeof backdropVariants>;

type BackdropContextValue = {
	register: (id: string) => void;
	unregister: (id: string) => void;
	isActive: boolean;
};

const BackdropContext = createContext<BackdropContextValue | null>(null);

type BackdropProviderProps = {
	children: React.ReactNode;
	className?: string;
};

/**
 * BackdropProvider manages a singleton backdrop overlay.
 * Multiple components can request the backdrop, but only one is rendered.
 * The backdrop remains visible as long as at least one component requests it.
 */
export function BackdropProvider({
	children,
	className,
}: BackdropProviderProps): React.ReactElement {
	const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

	const register = useCallback((id: string) => {
		setActiveIds((prev) => new Set(prev).add(id));
	}, []);

	const unregister = useCallback((id: string) => {
		setActiveIds((prev) => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const isActive = activeIds.size > 0;

	const value = useMemo(
		() => ({ register, unregister, isActive }),
		[register, unregister, isActive],
	);

	return (
		<BackdropContext.Provider value={value}>
			{children}
			<AnimatePresence>
				{isActive && (
					<motion.div
						className={cn(backdropVariants(), className)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						aria-hidden="true"
					/>
				)}
			</AnimatePresence>
		</BackdropContext.Provider>
	);
}

/**
 * Hook to register a component with the singleton backdrop.
 * When `active` is true, the backdrop will be shown.
 * Multiple components can be active simultaneously - only one backdrop renders.
 */
export function useBackdrop(active: boolean): void {
	const context = useContext(BackdropContext);
	const idRef = useRef<string>(`backdrop-${Math.random().toString(36).slice(2)}`);

	useEffect(() => {
		if (!context) {
			return;
		}

		if (active) {
			context.register(idRef.current);
		} else {
			context.unregister(idRef.current);
		}

		return () => {
			context.unregister(idRef.current);
		};
	}, [active, context]);
}

/**
 * Hook to check if the backdrop is currently active
 */
export function useBackdropActive(): boolean {
	const context = useContext(BackdropContext);
	return context?.isActive ?? false;
}
