import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import {
	Drawer,
	DrawerBody,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "../primitive/drawer.tsx";
import {
	NavigationMenu,
	NavigationMenuBack,
	NavigationMenuContent,
	NavigationMenuLink,
	NavigationMenuView,
} from "../primitive/navigation-menu.tsx";
import { useTheme, type ThemeConfig } from "../theme/index.ts";

type SystemMenuProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function SystemMenu({
	open,
	onOpenChange,
}: SystemMenuProps): React.ReactElement {
	return (
		<Drawer side="left" open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				{/* Key resets navigation state when drawer closes/reopens */}
				<NavigationMenu defaultView="main" key={open ? "open" : "closed"}>
					<SystemMenuContent />
				</NavigationMenu>
			</DrawerContent>
		</Drawer>
	);
}

function SystemMenuContent(): React.ReactElement {
	return (
		<NavigationMenuContent className="h-full flex flex-col">
			<NavigationMenuView id="main" className="h-full flex flex-col">
				<MainMenuView />
			</NavigationMenuView>
			<NavigationMenuView id="settings" className="h-full flex flex-col">
				<SettingsView />
			</NavigationMenuView>
		</NavigationMenuContent>
	);
}

function MainMenuView(): React.ReactElement {
	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Menu</DrawerTitle>
				<DrawerClose />
			</DrawerHeader>
			<DrawerBody className="space-y-1">
				<NavigationMenuLink
					to="settings"
					className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left hover:bg-secondary transition-colors"
				>
					<Settings className="w-5 h-5 text-muted-foreground" />
					<span className="font-medium">Settings</span>
					<ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
				</NavigationMenuLink>
			</DrawerBody>
		</>
	);
}

function SettingsView(): React.ReactElement {
	const { theme, setTheme, themes } = useTheme();

	return (
		<>
			<DrawerHeader className="flex-row items-center gap-2">
				<NavigationMenuBack className="p-1 -ml-1 rounded-md hover:bg-secondary transition-colors">
					<ChevronLeft className="w-5 h-5" />
				</NavigationMenuBack>
				<DrawerTitle>Settings</DrawerTitle>
			</DrawerHeader>
			<DrawerBody className="space-y-6">
				<section className="space-y-3">
					<h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
						Theme Color
					</h3>
					<div className="flex gap-4">
						{themes.map((themeConfig) => (
							<ThemeOrb
								key={themeConfig.id}
								config={themeConfig}
								selected={theme === themeConfig.id}
								onSelect={() => setTheme(themeConfig.id)}
							/>
						))}
					</div>
				</section>
			</DrawerBody>
		</>
	);
}

type ThemeOrbProps = {
	config: ThemeConfig;
	selected: boolean;
	onSelect: () => void;
};

function ThemeOrb({
	config,
	selected,
	onSelect,
}: ThemeOrbProps): React.ReactElement {
	return (
		<button
			type="button"
			onClick={onSelect}
			className="flex flex-col items-center gap-2 group"
			aria-label={`Select ${config.name} theme`}
			aria-pressed={selected}
		>
			<div
				className={`w-12 h-12 rounded-full transition-all ${
					selected
						? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
						: "group-hover:scale-105"
				}`}
				style={{ backgroundColor: config.color }}
			/>
			<span
				className={`text-xs transition-colors ${
					selected ? "text-foreground font-medium" : "text-muted-foreground"
				}`}
			>
				{config.name}
			</span>
		</button>
	);
}
