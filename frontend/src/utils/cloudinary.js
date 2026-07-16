export function optimizeCloudinaryImage(url, width = 800) {
    if (!url || typeof url !== "string") return url;
    if (!url.includes("res.cloudinary.com")) return url;

    // Remove known analytics query params if present (harmless but reduces third-party tracking query strings)
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
    } catch (e) {
        // If URL parsing fails, fall back to original url
        clean = url;
    }

    const token = `/image/upload/f_auto,q_auto,dpr_auto,c_limit,w_${width}/`;
    if (clean.includes(token)) return clean;

    return clean.replace("/image/upload/", token);
}
