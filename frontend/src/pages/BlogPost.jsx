import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Clock,
    Eye,
    Calendar,
    Tag,
    Share2,
    ArrowLeft,
    ChevronRight,
    BookOpen,
    ExternalLink,
} from "lucide-react";
import { blogAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { useSiteConfigStore } from "../store/index.js";

// ── Helpers ───────────────────────────────────────────────────────────
function fmtDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// ── Breadcrumb ────────────────────────────────────────────────────────
function Breadcrumb({ title }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-6 flex-wrap">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight size={13} />
            <span className="text-slate-300 truncate max-w-xs">{title}</span>
        </nav>
    );
}

// ── Related post card ─────────────────────────────────────────────────
function RelatedCard({ post }) {
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="group flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-accent-blue/30 transition-all"
        >
            {post.featuredImage?.url && (
                <img
                    src={optimizeCloudinaryImage(post.featuredImage.url, 120)}
                    alt={post.title}
                    width={80}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                />
            )}
            <div className="min-w-0">
                <p className="text-xs text-accent-blue font-bold mb-1 flex items-center gap-1">
                    <Clock size={10} /> {post.readingTime} min read
                </p>
                <h3 className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors line-clamp-2">
                    {post.title}
                </h3>
            </div>
        </Link>
    );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { config, fetch: fetchConfig } = useSiteConfigStore();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!config) fetchConfig();
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        blogAPI
            .getPost(slug)
            .then(({ data }) => {
                setPost(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err?.response?.status === 404 ? "not-found" : "error");
                setLoading(false);
            });
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: post?.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ── Loading ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
                    <div className="h-4 w-48 bg-white/5 rounded mb-8" />
                    <div className="h-10 w-3/4 bg-white/5 rounded mb-4" />
                    <div className="h-5 w-1/3 bg-white/5 rounded mb-8" />
                    <div className="h-80 bg-white/5 rounded-2xl mb-8" />
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${90 - i * 5}%` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                    <div className="text-5xl mb-4">{error === "not-found" ? "📭" : "⚠️"}</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {error === "not-found" ? "Article not found" : "Something went wrong"}
                    </h1>
                    <p className="text-slate-400 mb-6">
                        {error === "not-found"
                            ? "This article may have been removed or the URL is incorrect."
                            : "Failed to load the article. Please try again."}
                    </p>
                    <Link
                        to="/blog"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                        <ArrowLeft size={15} /> Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const p = post;
    const pageUrl = `https://utkalbehera.com/blog/${p.slug}`;
    const ogImage = p.ogImage || p.featuredImage?.url || "https://utkalbehera.com/og-image.png";

    // JSON-LD BlogPosting schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: p.seoTitle || p.title,
        description: p.seoDescription || p.excerpt,
        image: ogImage,
        url: p.canonical || pageUrl,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt,
        author: {
            "@type": "Person",
            name: p.author || "Utkal Behera",
            url: "https://utkalbehera.com",
        },
        publisher: {
            "@type": "Person",
            name: "Utkal Behera",
            url: "https://utkalbehera.com",
        },
        wordCount: p.content?.replace(/<[^>]+>/g, " ").split(/\s+/).length,
        timeRequired: `PT${p.readingTime || 1}M`,
        ...(p.category && { articleSection: p.category.name }),
        ...(p.tags?.length && { keywords: p.tags.map((t) => t.name).join(", ") }),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://utkalbehera.com" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://utkalbehera.com/blog" },
            { "@type": "ListItem", position: 3, name: p.title, item: pageUrl },
        ],
    };

    return (
        <>
            <SEO
                title={`${p.seoTitle || p.title} | Utkal Behera`}
                description={p.seoDescription || p.excerpt || p.title}
                keywords={p.tags?.map((t) => t.name).join(", ")}
                image={ogImage}
                url={p.canonical || pageUrl}
                type="article"
                schema={[schema, breadcrumbSchema]}
            />

            <div className="min-h-screen bg-dark-bg text-slate-100">
                <Navbar />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24">
                    <Breadcrumb title={p.title} />

                    {/* ── HERO ──────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Category & meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            {p.category && (
                                <Link
                                    to={`/blog?category=${p.category.slug}`}
                                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
                                    style={{
                                        background: `${p.category.color}15`,
                                        color: p.category.color,
                                        border: `1px solid ${p.category.color}30`,
                                    }}
                                >
                                    <Tag size={10} /> {p.category.name}
                                </Link>
                            )}
                            <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                                <Calendar size={11} /> {fmtDate(p.publishedAt || p.createdAt)}
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                                <Clock size={11} /> {p.readingTime || 1} min read
                            </span>
                            {p.views > 0 && (
                                <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                                    <Eye size={11} /> {p.views} views
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                            {p.title}
                        </h1>

                        {/* Excerpt */}
                        {p.excerpt && (
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-3xl">
                                {p.excerpt}
                            </p>
                        )}

                        {/* Author + actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-dark-border">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue font-bold text-sm">
                                    {(p.author || "U").charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{p.author || "Utkal Behera"}</p>
                                    <p className="text-xs text-slate-500">Author</p>
                                </div>
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white text-xs font-semibold transition-all hover:border-white/20"
                                aria-label="Share this article"
                            >
                                <Share2 size={13} /> {copied ? "Copied!" : "Share"}
                            </button>
                        </div>

                        {/* Featured image */}
                        {p.featuredImage?.url && (
                            <div className="rounded-2xl overflow-hidden mb-10 border border-dark-border">
                                <img
                                    src={optimizeCloudinaryImage(p.featuredImage.url, 1200)}
                                    alt={p.title}
                                    width={1200}
                                    height={630}
                                    loading="eager"
                                    decoding="async"
                                    className="w-full object-cover max-h-[480px]"
                                />
                            </div>
                        )}
                    </motion.div>

                    {/* ── 2-COLUMN LAYOUT ──────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ── ARTICLE CONTENT ──────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            {/* Render rich HTML from CMS */}
                            <div
                                className="prose prose-invert prose-lg max-w-none
                                    prose-headings:text-white prose-headings:font-extrabold
                                    prose-p:text-slate-300 prose-p:leading-relaxed
                                    prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
                                    prose-strong:text-white
                                    prose-code:text-accent-blue prose-code:bg-accent-blue/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                                    prose-pre:bg-dark-card prose-pre:border prose-pre:border-dark-border prose-pre:rounded-xl
                                    prose-blockquote:border-l-accent-blue prose-blockquote:text-slate-400
                                    prose-img:rounded-xl prose-img:border prose-img:border-dark-border
                                    prose-li:text-slate-300
                                    prose-hr:border-dark-border"
                                dangerouslySetInnerHTML={{ __html: p.content }}
                            />

                            {/* Tags */}
                            {p.tags?.length > 0 && (
                                <div className="mt-10 pt-6 border-t border-dark-border">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {p.tags.map((tag) => (
                                            <Link
                                                key={tag._id}
                                                to={`/blog?tag=${tag.slug}`}
                                                className="px-3 py-1 rounded-lg bg-dark-card border border-dark-border text-slate-400 text-xs hover:text-white hover:border-white/20 transition-colors"
                                            >
                                                # {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Back to blog */}
                            <div className="mt-10 flex items-center gap-3">
                                <Link
                                    to="/blog"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all"
                                >
                                    <ArrowLeft size={14} /> All Articles
                                </Link>
                            </div>
                        </motion.div>

                        {/* ── SIDEBAR ───────────────────────────────── */}
                        <aside className="space-y-6">
                            {/* Quick info */}
                            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-3">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <BookOpen size={15} className="text-accent-blue" /> Article Info
                                </h3>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <p className="flex items-center justify-between">
                                        <span>Published</span>
                                        <span className="text-slate-300">{fmtDate(p.publishedAt || p.createdAt)}</span>
                                    </p>
                                    <p className="flex items-center justify-between">
                                        <span>Reading time</span>
                                        <span className="text-slate-300">{p.readingTime || 1} min</span>
                                    </p>
                                    {p.views > 0 && (
                                        <p className="flex items-center justify-between">
                                            <span>Views</span>
                                            <span className="text-slate-300">{p.views.toLocaleString()}</span>
                                        </p>
                                    )}
                                    {p.author && (
                                        <p className="flex items-center justify-between">
                                            <span>Author</span>
                                            <span className="text-slate-300">{p.author}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            {p.category && (
                                <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                                    <h3 className="text-sm font-bold text-white mb-3">Category</h3>
                                    <Link
                                        to={`/blog?category=${p.category.slug}`}
                                        className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                                        style={{ color: p.category.color }}
                                    >
                                        <Tag size={13} /> {p.category.name}
                                        <ExternalLink size={11} className="ml-auto" />
                                    </Link>
                                    {p.category.description && (
                                        <p className="text-xs text-slate-500 mt-2">{p.category.description}</p>
                                    )}
                                </div>
                            )}

                            {/* Share */}
                            <button
                                onClick={handleShare}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all"
                            >
                                <Share2 size={15} /> {copied ? "Link Copied!" : "Share Article"}
                            </button>
                        </aside>
                    </div>

                    {/* ── RELATED POSTS ────────────────────────────── */}
                    {p.relatedPosts?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="mt-16 pt-12 border-t border-dark-border"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <BookOpen size={17} className="text-accent-blue" /> Related Articles
                                <div className="flex-1 h-px bg-white/5" />
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {p.relatedPosts.map((related) => (
                                    <RelatedCard key={related._id} post={related} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                <Footer config={config} />
            </div>
        </>
    );
}
