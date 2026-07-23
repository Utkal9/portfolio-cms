import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ExternalLink,
    Github,
    Play,
    Star,
    Volume2,
    VolumeX,
    X,
    Code2,
    ArrowRight,
} from "lucide-react";
import { useProjectStore } from "../store/index.js";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { useAnalytics } from "../hooks/useAnalytics.js";
function getEmbedUrl(url, muted = true) {
    if (!url) return null;
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (yt)
        return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${yt[1]}&controls=1`;
    const loom = url.match(/loom\.com\/share\/([^?&]+)/);
    if (loom) return `https://www.loom.com/embed/${loom[1]}?autoplay=1`;
    const vimeo = url.match(/vimeo\.com\/(\d+)/);
    if (vimeo)
        return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&muted=${muted ? 1 : 0}`;
    return url;
}

function getYoutubeThumbnail(url) {
    const m = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

// ── Stats bar ─────────────────────────────────────────────────────────
function StatsBar({ projects }) {
    const live = projects.filter((p) => p.liveUrl).length;
    const vids = projects.filter(
        (p) => p.videoUrl && p.videoUrl.trim() !== "",
    ).length;
    const techs = new Set(projects.flatMap((p) => p.techStack || [])).size;
    return (
        <div className="flex gap-8 justify-center mb-10 flex-wrap">
            {[
                { n: projects.length, l: "Projects" },
                { n: `${techs}+`, l: "Technologies" },
                { n: live, l: "Live Apps" },
                { n: vids, l: "With Demo" },
            ].map((s, i) => (
                <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="text-center"
                >
                    <div className="text-2xl font-extrabold grad-text">
                        {s.n}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                        {s.l}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ── Project card ──────────────────────────────────────────────────────
function ProjectCard({ project, onClick, index }) {
    const thumb =
        getYoutubeThumbnail(project.videoUrl) || project.images?.[0]?.url;
    const hasVideo = project.videoUrl && project.videoUrl.trim() !== "";

    const gradients = [
        "from-blue-100 to-indigo-100 dark:from-blue-950/60 dark:to-indigo-950/60",
        "from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/60",
        "from-violet-100 to-purple-100 dark:from-violet-950/60 dark:to-purple-950/60",
        "from-rose-100 to-pink-100 dark:from-rose-950/60 dark:to-pink-950/60",
        "from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/60",
        "from-cyan-100 to-sky-100 dark:from-cyan-950/60 dark:to-sky-950/60",
    ];
    const grad = gradients[index % gradients.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="cursor-pointer group rounded-2xl overflow-hidden
        bg-white dark:bg-dark-card
        border border-slate-200 dark:border-dark-border
        hover:border-accent-blue/50 dark:hover:border-accent-blue/40
        shadow-sm dark:shadow-none
        hover:shadow-xl dark:hover:shadow-glow-blue/10
        transition-all duration-300"
        >
            {/* Image */}
            <div
                className={`relative h-48 bg-gradient-to-br ${grad}
        flex items-center justify-center overflow-hidden`}
            >
                {thumb ? (
                    <img
                        src={optimizeCloudinaryImage(thumb, 900)}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width={900}
                        height={480}
                        className="absolute inset-0 w-full h-full object-cover opacity-70
              group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                    />
                ) : (
                    <span
                        className="text-6xl opacity-30 group-hover:scale-110
            transition-transform duration-300 z-10"
                    >
                        💼
                    </span>
                )}
                <div
                    className="absolute inset-0 bg-gradient-to-t
          from-white/90 dark:from-dark-card/95 via-transparent to-transparent"
                />

                {/* Badges */}
                {project.featured && (
                    <div
                        className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1
            rounded-full bg-amber-400/20 border border-amber-400/30
            text-amber-600 dark:text-amber-300 text-[9px] font-bold z-10"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Featured
                    </div>
                )}
                {project.liveUrl && (
                    <div
                        className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
            rounded-full bg-green-500/10 border border-green-500/25
            text-green-600 dark:text-green-400 text-[9px] font-bold z-10"
                    >
                        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                        Live
                    </div>
                )}
                <span
                    className="absolute bottom-3 left-3 text-[9px] px-2 py-0.5
          rounded-full bg-black/20 dark:bg-black/50 backdrop-blur-sm
          text-slate-700 dark:text-slate-300 border border-white/20 z-10"
                >
                    {project.category}
                </span>
                {hasVideo && (
                    <div
                        className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1
            rounded-full bg-red-500/80 text-white text-[9px] font-bold z-10"
                    >
                        <Play size={9} fill="white" /> Demo
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="text-[9px] font-bold tracking-wider text-accent-blue uppercase mb-1.5">
                    {project.category}
                    {project.startDate &&
                        ` · ${project.startDate}${project.endDate ? ` – ${project.endDate}` : ""}`}
                </div>

                <h3
                    className="font-extrabold text-slate-900 dark:text-white text-base
          leading-tight mb-2 group-hover:text-accent-blue transition-colors"
                >
                    {project.title}
                </h3>

                <p
                    className="text-xs text-slate-500 dark:text-slate-400
          leading-relaxed mb-4 line-clamp-2"
                >
                    {project.tagline || project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack?.slice(0, 4).map((t) => (
                        <span
                            key={t}
                            className="tech-pill text-[10px] px-2.5 py-1"
                        >
                            {t}
                        </span>
                    ))}
                    {project.techStack?.length > 4 && (
                        <span className="tech-pill text-[10px] px-2.5 py-1">
                            +{project.techStack.length - 4}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-dark-border">
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                bg-accent-blue/10 text-accent-blue border border-accent-blue/20
                text-[11px] font-bold hover:bg-accent-blue/20 transition-colors"
                        >
                            <ExternalLink size={11} /> Demo
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border
                text-slate-500 dark:text-slate-400 text-[11px] font-bold
                hover:text-accent-blue hover:border-accent-blue/30 transition-colors"
                        >
                            <Github size={11} /> Code
                        </a>
                    )}
                    {/* Details page link — navigates to /projects/:slug */}
                    <Link
                        to={`/projects/${project.slug || project._id}`}
                        onClick={(e) => { e.stopPropagation(); trackProjectClick(project); }}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl
                bg-white/5 border border-white/10 text-slate-400
                text-[11px] font-bold hover:text-white hover:border-white/20
                transition-colors"
                        title="View project details"
                    >
                        <ArrowRight size={11} />
                    </Link>
                    {hasVideo && (
                        <button
                            onClick={onClick}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl
                bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400
                text-[11px] font-bold hover:bg-red-500/20 transition-colors"
                        >
                            <Play size={11} fill="currentColor" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── Case study modal ──────────────────────────────────────────────────
function ProjectModal({ project, onClose }) {
    const hasVideo = project.videoUrl && project.videoUrl.trim() !== "";
    const [muted, setMuted] = useState(false);
    const [tab, setTab] = useState(hasVideo ? "video" : "details");

    const embedUrl = hasVideo ? getEmbedUrl(project.videoUrl, muted) : null;
    const thumb =
        getYoutubeThumbnail(project.videoUrl) || project.images?.[0]?.url;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const h = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", h);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", h);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                    className="relative z-10 w-full max-w-2xl bg-white dark:bg-dark-card
            rounded-3xl border border-slate-200 dark:border-dark-border
            shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full
              bg-black/20 dark:bg-black/50 flex items-center justify-center
              text-white hover:bg-black/40 transition-colors"
                    >
                        <X size={14} />
                    </button>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 dark:border-dark-border flex-shrink-0">
                        {[
                            ...(hasVideo
                                ? [{ id: "video", label: "▶  Demo Video" }]
                                : []),
                            { id: "details", label: "📋  Case Study" },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider
                  transition-colors
                  ${
                      tab === t.id
                          ? "text-accent-blue border-b-2 border-accent-blue bg-accent-blue/5"
                          : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {/* Video tab */}
                        {tab === "video" && embedUrl && (
                            <div className="relative bg-black">
                                <div
                                    style={{
                                        paddingBottom: "56.25%",
                                        position: "relative",
                                    }}
                                >
                                    <iframe
                                        src={embedUrl}
                                        className="absolute inset-0 w-full h-full"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                        frameBorder="0"
                                        title={`${project.title} demo`}
                                    />
                                </div>
                                <button
                                    onClick={() => setMuted((v) => !v)}
                                    className="absolute top-3 left-3 flex items-center gap-1.5
                    px-3 py-1.5 rounded-lg bg-black/60 text-white text-xs
                    hover:bg-black/80 transition-colors"
                                >
                                    {muted ? (
                                        <>
                                            <VolumeX size={12} /> Unmute
                                        </>
                                    ) : (
                                        <>
                                            <Volume2 size={12} /> Mute
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Details tab */}
                        {tab === "details" && (
                            <>
                                {/* Hero image */}
                                <div
                                    className="h-48 relative overflow-hidden flex items-center justify-center
                  bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-dark-card dark:to-dark-bg2"
                                >
                                    {thumb && (
                                        <img
                                            src={optimizeCloudinaryImage(
                                                thumb,
                                                1200,
                                            )}
                                            alt={project.title}
                                            loading="lazy"
                                            decoding="async"
                                            width={1200}
                                            height={480}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                                        />
                                    )}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t
                    from-white dark:from-dark-card via-transparent to-transparent"
                                    />
                                    {!thumb && (
                                        <span className="text-6xl opacity-20">
                                            💼
                                        </span>
                                    )}
                                    {project.featured && (
                                        <div
                                            className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5
                      rounded-full bg-amber-400/20 border border-amber-400/30
                      text-amber-600 dark:text-amber-300 text-xs font-bold"
                                        >
                                            <Star
                                                size={10}
                                                fill="currentColor"
                                            />{" "}
                                            Featured
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    {/* Category + dates */}
                                    <div className="text-[10px] font-bold tracking-wider text-accent-blue uppercase mb-2">
                                        {project.category}
                                        {project.startDate &&
                                            ` · ${project.startDate}${project.endDate ? ` – ${project.endDate}` : ""}`}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight">
                                        {project.title}
                                    </h3>

                                    {/* Tagline */}
                                    {project.tagline && (
                                        <p
                                            className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4
                      pl-3 border-l-2 border-accent-blue font-medium"
                                        >
                                            {project.tagline}
                                        </p>
                                    )}

                                    {/* Problem → Solution */}
                                    {project.problem && (
                                        <div
                                            className="bg-accent-blue/5 dark:bg-accent-blue/8
                      border border-accent-blue/15 rounded-xl p-4 mb-4"
                                        >
                                            <div
                                                className="text-[9px] font-bold text-accent-blue uppercase
                        tracking-wider mb-2"
                                            >
                                                💡 Problem → Solution
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {project.problem}
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {project.description && (
                                        <p
                                            className="text-sm text-slate-500 dark:text-slate-400
                      leading-relaxed mb-5"
                                        >
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Features */}
                                    {project.features?.length > 0 && (
                                        <div className="mb-5">
                                            <div
                                                className="text-[9px] font-bold text-slate-400 uppercase
                        tracking-wider mb-3"
                                            >
                                                ✨ Key Features
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {project.features.map(
                                                    (f, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex items-center gap-2
                            text-xs text-slate-600 dark:text-slate-400"
                                                        >
                                                            <span
                                                                className="text-green-500 dark:text-green-400
                              font-bold text-[11px] flex-shrink-0"
                                                            >
                                                                ✓
                                                            </span>
                                                            {f}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tech stack */}
                                    <div className="mb-2">
                                        <div
                                            className="text-[9px] font-bold text-slate-400 uppercase
                      tracking-wider mb-3"
                                        >
                                            🧰 Tech Stack
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.map((t) => (
                                                <span
                                                    key={t}
                                                    className="tech-pill"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div className="flex gap-3 p-4 border-t border-slate-100 dark:border-dark-border flex-shrink-0">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                  bg-grad-main text-white font-bold text-sm
                  hover:shadow-glow-blue transition-all"
                            >
                                <ExternalLink size={14} /> Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                  border border-slate-200 dark:border-dark-border
                  text-slate-700 dark:text-slate-300 font-bold text-sm
                  hover:border-accent-blue/50 hover:text-accent-blue transition-all"
                            >
                                <Github size={14} /> GitHub
                            </a>
                        )}
                        {hasVideo && tab !== "video" && (
                            <button
                                onClick={() => setTab("video")}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl
                  bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400
                  font-bold text-sm hover:bg-red-500/20 transition-all"
                            >
                                <Play size={13} fill="currentColor" /> Watch
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

const FILTERS = ["All", "Web", "Mobile", "AI/ML", "DevOps"];

export default function ProjectGrid() {
    const { projects, fetch, loading } = useProjectStore();
    const { trackProjectClick } = useAnalytics();
    const [filter, setFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch();
    }, []);

    const sorted = [...projects].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order ?? 0) - (b.order ?? 0);
    });

    const filtered =
        filter === "All" ? sorted : sorted.filter((p) => p.category === filter);

    return (
        <section id="projects" className="py-20">
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-3 block">
                        Projects
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Things I've <span className="grad-text">Built</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2 text-sm">
                        Click any card to see full case study — problem,
                        solution, features & demo
                    </p>
                </motion.div>

                {!loading && projects.length > 0 && (
                    <StatsBar projects={projects} />
                )}

                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {FILTERS.map((f) => (
                        <motion.button
                            key={f}
                            onClick={() => setFilter(f)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${
                    filter === f
                        ? "bg-grad-main text-white shadow-glow-blue"
                        : "bg-white dark:bg-dark-card2 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:text-accent-blue hover:border-accent-blue/30"
                }`}
                        >
                            {f}
                        </motion.button>
                    ))}
                </div>

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array(3)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="skeleton h-80 rounded-2xl"
                                />
                            ))}
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filtered.map((p, i) => (
                                <ProjectCard
                                    key={p._id}
                                    project={p}
                                    index={i}
                                    onClick={() => setSelected(p)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <Code2 size={40} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm">No projects in this category</p>
                    </div>
                )}
            </div>

            {selected && (
                <ProjectModal
                    project={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    );
}
