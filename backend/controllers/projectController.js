import { Project } from "../models/index.js";
import { uploadBuffer, deleteAsset } from "../config/cloudinary.js";

// GET /api/projects  (public)
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

// GET /api/projects/all  (admin)
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/projects/:id-or-slug
export const getProject = async (req, res) => {
    try {
        const identifier = req.params.id;
        let project = null;

        if (identifier && identifier.match(/^[0-9a-fA-F]{24}$/)) {
            project = await Project.findOne({ _id: identifier, visible: true });
        } else {
            project = await Project.findOne({
                slug: identifier,
                visible: true,
            });
            if (!project) {
                project = await Project.findOne({
                    title: identifier,
                    visible: true,
                });
            }
        }

        if (!project) {
            return res
                .status(404)
                .json({ success: false, message: "Not found" });
        }

        res.json({ success: true, data: project });
    } catch (err) {
        console.error("getProject error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/projects  (admin)
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
        const project = await Project.create({
            ...req.body,
            techStack,
            images,
        });
        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/projects/:id  (admin)
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

// DELETE /api/projects/:id  (admin)
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

// PATCH /api/projects/reorder  (admin)
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

function parseTechStack(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
}
