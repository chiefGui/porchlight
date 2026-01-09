import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.tsx";

import "../content/pack/base/index.ts";

export function App(): React.ReactElement {
	return <RouterProvider router={router} />;
}
