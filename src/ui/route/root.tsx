import { createRootRoute, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
	component: RootLayout,
	notFoundComponent: () => (
		<div className="min-h-screen flex items-center justify-center p-8 bg-background text-foreground">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-muted-foreground">Route not found</p>
			</div>
		</div>
	),
});

function RootLayout(): React.ReactElement {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Outlet />
		</div>
	);
}
