import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Briefcase,
    Upload,
    Award,
    ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import { useExperienceStore } from "../../store/index.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";

const EMPTY = {
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "Present",
    description: "",
    techStack: "",
};

function ExpForm({ initial = EMPTY, onSave, onCancel, loading }) {
    const [form, setForm] = useState({
        ...EMPTY,
        ...initial,
        techStack: initial.techStack?.join?.(", ") || initial.techStack || "",
    });
    const [certFile, setCertFile] = useState(null);
    const [certPreview, setCertPreview] = useState(
        initial.certificate?.url || "",
    );

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleCert = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCertFile(file);
        setCertPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("role", form.role);
        fd.append("company", form.company);
        fd.append("location", form.location);
        fd.append("startDate", form.startDate);
        fd.append("endDate", form.endDate);
        fd.append("description", form.description);

        const stack = form.techStack
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        stack.forEach((t) => fd.append("techStack[]", t));

        if (certFile) {
            fd.append("certificate", certFile);
        } else if (initial.certificate?.url && !certPreview) {
            // Signal to backend that the certificate was removed
            fd.append("removeCertificate", "true");
        }

        onSave(fd);
    };

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg
    border border-dark-border text-slate-200 placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Role *
                    </label>
                    <input
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Web Development Intern"
                    />
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Company *
                    </label>
                    <input
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Company Name"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Location
                    </label>
                    <input
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        className={inputClass}
                        placeholder="Remote / City"
                    />
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        Start Date *
                    </label>
                    <input
                        value={form.startDate}
                        onChange={(e) => set("startDate", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Sep 2025"
                    />
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
            uppercase tracking-wider mb-1.5"
                    >
                        End Date
                    </label>
                    <input
                        value={form.endDate}
                        onChange={(e) => set("endDate", e.target.value)}
                        className={inputClass}
                        placeholder="Nov 2025 / Present"
                    />
                </div>
            </div>

            <div>
                <label
                    className="block text-[10px] text-slate-400 font-bold
          uppercase tracking-wider mb-1.5"
                >
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder="What you did, what you built, what you learned..."
                />
            </div>

            <div>
                <label
                    className="block text-[10px] text-slate-400 font-bold
          uppercase tracking-wider mb-1.5"
                >
                    Tech Stack (comma-separated)
                </label>
                <input
                    value={form.techStack}
                    onChange={(e) => set("techStack", e.target.value)}
                    className={inputClass}
                    placeholder="React, Node.js, MongoDB..."
                />
            </div>

            {/* Certificate upload */}
            <div>
                <label
                    className="block text-[10px] text-slate-400 font-bold
          uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                >
                    <Award size={11} /> Experience Certificate (optional)
                </label>
                <label
                    className="flex items-center justify-center gap-2 w-full
          border-2 border-dashed border-dark-border rounded-xl p-4
          text-slate-500 hover:border-accent-blue/50 hover:text-accent-blue
          transition-all cursor-pointer text-sm"
                >
                    <Upload size={15} />
                    {certPreview
                        ? "Change certificate image/PDF"
                        : "Click to upload certificate"}
                    <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleCert}
                        className="hidden"
                    />
                </label>

                {certPreview && (
                    <div className="mt-3 relative">
                        {/* Display an icon for PDFs instead of a broken image preview */}
                        {certFile?.type === "application/pdf" ||
                        certPreview.endsWith(".pdf") ? (
                            <div className="w-full h-32 flex items-center justify-center bg-dark-bg rounded-xl border border-dark-border text-slate-400">
                                PDF Document Selected
                            </div>
                        ) : (
                            <img
                                src={optimizeCloudinaryImage(certPreview, 600)}
                                alt="Certificate preview"
                                loading="lazy"
                                decoding="async"
                                width={600}
                                height={192}
                                className="w-full max-h-48 object-cover rounded-xl border border-dark-border"
                            />
                        )}

                        <div className="absolute top-2 right-2 flex gap-2">
                            <a
                                href={certPreview}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-dark-bg/80 text-slate-300
                  hover:text-white transition-colors"
                            >
                                <ExternalLink size={13} />
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                    setCertFile(null);
                                    setCertPreview("");
                                }}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400
                  hover:bg-red-500/30 transition-colors"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    </div>
                )}
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
            font-semibold text-sm hover:shadow-glow-blue
            transition-all disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Save Experience"}
                </button>
            </div>
        </form>
    );
}

export default function ExperienceManager() {
    const {
        experience,
        fetchAdmin,
        create,
        update,
        delete: del,
    } = useExperienceStore();
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAdmin();
    }, []);

    const handleSave = async (fd) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await create(fd);
                toast.success("Experience added!");
            } else {
                await update(editing._id, fd);
                toast.success("Updated!");
            }
            setEditing(null);
        } catch (error) {
            console.error("THE CRASH IS HAPPENING HERE:", error);
            toast.error("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this experience?")) return;
        try {
            await del(id);
            toast.success("Deleted");
        } catch {
            toast.error("Error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Experience</h2>
                    <p className="text-sm text-slate-500">
                        {experience.length} entries
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold
            hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Experience
                </button>
            </div>

            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-dark-card border border-dark-border
              rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">
                                {editing === "new"
                                    ? "Add Experience"
                                    : "Edit Experience"}
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <ExpForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {experience.map((exp) => (
                    <div
                        key={exp._id}
                        className="bg-dark-card border border-dark-border rounded-2xl p-5
              hover:border-accent-blue/20 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className="w-10 h-10 rounded-xl bg-accent-blue/10
                flex items-center justify-center text-accent-blue flex-shrink-0"
                            >
                                <Briefcase size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-bold text-white">
                                                {exp.role}
                                            </h4>
                                            {exp.certificate?.url && (
                                                <span
                                                    className="flex items-center gap-1 text-[10px] font-bold
                          px-2 py-0.5 rounded-full
                          bg-amber-500/10 text-amber-500
                          border border-amber-500/20"
                                                >
                                                    <Award size={9} />{" "}
                                                    Certificate
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-accent-blue text-sm font-medium">
                                            {exp.company}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {exp.startDate} – {exp.endDate}
                                            {exp.location &&
                                                ` · ${exp.location}`}
                                        </p>
                                    </div>
                                    <div
                                        className="flex gap-2 opacity-0 group-hover:opacity-100
                    transition-opacity flex-shrink-0"
                                    >
                                        <button
                                            onClick={() => setEditing(exp)}
                                            className="w-8 h-8 rounded-lg bg-dark-bg2
                        text-slate-400 hover:text-accent-blue
                        flex items-center justify-center transition-colors"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(exp._id)
                                            }
                                            className="w-8 h-8 rounded-lg bg-dark-bg2
                        text-slate-400 hover:text-red-400
                        flex items-center justify-center transition-colors"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                {exp.description && (
                                    <p
                                        className="text-sm text-slate-400 mt-2 leading-relaxed
                    line-clamp-2"
                                    >
                                        {exp.description}
                                    </p>
                                )}

                                {/* Certificate preview */}
                                {exp.certificate?.url && (
                                    <div className="mt-3 flex items-center gap-2">
                                        {exp.certificate.url.endsWith(
                                            ".pdf",
                                        ) ? (
                                            <div className="w-16 h-10 flex items-center justify-center rounded-lg border border-dark-border text-[10px] text-slate-500">
                                                PDF
                                            </div>
                                        ) : (
                                            <img
                                                src={optimizeCloudinaryImage(
                                                    exp.certificate.url,
                                                    200,
                                                )}
                                                alt="cert"
                                                loading="lazy"
                                                decoding="async"
                                                width={64}
                                                height={40}
                                                className="w-16 h-10 object-cover rounded-lg
                            border border-dark-border"
                                            />
                                        )}
                                        <a
                                            href={exp.certificate.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-accent-blue hover:underline
                        flex items-center gap-1"
                                        >
                                            <ExternalLink size={10} /> View
                                            Certificate
                                        </a>
                                    </div>
                                )}

                                {exp.techStack?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {exp.techStack.map((t) => (
                                            <span
                                                key={t}
                                                className="text-[10px] px-2 py-0.5 rounded-full
                          bg-accent-blue/10 text-accent-blue
                          border border-accent-blue/20"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {experience.length === 0 && (
                    <div className="text-center py-16 text-slate-600">
                        <Briefcase
                            size={40}
                            className="mx-auto mb-3 opacity-20"
                        />
                        <p className="text-sm">No experience entries yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
