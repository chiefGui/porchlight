import { createRouter } from "@tanstack/react-router";
import { indexRoute } from "./route/index.tsx";
import { rootRoute } from "./route/root.tsx";

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
