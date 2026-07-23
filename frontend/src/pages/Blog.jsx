import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Tag, Clock, Eye, ChevronRight, BookOpen, Calendar } from "lucide-react";
import { blogAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { useSiteConfigStore } from "../store/index.js";

// ── Format helpers ────────────────────────────────────────────────────
function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

// ── Blog card ─────────────────────────────────────────────────────────
function BlogCard({ post, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-accent-blue/30 transition-all hover:-translate-y-1"
        >
            {/* Featured image */}
            <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden bg-dark-bg">
                {post.featuredImage?.url ? (
                    <img
                        src={optimizeCloudinaryImage(post.featuredImage.url, 640)}
                        alt={post.title}
                        width={640}
                        height={360}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={40} className="text-slate-700" />
                    </div>
                )}
            </Link>

            <div className="p-5">
                {/* Category */}
                {post.category && (
                    <span
                        className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
                        style={{
                            background: `${post.category.color}20`,
                            color: post.category.color,
                            border: `1px solid ${post.category.color}40`,
                        }}
                    >
                        {post.category.name}
                    </span>
                )}

                {/* Title */}
                <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors leading-snug">
                        {post.title}
                    </h2>
                </Link>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                        {post.excerpt}
                    </p>
                )}

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-dark-border">
                    <span className="flex items-center gap-1">
                        <Calendar size={11} /> {fmtDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={11} /> {post.readingTime || 1} min
                    </span>
                    {post.views > 0 && (
                        <span className="flex items-center gap-1">
                            <Eye size={11} /> {post.views}
                        </span>
                    )}
                    <Link
                        to={`/blog/${post.slug}`}
                        className="ml-auto flex items-center gap-1 text-accent-blue hover:text-blue-400 font-semibold transition-colors"
                    >
                        Read <ChevronRight size={12} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

// ── Featured hero card ────────────────────────────────────────────────
function HeroCard({ post }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group relative rounded-3xl overflow-hidden bg-dark-card border border-dark-border hover:border-accent-blue/30 transition-all"
        >
            {post.featuredImage?.url && (
                <div className="absolute inset-0">
                    <img
                        src={optimizeCloudinaryImage(post.featuredImage.url, 1200)}
                        alt={post.title}
                        width={1200}
                        height={630}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent" />
                </div>
            )}
            <div className="relative p-8 md:p-12 min-h-[320px] flex flex-col justify-end">
                {post.category && (
                    <span
                        className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit"
                        style={{
                            background: `${post.category.color}20`,
                            color: post.category.color,
                            border: `1px solid ${post.category.color}40`,
                        }}
                    >
                        ✨ Featured · {post.category.name}
                    </span>
                )}
                <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 group-hover:text-accent-blue transition-colors leading-tight">
                        {post.title}
                    </h2>
                </Link>
                {post.excerpt && (
                    <p className="text-slate-300 mb-4 max-w-2xl line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={12} /> {fmtDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {post.readingTime || 1} min read
                    </span>
                    <Link
                        to={`/blog/${post.slug}`}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-blue-500 transition-colors"
                    >
                        Read Article <ChevronRight size={13} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function Blog() {
    const { config, fetch: fetchConfig } = useSiteConfigStore();

    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [searchDebounced, setSearchDebounced] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        let cancelled = false;
        if (!config) fetchConfig();
        blogAPI
            .getCategories()
            .then(({ data }) => {
                if (!cancelled) setCategories(data.data || []);
            })
            .catch(() => {}); // silently ignore on unmount
        return () => { cancelled = true; };
    }, []);

    // Debounce search input
    useEffect(() => {
        const t = setTimeout(() => setSearchDebounced(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    // Fetch posts when params change — guarded against unmount
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        let cancelled = false;
        try {
            const params = { page, limit: 9 };
            if (activeCategory) params.category = activeCategory;
            if (searchDebounced) params.q = searchDebounced;
            const { data } = await blogAPI.getPosts(params);
            if (!cancelled) {
                setPosts(data.data || []);
                setPagination(data.pagination);
            }
        } catch {
            if (!cancelled) setPosts([]);
        } finally {
            if (!cancelled) setLoading(false);
        }
        return () => { cancelled = true; };
    }, [page, activeCategory, searchDebounced]);

    useEffect(() => {
        setPage(1);
    }, [activeCategory, searchDebounced]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);


    const featured = posts[0];
    const rest = posts.slice(1);

    // JSON-LD for the blog listing page
    const schema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Utkal Behera's Blog",
        description: "Insights on full-stack development, system design, and software engineering.",
        url: "https://utkalbehera.com/blog",
        author: {
            "@type": "Person",
            name: "Utkal Behera",
            url: "https://utkalbehera.com",
        },
    };

    return (
        <>
            <SEO
                title="Blog | Utkal Behera — Full Stack Developer"
                description="Insights on full-stack development, React, Node.js, system design, and software engineering."
                keywords="Utkal Behera blog, full stack developer blog, React blog, Node.js tutorials"
                url="https://utkalbehera.com/blog"
                schema={schema}
            />

            <div className="min-h-screen bg-dark-bg text-slate-100">
                <Navbar />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-24">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 text-center"
                    >
                        <span className="inline-block text-xs font-bold uppercase tracking-widest text-accent-blue mb-3 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20">
                            Blog
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
                            Thoughts & Insights
                        </h1>
                        <p className="text-slate-400 max-w-xl mx-auto">
                            Deep dives into full-stack development, system design, and software engineering.
                        </p>
                    </motion.div>

                    {/* Search + Filter bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:border-accent-blue transition-colors"
                            />
                        </div>

                        {/* Category filter */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                                    !activeCategory
                                        ? "bg-accent-blue text-white border-accent-blue"
                                        : "bg-dark-card text-slate-400 border-dark-border hover:border-accent-blue/40"
                                }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => setActiveCategory(cat.slug)}
                                    className="px-3 py-2 rounded-xl text-xs font-bold border transition-all"
                                    style={
                                        activeCategory === cat.slug
                                            ? {
                                                  background: cat.color,
                                                  color: "#fff",
                                                  borderColor: cat.color,
                                              }
                                            : {
                                                  background: `${cat.color}10`,
                                                  color: cat.color,
                                                  borderColor: `${cat.color}30`,
                                              }
                                    }
                                >
                                    <span className="flex items-center gap-1">
                                        <Tag size={10} /> {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden animate-pulse">
                                    <div className="aspect-video bg-white/5" />
                                    <div className="p-5 space-y-2">
                                        <div className="h-3 w-20 bg-white/5 rounded" />
                                        <div className="h-4 bg-white/5 rounded" />
                                        <div className="h-4 w-4/5 bg-white/5 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && posts.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                            <p className="text-slate-500 text-lg">No articles yet.</p>
                            <p className="text-slate-600 text-sm mt-1">Check back soon for new posts!</p>
                        </div>
                    )}

                    {/* Featured hero post */}
                    {!loading && featured && !search && !activeCategory && page === 1 && (
                        <div className="mb-8">
                            <HeroCard post={featured} />
                        </div>
                    )}

                    {/* Post grid */}
                    {!loading && rest.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {(search || activeCategory || page > 1 ? posts : rest).map((post, i) => (
                                <BlogCard key={post._id} post={post} index={i} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-slate-500 text-sm">
                                {page} / {pagination.pages}
                            </span>
                            <button
                                disabled={page === pagination.pages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                <Footer config={config} />
            </div>
        </>
    );
}
