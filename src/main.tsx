// Global error handlers - must be set up before any other imports
window.onerror = (message, source, lineno, colno, error) => {
	document.body.innerHTML = `
		<div style="padding: 2rem; font-family: system-ui, sans-serif; color: #f87171; background: #1a1a1a; min-height: 100vh;">
			<h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Startup Error</h1>
			<pre style="background: #2a2a2a; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-size: 0.875rem; white-space: pre-wrap; word-break: break-word;">${message}\n\nSource: ${source}:${lineno}:${colno}\n\n${error?.stack || ""}</pre>
		</div>
	`;
};

window.onunhandledrejection = (event) => {
	document.body.innerHTML = `
		<div style="padding: 2rem; font-family: system-ui, sans-serif; color: #f87171; background: #1a1a1a; min-height: 100vh;">
			<h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Unhandled Promise Rejection</h1>
			<pre style="background: #2a2a2a; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-size: 0.875rem; white-space: pre-wrap; word-break: break-word;">${event.reason?.message || event.reason}\n\n${event.reason?.stack || ""}</pre>
		</div>
	`;
};

// Dynamic imports to ensure error handlers are set up first
async function bootstrap() {
	try {
		await import("reflect-metadata");
		await import("./ui/index.css");

		const { StrictMode } = await import("react");
		const { createRoot } = await import("react-dom/client");
		const { App } = await import("./ui/app.tsx");

		const rootElement = document.getElementById("root");
		if (!rootElement) {
			throw new Error("Root element not found");
		}

		createRoot(rootElement).render(
			<StrictMode>
				<App />
			</StrictMode>,
		);
	} catch (error) {
		document.body.innerHTML = `
			<div style="padding: 2rem; font-family: system-ui, sans-serif; color: #f87171; background: #1a1a1a; min-height: 100vh;">
				<h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Bootstrap Error</h1>
				<pre style="background: #2a2a2a; padding: 1rem; border-radius: 0.5rem; overflow: auto; font-size: 0.875rem; white-space: pre-wrap; word-break: break-word;">${error instanceof Error ? error.message : error}\n\n${error instanceof Error ? error.stack : ""}</pre>
			</div>
		`;
	}
}

bootstrap();
