import { createRouter, createHashHistory } from "@tanstack/react-router";
import { chatThreadRoute } from "./route/chat-thread.tsx";
import { chatRoute } from "./route/chat.tsx";
import { gameRoute } from "./route/game.tsx";
import { indexRoute } from "./route/index.tsx";
import { rootRoute } from "./route/root.tsx";

const hashHistory = createHashHistory();

const routeTree = rootRoute.addChildren([
	indexRoute,
	gameRoute,
	chatRoute,
	chatThreadRoute,
]);

export const router = createRouter({
	routeTree,
	history: hashHistory,
	basepath: "/porchlight",
	defaultNotFoundComponent: () => (
		<div className="min-h-screen flex items-center justify-center p-8">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">404</h1>
				<p className="text-muted-foreground">Page not found</p>
				<p className="text-sm text-muted-foreground">
					Current path: {window.location.pathname}
				</p>
			</div>
		</div>
	),
	defaultPendingComponent: () => (
		<div className="min-h-screen flex items-center justify-center">
			<p>Loading...</p>
		</div>
	),
	defaultErrorComponent: ({ error }) => (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center space-y-4 w-full max-w-lg">
				<h1 className="text-2xl font-bold text-destructive">Route Error</h1>
				<pre className="text-sm bg-muted p-4 rounded overflow-auto text-left break-words whitespace-pre-wrap">
					{error instanceof Error ? error.message : String(error)}
				</pre>
			</div>
		</div>
	),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
