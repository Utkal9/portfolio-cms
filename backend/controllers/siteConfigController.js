import { SiteConfig } from "../models/index.js";
import { uploadBuffer, deleteAsset } from "../config/cloudinary.js";

// GET /api/site-config  (public)
export const getSiteConfig = async (req, res) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) config = await SiteConfig.create({});
        res.json({ success: true, data: config });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/site-config  (admin)
export const updateSiteConfig = async (req, res) => {
    try {
        let config = await SiteConfig.findOne();
        if (!config) config = new SiteConfig({});
        const allowed = [
            "hero",
            "about",
            "contact",
            "footer",
            "pages",
            "seo",
            "sections",
            "sectionOrder",
            "theme",
        ];
        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                const current = config[key]?.toObject
                    ? config[key].toObject()
                    : config[key] || {};
                config[key] = { ...current, ...req.body[key] };
            }
        }
        await config.save();
        res.json({ success: true, data: config });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/site-config/upload-profile  (admin)
export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: "No file uploaded" });
        }

        const { section = "hero" } = req.body;

        let config = await SiteConfig.findOne();
        if (!config) config = new SiteConfig({});

        // Delete old image from Cloudinary if it exists
        const oldPublicId = config[section]?.profileImagePublicId;
        if (oldPublicId) await deleteAsset(oldPublicId);

        // Upload new image buffer to Cloudinary
        const result = await uploadBuffer(
            req.file.buffer,
            `portfolio/${section}`,
        );

        // Merge new image URL into the section without overwriting other fields
        const current = config[section]?.toObject
            ? config[section].toObject()
            : config[section] || {};
        config[section] = {
            ...current,
            profileImage: result.url,
            profileImagePublicId: result.public_id,
        };

        // markModified so Mongoose detects the nested change
        config.markModified(section);
        await config.save();

        res.json({ success: true, url: result.url, data: config });
    } catch (err) {
        console.error("uploadProfileImage error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
