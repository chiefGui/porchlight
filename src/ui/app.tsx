import { RouterProvider } from "@tanstack/react-router";
import { ErrorBoundary } from "./error-boundary.tsx";
import { router } from "./router.tsx";

import "../content/pack/base/index.ts";

export function App(): React.ReactElement {
	return (
		<ErrorBoundary>
			<RouterProvider router={router} />
		</ErrorBoundary>
	);
}
