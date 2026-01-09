import { RouterProvider } from "@tanstack/react-router";
import { EngineProvider } from "../engine/react/index.ts";
import { ErrorBoundary } from "./error-boundary.tsx";
import { BackdropProvider } from "./primitive/backdrop.tsx";
import { router } from "./router.tsx";

import "../content/pack/base/index.ts";

export function App(): React.ReactElement {
	return (
		<ErrorBoundary>
			<EngineProvider>
				<BackdropProvider>
					<RouterProvider router={router} />
				</BackdropProvider>
			</EngineProvider>
		</ErrorBoundary>
	);
}
