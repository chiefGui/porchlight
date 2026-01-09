import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./primitive/button.tsx";

type ErrorBoundaryProps = {
	children: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		this.setState({ error, errorInfo });
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	handleReset = (): void => {
		this.setState({ hasError: false, error: null, errorInfo: null });
	};

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
					<div className="max-w-2xl w-full space-y-6">
						<div className="space-y-2">
							<h1 className="text-2xl font-bold text-destructive">
								Something went wrong
							</h1>
							<p className="text-muted-foreground">
								An error occurred while rendering the application.
							</p>
						</div>

						<div className="bg-card border border-border rounded-lg p-4 space-y-4">
							<div className="space-y-2">
								<h2 className="text-sm font-medium text-muted-foreground">
									Error
								</h2>
								<pre className="text-sm text-destructive font-mono bg-destructive/10 p-3 rounded overflow-x-auto">
									{this.state.error?.message}
								</pre>
							</div>

							{this.state.errorInfo?.componentStack && (
								<div className="space-y-2">
									<h2 className="text-sm font-medium text-muted-foreground">
										Component Stack
									</h2>
									<pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
										{this.state.errorInfo.componentStack}
									</pre>
								</div>
							)}

							{this.state.error?.stack && (
								<div className="space-y-2">
									<h2 className="text-sm font-medium text-muted-foreground">
										Stack Trace
									</h2>
									<pre className="text-xs font-mono bg-muted p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
										{this.state.error.stack}
									</pre>
								</div>
							)}
						</div>

						<div className="flex gap-3">
							<Button onClick={this.handleReset}>Try Again</Button>
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								Reload Page
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
