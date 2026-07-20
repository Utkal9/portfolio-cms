import { Component } from "react";

/**
 * ErrorBoundary — catches render errors in any child tree.
 * - Shows a user-friendly recovery UI instead of a blank white screen.
 * - Reports to GA4 / Microsoft Clarity if available.
 * - Supports per-component isolation via the `fallback` prop.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Report to GA4 if available
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "exception", {
                description: error?.message || "Unknown error",
                fatal: true,
            });
        }
        // Report to Microsoft Clarity if available
        if (typeof window !== "undefined" && window.clarity) {
            window.clarity("set", "error", error?.message || "Unknown error");
        }
        if (import.meta.env.DEV) {
            console.error("[ErrorBoundary] Caught error:", error, info);
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Allow a custom fallback from the parent
            if (this.props.fallback) {
                return typeof this.props.fallback === "function"
                    ? this.props.fallback(this.state.error, this.handleReset)
                    : this.props.fallback;
            }

            return (
                <div
                    role="alert"
                    aria-live="assertive"
                    className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
                >
                    <div className="w-16 h-16 mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-gray-400 text-sm mb-6 max-w-sm">
                        An unexpected error occurred. This has been reported. Please try
                        refreshing the page.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={this.handleReset}
                            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                    {import.meta.env.DEV && this.state.error && (
                        <pre className="mt-6 text-left text-xs text-red-300 bg-red-950/40 rounded-lg p-4 max-w-lg overflow-auto">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
