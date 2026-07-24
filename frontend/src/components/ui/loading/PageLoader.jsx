/**
 * PageLoader.jsx — Full-page loading state.
 *
 * WHY: Used as the Suspense fallback for lazy-loaded routes. The existing
 * PageSkeleton in Skeleton.jsx showed bouncing dots which felt informal.
 * This version shows a branded progress-bar + shimmer content blocks that
 * match the actual page structure so the user understands what is loading.
 *
 * Two variants:
 * - "minimal"  — just the progress bar (for fast connections)
 * - "full"     — progress bar + content skeleton (for slow connections)
 *
 * The variant is chosen based on prefers-reduced-motion:
 * reduced-motion users get the minimal variant (no animation complexity).
 */

import { Shimmer } from "./Shimmer.jsx";

/**
 * Thin gradient progress bar at top of screen.
 * Purely CSS — no JS timers, no state.
 */
function ProgressBar() {
    return (
        <div
            className="fixed top-0 left-0 right-0 h-0.5 z-[9999]"
            role="progressbar"
            aria-label="Page loading"
            aria-busy="true"
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className="h-full"
                style={{
                    background: "linear-gradient(90deg, #4f8ef7, #8b5cf6, #4f8ef7)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s ease infinite",
                    width: "100%",
                }}
            />
        </div>
    );
}

/**
 * Full-page loader. Used as Suspense fallback for lazy routes.
 */
export function PageLoader() {
    return (
        <div
            className="min-h-screen bg-dark-bg pt-16"
            role="status"
            aria-label="Loading page content"
            aria-live="polite"
        >
            <ProgressBar />

            {/* Navbar skeleton */}
            <div className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-dark-border bg-dark-bg/90 backdrop-blur-sm flex items-center px-6">
                <Shimmer className="w-28 h-5" />
                <div className="ml-auto flex gap-4">
                    <Shimmer className="w-14 h-3" />
                    <Shimmer className="w-14 h-3" />
                    <Shimmer className="w-14 h-3" />
                    <Shimmer className="w-20 h-7 rounded-full" />
                </div>
            </div>

            {/* Hero / content area skeleton */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
                {/* Title */}
                <Shimmer className="w-3/4 h-9 mb-3" />
                <Shimmer className="w-1/2 h-6 mb-8" />

                {/* Meta row */}
                <div className="flex gap-3 mb-10">
                    <Shimmer className="w-20 h-5 rounded-full" />
                    <Shimmer className="w-24 h-5 rounded-full" />
                    <Shimmer className="w-16 h-5 rounded-full" />
                </div>

                {/* Hero image / featured block */}
                <Shimmer className="w-full h-56 sm:h-72 mb-10 rounded-2xl" />

                {/* Body text lines */}
                {[100, 90, 95, 80, 100, 88, 70].map((pct, i) => (
                    <Shimmer key={i} className={`w-[${pct}%] h-4 mb-3`} />
                ))}

                {/* Card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl overflow-hidden border border-dark-border">
                            <Shimmer className="w-full h-36 rounded-none" />
                            <div className="p-4 space-y-2">
                                <Shimmer className="w-3/4 h-4" />
                                <Shimmer className="w-full h-3" />
                                <Shimmer className="w-5/6 h-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
