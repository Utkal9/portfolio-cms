/**
 * LoadingOverlay.jsx — Semi-transparent overlay for in-place mutations.
 *
 * WHY: Upload operations (Cloudinary) and delete confirmations in admin
 * components have no visual feedback during the async operation.
 * This component overlays an existing container with a spinner
 * WITHOUT removing or replacing the content underneath — so the user
 * can see what is being acted on while the operation completes.
 *
 * Usage:
 *   <div className="relative">
 *     {content}
 *     <LoadingOverlay show={isUploading} label="Uploading…" />
 *   </div>
 *
 * The parent MUST have `position: relative` (class `relative`).
 */

import { Spinner } from "./Spinner.jsx";

/**
 * @param {boolean} show    - Controls visibility
 * @param {string}  label   - Status text shown below spinner (optional)
 * @param {"full"|"rounded"} shape - Clip shape of overlay
 */
export function LoadingOverlay({ show = false, label = "Loading…", shape = "rounded" }) {
    if (!show) return null;

    return (
        <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2
                        bg-dark-bg/70 backdrop-blur-sm
                        ${shape === "rounded" ? "rounded-2xl" : ""}`}
            role="status"
            aria-label={label}
            aria-live="polite"
            aria-busy="true"
        >
            <Spinner size="lg" color="text-accent-blue" />
            {label && (
                <p className="text-xs text-slate-400 font-medium select-none">{label}</p>
            )}
        </div>
    );
}
