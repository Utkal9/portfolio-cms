import { Project } from "../models/index.js";
import { uploadBuffer, deleteAsset } from "../config/cloudinary.js";

// ── Slug utilities ─────────────────────────────────────────────────────────
/**
 * Convert a project title into an SEO-friendly slug.
 * e.g. "My MERN App (2025)" → "my-mern-app-2025"
 */
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")       // spaces/underscores → hyphens
        .replace(/[^\w-]+/g, "")       // remove non-word chars except hyphens
        .replace(/--+/g, "-")          // collapse multiple hyphens
        .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

/**
 * Ensure the slug is unique. If taken, append a short suffix.
 * @param {string} base - The candidate slug
 * @param {string|null} excludeId - MongoDB ID to exclude (for updates)
 */
async function uniqueSlug(base, excludeId = null) {
    let slug = base;
    let n = 1;
    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        const exists = await Project.findOne(query).select("_id").lean();
        if (!exists) return slug;
        slug = `${base}-${n++}`;
    }
}

// ── GET /api/projects  (public) ────────────────────────────────────────────
export const getProjects = async (req, res) => {
    try {
        const { category, featured } = req.query;
        const filter = { visible: true };
        if (category) filter.category = category;
        if (featured === "true") filter.featured = true;
        const projects = await Project.find(filter).sort({
            order: 1,
            createdAt: -1,
        });
        res.json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/projects/all  (admin) ─────────────────────────────────────────
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/projects/slug/:slug  (public) ─────────────────────────────────
export const getProjectBySlug = async (req, res) => {
    try {
        const project = await Project.findOne({
            slug: req.params.slug.toLowerCase(),
            visible: true,
        }).populate("relatedProjects", "title slug tagline images category techStack liveUrl githubUrl");

        if (!project)
            return res.status(404).json({ success: false, message: "Project not found" });

        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── GET /api/projects/:id ──────────────────────────────────────────────────
export const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project)
            return res
                .status(404)
                .json({ success: false, message: "Not found" });
        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── POST /api/projects  (admin) ────────────────────────────────────────────
export const createProject = async (req, res) => {
    try {
        const images = [];
        if (req.files?.length) {
            for (const file of req.files) {
                const result = await uploadBuffer(
                    file.buffer,
                    "portfolio/projects",
                );
                images.push({ url: result.url, publicId: result.public_id });
            }
        }
        const techStack = parseTechStack(req.body.techStack);
        const features = parseFeatures(req.body.features);

        // Auto-generate slug from title if not provided
        const baseSlug = req.body.slug
            ? slugify(req.body.slug)
            : slugify(req.body.title);
        const slug = await uniqueSlug(baseSlug);

        const project = await Project.create({
            ...req.body,
            techStack,
            features,
            images,
            slug,
        });
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── PUT /api/projects/:id  (admin) ─────────────────────────────────────────
export const updateProject = async (req, res) => {
    try {
        const updates = { ...req.body };

        // Explicitly allow clearing videoUrl if it's sent as empty string
        if (req.body.videoUrl !== undefined) {
            updates.videoUrl = req.body.videoUrl.trim();
        }

        if (req.files?.length) {
            const images = [];
            for (const file of req.files) {
                const result = await uploadBuffer(
                    file.buffer,
                    "portfolio/projects",
                );
                images.push({ url: result.url, publicId: result.public_id });
            }
            updates.images = images;
        }
        updates.techStack = parseTechStack(updates.techStack);
        updates.features = parseFeatures(updates.features);

        // Regenerate slug if title changed and no explicit slug given
        if (updates.title && !updates.slug) {
            updates.slug = await uniqueSlug(slugify(updates.title), req.params.id);
        } else if (updates.slug) {
            updates.slug = await uniqueSlug(slugify(updates.slug), req.params.id);
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true },
        );
        if (!project)
            return res
                .status(404)
                .json({ success: false, message: "Not found" });
        res.json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── DELETE /api/projects/:id  (admin) ──────────────────────────────────────
export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project)
            return res
                .status(404)
                .json({ success: false, message: "Not found" });
        for (const img of project.images) {
            await deleteAsset(img.publicId);
        }
        await project.deleteOne();
        res.json({ success: true, message: "Project deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── PATCH /api/projects/reorder  (admin) ───────────────────────────────────
export const reorderProjects = async (req, res) => {
    try {
        const { orders } = req.body;
        await Promise.all(
            orders.map(({ id, order }) =>
                Project.findByIdAndUpdate(id, { order }),
            ),
        );
        res.json({ success: true, message: "Reordered" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Helpers ────────────────────────────────────────────────────────────────
function parseTechStack(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}

function parseFeatures(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw
        .split(/[\n,]/)
        .map((f) => f.trim())
        .filter(Boolean);
}

// ── POST /api/projects/migrate-slugs  (admin) ──────────────────────────────
// One-time migration: generates slugs for all projects that don't have one.
// Safe to call multiple times — only touches documents where slug is missing.
export const migrateSlugs = async (req, res) => {
    try {
        const projects = await Project.find({ $or: [{ slug: null }, { slug: "" }, { slug: { $exists: false } }] }).select("_id title");

        let migrated = 0;
        for (const p of projects) {
            const base = slugify(p.title || `project-${p._id}`);
            const slug = await uniqueSlug(base, p._id.toString());
            await Project.findByIdAndUpdate(p._id, { slug });
            migrated++;
        }

        res.json({ success: true, message: `Migrated ${migrated} projects`, migrated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
