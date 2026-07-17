import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, Save } from "lucide-react";
import toast from "react-hot-toast";
import { blogAPI } from "../../services/api.js";

const EMPTY = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    tags: "",
    status: "draft",
    featured: false,
    visible: true,
    author: "Utkal Behera",
    readingTime: 4,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    ogImage: "",
};

function BlogForm({ initial, onSave, onCancel, loading }) {
    const [form, setForm] = useState({
        ...EMPTY,
        ...initial,
        tags: (initial.tags || []).join(", "),
    });

    useEffect(() => {
        setForm({
            ...EMPTY,
            ...initial,
            tags: (initial.tags || []).join(", "),
        });
    }, [initial]);

    const setValue = (key, value) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            tags: form.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
        };
        onSave(payload);
    };

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg border border-dark-border text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Title
                    </label>
                    <input
                        value={form.title}
                        onChange={(e) => setValue("title", e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Slug
                    </label>
                    <input
                        value={form.slug}
                        onChange={(e) => setValue("slug", e.target.value)}
                        className={inputClass}
                        placeholder="engineering-notes"
                    />
                </div>
            </div>
            <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Excerpt
                </label>
                <textarea
                    value={form.excerpt}
                    onChange={(e) => setValue("excerpt", e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                />
            </div>
            <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Content
                </label>
                <textarea
                    value={form.content}
                    onChange={(e) => setValue("content", e.target.value)}
                    rows={8}
                    className={`${inputClass} resize-none font-mono text-[11px]`}
                />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Category
                    </label>
                    <input
                        value={form.category}
                        onChange={(e) => setValue("category", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Tags
                    </label>
                    <input
                        value={form.tags}
                        onChange={(e) => setValue("tags", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Reading Time
                    </label>
                    <input
                        type="number"
                        value={form.readingTime}
                        onChange={(e) =>
                            setValue("readingTime", Number(e.target.value))
                        }
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Status
                    </label>
                    <select
                        value={form.status}
                        onChange={(e) => setValue("status", e.target.value)}
                        className={inputClass}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Author
                    </label>
                    <input
                        value={form.author}
                        onChange={(e) => setValue("author", e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        SEO Title
                    </label>
                    <input
                        value={form.seoTitle}
                        onChange={(e) => setValue("seoTitle", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        SEO Description
                    </label>
                    <input
                        value={form.seoDescription}
                        onChange={(e) =>
                            setValue("seoDescription", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Canonical URL
                    </label>
                    <input
                        value={form.canonicalUrl}
                        onChange={(e) =>
                            setValue("canonicalUrl", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        OG Image
                    </label>
                    <input
                        value={form.ogImage}
                        onChange={(e) => setValue("ogImage", e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setValue("featured", !form.featured)}
                    className={`w-10 h-5 rounded-full transition-all relative ${form.featured ? "bg-accent-blue" : "bg-dark-border"}`}
                >
                    <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${form.featured ? "left-5" : "left-0.5"}`}
                    />
                </button>
                <span className="text-sm text-slate-300">Featured article</span>
            </div>
            <div className="flex gap-3 pt-2 border-t border-dark-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-dark-border text-slate-400 hover:text-white text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-grad-main text-white font-semibold text-sm hover:shadow-glow-blue transition-all disabled:opacity-60"
                >
                    {loading ? (
                        "Saving..."
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <Save size={14} />
                            Save Article
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}

export default function BlogManager() {
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    async function refresh() {
        try {
            const { data } = await blogAPI.getAllAdmin();
            setPosts(data.data || []);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const handleSave = async (payload) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await blogAPI.create(payload);
                toast.success("Article created");
            } else {
                await blogAPI.update(editing._id, payload);
                toast.success("Article updated");
            }
            setEditing(null);
            await refresh();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error saving article");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await blogAPI.delete(deleteId);
            toast.success("Article deleted");
            await refresh();
        } catch {
            toast.error("Delete failed");
        } finally {
            setDeleteId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Blog CMS</h2>
                    <p className="text-sm text-slate-500">
                        Create, edit, publish, and manage posts from the admin
                        panel
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Article
                </button>
            </div>

            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="font-bold text-white">
                                    {editing === "new"
                                        ? "New article"
                                        : `Edit — ${editing.title}`}
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    All blog fields remain editable from CMS
                                </p>
                            </div>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <BlogForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4 md:grid-cols-2">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="bg-dark-card border border-dark-border rounded-2xl p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-accent-blue font-bold">
                                    {post.category || "General"}
                                </p>
                                <h3 className="text-sm font-bold text-white mt-1">
                                    {post.title}
                                </h3>
                                <p className="text-xs text-slate-500 mt-2">
                                    {post.excerpt ||
                                        post.content?.slice(0, 120)}
                                </p>
                            </div>
                            <span
                                className={`text-[10px] px-2 py-1 rounded-full ${post.status === "published" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                            >
                                {post.status}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setEditing(post)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dark-border text-slate-400 hover:text-accent-blue hover:border-accent-blue/30 text-xs font-medium transition-all"
                            >
                                <Edit2 size={12} /> Edit
                            </button>
                            <button
                                onClick={() => setDeleteId(post._id)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dark-border text-slate-400 hover:text-red-400 hover:border-red-400/30 text-xs font-medium transition-all"
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-sm w-full">
                            <h3 className="font-bold text-white mb-2">
                                Delete article?
                            </h3>
                            <p className="text-sm text-slate-400 mb-5">
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-dark-border text-slate-400 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
