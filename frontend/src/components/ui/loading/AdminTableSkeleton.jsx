/**
 * AdminTableSkeleton.jsx — Skeleton for admin panel data tables / lists.
 *
 * WHY: Admin panels (BlogManager, SemesterManager, EducationManager,
 * CertificationManager, GalleryManager) showed raw animate-pulse divs
 * or just blank space while fetching. This matches the admin list row
 * layout exactly: avatar/icon + title + meta + action buttons.
 *
 * Also exports:
 *   AdminStatsSkeleton  — DashboardStats widget cards
 *   AdminFormSkeleton   — Placeholder while edit form is loading
 */

import { Shimmer } from "./Shimmer.jsx";

/** Single admin table row */
function TableRow() {
    return (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-dark-border bg-dark-card" aria-hidden="true">
            {/* Thumbnail / icon */}
            <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
            {/* Main content */}
            <div className="flex-1 space-y-2 min-w-0">
                <Shimmer className="w-2/3 h-4" />
                <Shimmer className="w-1/3 h-3" />
            </div>
            {/* Status badge */}
            <Shimmer className="w-16 h-6 rounded-full flex-shrink-0" />
            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
                <Shimmer className="w-8 h-8 rounded-lg" />
                <Shimmer className="w-8 h-8 rounded-lg" />
            </div>
        </div>
    );
}

/**
 * @param {number} rows - Number of skeleton rows to show. Default 5.
 */
export function AdminTableSkeleton({ rows = 5 }) {
    return (
        <div
            className="space-y-3"
            role="status"
            aria-label="Loading content"
            aria-busy="true"
            aria-live="polite"
        >
            {/* Header row with action button */}
            <div className="flex items-center justify-between mb-6">
                <Shimmer className="w-40 h-7" />
                <Shimmer className="w-28 h-9 rounded-xl" />
            </div>
            {[...Array(rows)].map((_, i) => (
                <TableRow key={i} />
            ))}
        </div>
    );
}

/** Dashboard stats grid skeleton — 4 metric tiles */
export function AdminStatsSkeleton() {
    return (
        <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            role="status"
            aria-label="Loading dashboard statistics"
            aria-busy="true"
        >
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 rounded-2xl border border-dark-border bg-dark-card space-y-3">
                    <Shimmer className="w-8 h-8 rounded-lg" />
                    <Shimmer className="w-1/2 h-7" />
                    <Shimmer className="w-3/4 h-3" />
                </div>
            ))}
        </div>
    );
}
