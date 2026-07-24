/**
 * ImageSkeleton.jsx — Progressive image loader with skeleton placeholder.
 *
 * WHY: Remote images (Cloudinary, GitHub avatars) loaded abruptly causing
 * layout shifts and blank gaps. This component:
 * 1. Shows a skeleton shimmer at the exact image dimensions
 * 2. Loads the image off-screen
 * 3. Cross-fades from skeleton → image on load
 * 4. Shows a subtle error state if the image fails to load
 * 5. Reserves layout space to prevent CLS (Cumulative Layout Shift)
 *
 * DOES NOT change any business logic. Drop-in for <img> elements.
 */

import { useState } from "react";
import { Shimmer } from "./Shimmer.jsx";

/**
 * @param {string}  src         - Image URL
 * @param {string}  alt         - Alt text (required for a11y)
 * @param {string}  className   - Classes applied to both skeleton and img
 * @param {string}  aspectClass - Tailwind aspect-ratio class, e.g. "aspect-video"
 * @param {object}  imgProps    - Any additional props forwarded to <img>
 */
export function ImageSkeleton({
    src,
    alt = "",
    className = "",
    aspectClass = "",
    wrapperClassName = "",
    ...imgProps
}) {
    const [status, setStatus] = useState("loading"); // "loading" | "loaded" | "error"

    return (
        <div
            className={`relative overflow-hidden ${aspectClass} ${wrapperClassName}`}
            aria-label={status === "loading" ? "Image loading" : undefined}
            aria-busy={status === "loading"}
        >
            {/* Skeleton shown while loading */}
            {status === "loading" && (
                <Shimmer className={`absolute inset-0 rounded-none ${className}`} />
            )}

            {/* Error state */}
            {status === "error" && (
                <div
                    className={`absolute inset-0 flex items-center justify-center
                                bg-dark-card2 text-slate-600 text-xs ${className}`}
                    aria-label="Image failed to load"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d="M3 3l18 18M10.5 6.5l3-3 7 7v7M13.5 13.5L20 20H4V8.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            )}

            {/* Actual image — invisible until loaded */}
            {src && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setStatus("loaded")}
                    onError={() => setStatus("error")}
                    className={`${className}
                                transition-opacity duration-500
                                ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
                    {...imgProps}
                />
            )}
        </div>
    );
}
