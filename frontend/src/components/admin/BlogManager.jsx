/**
 * BlogManager — Admin panel for Blog CMS
 *
 * Flow:
 *   LIST view  → click "New Post" → FORM view (create)
 *              → click "Edit"     → FORM view (edit existing)
 *
 * The editor uses a <textarea> for HTML content (or you can drop in
 * react-quill later by swapping the textarea for <ReactQuill />).
 */
import { useState, useEffect, useRef } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    ArrowLeft,
    Save,
    X,
    Tag,
    Globe,
    FileText,
    Clock,
    RefreshCw,
    ExternalLink,
} from "lucide-react";
import { blogAPI } from "../../services/api.js";

// ── helpers ───────────────────────────────────────────────────────────
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[\s_]+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const STATUS_STYLES = {
    published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-dark-border text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-accent-blue transition-colors";

const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5";

// ── EMPTY form state ──────────────────────────────────────────────────
const EMPTY = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Utkal Behera",
    status: "draft",
    category: "",
    tags: [],          // array of tag IDs
    seoTitle: "",
    seoDescription: "",
    ogImage: "",
    canonical: "",
    publishedAt: "",
    scheduledAt: "",
};

// ── Post list row ─────────────────────────────────────────────────────
function PostRow({ post, onEdit, onDelete, onToggleStatus }) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/3 border border-dark-border hover:border-accent-blue/30 transition-all group">
            {/* Featured image thumbnail */}
            {post.featuredImage?.url ? (
                <img
                    src={post.featuredImage.url}
                    alt={post.title}
                    width={56}
                    height={40}
                    className="w-14 h-10 object-cover rounded-lg flex-shrink-0"
                />
            ) : (
                <div className="w-14 h-10 rounded-lg bg-dark-card flex-shrink-0 flex items-center justify-center">
                    <FileText size={16} className="text-slate-600" />
                </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                <p className="text-xs text-slate-500 truncate">/{post.slug}</p>
            </div>

            {/* Category */}
            {post.category && (
                <span
                    className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-bold border"
                    style={{
                        color: post.category.color,
                        background: `${post.category.color}15`,
                        borderColor: `${post.category.color}30`,
                    }}
                >
                    {post.category.name}
                </span>
            )}

            {/* Status badge */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[post.status]}`}>
                {post.status}
            </span>

            {/* Date */}
            <span className="hidden lg:block text-xs text-slate-500 w-24 text-right flex-shrink-0">
                {fmtDate(post.publishedAt || post.createdAt)}
            </span>

            {/* Reading time */}
            <span className="hidden lg:flex items-center gap-1 text-xs text-slate-500 flex-shrink-0">
                <Clock size={11} /> {post.readingTime || 1}m
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onToggleStatus(post)}
                    className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    title={post.status === "published" ? "Revert to Draft" : "Publish"}
                >
                    {post.status === "published" ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button
                    onClick={() => onEdit(post)}
                    className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-slate-400 hover:text-accent-blue transition-colors"
                    title="Edit post"
                >
                    <Pencil size={13} />
                </button>
                <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors"
                    title="View live"
                >
                    <ExternalLink size={13} />
                </a>
                <button
                    onClick={() => onDelete(post._id)}
                    className="w-7 h-7 rounded-lg bg-dark-card flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete post"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════
export default function BlogManager() {
    const [view, setView] = useState("list"); // "list" | "form"
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [newCatName, setNewCatName] = useState("");
    const [newTagName, setNewTagName] = useState("");
    const [slugLocked, setSlugLocked] = useState(false);
    const fileRef = useRef(null);

    // ── Fetch data ──────────────────────────────────────────────────
    const loadAll = async () => {
        setLoading(true);
        try {
            const [postsRes, catsRes, tagsRes] = await Promise.all([
                blogAPI.getAllAdmin(),
                blogAPI.getCategories(),
                blogAPI.getTags(),
            ]);
            setPosts(postsRes.data.data || []);
            setCategories(catsRes.data.data || []);
            setTags(tagsRes.data.data || []);
        } catch (e) {
            setError("Failed to load blog data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    // ── Form helpers ────────────────────────────────────────────────
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleTitleChange = (val) => {
        set("title", val);
        if (!slugLocked) set("slug", slugify(val));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const toggleTag = (id) => {
        setForm((f) => ({
            ...f,
            tags: f.tags.includes(id) ? f.tags.filter((t) => t !== id) : [...f.tags, id],
        }));
    };

    // ── Open form ───────────────────────────────────────────────────
    const openCreate = () => {
        setEditId(null);
        setForm(EMPTY);
        setImageFile(null);
        setImagePreview(null);
        setSlugLocked(false);
        setError(null);
        setView("form");
    };

    const openEdit = async (post) => {
        setEditId(post._id);
        setError(null);
        setImageFile(null);
        setImagePreview(post.featuredImage?.url || null);
        setSlugLocked(true);

        // Fetch full post content (list doesn't include content)
        try {
            const { data } = await blogAPI.getByIdAdmin(post._id);
            const p = data.data;
            setForm({
                title: p.title || "",
                slug: p.slug || "",
                excerpt: p.excerpt || "",
                content: p.content || "",
                author: p.author || "Utkal Behera",
                status: p.status || "draft",
                category: p.category?._id || "",
                tags: p.tags?.map((t) => t._id) || [],
                seoTitle: p.seoTitle || "",
                seoDescription: p.seoDescription || "",
                ogImage: p.ogImage || "",
                canonical: p.canonical || "",
                publishedAt: p.publishedAt ? p.publishedAt.slice(0, 10) : "",
                scheduledAt: p.scheduledAt ? p.scheduledAt.slice(0, 10) : "",
            });
        } catch {
            setError("Failed to load post.");
        }
        setView("form");
    };

    // ── Save ────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!form.title.trim()) return setError("Title is required.");
        setSaving(true);
        setError(null);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k === "tags") {
                    v.forEach((id) => fd.append("tags", id));
                } else if (v !== undefined && v !== null) {
                    fd.append(k, v);
                }
            });
            if (imageFile) fd.append("featuredImage", imageFile);

            if (editId) {
                await blogAPI.update(editId, fd);
            } else {
                await blogAPI.create(fd);
            }
            await loadAll();
            setView("list");
        } catch (e) {
            setError(e?.response?.data?.message || "Save failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this post permanently?")) return;
        try {
            await blogAPI.delete(id);
            setPosts((p) => p.filter((x) => x._id !== id));
        } catch {
            alert("Delete failed.");
        }
    };

    // ── Toggle publish ──────────────────────────────────────────────
    const handleToggleStatus = async (post) => {
        const newStatus = post.status === "published" ? "draft" : "published";
        try {
            const fd = new FormData();
            fd.append("status", newStatus);
            await blogAPI.update(post._id, fd);
            setPosts((prev) =>
                prev.map((p) => (p._id === post._id ? { ...p, status: newStatus } : p)),
            );
        } catch {
            alert("Status update failed.");
        }
    };

    // ── Add category ────────────────────────────────────────────────
    const handleAddCategory = async () => {
        if (!newCatName.trim()) return;
        try {
            const { data } = await blogAPI.createCategory({ name: newCatName, color: "#6366f1" });
            setCategories((c) => [...c, data.data]);
            setNewCatName("");
        } catch {
            alert("Could not create category.");
        }
    };

    // ── Add tag ─────────────────────────────────────────────────────
    const handleAddTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const { data } = await blogAPI.createTag({ name: newTagName });
            setTags((t) => [...t, data.data]);
            setNewTagName("");
        } catch {
            alert("Could not create tag.");
        }
    };

    // ── Delete category / tag ───────────────────────────────────────
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            await blogAPI.deleteCategory(id);
            setCategories((c) => c.filter((x) => x._id !== id));
        } catch { alert("Failed."); }
    };

    const handleDeleteTag = async (id) => {
        try {
            await blogAPI.deleteTag(id);
            setTags((t) => t.filter((x) => x._id !== id));
        } catch { alert("Failed."); }
    };

    // ══════════════════════════════════════════════════════════════════
    // LIST VIEW
    // ══════════════════════════════════════════════════════════════════
    if (view === "list") {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Blog Manager</h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {posts.length} post{posts.length !== 1 ? "s" : ""}
                            {" · "}
                            {posts.filter((p) => p.status === "published").length} published
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={loadAll}
                            className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                            title="Refresh"
                        >
                            <RefreshCw size={15} />
                        </button>
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                        >
                            <Plus size={15} /> New Post
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 rounded-xl bg-white/3 border border-dark-border animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!loading && posts.length === 0 && (
                    <div className="text-center py-16">
                        <FileText size={40} className="mx-auto text-slate-700 mb-4" />
                        <p className="text-slate-500">No blog posts yet.</p>
                        <button
                            onClick={openCreate}
                            className="mt-4 px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                        >
                            Write your first post
                        </button>
                    </div>
                )}

                {/* Post list */}
                {!loading && posts.length > 0 && (
                    <div className="space-y-2">
                        {posts.map((post) => (
                            <PostRow
                                key={post._id}
                                post={post}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                                onToggleStatus={handleToggleStatus}
                            />
                        ))}
                    </div>
                )}

                {/* ── CATEGORY + TAG MANAGEMENT ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-dark-border">
                    {/* Categories */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Globe size={14} className="text-accent-blue" /> Categories
                        </h3>
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                            {categories.map((cat) => (
                                <div key={cat._id} className="flex items-center justify-between gap-2">
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-lg"
                                        style={{ color: cat.color, background: `${cat.color}15` }}
                                    >
                                        {cat.name}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCategory(cat._id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                                placeholder="New category…"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-dark-border text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent-blue"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <Tag size={14} className="text-accent-blue" /> Tags
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3 max-h-40 overflow-y-auto">
                            {tags.map((tag) => (
                                <span
                                    key={tag._id}
                                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 border border-dark-border text-slate-300"
                                >
                                    # {tag.name}
                                    <button
                                        onClick={() => handleDeleteTag(tag._id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors ml-0.5"
                                    >
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                placeholder="New tag…"
                                className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-dark-border text-slate-200 text-xs placeholder:text-slate-600 focus:outline-none focus:border-accent-blue"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-3 py-1.5 rounded-lg bg-accent-blue text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════════════
    // FORM VIEW (Create / Edit)
    // ══════════════════════════════════════════════════════════════════
    return (
        <div className="space-y-6 max-w-4xl">
            {/* Back + title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setView("list")}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <span className="text-slate-600">/</span>
                <h1 className="text-xl font-bold text-white">
                    {editId ? "Edit Post" : "New Post"}
                </h1>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── LEFT: Main content ─────────────────────────── */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Title */}
                    <div>
                        <label className={labelClass}>Title *</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Your blog post title…"
                            className={inputClass}
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className={labelClass}>URL Slug</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => {
                                    set("slug", e.target.value);
                                    setSlugLocked(true);
                                }}
                                placeholder="url-friendly-slug"
                                className={`${inputClass} flex-1 font-mono text-xs`}
                            />
                            <button
                                onClick={() => {
                                    set("slug", slugify(form.title));
                                    setSlugLocked(false);
                                }}
                                className="px-3 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 hover:text-white text-xs transition-colors"
                                title="Regenerate from title"
                            >
                                <RefreshCw size={13} />
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">/blog/{form.slug || "your-slug"}</p>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className={labelClass}>Excerpt (for cards & meta description)</label>
                        <textarea
                            value={form.excerpt}
                            onChange={(e) => set("excerpt", e.target.value)}
                            rows={3}
                            maxLength={300}
                            placeholder="A short summary of this post (max 300 chars)…"
                            className={`${inputClass} resize-none`}
                        />
                        <p className="text-xs text-slate-500 mt-1 text-right">{form.excerpt.length}/300</p>
                    </div>

                    {/* Content / HTML editor */}
                    <div>
                        <label className={labelClass}>
                            Content (HTML — paste from any rich text editor or write markdown-like HTML)
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => set("content", e.target.value)}
                            rows={20}
                            placeholder={`<h2>Introduction</h2>\n<p>Write your article here...</p>\n<h3>Section heading</h3>\n<p>More content...</p>`}
                            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
                            spellCheck={false}
                        />
                        <p className="text-xs text-slate-500 mt-1">
                            Tip: You can paste HTML from Notion, Google Docs, or any rich-text editor.
                            The blog page renders this with beautiful prose styling.
                        </p>
                    </div>

                    {/* ── SEO accordion ── */}
                    <details className="group rounded-xl border border-dark-border">
                        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-semibold text-slate-300 hover:text-white select-none list-none">
                            <Globe size={14} className="text-accent-blue" /> SEO Settings
                            <span className="ml-auto text-slate-500 text-xs group-open:rotate-180 transition-transform">▾</span>
                        </summary>
                        <div className="px-4 pb-4 space-y-4 border-t border-dark-border">
                            <div className="mt-4">
                                <label className={labelClass}>SEO Title (override)</label>
                                <input type="text" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={form.title || "Custom SEO title…"} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>SEO Description</label>
                                <textarea value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={2} placeholder={form.excerpt || "Custom meta description…"} className={`${inputClass} resize-none`} />
                            </div>
                            <div>
                                <label className={labelClass}>OG Image URL (override)</label>
                                <input type="url" value={form.ogImage} onChange={(e) => set("ogImage", e.target.value)} placeholder="https://…" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Canonical URL</label>
                                <input type="url" value={form.canonical} onChange={(e) => set("canonical", e.target.value)} placeholder="https://… (leave blank if not syndicating)" className={inputClass} />
                            </div>
                        </div>
                    </details>
                </div>

                {/* ── RIGHT: Sidebar ─────────────────────────────── */}
                <div className="space-y-5">
                    {/* Publish */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border space-y-4">
                        <h3 className="text-sm font-bold text-white">Publish</h3>

                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => set("status", e.target.value)}
                                className={inputClass}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>

                        {form.status === "scheduled" && (
                            <div>
                                <label className={labelClass}>Scheduled Date</label>
                                <input type="date" value={form.scheduledAt} onChange={(e) => set("scheduledAt", e.target.value)} className={inputClass} />
                            </div>
                        )}

                        <div>
                            <label className={labelClass}>Author</label>
                            <input type="text" value={form.author} onChange={(e) => set("author", e.target.value)} className={inputClass} />
                        </div>

                        {/* Save button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-bold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {saving ? (
                                <><RefreshCw size={14} className="animate-spin" /> Saving…</>
                            ) : (
                                <><Save size={14} /> {editId ? "Update Post" : "Create Post"}</>
                            )}
                        </button>
                    </div>

                    {/* Featured image */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                        <h3 className="text-sm font-bold text-white mb-3">Featured Image</h3>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        {imagePreview ? (
                            <div className="relative group">
                                <img src={imagePreview} alt="Preview" className="w-full aspect-video object-cover rounded-xl border border-dark-border" />
                                <button
                                    onClick={() => { setImageFile(null); setImagePreview(null); fileRef.current.value = ""; }}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileRef.current.click()}
                                className="w-full aspect-video rounded-xl border-2 border-dashed border-dark-border flex flex-col items-center justify-center text-slate-500 hover:border-accent-blue hover:text-accent-blue transition-all text-sm gap-2"
                            >
                                <Plus size={20} />
                                <span>Upload image</span>
                            </button>
                        )}
                    </div>

                    {/* Category */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                        <h3 className="text-sm font-bold text-white mb-3">Category</h3>
                        <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className={inputClass}
                        >
                            <option value="">— No category —</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tags */}
                    <div className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                        <h3 className="text-sm font-bold text-white mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag._id}
                                    onClick={() => toggleTag(tag._id)}
                                    className={`text-xs px-2 py-1 rounded-lg border transition-all ${
                                        form.tags.includes(tag._id)
                                            ? "bg-accent-blue text-white border-accent-blue"
                                            : "bg-white/5 text-slate-400 border-dark-border hover:border-accent-blue/40"
                                    }`}
                                >
                                    # {tag.name}
                                </button>
                            ))}
                            {tags.length === 0 && (
                                <p className="text-xs text-slate-500">Add tags from the list view.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
