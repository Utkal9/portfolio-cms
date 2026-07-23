import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag as TagIcon, ArrowLeft, Clock, Calendar } from "lucide-react";
import { blogAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { useSiteConfigStore } from "../store/index.js";

function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

export default function TagPage() {
    const { slug } = useParams();
    const { config, fetch: fetchConfig } = useSiteConfigStore();

    const [posts, setPosts] = useState([]);
    const [tag, setTag]     = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage]   = useState(1);
    const [pagination, setPagination] = useState(null);
    const LIMIT = 12;

    useEffect(() => {
        if (!config) fetchConfig();
    }, []);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        // Resolve tag name from tags list
        blogAPI.getTags()
            .then(({ data }) => {
                const found = (data.data || []).find((t) => t.slug === slug);
                if (!cancelled) setTag(found || { name: slug, slug });
            })
            .catch(() => {});

        blogAPI.getPosts({ tag: slug, page, limit: LIMIT })
            .then(({ data }) => {
                if (cancelled) return;
                setPosts(data.data || []);
                setPagination(data.pagination);
                setLoading(false);
            })
            .catch(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [slug, page]);

    const tagColor = tag?.color || "#4F8EF7";

    return (
        <>
            <SEO
                title={`#${tag?.name || slug} — Blog | Utkal Behera`}
                description={`All articles tagged with "${tag?.name || slug}".`}
                url={`https://utkalbehera.com/blog/tag/${slug}`}
            />

            <div className="min-h-screen bg-dark-bg text-slate-100">
                <Navbar />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mb-10"
                    >
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft size={14} /> Back to Blog
                        </Link>

                        <div className="flex items-center gap-3 mb-2">
                            <span
                                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border"
                                style={{
                                    color: tagColor,
                                    borderColor: `${tagColor}40`,
                                    background: `${tagColor}12`,
                                }}
                            >
                                <TagIcon size={14} />
                                #{tag?.name || slug}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                            Articles tagged{" "}
                            <span style={{ color: tagColor }}>#{tag?.name || slug}</span>
                        </h1>
                        {pagination && (
                            <p className="text-slate-400 text-sm">
                                {pagination.total} article{pagination.total !== 1 ? "s" : ""} found
                            </p>
                        )}
                    </motion.div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-56 bg-white/5 rounded-2xl" />
                            ))}
                        </div>
                    )}

                    {/* Posts grid */}
                    {!loading && posts.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-5xl mb-4">🏷️</p>
                            <p className="text-xl font-bold text-white mb-2">No posts yet</p>
                            <p className="text-slate-400 mb-6">
                                No articles have been tagged with <strong>#{tag?.name || slug}</strong> yet.
                            </p>
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
                            >
                                <ArrowLeft size={14} /> Browse all posts
                            </Link>
                        </div>
                    )}

                    {!loading && posts.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, i) => (
                                <motion.article
                                    key={post._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.06 }}
                                    className="group bg-dark-card border border-dark-border rounded-2xl overflow-hidden
                                               hover:border-accent-blue/30 transition-all hover:-translate-y-1"
                                >
                                    {post.featuredImage?.url && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={optimizeCloudinaryImage(post.featuredImage.url, 600)}
                                                alt={post.title}
                                                loading="lazy"
                                                decoding="async"
                                                width={600}
                                                height={338}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-5">
                                        {post.category && (
                                            <span
                                                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3"
                                                style={{
                                                    color: post.category.color,
                                                    background: `${post.category.color}18`,
                                                    border: `1px solid ${post.category.color}35`,
                                                }}
                                            >
                                                {post.category.name}
                                            </span>
                                        )}
                                        <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                                            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-xs text-slate-400 line-clamp-2 mb-4">{post.excerpt}</p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-dark-border">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={10} /> {fmtDate(post.publishedAt)}
                                            </span>
                                            {post.readingTime && (
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} /> {post.readingTime} min
                                                </span>
                                            )}
                                            <Link
                                                to={`/blog/${post.slug}`}
                                                className="ml-auto text-accent-blue font-bold hover:underline"
                                            >
                                                Read →
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-12">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm
                                           hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                ← Prev
                            </button>
                            <span className="text-sm text-slate-400">
                                Page {page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm
                                           hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>

                <Footer config={config} />
            </div>
        </>
    );
}
