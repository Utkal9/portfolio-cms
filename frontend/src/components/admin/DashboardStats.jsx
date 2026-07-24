import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FolderKanban,
    Zap,
    MessageSquare,
    Eye,
    Settings,
    ArrowRight,
    GraduationCap,
    Award,
} from "lucide-react";
import {
    useProjectStore,
    useSkillStore,
    useMessageStore,
    useSiteConfigStore,
} from "../../store/index.js";
import { AdminStatsSkeleton } from "../ui/loading/index.js";

function StatCard({ icon, label, value, color, delay, to }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-dark-card border border-dark-border rounded-2xl p-5
        hover:border-accent-blue/30 transition-all duration-300 group"
        >
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                >
                    {icon}
                </div>
                {to && (
                    <Link
                        to={to}
                        className="opacity-0 group-hover:opacity-100 transition-opacity
              text-slate-500 hover:text-accent-blue"
                    >
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
            <div className="text-3xl font-bold grad-text mb-1">{value}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
}

function SectionToggle({ label, keyName, visible, onToggle }) {
    return (
        <div
            className="flex items-center justify-between py-3
      border-b border-dark-border last:border-0"
        >
            <span className="text-sm text-slate-300">{label}</span>
            <button
                onClick={() => onToggle(keyName, !visible)}
                className={`w-10 h-5 rounded-full transition-all duration-200 relative
          ${visible ? "bg-accent-blue" : "bg-dark-border"}`}
            >
                <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white
          transition-all duration-200
          ${visible ? "left-5" : "left-0.5"}`}
                />
            </button>
        </div>
    );
}

const SECTIONS = [
    { label: "Hero Section", key: "hero" },
    { label: "About Section", key: "about" },
    { label: "Skills Section", key: "skills" },
    { label: "Projects Section", key: "projects" },
    { label: "Experience Section", key: "experience" },
    { label: "Education Section", key: "education" },
    { label: "Certificates Section", key: "certificates" },
    { label: "GitHub Stats", key: "github" },
    { label: "LeetCode Stats", key: "leetcode" },
    { label: "Contact Section", key: "contact" },
];

export default function DashboardStats() {
    const { projects, fetch: fetchProjects } = useProjectStore();
    const { skills, fetch: fetchSkills } = useSkillStore();
    const { messages, unread, fetch: fetchMsgs } = useMessageStore();
    const { config, fetch: fetchConfig, update } = useSiteConfigStore();

    useEffect(() => {
        fetchProjects();
        fetchSkills();
        fetchMsgs();
        fetchConfig();
    }, []);

    const toggleSection = async (key, val) => {
        await update({ sections: { ...config?.sections, [key]: val } });
    };

    const stats = [
        {
            icon: <FolderKanban size={18} className="text-blue-400" />,
            label: "Projects",
            value: projects.length,
            color: "bg-blue-400/10",
            delay: 0,
            to: "/admin/projects",
        },
        {
            icon: <Zap size={18} className="text-purple-400" />,
            label: "Skills",
            value: skills.length,
            color: "bg-purple-400/10",
            delay: 0.05,
            to: "/admin/skills",
        },
        {
            icon: <MessageSquare size={18} className="text-amber-400" />,
            label: "Messages",
            value: messages.length,
            color: "bg-amber-400/10",
            delay: 0.1,
            to: "/admin/messages",
        },
        {
            icon: <Eye size={18} className="text-green-400" />,
            label: "Unread",
            value: unread,
            color: "bg-green-400/10",
            delay: 0.15,
        },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Dashboard</h2>
                <p className="text-sm text-slate-500">
                    Overview of your portfolio CMS
                </p>
            </div>

            {/* Stats — show skeleton while all stores are still loading */}
            {(useProjectStore.getState().loading || projects.length === 0 && skills.length === 0) ? (
                <AdminStatsSkeleton />
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section visibility */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-dark-card border border-dark-border rounded-2xl p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white text-sm">
                            Section Visibility
                        </h3>
                        <span className="text-xs text-slate-500">
                            Toggle to show/hide
                        </span>
                    </div>
                    {SECTIONS.map((s) => (
                        <SectionToggle
                            key={s.key}
                            label={s.label}
                            keyName={s.key}
                            visible={config?.sections?.[s.key] !== false}
                            onToggle={toggleSection}
                        />
                    ))}
                </motion.div>

                {/* Quick actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-dark-card border border-dark-border rounded-2xl p-5"
                >
                    <h3 className="font-bold text-white text-sm mb-4">
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            {
                                label: "Edit Hero",
                                to: "/admin/hero",
                                icon: <Settings size={16} />,
                            },
                            {
                                label: "Add Project",
                                to: "/admin/projects",
                                icon: <FolderKanban size={16} />,
                            },
                            {
                                label: "Add Skill",
                                to: "/admin/skills",
                                icon: <Zap size={16} />,
                            },
                            {
                                label: "Add Education",
                                to: "/admin/education",
                                icon: <GraduationCap size={16} />,
                            },
                            {
                                label: "Add Certificate",
                                to: "/admin/certs",
                                icon: <Award size={16} />,
                            },
                            {
                                label: "View Messages",
                                to: "/admin/messages",
                                icon: <MessageSquare size={16} />,
                            },
                        ].map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 p-3 rounded-xl
                  bg-dark-bg border border-dark-border
                  text-slate-400 hover:text-white hover:border-accent-blue/30
                  transition-all text-xs font-medium"
                            >
                                <span className="text-accent-blue">
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <a
                        href="/"
                        target="_blank"
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl
              bg-grad-main text-white font-semibold text-sm
              hover:shadow-glow-blue transition-all"
                    >
                        <Eye size={15} /> Preview Portfolio
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
