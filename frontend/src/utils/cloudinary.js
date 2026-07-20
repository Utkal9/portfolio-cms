/**
 * Cloudinary image optimization utilities.
 *
 * These helpers inject Cloudinary URL transformation parameters to deliver
 * the smallest possible image at the correct resolution and format.
 *
 * Transformations applied:
 *  - f_auto   → Serve WebP/AVIF automatically based on browser support
 *  - q_auto   → Cloudinary picks the optimal quality (no visible degradation)
 *  - dpr_auto → Serves 2x on Retina without doubling bandwidth for 1x screens
 *  - c_limit  → Only downscale, never upscale
 *  - w_<n>    → Target width in pixels
 */

/**
 * Optimize a Cloudinary image URL.
 *
 * @param {string} url    - Raw Cloudinary image URL
 * @param {number} width  - Target display width in pixels (default: 800)
 * @returns {string}      - Optimized URL
 *
 * @example
 * optimizeCloudinaryImage(project.images[0].url, 600)
 */
export function optimizeCloudinaryImage(url, width = 800) {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("res.cloudinary.com")) return url;

    // Strip analytics query params (reduces external tracking exposure)
    let clean = url;
    try {
        const [base, query] = url.split("?");
        if (query) {
            const params = new URLSearchParams(query);
            params.delete("analytics");
            params.delete("cloudinary_analytics");
            const qs = params.toString();
            clean = qs ? `${base}?${qs}` : base;
        }
    } catch {
        clean = url;
    }

    const token = `/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_${width}/`;

    // Already transformed — don't double-transform
    if (clean.includes(token)) return clean;

    // Strip any existing transformation so we don't stack them
    const uploadIdx = clean.indexOf("/image/upload/");
    if (uploadIdx === -1) return clean;

    const afterUpload = clean.slice(uploadIdx + "/image/upload/".length);
    const base = clean.slice(0, uploadIdx);

    // Remove existing transformation segment if present (starts with a letter, e.g. "w_400/", "f_auto,q_auto/")
    const withoutExistingTransform = afterUpload.replace(
        /^[a-z][^/]*\//,
        "",
    );

    return `${base}/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_${width}/${withoutExistingTransform}`;
}

/**
 * Generate a `srcSet` string for responsive images from a Cloudinary URL.
 * Use with <img srcSet={...} sizes={...} />.
 *
 * @param {string} url    - Raw Cloudinary image URL
 * @param {number[]} widths - Array of widths to generate (default: [400, 800, 1200])
 * @returns {string}      - srcSet string
 *
 * @example
 * <img
 *   src={optimizeCloudinaryImage(url, 800)}
 *   srcSet={cloudinarySrcSet(url)}
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   loading="lazy"
 * />
 */
export function cloudinarySrcSet(url, widths = [400, 800, 1200]) {
    if (!url || typeof url !== "string") return "";
    return widths
        .map((w) => `${optimizeCloudinaryImage(url, w)} ${w}w`)
        .join(", ");
}

/**
 * Get a Cloudinary thumbnail URL (small square crop for avatars/cards).
 *
 * @param {string} url  - Raw Cloudinary image URL
 * @param {number} size - Square size in pixels (default: 200)
 * @returns {string}    - Thumbnail URL
 */
export function cloudinaryThumb(url, size = 200) {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("res.cloudinary.com")) return url;

    const uploadIdx = url.indexOf("/image/upload/");
    if (uploadIdx === -1) return url;

    const afterUpload = url.slice(uploadIdx + "/image/upload/".length);
    const base = url.slice(0, uploadIdx);
    const withoutExistingTransform = afterUpload.replace(/^[a-z][^/]*\//, "");

    return `${base}/image/upload/f_auto,q_auto,c_fill,g_face,w_${size},h_${size}/${withoutExistingTransform}`;
}
