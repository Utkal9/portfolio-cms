/**
 * Spinner.jsx — Lightweight SVG ring spinner.
 *
 * WHY: Three different inline spinner implementations existed in the codebase
 * (Login, ContactSection, MessageViewer). Centralising avoids drift.
 *
 * Uses SVG stroke-dasharray animation — GPU-accelerated, no layout impact.
 * Respects prefers-reduced-motion via CSS.
 *
 * Sizes: xs(12) | sm(16) | md(20) | lg(28) | xl(40)
 */

const SIZE = { xs: 12, sm: 16, md: 20, lg: 28, xl: 40 };
const STROKE = { xs: 2, sm: 2, md: 2.5, lg: 3, xl: 3.5 };

/**
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} size
 * @param {string} color   - Tailwind text colour class, e.g. "text-white"
 * @param {string} className
 */
export function Spinner({ size = "md", color = "text-accent-blue", className = "" }) {
    const px = SIZE[size] ?? SIZE.md;
    const sw = STROKE[size] ?? STROKE.md;
    const r  = (px - sw) / 2;
    const c  = 2 * Math.PI * r;

    return (
        <svg
            width={px}
            height={px}
            viewBox={`0 0 ${px} ${px}`}
            fill="none"
            aria-hidden="true"
            className={`shrink-0 ${color} ${className}`}
            style={{ animation: "spin 0.8s linear infinite" }}
        >
            {/* Track */}
            <circle
                cx={px / 2}
                cy={px / 2}
                r={r}
                stroke="currentColor"
                strokeWidth={sw}
                opacity={0.2}
            />
            {/* Spinner arc */}
            <circle
                cx={px / 2}
                cy={px / 2}
                r={r}
                stroke="currentColor"
                strokeWidth={sw}
                strokeLinecap="round"
                strokeDasharray={`${c * 0.25} ${c * 0.75}`}
                strokeDashoffset={0}
                style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
            />
        </svg>
    );
}
