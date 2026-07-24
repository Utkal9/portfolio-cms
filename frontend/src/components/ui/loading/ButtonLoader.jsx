/**
 * ButtonLoader.jsx — Wrapper that converts any button into an async-aware button.
 *
 * WHY: Three pages (Login, ContactSection, BlogManager) implemented inline
 * spinner-in-button patterns differently. This component is the single
 * canonical implementation.
 *
 * GUARANTEES:
 * - Disabled while loading (prevents double submit)
 * - Shows Spinner in place of children
 * - Preserves all button sizing/styling via className pass-through
 * - aria-busy + aria-disabled for screen readers
 * - Spinner colour inherits from text colour
 */

import { Spinner } from "./Spinner.jsx";

/**
 * @param {boolean}   loading     - Drives the spinner + disabled state.
 * @param {string}    loadingText - Optional text to show next to spinner.
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} spinnerSize
 * @param {React.ReactNode} children
 * @param {object}    rest        - All other button props forwarded verbatim.
 */
export function ButtonLoader({
    loading = false,
    loadingText,
    spinnerSize = "sm",
    children,
    className = "",
    disabled,
    ...rest
}) {
    const isDisabled = loading || disabled;

    return (
        <button
            {...rest}
            disabled={isDisabled}
            aria-busy={loading}
            aria-disabled={isDisabled}
            className={`relative inline-flex items-center justify-center gap-2
                        transition-opacity duration-200
                        ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}
                        ${className}`}
        >
            {loading && (
                <Spinner
                    size={spinnerSize}
                    color="text-current"
                    className="shrink-0"
                />
            )}
            {loading ? (loadingText ?? children) : children}
        </button>
    );
}
