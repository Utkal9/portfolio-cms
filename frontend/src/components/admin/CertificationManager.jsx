import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Upload, Award } from "lucide-react";
import toast from "react-hot-toast";
import { certsAPI } from "../../services/api.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";

const EMPTY = {
    title: "",
    issuer: "",
    date: "",
    verificationUrl: "",
};

function CertForm({ initial = EMPTY, onSave, onCancel, loading }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(initial.image?.url || "");

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (imageFile) fd.append("image", imageFile);
        onSave(fd);
    };

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg
    border border-dark-border text-slate-200 placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Title *
                    </label>
                    <input
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Social Networks"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Issuer *
                    </label>
                    <input
                        value={form.issuer}
                        onChange={(e) => set("issuer", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="NPTEL"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Date
                    </label>
                    <input
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        className={inputClass}
                        placeholder="Oct 2025"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Verification URL
                    </label>
                    <input
                        value={form.verificationUrl}
                        onChange={(e) => set("verificationUrl", e.target.value)}
                        className={inputClass}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Certificate Image
                </label>
                <label
                    className="flex items-center justify-center gap-2
          border-2 border-dashed border-dark-border rounded-xl p-4
          text-slate-500 hover:border-accent-blue/50 hover:text-accent-blue
          transition-all cursor-pointer text-sm"
                >
                    <Upload size={15} /> Click to upload certificate image
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        className="hidden"
                    />
                </label>
                {preview && (
                    <img
                        src={optimizeCloudinaryImage(preview)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={600}
                        height={128}
                        className="mt-2 w-full h-32 object-cover rounded-xl border border-dark-border"
                    />
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
            font-semibold text-sm hover:shadow-glow-blue transition-all disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Save Certificate"}
                </button>
            </div>
        </form>
    );
}

export default function CertificationManager() {
    const [certs, setCerts] = useState([]);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await certsAPI.getAllAdmin();
            setCerts(res.data?.data || []);
        } catch {
            toast.error("Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async (fd) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await certsAPI.create(fd);
                toast.success("Certificate added!");
            } else {
                await certsAPI.update(editing._id, fd);
                toast.success("Updated!");
            }
            setEditing(null);
            await load();
        } catch {
            toast.error("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this certificate?")) return;
        try {
            await certsAPI.delete(id);
            toast.success("Deleted");
            await load();
        } catch {
            toast.error("Error");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Certifications
                    </h2>
                    <p className="text-sm text-slate-500">
                        {certs.length} certificates
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Certificate
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
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-white">
                                {editing === "new"
                                    ? "Add Certificate"
                                    : `Edit — ${editing.title}`}
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <CertForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="skeleton h-48 rounded-2xl"
                            />
                        ))}
                </div>
            )}

            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certs.map((cert) => (
                        <motion.div
                            key={cert._id}
                            layout
                            className="bg-dark-card border border-dark-border rounded-2xl
                overflow-hidden hover:border-accent-blue/20 transition-all"
                        >
                            {cert.image?.url ? (
                                <img
                                    src={optimizeCloudinaryImage(
                                        cert.image.url,
                                        600,
                                    )}
                                    alt={cert.title}
                                    loading="lazy"
                                    decoding="async"
                                    width={600}
                                    height={128}
                                    className="w-full h-32 object-cover"
                                />
                            ) : (
                                <div
                                    className="h-32 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10
                  flex items-center justify-center"
                                >
                                    <Award
                                        size={40}
                                        className="text-accent-blue/30"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h4 className="font-bold text-white text-sm mb-1">
                                    {cert.title}
                                </h4>
                                <p className="text-xs text-accent-blue font-semibold mb-1">
                                    {cert.issuer}
                                </p>
                                <p className="text-xs text-slate-500 mb-3">
                                    {cert.date}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditing(cert)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                      border border-dark-border text-slate-400 hover:text-accent-blue
                      hover:border-accent-blue/30 text-xs font-medium transition-all"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cert._id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                      border border-dark-border text-slate-400 hover:text-red-400
                      hover:border-red-400/30 text-xs font-medium transition-all"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && certs.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                    <Award size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">
                        No certificates yet — add your first one!
                    </p>
                </div>
            )}
        </div>
    );
}
