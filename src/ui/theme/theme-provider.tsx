import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { Persistence } from "../../engine/persistence/index.ts";

// ============================================================================
// Types
// ============================================================================

export type Theme = "sky" | "emerald" | "rose";

export type ThemeConfig = {
	id: Theme;
	name: string;
	color: string;
};

export const THEMES: ThemeConfig[] = [
	{ id: "sky", name: "Sky", color: "oklch(0.922 0.14 250)" },
	{ id: "emerald", name: "Emerald", color: "oklch(0.8 0.15 160)" },
	{ id: "rose", name: "Rose", color: "oklch(0.8 0.15 350)" },
];

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	themes: ThemeConfig[];
};

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

// ============================================================================
// Provider
// ============================================================================

const THEME_META_KEY = "theme";
const DEFAULT_THEME: Theme = "sky";

type ThemeProviderProps = {
	children: React.ReactNode;
};

export function ThemeProvider({
	children,
}: ThemeProviderProps): React.ReactElement {
	const [theme, setThemeState] = useState<Theme>(() => {
		// Try to get persisted theme on initial load
		if (Persistence.isInitialized()) {
			const persisted = Persistence.getMeta<Theme>(THEME_META_KEY);
			if (persisted && THEMES.some((t) => t.id === persisted)) {
				return persisted;
			}
		}
		return DEFAULT_THEME;
	});

	// Apply theme class to document
	useEffect(() => {
		const root = document.documentElement;

		// Remove all theme classes
		root.classList.remove("theme-sky", "theme-emerald", "theme-rose");

		// Add current theme class (sky is default, so no class needed)
		if (theme !== "sky") {
			root.classList.add(`theme-${theme}`);
		}
	}, [theme]);

	// Load persisted theme when persistence becomes available
	useEffect(() => {
		if (Persistence.isInitialized()) {
			const persisted = Persistence.getMeta<Theme>(THEME_META_KEY);
			if (persisted && THEMES.some((t) => t.id === persisted)) {
				setThemeState(persisted);
			}
		}
	}, []);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);

		// Persist to IndexedDB via Persistence metadata
		if (Persistence.isInitialized()) {
			Persistence.setMeta(THEME_META_KEY, newTheme);
		}
	}, []);

	const value = useMemo(
		() => ({
			theme,
			setTheme,
			themes: THEMES,
		}),
		[theme, setTheme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
