import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { useSkillStore } from "../../store/index.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";

// ── Same icon map as SkillSection.jsx ────────────────────────────────
const ICON_MAP = {
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "react.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "next.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    typescript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    javascript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    tailwind:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    tailwindcss:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    bootstrap:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    "vue.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    angular:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    redux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    "node.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    express:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "express.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    mongodb:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    postgresql:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    graphql:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    firebase:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    kubernetes:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
    aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    nginx: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
    "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    postman:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    wordpress:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
};

function getIconUrl(name) {
    return ICON_MAP[name?.toLowerCase()] || null;
}

const CIRC = 163;
const CATS = ["Frontend", "Backend", "Cloud & DevOps", "Languages", "Tools"];
const EMPTY = {
    name: "",
    icon: "⚡",
    level: 80,
    category: "Frontend",
    visible: true,
};

// ── Mini ring preview (matches portfolio exactly) ────────────────────
function SkillPreviewCard({ skill }) {
    const iconUrl = getIconUrl(skill.name);
    const offset = CIRC - (CIRC * skill.level) / 100;
    const id = `prev-${skill.name?.replace(/\s/g, "")}`;

    return (
        <div
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl
      bg-dark-bg border border-dark-border
      hover:border-accent-blue/30 transition-all group relative overflow-hidden"
        >
            <div
                className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5
        opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
            />

            {/* Ring */}
            <div className="relative w-14 h-14">
                <svg
                    width="56"
                    height="56"
                    viewBox="0 0 64 64"
                    className="-rotate-90 absolute inset-0 w-full h-full"
                >
                    <defs>
                        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#4f8ef7" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="4"
                    />
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke={`url(#${id})`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 0.8s ease" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    {iconUrl ? (
                        <img
                            src={optimizeCloudinaryImage(iconUrl, 200)}
                            alt={skill.name}
                            loading="lazy"
                            decoding="async"
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <span
                        style={{ display: iconUrl ? "none" : "flex" }}
                        className="text-lg"
                    >
                        {skill.icon || "⚡"}
                    </span>
                </div>
            </div>

            <div className="text-center relative z-10">
                <div className="text-[11px] font-bold text-slate-300 leading-tight">
                    {skill.name || "—"}
                </div>
                <div
                    className="text-[10px] font-extrabold bg-gradient-to-r from-accent-blue to-accent-purple
          bg-clip-text text-transparent"
                >
                    {skill.level}%
                </div>
            </div>
        </div>
    );
}

// ── Skill form ───────────────────────────────────────────────────────
function SkillForm({ initial = EMPTY, onSave, onCancel, loading }) {
    const [form, setForm] = useState({ ...EMPTY, ...initial });
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const iconUrl = getIconUrl(form.name);
    const hasRealIcon = !!iconUrl;

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg border border-dark-border
    text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent-blue transition-colors`;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(form);
            }}
            className="space-y-4"
        >
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
                        Skill Name *
                    </label>
                    <input
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        required
                        className={inputClass}
                        placeholder="e.g. React.js, MongoDB, Docker"
                    />
                    {/* Live icon feedback */}
                    {form.name && (
                        <div className="flex items-center gap-2 mt-1.5">
                            {hasRealIcon ? (
                                <>
                                    <img
                                        src={optimizeCloudinaryImage(
                                            iconUrl,
                                            200,
                                        )}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        width={16}
                                        height={16}
                                        className="w-4 h-4 object-contain"
                                    />
                                    <span className="text-[10px] text-green-400 font-semibold">
                                        ✓ Real icon found
                                    </span>
                                </>
                            ) : (
                                <span className="text-[10px] text-amber-400">
                                    ⚠ No icon match — will use emoji below
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
                        Fallback Emoji
                    </label>
                    <input
                        value={form.icon}
                        onChange={(e) => set("icon", e.target.value)}
                        className={inputClass}
                        placeholder="⚡"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">
                        Used only if no real icon found
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
                        Proficiency — {form.level}%
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={form.level}
                        onChange={(e) => set("level", +e.target.value)}
                        className="w-full accent-accent-blue"
                    />
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                        <span>Beginner</span>
                        <span>Expert</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
                        Category
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        className={inputClass}
                    >
                        {CATS.map((c) => (
                            <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Live preview — matches portfolio card exactly */}
            <div>
                <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                    Live Preview — exactly as it appears on portfolio
                </label>
                <div className="flex justify-center">
                    <div className="w-32">
                        <SkillPreviewCard skill={form} />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2.5 rounded-xl border border-dark-border text-slate-400
            hover:text-white text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl bg-grad-main text-white font-semibold
            text-sm hover:shadow-glow-blue transition-all disabled:opacity-60"
                >
                    {loading ? "Saving..." : "Save Skill"}
                </button>
            </div>
        </form>
    );
}

// ── Main SkillManager ────────────────────────────────────────────────
export default function SkillManager() {
    const { skills, fetchAdmin, create, update, delete: del } = useSkillStore();
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAdmin();
    }, []);

    const handleSave = async (data) => {
        setSaving(true);
        try {
            if (editing === "new") {
                await create(data);
                toast.success("Skill added!");
            } else {
                await update(editing._id, data);
                toast.success("Skill updated!");
            }
            setEditing(null);
        } catch {
            toast.error("Error saving skill");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this skill?")) return;
        try {
            await del(id);
            toast.success("Deleted");
        } catch {
            toast.error("Error");
        }
    };

    // Group by category
    const grouped = CATS.reduce((acc, cat) => {
        const list = skills.filter((s) => s.category === cat);
        if (list.length) acc[cat] = list;
        return acc;
    }, {});

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Skills</h2>
                    <p className="text-sm text-slate-500">
                        {skills.length} skills configured
                    </p>
                </div>
                <button
                    onClick={() => setEditing("new")}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-grad-main text-white text-sm font-semibold
            hover:shadow-glow-blue transition-all"
                >
                    <Plus size={16} /> Add Skill
                </button>
            </div>

            {/* Form panel */}
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
                                    ? "Add New Skill"
                                    : `Edit — ${editing.name}`}
                            </h3>
                            <button
                                onClick={() => setEditing(null)}
                                className="text-slate-500 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <SkillForm
                            initial={editing === "new" ? EMPTY : editing}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                            loading={saving}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skills grouped by category — shown as mini cards matching portfolio */}
            {Object.entries(grouped).map(([cat, list]) => (
                <div key={cat} className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {cat}
                        </h3>
                        <div className="flex-1 h-px bg-dark-border" />
                        <span className="text-xs text-slate-600">
                            {list.length} skills
                        </span>
                    </div>

                    {/* Mini card grid — same layout as portfolio */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-4">
                        {list.map((skill) => (
                            <div key={skill._id} className="relative group">
                                <SkillPreviewCard skill={skill} />
                                {/* Edit/Delete overlay on hover */}
                                {/* Edit top-left, Delete top-right — icon circles */}
                                <div
                                    className="absolute inset-0 rounded-2xl
  opacity-0 group-hover:opacity-100 transition-all duration-200"
                                >
                                    {/* Edit — top left */}
                                    <button
                                        onClick={() => setEditing(skill)}
                                        className="absolute top-2 left-2 w-7 h-7 rounded-full
      flex items-center justify-center
      bg-accent-blue text-white shadow-lg
      hover:scale-110 transition-transform"
                                    >
                                        <Edit2 size={11} />
                                    </button>

                                    {/* Delete — top right */}
                                    <button
                                        onClick={() => handleDelete(skill._id)}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full
      flex items-center justify-center
      bg-red-500 text-white shadow-lg
      hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {skills.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                    <div className="text-4xl mb-3">⚡</div>
                    <p className="text-sm">
                        No skills yet — add your first one!
                    </p>
                </div>
            )}
        </div>
    );
}
