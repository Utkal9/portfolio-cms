/**
 * cacheMiddleware — adds Cache-Control headers to public GET responses.
 *
 * Usage:
 *   router.get('/', cache(300), handler)   // 5 min cache
 *   router.get('/', cache(0), handler)     // no cache (admin routes)
 *
 * Strategy:
 * - Public reads (projects, skills, site-config, social): 5 min browser cache,
 *   10 min CDN/proxy cache. Stale-while-revalidate keeps pages fast even after
 *   expiry.
 * - Admin mutations (POST/PUT/DELETE) send Cache-Control: no-store so stale
 *   data is never served to the dashboard.
 */

/**
 * @param {number} maxAge - seconds for max-age (browser cache)
 * @param {number} [sMaxAge] - seconds for s-maxage (CDN cache). Defaults to maxAge * 2.
 */
export function cache(maxAge, sMaxAge) {
    const s = sMaxAge ?? maxAge * 2;
    return (req, res, next) => {
        if (req.method !== "GET") {
            // Never cache mutations
            res.setHeader("Cache-Control", "no-store");
            return next();
        }
        if (maxAge === 0) {
            res.setHeader("Cache-Control", "no-store");
        } else {
            res.setHeader(
                "Cache-Control",
                `public, max-age=${maxAge}, s-maxage=${s}, stale-while-revalidate=60`,
            );
        }
        next();
    };
}

/**
 * noCache — convenience alias for routes that must never be cached.
 * Use on all admin / authenticated endpoints.
 */
export function noCache(req, res, next) {
    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
}
