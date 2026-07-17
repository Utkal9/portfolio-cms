import { Blog } from "../models/index.js";

function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ visible: true, status: "published" })
            .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
            .lean();
        res.json({ success: true, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        res.json({ success: true, data: blogs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({
            slug: req.params.slug,
            visible: true,
            status: "published",
        }).lean();
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (!payload.slug && payload.title)
            payload.slug = slugify(payload.title);
        const blog = await Blog.create(payload);
        res.status(201).json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (!updates.slug && updates.title)
            updates.slug = slugify(updates.title);
        const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        res.json({ success: true, data: blog });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res
                .status(404)
                .json({ success: false, message: "Blog not found" });
        }
        await blog.deleteOne();
        res.json({ success: true, message: "Blog deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
