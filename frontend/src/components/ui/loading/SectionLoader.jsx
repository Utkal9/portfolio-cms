/**
 * SectionLoader.jsx — In-page section loading placeholder.
 *
 * WHY: Several portfolio sections (About, Skills, Experience, GithubStats,
 * Education, Certifications, LeetcodeStats) fetch their own data independently.
 * When loading they show nothing, or show a raw `animate-pulse` div with no
 * context. This gives a proper content-shaped skeleton.
 *
 * Variants:
 * "default"   — heading + 3 cards (generic)
 * "stats"     — heading + stat numbers in a row
 * "timeline"  — heading + timeline entries
 * "list"      — heading + stacked rows
 */

import { Shimmer } from "./Shimmer.jsx";

function DefaultVariant() {
    return (
        <>
            <Shimmer className="w-40 h-7 mb-2" />
            <Shimmer className="w-24 h-3 mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-dark-border space-y-3">
                        <Shimmer className="w-10 h-10 rounded-xl" />
                        <Shimmer className="w-3/4 h-5" />
                        <Shimmer className="w-full h-3" />
                        <Shimmer className="w-5/6 h-3" />
                    </div>
                ))}
            </div>
        </>
    );
}

function StatsVariant() {
    return (
        <>
            <Shimmer className="w-40 h-7 mb-10" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-dark-border space-y-2">
                        <Shimmer className="w-full h-8 rounded-xl" />
                        <Shimmer className="w-3/4 h-4 mx-auto" />
                    </div>
                ))}
            </div>
        </>
    );
}

function TimelineVariant() {
    return (
        <>
            <Shimmer className="w-40 h-7 mb-10" />
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 flex-shrink-0">
                            <Shimmer className="w-10 h-10 rounded-full" />
                        </div>
                        <div className="flex-1 p-5 rounded-2xl border border-dark-border space-y-2">
                            <Shimmer className="w-1/2 h-5" />
                            <Shimmer className="w-1/3 h-3" />
                            <Shimmer className="w-full h-3" />
                            <Shimmer className="w-4/5 h-3" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function ListVariant({ rows = 4 }) {
    return (
        <>
            <Shimmer className="w-40 h-7 mb-10" />
            <div className="space-y-3">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-dark-border">
                        <Shimmer className="w-10 h-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Shimmer className="w-2/3 h-4" />
                            <Shimmer className="w-1/3 h-3" />
                        </div>
                        <Shimmer className="w-16 h-6 rounded-full flex-shrink-0" />
                    </div>
                ))}
            </div>
        </>
    );
}

/**
 * @param {"default"|"stats"|"timeline"|"list"} variant
 * @param {number} rows - Only used when variant="list"
 */
export function SectionLoader({ variant = "default", rows = 4 }) {
    return (
        <section
            className="py-16 px-4 max-w-6xl mx-auto"
            role="status"
            aria-label="Loading section"
            aria-live="polite"
            aria-busy="true"
        >
            {variant === "stats"    && <StatsVariant />}
            {variant === "timeline" && <TimelineVariant />}
            {variant === "list"     && <ListVariant rows={rows} />}
            {variant === "default"  && <DefaultVariant />}
        </section>
    );
}
