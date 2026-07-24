import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import { AdminTableSkeleton } from "../ui/loading/index.js";

const EMPTY = {
    institution: "",
    degree: "",
    field: "",
    grade: "",
    startDate: "",
    endDate: "",
    location: "",
};

function EduForm({ initial = EMPTY, onSave, onCancel, loading }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg
    border border-dark-border text-slate-200 placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
            }}
            className="space-y-4"
        >
            <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Institution *
                </label>
                <input
                    value={form.institution}
                    onChange={(e) => set("institution", e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Lovely Professional University"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Degree *
                    </label>
                    <input
                        value={form.degree}
                        onChange={(e) => set("degree", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="Bachelor of Technology"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Field of Study
                    </label>
                    <input
                        value={form.field}
                        onChange={(e) => set("field", e.target.value)}
                        className={inputClass}
                        placeholder="Computer Science & Engineering"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Grade / CGPA
                    </label>
                    <input
                        value={form.grade}
                        onChange={(e) => set("grade", e.target.value)}
                        className={inputClass}
                        placeholder="7.6 CGPA"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        Start Year
                    </label>
                    <input
                        value={form.startDate}
                        onChange={(e) => set("startDate", e.target.value)}
                        className={inputClass}
                        placeholder="2022"
                    />
                </div>
                <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        End Year
                    </label>
                    <input
                        value={form.endDate}
                        onChange={(e) => set("endDate", e.target.value)}
                        className={inputClass}
                        placeholder="2026"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Location
                </label>
                <input
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    className={inputClass}
                    placeholder="Phagwara, Punjab"
                />
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
                    {loading ? "Saving..." : "Save Education"}
                </button>
            </div>
        </form>
    );
}

export default function EducationManager() {
    const [education, setEducation] = useState([]);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get("/education/all");
            setEducation(res.data?.data || []);
        } catch {
            toast.error("Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await api.post("/education", data);
                toast.success("Education added!");
            } else {
                await api.put(`/education/${editing._id}`, data);
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
        if (!confirm("Delete this entry?")) return;
        try {
            await api.delete(`/education/${id}`);
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
                    <h2 className="text-xl font-bold text-white">Education</h2>
                    <p className="text-sm text-slate-500">
                        {education.length} entries
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Education
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
                                    ? "Add Education"
                                    : `Edit — ${editing.institution}`}
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <EduForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {loading && <AdminTableSkeleton rows={2} />}

            {!loading && (
                <div className="space-y-4">
                    {education.map((edu) => (
                        <motion.div
                            key={edu._id}
                            layout
                            className="bg-dark-card border border-dark-border rounded-2xl p-5
                hover:border-accent-blue/20 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex-shrink-0
                    bg-accent-blue/10 border border-accent-blue/20
                    flex items-center justify-center"
                                    >
                                        <GraduationCap
                                            size={18}
                                            className="text-accent-blue"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">
                                            {edu.institution}
                                        </h4>
                                        <p className="text-xs text-accent-blue font-semibold mt-0.5">
                                            {edu.degree}
                                            {edu.field ? ` — ${edu.field}` : ""}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            {edu.location && (
                                                <span className="text-[10px] text-slate-500">
                                                    {edu.location}
                                                </span>
                                            )}
                                            {(edu.startDate || edu.endDate) && (
                                                <span className="text-[10px] text-slate-500">
                                                    {edu.startDate}
                                                    {edu.endDate
                                                        ? ` – ${edu.endDate}`
                                                        : ""}
                                                </span>
                                            )}
                                            {edu.grade && (
                                                <span
                                                    className="text-[10px] font-bold text-accent-blue
                          bg-accent-blue/10 px-2 py-0.5 rounded-full border border-accent-blue/20"
                                                >
                                                    {edu.grade}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setEditing(edu)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                      border border-dark-border text-slate-400 hover:text-accent-blue
                      hover:border-accent-blue/30 text-xs font-medium transition-all"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(edu._id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
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

            {!loading && education.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                    <GraduationCap
                        size={40}
                        className="mx-auto mb-3 opacity-20"
                    />
                    <p className="text-sm">
                        No education entries yet — add your first one!
                    </p>
                </div>
            )}
        </div>
    );
}
