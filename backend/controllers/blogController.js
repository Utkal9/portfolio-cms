import { BlogPost, BlogCategory, BlogTag } from "../models/index.js";
import { uploadBuffer, deleteAsset } from "../config/cloudinary.js";

// ── Slug helpers ───────────────────────────────────────────────────────────
function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(Model, base, excludeId = null) {
    let slug = base;
    let n = 1;
    while (true) {
        const query = { slug };
        if (excludeId) query._id = { $ne: excludeId };
        const exists = await Model.findOne(query).select("_id").lean();
        if (!exists) return slug;
        slug = `${base}-${n++}`;
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// BLOG POSTS
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/blog  — paginated public list (published only)
export const getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 9, category, tag, q } = req.query;
        const filter = { status: "published" };

        if (category) {
            const cat = await BlogCategory.findOne({ slug: category });
            if (cat) filter.category = cat._id;
        }
        if (tag) {
            const t = await BlogTag.findOne({ slug: tag });
            if (t) filter.tags = t._id;
        }
        if (q) {
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { excerpt: { $regex: q, $options: "i" } },
            ];
        }

        const total = await BlogPost.countDocuments(filter);
        const posts = await BlogPost.find(filter)
            .populate("category", "name slug color")
            .populate("tags", "name slug")
            .select("-content") // don't send full HTML in listing
            .sort({ publishedAt: -1 })
            .skip((+page - 1) * +limit)
            .limit(+limit);

        res.json({
            success: true,
            data: posts,
            pagination: {
                page: +page,
                limit: +limit,
                total,
                pages: Math.ceil(total / +limit),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/blog/all  — admin: all posts including drafts
export const getAllPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find()
            .populate("category", "name slug color")
            .populate("tags", "name slug")
            .select("-content")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/blog/:slug  — single post by slug
export const getPost = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug, status: "published" })
            .populate("category", "name slug color")
            .populate("tags", "name slug")
            .populate("relatedPosts", "title slug excerpt featuredImage category readingTime publishedAt");

        if (!post) return res.status(404).json({ success: false, message: "Post not found" });

        // Increment view count (fire-and-forget)
        BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).exec();

        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/blog/admin/:id  — single post by ID (admin, includes drafts)
export const getPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id)
            .populate("category", "name slug color")
            .populate("tags", "name slug");
        if (!post) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/blog  — create
export const createPost = async (req, res) => {
    try {
        let featuredImage;
        if (req.file) {
            const result = await uploadBuffer(req.file.buffer, "portfolio/blog");
            featuredImage = { url: result.url, publicId: result.public_id };
        }

        const baseSlug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);
        const slug = await uniqueSlug(BlogPost, baseSlug);

        const tags = parseTags(req.body.tags);

        const post = await BlogPost.create({
            ...req.body,
            slug,
            featuredImage,
            tags,
        });
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/blog/:id  — update
export const updatePost = async (req, res) => {
    try {
        const updates = { ...req.body };

        if (req.file) {
            const result = await uploadBuffer(req.file.buffer, "portfolio/blog");
            updates.featuredImage = { url: result.url, publicId: result.public_id };
        }

        if (updates.slug) {
            updates.slug = await uniqueSlug(BlogPost, slugify(updates.slug), req.params.id);
        } else if (updates.title) {
            // Regenerate slug only if title changed and no explicit slug given
            const existing = await BlogPost.findById(req.params.id).select("title slug");
            if (existing && updates.title !== existing.title && !updates.slug) {
                updates.slug = await uniqueSlug(BlogPost, slugify(updates.title), req.params.id);
            }
        }

        updates.tags = parseTags(updates.tags);

        const post = await BlogPost.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });
        if (!post) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/blog/:id
export const deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, message: "Not found" });
        if (post.featuredImage?.publicId) {
            await deleteAsset(post.featuredImage.publicId);
        }
        await post.deleteOne();
        res.json({ success: true, message: "Post deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════════════════════

export const getCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find().sort({ name: 1 });
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const slug = await uniqueSlug(BlogCategory, slugify(req.body.name));
        const cat = await BlogCategory.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: cat });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const cat = await BlogCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cat) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: cat });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        await BlogCategory.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ══════════════════════════════════════════════════════════════════════════════
// TAGS
// ══════════════════════════════════════════════════════════════════════════════

export const getTags = async (req, res) => {
    try {
        const tags = await BlogTag.find().sort({ name: 1 });
        res.json({ success: true, data: tags });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createTag = async (req, res) => {
    try {
        const slug = await uniqueSlug(BlogTag, slugify(req.body.name));
        const tag = await BlogTag.create({ ...req.body, slug });
        res.status(201).json({ success: true, data: tag });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTag = async (req, res) => {
    try {
        await BlogTag.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Tag deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ── Helper ─────────────────────────────────────────────────────────────────
function parseTags(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    // Support comma-separated string of IDs
    return raw.split(",").map((t) => t.trim()).filter(Boolean);
}
