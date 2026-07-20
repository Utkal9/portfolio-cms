import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    Star,
    X,
    Upload,
    ExternalLink,
    Github,
    Play,
} from "lucide-react";
import toast from "react-hot-toast";
import { useProjectStore } from "../../store/index.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";

const EMPTY = {
    title: "",
    slug: "",
    description: "",
    tagline: "",
    problem: "",
    overview: "",
    challenges: "",
    learnings: "",
    architecture: "",
    metrics: "",
    features: "",
    techStack: "",
    liveUrl: "",
    githubUrl: "",
    videoUrl: "",
    category: "Web",
    featured: false,
    startDate: "",
    endDate: "",
};

// ── Live preview card — matches portfolio exactly ─────────────────────
function PreviewCard({ project }) {
    const hasVideo = project.videoUrl && project.videoUrl.trim() !== "";

    return (
        <div className="rounded-2xl overflow-hidden bg-dark-bg border border-dark-border">
            {/* Image */}
            <div
                className="h-40 bg-gradient-to-br from-blue-950/50 to-indigo-950/50
        flex items-center justify-center relative overflow-hidden"
            >
                {project.images?.[0]?.url ? (
                    <img
                        src={optimizeCloudinaryImage(
                            project.images[0].url,
                            900,
                        )}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={900}
                        height={480}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 to-transparent" />
                <span className="text-5xl z-10 opacity-30">
                    {!project.images?.[0]?.url ? "💼" : ""}
                </span>

                {project.featured && (
                    <div
                        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5
            rounded-full bg-amber-400/20 border border-amber-400/30
            text-amber-300 text-[9px] font-bold z-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Featured
                    </div>
                )}
                {project.liveUrl && (
                    <div
                        className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5
            rounded-full bg-green-500/10 border border-green-500/20
            text-green-400 text-[9px] font-bold z-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live
                    </div>
                )}
                <span
                    className="absolute bottom-3 left-3 text-[9px] px-2 py-0.5
          rounded-full bg-black/50 text-slate-400 border border-white/10 z-10"
                >
                    {project.category || "Web"}
                </span>
                {hasVideo && (
                    <div
                        className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5
            rounded-full bg-red-500/80 text-white text-[9px] font-bold z-10"
                    >
                        <Play size={8} fill="white" /> Demo
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                <div className="text-[9px] font-bold tracking-wider text-accent-blue uppercase mb-1">
                    {project.category || "Web"}
                    {project.startDate &&
                        ` · ${project.startDate}${project.endDate ? `–${project.endDate}` : ""}`}
                </div>
                <h3 className="font-extrabold text-white text-sm leading-tight mb-1.5">
                    {project.title || "Project Title"}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3 line-clamp-2">
                    {project.tagline ||
                        project.description ||
                        "Your tagline appears here..."}
                </p>

                {/* Problem preview */}
                {project.problem && (
                    <div
                        className="text-[10px] text-slate-500 italic mb-3
            pl-2 border-l-2 border-accent-blue/30 line-clamp-1"
                    >
                        {project.problem}
                    </div>
                )}

                {/* Features count */}
                {(project.features || "").split(/[\n,]/).filter((f) => f.trim())
                    .length > 0 && (
                    <p className="text-[9px] text-slate-600 mb-2">
                        ✨{" "}
                        {
                            (project.features || "")
                                .split(/[\n,]/)
                                .filter((f) => f.trim()).length
                        }{" "}
                        features listed
                    </p>
                )}

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {(project.techStack || "")
                        .split(",")
                        .slice(0, 4)
                        .map((t, i) =>
                            t.trim() ? (
                                <span
                                    key={i}
                                    className="text-[9px] px-2 py-0.5 rounded-lg font-bold
                bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                                >
                                    {t.trim()}
                                </span>
                            ) : null,
                        )}
                </div>

                {/* Action buttons preview */}
                <div className="flex gap-2 pt-3 border-t border-dark-border">
                    {project.liveUrl && (
                        <div
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl
              bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-[9px] font-bold"
                        >
                            <ExternalLink size={9} /> Demo
                        </div>
                    )}
                    {project.githubUrl && (
                        <div
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl
              bg-dark-card border border-dark-border text-slate-500 text-[9px] font-bold"
                        >
                            <Github size={9} /> Code
                        </div>
                    )}
                    {hasVideo && (
                        <div
                            className="flex items-center justify-center px-2 py-1.5 rounded-xl
              bg-red-500/10 border border-red-500/20 text-red-400 text-[9px]"
                        >
                            <Play size={9} fill="currentColor" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Project form ──────────────────────────────────────────────────────
function ProjectForm({ initial = EMPTY, onSave, onCancel, loading }) {
    const [form, setForm] = useState({
        ...EMPTY,
        ...initial,
        techStack: initial.techStack?.join?.(", ") || initial.techStack || "",
        features: initial.features?.join?.("\n") || initial.features || "",
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState(
        initial.images?.map((i) => i.url) || [],
    );

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleImages = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles(files);
        setPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        // Only append fields that are explicitly defined in our form state (EMPTY)
        // This prevents sending internal MongoDB fields (like _id, relatedProjects, etc.)
        // which can cause CastErrors on the backend.
        Object.keys(EMPTY).forEach((k) => {
            if (!["images", "videoUrl", "features", "techStack"].includes(k)) {
                if (form[k] !== undefined) {
                    fd.append(k, form[k]);
                }
            }
        });
        (form.techStack || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((t) => fd.append("techStack", t));
        (form.features || "")
            .split(/[\n,]/)
            .map((f) => f.trim())
            .filter(Boolean)
            .forEach((f) => fd.append("features", f));

        // Explicitly append videoUrl, even if it's an empty string so the backend can clear it
        fd.append("videoUrl", form.videoUrl ? form.videoUrl.trim() : "");

        imageFiles.forEach((f) => fd.append("images", f));
        onSave(fd);
    };

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg
    border border-dark-border text-slate-200 placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue transition-colors`;

    const Label = ({ text, hint }) => (
        <div className="mb-1.5">
            <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {text}
            </label>
            {hint && <p className="text-[9px] text-slate-600 mt-0.5">{hint}</p>}
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT — form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label text="Title *" />
                        <input
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            required
                            className={inputClass}
                            placeholder="Project name"
                        />
                    </div>
                    <div>
                        <Label text="Category" />
                        <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className={inputClass}
                        >
                            {[
                                "Web",
                                "Mobile",
                                "AI/ML",
                                "DevOps",
                                "Open Source",
                            ].map((c) => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Slug */}
                <div>
                    <Label
                        text="URL Slug"
                        hint="Auto-generated from title. Edit to customise. e.g. my-project-name"
                    />
                    <input
                        value={form.slug || ""}
                        onChange={(e) =>
                            set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))
                        }
                        className={inputClass}
                        placeholder="auto-generated-from-title"
                    />
                    {form.slug && (
                        <p className="text-[9px] text-slate-600 mt-1">
                            URL: /projects/<span className="text-accent-blue">{form.slug}</span>
                        </p>
                    )}
                </div>

                <div>
                    <Label
                        text="One-line Tagline"
                        hint="Punchy description shown on card — be specific"
                    />
                    <input
                        value={form.tagline || ""}
                        onChange={(e) => set("tagline", e.target.value)}
                        className={inputClass}
                        placeholder="Full-stack platform with real-time messaging and video calls"
                    />
                </div>

                <div>
                    <Label
                        text="Description"
                        hint="Full description shown in modal"
                    />
                    <textarea
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Detailed project description..."
                    />
                </div>

                <div>
                    <Label
                        text="💡 Problem → Solution"
                        hint="Shown as highlighted block in modal"
                    />
                    <textarea
                        value={form.problem || ""}
                        onChange={(e) => set("problem", e.target.value)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Problem → how your project solves it"
                    />
                </div>

                {/* ── Detail page content ─────────────────────────── */}
                <div className="pt-2 pb-1">
                    <p className="text-[9px] text-accent-blue font-bold uppercase tracking-widest">
                        📄 Project Detail Page Content
                    </p>
                    <p className="text-[9px] text-slate-600 mt-0.5">
                        Fields below power the /projects/:slug landing page
                    </p>
                </div>

                <div>
                    <Label
                        text="📋 Overview"
                        hint="Extended description for the detail page"
                    />
                    <textarea
                        value={form.overview || ""}
                        onChange={(e) => set("overview", e.target.value)}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Full project overview shown on the detail page..."
                    />
                </div>

                <div>
                    <Label
                        text="🏗 Architecture"
                        hint="System design, tech decisions, patterns used"
                    />
                    <textarea
                        value={form.architecture || ""}
                        onChange={(e) => set("architecture", e.target.value)}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Frontend: React + Vite → Backend: Express REST API → DB: MongoDB Atlas..."
                    />
                </div>

                <div>
                    <Label
                        text="⚡ Challenges Faced"
                        hint="Technical problems you solved"
                    />
                    <textarea
                        value={form.challenges || ""}
                        onChange={(e) => set("challenges", e.target.value)}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Biggest challenge was X. Solved it by..."
                    />
                </div>

                <div>
                    <Label
                        text="💡 Key Learnings"
                        hint="What you learned or improved"
                    />
                    <textarea
                        value={form.learnings || ""}
                        onChange={(e) => set("learnings", e.target.value)}
                        rows={3}
                        className={`${inputClass} resize-none`}
                        placeholder="Learned how to implement X at scale. Improved understanding of Y..."
                    />
                </div>

                <div>
                    <Label
                        text="📊 Impact & Metrics"
                        hint="Numbers, stats, user feedback"
                    />
                    <textarea
                        value={form.metrics || ""}
                        onChange={(e) => set("metrics", e.target.value)}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Reduced load time by 40%. Served 500+ users. 98 Lighthouse score..."
                    />
                </div>

                <div>
                    <Label
                        text="✨ Key Features"
                        hint="One per line — shown in modal as checklist"
                    />
                    <textarea
                        value={form.features || ""}
                        onChange={(e) => set("features", e.target.value)}
                        rows={5}
                        className={`${inputClass} resize-none font-mono text-[11px]`}
                        placeholder={
                            "Real-time messaging\nVideo calls (WebRTC)\nAuth system\nAdmin dashboard"
                        }
                    />
                    {form.features && (
                        <p className="text-[9px] text-slate-600 mt-1">
                            {
                                form.features
                                    .split(/[\n,]/)
                                    .filter((f) => f.trim()).length
                            }{" "}
                            features added
                        </p>
                    )}
                </div>

                <div>
                    <Label text="Tech Stack" hint="Comma-separated" />
                    <input
                        value={form.techStack}
                        onChange={(e) => set("techStack", e.target.value)}
                        className={inputClass}
                        placeholder="React, Node.js, MongoDB..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label text="Live URL" />
                        <input
                            value={form.liveUrl}
                            onChange={(e) => set("liveUrl", e.target.value)}
                            className={inputClass}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <Label text="GitHub URL" />
                        <input
                            value={form.githubUrl}
                            onChange={(e) => set("githubUrl", e.target.value)}
                            className={inputClass}
                            placeholder="https://github.com/..."
                        />
                    </div>
                </div>

                <div>
                    <Label
                        text="Demo Video URL"
                        hint="YouTube / Loom / Vimeo (leave empty to remove)"
                    />
                    <input
                        value={form.videoUrl || ""}
                        onChange={(e) => set("videoUrl", e.target.value)}
                        className={inputClass}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                    {form.videoUrl?.trim() && (
                        <p className="text-[9px] text-green-400 mt-1">
                            ✓ Video added — play button will show on card
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label text="Start Date" />
                        <input
                            value={form.startDate || ""}
                            onChange={(e) => set("startDate", e.target.value)}
                            className={inputClass}
                            placeholder="Sep 2025"
                        />
                    </div>
                    <div>
                        <Label text="End Date" />
                        <input
                            value={form.endDate || ""}
                            onChange={(e) => set("endDate", e.target.value)}
                            className={inputClass}
                            placeholder="Dec 2025"
                        />
                    </div>
                </div>

                <div>
                    <Label
                        text="Project Images"
                        hint="Uploaded to Cloudinary"
                    />
                    <label
                        className="flex items-center justify-center gap-2
            border-2 border-dashed border-dark-border rounded-xl p-4
            text-slate-500 hover:border-accent-blue/50 hover:text-accent-blue
            transition-all cursor-pointer text-sm"
                    >
                        <Upload size={15} /> Click to upload images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImages}
                            className="hidden"
                        />
                    </label>
                    {previews.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {previews.map((p, i) => (
                                <img
                                    key={i}
                                    src={optimizeCloudinaryImage(p, 900)}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    width={64}
                                    height={48}
                                    className="w-16 h-12 object-cover rounded-lg border border-dark-border"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 py-1">
                    <button
                        type="button"
                        onClick={() => set("featured", !form.featured)}
                        className={`w-10 h-5 rounded-full transition-all relative
              ${form.featured ? "bg-accent-blue" : "bg-dark-border"}`}
                    >
                        <div
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full
              transition-all ${form.featured ? "left-5" : "left-0.5"}`}
                        />
                    </button>
                    <div>
                        <span className="text-sm text-slate-300 font-semibold">
                            Featured project
                        </span>
                        <p className="text-[9px] text-slate-600">
                            Appears first in the projects grid
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 pt-2 border-t border-dark-border">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-2.5 rounded-xl border border-dark-border
              text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl bg-grad-main text-white
              font-semibold text-sm hover:shadow-glow-blue transition-all disabled:opacity-60"
                    >
                        {loading ? "Saving..." : "Save Project"}
                    </button>
                </div>
            </form>

            {/* RIGHT — live preview */}
            <div className="lg:sticky lg:top-6">
                <div className="mb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Live Preview
                    </p>
                    <p className="text-[10px] text-slate-600">
                        Updates as you type — exactly as visitors see it
                    </p>
                </div>
                <PreviewCard project={form} />

                {/* Completeness */}
                <div className="mt-4 p-3 bg-dark-bg rounded-xl border border-dark-border">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Completeness
                    </p>
                    {[
                        { label: "Title", done: !!form.title },
                        { label: "Tagline", done: !!form.tagline },
                        { label: "Problem", done: !!form.problem },
                        {
                            label: "Features",
                            done:
                                form.features
                                    ?.split(/[\n,]/)
                                    .filter((f) => f.trim()).length > 0,
                        },
                        {
                            label: "Tech Stack",
                            done:
                                form.techStack
                                    ?.split(",")
                                    .filter((t) => t.trim()).length > 0,
                        },
                        { label: "Live URL", done: !!form.liveUrl },
                        { label: "GitHub", done: !!form.githubUrl },
                        {
                            label: "Image",
                            done:
                                !!form.images?.[0]?.url ||
                                imageFiles.length > 0,
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between py-0.5"
                        >
                            <span className="text-[10px] text-slate-500">
                                {item.label}
                            </span>
                            <span
                                className={`text-[9px] font-bold ${item.done ? "text-green-400" : "text-slate-700"}`}
                            >
                                {item.done ? "✓" : "○"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────
export default function ProjectManager() {
    const {
        projects,
        fetchAdmin,
        create,
        update,
        delete: del,
    } = useProjectStore();
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [delId, setDelId] = useState(null);

    useEffect(() => {
        fetchAdmin();
    }, []);

    const handleSave = async (fd) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await create(fd);
                toast.success("Project created!");
            } else {
                await update(editing._id, fd);
                toast.success("Project updated!");
            }
            setEditing(null);
        } catch (e) {
            toast.error(e.response?.data?.message || "Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await del(id);
            toast.success("Deleted");
        } catch {
            toast.error("Error");
        }
        setDelId(null);
    };

    const sorted = [...projects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Projects</h2>
                    <p className="text-sm text-slate-500">
                        {projects.length} projects ·{" "}
                        {projects.filter((p) => p.featured).length} featured
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Project
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
                                        ? "Add New Project"
                                        : `Edit — ${editing.title}`}
                                </h3>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                    Right panel updates live as you type
                                </p>
                            </div>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <ProjectForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sorted.map((p) => {
                    const hasVideo = p.videoUrl && p.videoUrl.trim() !== "";
                    return (
                        <motion.div
                            key={p._id}
                            layout
                            className={`bg-dark-card rounded-2xl overflow-hidden transition-all
                hover:border-accent-blue/30 group
                ${p.featured ? "border border-accent-blue/30" : "border border-dark-border"}`}
                        >
                            {/* Image */}
                            <div className="h-36 bg-dark-bg2 relative overflow-hidden flex items-center justify-center">
                                {p.images?.[0]?.url ? (
                                    <img
                                        src={optimizeCloudinaryImage(
                                            p.images[0].url,
                                            900,
                                        )}
                                        alt={p.title}
                                        loading="lazy"
                                        decoding="async"
                                        width={900}
                                        height={360}
                                        className="w-full h-full object-cover opacity-70"
                                    />
                                ) : (
                                    <span className="text-4xl opacity-20">
                                        💼
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent" />
                                <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                                    {p.featured && (
                                        <span
                                            className="flex items-center gap-1 px-2 py-0.5 rounded-full
                      bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[9px] font-bold"
                                        >
                                            <Star
                                                size={7}
                                                fill="currentColor"
                                            />{" "}
                                            Featured
                                        </span>
                                    )}
                                    {p.liveUrl && (
                                        <span
                                            className="flex items-center gap-1 px-2 py-0.5 rounded-full
                      bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />{" "}
                                            Live
                                        </span>
                                    )}
                                    {hasVideo && (
                                        <span
                                            className="px-2 py-0.5 rounded-full bg-red-500/15
                      border border-red-500/20 text-red-400 text-[9px] font-bold"
                                        >
                                            ▶
                                        </span>
                                    )}
                                </div>
                                <span
                                    className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5
                  rounded-full bg-black/50 text-slate-400 border border-white/10 z-10"
                                >
                                    {p.category}
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="text-[9px] font-bold text-accent-blue uppercase tracking-wider mb-1">
                                    {p.startDate}
                                    {p.endDate ? ` – ${p.endDate}` : ""}
                                </div>
                                <h4 className="font-bold text-white text-sm mb-1">
                                    {p.title}
                                </h4>
                                {p.tagline && (
                                    <p className="text-[10px] text-accent-blue mb-1.5 line-clamp-1">
                                        {p.tagline}
                                    </p>
                                )}
                                {p.problem && (
                                    <p
                                        className="text-[10px] text-slate-500 italic mb-2
                    pl-2 border-l-2 border-accent-blue/30 line-clamp-1"
                                    >
                                        {p.problem}
                                    </p>
                                )}
                                {p.features?.length > 0 && (
                                    <p className="text-[9px] text-slate-600 mb-2">
                                        ✨ {p.features.length} features listed
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {p.techStack?.slice(0, 4).map((t) => (
                                        <span
                                            key={t}
                                            className="text-[9px] px-2 py-0.5 rounded-full
                      bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                    {p.techStack?.length > 4 && (
                                        <span
                                            className="text-[9px] px-2 py-0.5 rounded-full
                      bg-dark-bg text-slate-500"
                                        >
                                            +{p.techStack.length - 4}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditing(p)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                      border border-dark-border text-slate-400 hover:text-accent-blue
                      hover:border-accent-blue/30 text-xs font-medium transition-all"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDelId(p._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                      border border-dark-border text-slate-400 hover:text-red-400
                      hover:border-red-400/30 text-xs font-medium transition-all"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Delete confirm */}
            <AnimatePresence>
                {delId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-sm w-full">
                            <h3 className="font-bold text-white mb-2">
                                Delete Project?
                            </h3>
                            <p className="text-sm text-slate-400 mb-5">
                                Deletes images from Cloudinary too. Cannot be
                                undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDelId(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-dark-border text-slate-400 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(delId)}
                                    className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30
                    text-red-400 text-sm font-semibold"
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
