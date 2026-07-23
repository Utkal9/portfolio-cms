/**
 * Search.jsx — Cross-content instant search
 *
 * Searches across Projects and Blog Posts simultaneously.
 * Uses the URL query param ?q= so results are shareable / bookmarkable.
 * Client-side filtering on pre-fetched data → zero extra API round-trip.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search as SearchIcon,
    FolderKanban,
    BookOpen,
    Clock,
    Tag,
    ExternalLink,
    X,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { projectsAPI, blogAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { useSiteConfigStore } from "../store/index.js";
import { useAnalytics } from "../hooks/useAnalytics.js";

// ── Result card types ────────────────────────────────────────────────
function ProjectCard({ item, query }) {
    const slug = item.slug || item._id;
    const thumb = item.images?.[0]?.url;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
        >
            <Link
                to={`/projects/${slug}`}
                className="group flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border
                           hover:border-accent-blue/40 transition-all hover:-translate-y-0.5"
            >
                {/* Thumbnail */}
                <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-dark-bg border border-dark-border">
                    {thumb ? (
                        <img
                            src={optimizeCloudinaryImage(thumb, 128)}
                            alt={item.title}
                            width={64}
                            height={56}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <FolderKanban size={18} className="text-slate-600" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full border border-accent-blue/20">
                            Project
                        </span>
                        {item.category && (
                            <span className="text-[10px] text-slate-500">{item.category}</span>
                        )}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors truncate">
                        <Highlight text={item.title} query={query} />
                    </h3>
                    {item.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            <Highlight text={item.description} query={query} />
                        </p>
                    )}
                    {item.techStack?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1.5">
                            {item.techStack.slice(0, 4).map((t) => (
                                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-accent-blue transition-colors flex-shrink-0 self-center" />
            </Link>
        </motion.div>
    );
}

function BlogCard({ item, query }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
        >
            <Link
                to={`/blog/${item.slug}`}
                className="group flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border
                           hover:border-purple-500/40 transition-all hover:-translate-y-0.5"
            >
                {/* Thumbnail */}
                <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-dark-bg border border-dark-border">
                    {item.featuredImage?.url ? (
                        <img
                            src={optimizeCloudinaryImage(item.featuredImage.url, 128)}
                            alt={item.title}
                            width={64}
                            height={56}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={18} className="text-slate-600" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                            Article
                        </span>
                        {item.category && (
                            <span
                                className="text-[10px] font-semibold"
                                style={{ color: item.category.color }}
                            >
                                {item.category.name}
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto">
                            <Clock size={9} /> {item.readingTime || 1}m
                        </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                        <Highlight text={item.title} query={query} />
                    </h3>
                    {item.excerpt && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                            <Highlight text={item.excerpt} query={query} />
                        </p>
                    )}
                    {item.tags?.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-1.5">
                            {item.tags.slice(0, 4).map((t) => (
                                <span key={t._id || t} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">
                                    # {t.name || t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-purple-400 transition-colors flex-shrink-0 self-center" />
            </Link>
        </motion.div>
    );
}

// ── Highlight matching text ───────────────────────────────────────────
function Highlight({ text = "", query = "" }) {
    if (!query || !text) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((p, i) =>
        p.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-400/20 text-yellow-300 rounded px-0.5">
                {p}
            </mark>
        ) : p
    );
}

// ── Skeleton card ──────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border animate-pulse">
            <div className="w-16 h-14 rounded-xl bg-white/5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded" />
                <div className="h-4 bg-white/5 rounded" />
                <div className="h-3 w-3/4 bg-white/5 rounded" />
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// Main Search Page
// ═══════════════════════════════════════════════════════════════════════
export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { config, fetch: fetchConfig } = useSiteConfigStore();
    const { trackSearch } = useAnalytics();

    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [loading, setLoading] = useState(true);

    // All data (fetched once, filtered client-side for instant results)
    const [allProjects, setAllProjects] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [filter, setFilter] = useState("all"); // "all" | "projects" | "blog"

    const inputRef = useRef(null);

    // ── Pre-fetch all content once ────────────────────────────────────
    useEffect(() => {
        if (!config) fetchConfig();
        inputRef.current?.focus();

        Promise.all([
            projectsAPI.getAll().catch(() => ({ data: { data: [] } })),
            blogAPI.getPosts({ limit: 100 }).catch(() => ({ data: { data: [] } })),
        ]).then(([projRes, blogRes]) => {
            setAllProjects(projRes.data.data || []);
            setAllPosts(blogRes.data.data || []);
            setLoading(false);
        });
    }, []);

    // ── Sync ?q= param ────────────────────────────────────────────────
    const handleQueryChange = useCallback((val) => {
        setQuery(val);
        if (val.trim()) {
            setSearchParams({ q: val }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
        // Fire GA4 event after a short delay (debounce)
        if (val.trim().length > 2) {
            clearTimeout(window.__searchTrackTimer);
            window.__searchTrackTimer = setTimeout(() => {
                const projMatches = allProjects.filter((p) =>
                    [p.title, p.description, p.category, ...(p.techStack || [])]
                        .join(" ").toLowerCase().includes(val.toLowerCase())
                ).length;
                const postMatches = allPosts.filter((p) =>
                    [p.title, p.excerpt, p.category?.name]
                        .join(" ").toLowerCase().includes(val.toLowerCase())
                ).length;
                trackSearch(val, projMatches + postMatches);
            }, 1000);
        }
    }, [setSearchParams, allProjects, allPosts, trackSearch]);

    // ── Filter results ────────────────────────────────────────────────
    const q = query.trim().toLowerCase();

    const matchedProjects = q
        ? allProjects.filter((p) =>
              [p.title, p.description, p.tagline, p.category, ...(p.techStack || [])]
                  .join(" ")
                  .toLowerCase()
                  .includes(q)
          )
        : allProjects.slice(0, 6);

    const matchedPosts = q
        ? allPosts.filter((p) =>
              [p.title, p.excerpt, p.category?.name, ...(p.tags?.map((t) => t.name) || [])]
                  .join(" ")
                  .toLowerCase()
                  .includes(q)
          )
        : allPosts.slice(0, 6);

    const totalResults = matchedProjects.length + matchedPosts.length;

    const showProjects = filter === "all" || filter === "projects";
    const showBlog = filter === "all" || filter === "blog";

    return (
        <>
            <SEO
                title={`Search${q ? ` — "${q}"` : ""} | Utkal Behera`}
                description="Search across all projects and blog posts."
                url="https://utkalbehera.com/search"
            />

            <div className="min-h-screen bg-dark-bg text-slate-100">
                <Navbar />

                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24">

                    {/* ── SEARCH HEADER ─────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-extrabold text-white mb-2">Search</h1>
                        <p className="text-slate-400 text-sm mb-6">
                            Search across all projects and blog posts instantly.
                        </p>

                        {/* Search input */}
                        <div className="relative">
                            <SearchIcon
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                            />
                            <input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => handleQueryChange(e.target.value)}
                                placeholder="Search projects, articles, tech stack…"
                                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-dark-card border border-dark-border
                                           text-white text-base placeholder:text-slate-500
                                           focus:outline-none focus:border-accent-blue
                                           transition-colors shadow-lg"
                                aria-label="Search content"
                            />
                            {query && (
                                <button
                                    onClick={() => handleQueryChange("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
                                               bg-white/10 flex items-center justify-center text-slate-400
                                               hover:text-white transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Filter tabs */}
                        <div className="flex gap-2 mt-4">
                            {[
                                { id: "all", label: `All (${totalResults})` },
                                { id: "projects", label: `Projects (${matchedProjects.length})` },
                                { id: "blog", label: `Articles (${matchedPosts.length})` },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id)}
                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                                        filter === tab.id
                                            ? "bg-accent-blue text-white border-accent-blue"
                                            : "bg-dark-card text-slate-400 border-dark-border hover:border-accent-blue/40"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── LOADING ───────────────────────────────── */}
                    {loading && (
                        <div className="space-y-3">
                            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    )}

                    {/* ── RESULTS ───────────────────────────────── */}
                    {!loading && (
                        <AnimatePresence mode="popLayout">
                            <div className="space-y-8">
                                {/* No results */}
                                {totalResults === 0 && q && (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16"
                                    >
                                        <div className="text-4xl mb-4">🔍</div>
                                        <p className="text-slate-400 font-medium">
                                            No results for <span className="text-white">"{query}"</span>
                                        </p>
                                        <p className="text-slate-500 text-sm mt-1">
                                            Try a different keyword or browse below.
                                        </p>
                                    </motion.div>
                                )}

                                {/* Empty state — no query */}
                                {!q && totalResults === 0 && (
                                    <motion.div
                                        key="start"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16"
                                    >
                                        <SearchIcon size={40} className="mx-auto text-slate-700 mb-4" />
                                        <p className="text-slate-500">Start typing to search…</p>
                                    </motion.div>
                                )}

                                {/* Projects section */}
                                {showProjects && matchedProjects.length > 0 && (
                                    <motion.section key="projects" layout>
                                        <div className="flex items-center gap-3 mb-4">
                                            <FolderKanban size={15} className="text-accent-blue" />
                                            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                                                Projects
                                            </h2>
                                            <span className="text-xs text-slate-600">
                                                {matchedProjects.length} result{matchedProjects.length !== 1 ? "s" : ""}
                                            </span>
                                            <div className="flex-1 h-px bg-white/5" />
                                            <Link
                                                to="/#projects"
                                                className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                View all <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                        <div className="space-y-2">
                                            <AnimatePresence>
                                                {matchedProjects.map((p) => (
                                                    <ProjectCard key={p._id} item={p} query={q} />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </motion.section>
                                )}

                                {/* Blog section */}
                                {showBlog && matchedPosts.length > 0 && (
                                    <motion.section key="blog" layout>
                                        <div className="flex items-center gap-3 mb-4">
                                            <BookOpen size={15} className="text-purple-400" />
                                            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                                                Articles
                                            </h2>
                                            <span className="text-xs text-slate-600">
                                                {matchedPosts.length} result{matchedPosts.length !== 1 ? "s" : ""}
                                            </span>
                                            <div className="flex-1 h-px bg-white/5" />
                                            <Link
                                                to="/blog"
                                                className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                                            >
                                                View all <ExternalLink size={10} />
                                            </Link>
                                        </div>
                                        <div className="space-y-2">
                                            <AnimatePresence>
                                                {matchedPosts.map((p) => (
                                                    <BlogCard key={p._id} item={p} query={q} />
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </motion.section>
                                )}

                                {/* Browse suggestion when no query */}
                                {!q && (
                                    <motion.div
                                        key="browse"
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="pt-4 border-t border-dark-border"
                                    >
                                        <p className="text-xs text-slate-500 text-center mb-3">Or browse by section</p>
                                        <div className="flex gap-3 justify-center flex-wrap">
                                            <Link
                                                to="/#projects"
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all"
                                            >
                                                <FolderKanban size={13} /> All Projects
                                            </Link>
                                            <Link
                                                to="/blog"
                                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all"
                                            >
                                                <BookOpen size={13} /> All Articles
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </AnimatePresence>
                    )}
                </div>

                <Footer config={config} />
            </div>
        </>
    );
}
