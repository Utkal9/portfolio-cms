/**
 * Shimmer.jsx — Base shimmer building block.
 *
 * Uses the .skeleton CSS class already defined in index.css which provides
 * a moving shimmer gradient via `@keyframes shimmer`. Falls back to
 * `animate-pulse` for reduced-motion users (handled via CSS media query).
 *
 * WHY: The existing `Shimmer` in Skeleton.jsx uses `bg-white/5 animate-pulse`
 * which gives a faint pulse but no shimmer movement. This version uses the
 * `.skeleton` class that was already defined in index.css but never wired up.
 */

/**
 * Shimmer — a single rectangular skeleton block.
 *
 * @param {string} className  - Tailwind classes for sizing/shape.
 * @param {"dark"|"light"} theme - Colour theme. Defaults to "dark".
 */
export function Shimmer({ className = "", theme = "dark" }) {
    const base =
        theme === "light"
            ? "skeleton-light"
            : "skeleton";
    return (
        <div
            className={`${base} rounded-lg ${className}`}
            aria-hidden="true"
        />
    );
}

/**
 * SkeletonBox — Shimmer with explicit width + height.
 * Convenience wrapper so callers don't need to remember Tailwind sizing.
 */
export function SkeletonBox({ w = "w-full", h = "h-4", rounded = "rounded-lg", className = "" }) {
    return <Shimmer className={`${w} ${h} ${rounded} ${className}`} />;
}
