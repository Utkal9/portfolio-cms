/**
 * Reusable shimmer skeleton components.
 * Used as Suspense fallbacks and loading placeholders throughout the app.
 */

// ── Base shimmer block ─────────────────────────────────────────────────
export function Shimmer({ className = "" }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-white/5 ${className}`}
            aria-hidden="true"
        />
    );
}

// ── Full-page skeleton (used for main page lazy load) ──────────────────
export function PageSkeleton() {
    return (
        <div
            className="min-h-screen bg-[#0B1120] flex items-center justify-center"
            role="status"
            aria-label="Loading page"
        >
            <div className="flex flex-col items-center gap-4">
                {/* Pulsing logo placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 animate-pulse" />
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
                <span className="text-gray-500 text-sm font-medium">Loading…</span>
            </div>
        </div>
    );
}

// ── Section skeleton (used for individual section lazy loads) ──────────
export function SectionSkeleton({ rows = 3 }) {
    return (
        <section
            className="py-16 px-4 max-w-6xl mx-auto"
            role="status"
            aria-label="Loading section"
        >
            <Shimmer className="h-8 w-48 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 p-5 rounded-xl bg-white/3">
                        <Shimmer className="h-40 w-full" />
                        <Shimmer className="h-5 w-3/4" />
                        <Shimmer className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Card skeleton ──────────────────────────────────────────────────────
export function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3 p-5 rounded-xl bg-white/3 border border-white/5" aria-hidden="true">
            <Shimmer className="h-40 w-full" />
            <Shimmer className="h-5 w-3/4" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <div className="flex gap-2 mt-1">
                <Shimmer className="h-6 w-16 rounded-full" />
                <Shimmer className="h-6 w-16 rounded-full" />
                <Shimmer className="h-6 w-16 rounded-full" />
            </div>
        </div>
    );
}
