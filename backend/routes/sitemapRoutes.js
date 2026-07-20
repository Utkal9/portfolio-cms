/**
 * Sitemap Route — dynamically generates XML sitemap.
 *
 * Includes:
 * - Static pages (homepage, etc.)
 * - All visible public projects (by slug or ID, updated as projects are added)
 * - All published blog posts (future: will auto-populate once blog is live)
 *
 * Served at GET /api/sitemap
 * Vercel rewrite in vercel.json maps /sitemap.xml → /api/sitemap
 */
import express from "express";
import { Project } from "../models/index.js";

const router = express.Router();

const DOMAIN = "https://utkalbehera.com";
const STATIC_PAGES = [
    { url: "/", changefreq: "weekly", priority: "1.0" },
];

function escapeXml(unsafe) {
    if (!unsafe) return "";
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toIsoDate(date) {
    return new Date(date).toISOString().split("T")[0];
}

function buildUrlEntry({ loc, lastmod, changefreq = "monthly", priority = "0.7" }) {
    return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

router.get("/", async (req, res) => {
    try {
        // Fetch all visible projects
        const projects = await Project.find({ visible: true })
            .select("slug title updatedAt _id")
            .lean();

        const staticEntries = STATIC_PAGES.map((p) =>
            buildUrlEntry({
                loc: `${DOMAIN}${p.url}`,
                lastmod: toIsoDate(new Date()),
                changefreq: p.changefreq,
                priority: p.priority,
            }),
        );

        const projectEntries = projects.map((p) => {
            // Use slug if available (Phase 4), otherwise fall back to MongoDB ID
            const path = p.slug
                ? `/projects/${escapeXml(p.slug)}`
                : `/projects/${p._id}`;
            return buildUrlEntry({
                loc: `${DOMAIN}${path}`,
                lastmod: toIsoDate(p.updatedAt),
                changefreq: "monthly",
                priority: "0.8",
            });
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticEntries.join("")}
${projectEntries.join("")}
</urlset>`;

        // Cache for 1 hour at CDN/browser level
        res.setHeader("Content-Type", "application/xml; charset=utf-8");
        res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=7200");
        res.send(xml);
    } catch (err) {
        console.error("Sitemap generation error:", err);
        res.status(500).send("<?xml version=\"1.0\"?><error>Sitemap generation failed</error>");
    }
});

export default router;
