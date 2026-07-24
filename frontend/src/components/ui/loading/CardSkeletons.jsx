/**
 * CardSkeletons.jsx — Semantic skeleton shapes for different card types.
 *
 * WHY: Blog.jsx and TagPage.jsx used raw inline animate-pulse blocks.
 * ProjectGrid and Search.jsx had no skeleton at all during loading.
 * These match the exact layout of the real cards to eliminate layout shift.
 *
 * Exported:
 *   BlogCardSkeleton    — matches Blog.jsx card proportions
 *   ProjectCardSkeleton — matches ProjectGrid card proportions
 *   CardSkeleton        — generic card (used in SectionSkeleton and elsewhere)
 */

import { Shimmer } from "./Shimmer.jsx";

/** Blog post card skeleton — aspect-video image + title + excerpt + meta */
export function BlogCardSkeleton() {
    return (
        <div
            className="rounded-2xl overflow-hidden border border-dark-border bg-dark-card"
            aria-hidden="true"
        >
            {/* Featured image */}
            <Shimmer className="w-full aspect-video rounded-none" />
            <div className="p-5 space-y-2">
                {/* Category badge */}
                <Shimmer className="w-20 h-4 rounded-full" />
                {/* Title */}
                <Shimmer className="w-full h-5" />
                <Shimmer className="w-4/5 h-5" />
                {/* Excerpt */}
                <Shimmer className="w-full h-3 mt-1" />
                <Shimmer className="w-5/6 h-3" />
                {/* Meta row */}
                <div className="flex gap-3 pt-2 border-t border-dark-border mt-2">
                    <Shimmer className="w-20 h-3 rounded-full" />
                    <Shimmer className="w-16 h-3 rounded-full" />
                </div>
            </div>
        </div>
    );
}

/** Project card skeleton — matches ProjectGrid card layout */
export function ProjectCardSkeleton() {
    return (
        <div
            className="rounded-2xl overflow-hidden border border-dark-border bg-dark-card p-5 space-y-3"
            aria-hidden="true"
        >
            {/* Header row: icon + title + status dot */}
            <div className="flex items-start gap-3">
                <Shimmer className="w-10 h-10 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Shimmer className="w-3/4 h-5" />
                    <Shimmer className="w-1/3 h-3 rounded-full" />
                </div>
            </div>
            {/* Description lines */}
            <Shimmer className="w-full h-3" />
            <Shimmer className="w-5/6 h-3" />
            {/* Tech tags */}
            <div className="flex gap-2 flex-wrap pt-1">
                <Shimmer className="w-14 h-5 rounded-full" />
                <Shimmer className="w-16 h-5 rounded-full" />
                <Shimmer className="w-12 h-5 rounded-full" />
            </div>
            {/* Actions row */}
            <div className="flex gap-2 pt-2">
                <Shimmer className="flex-1 h-8 rounded-xl" />
                <Shimmer className="w-8 h-8 rounded-xl" />
                <Shimmer className="w-8 h-8 rounded-xl" />
            </div>
        </div>
    );
}

/** Generic card skeleton — 3-column grid usage */
export function CardSkeleton() {
    return (
        <div
            className="flex flex-col gap-3 p-5 rounded-2xl bg-dark-card border border-dark-border"
            aria-hidden="true"
        >
            <Shimmer className="w-full h-40" />
            <Shimmer className="w-3/4 h-5" />
            <Shimmer className="w-full h-3" />
            <Shimmer className="w-5/6 h-3" />
            <div className="flex gap-2 mt-1">
                <Shimmer className="w-16 h-6 rounded-full" />
                <Shimmer className="w-16 h-6 rounded-full" />
                <Shimmer className="w-16 h-6 rounded-full" />
            </div>
        </div>
    );
}
