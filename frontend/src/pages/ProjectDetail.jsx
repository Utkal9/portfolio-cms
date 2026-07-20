import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ExternalLink,
    Github,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Tag,
    CheckCircle,
    AlertTriangle,
    Lightbulb,
    BarChart2,
    Code2,
    Layers,
    ChevronRight,
    Play,
    Share2,
} from "lucide-react";
import { projectsAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { optimizeCloudinaryImage, cloudinarySrcSet } from "../utils/cloudinary.js";
import { useSiteConfigStore } from "../store/index.js";

// ── Fade-in section wrapper ───────────────────────────────────────────
function Section({ children, className = "" }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.section>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue flex-shrink-0">
                <Icon size={17} />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <div className="flex-1 h-px bg-white/5" />
        </div>
    );
}

// ── Tech badge ────────────────────────────────────────────────────────
function TechBadge({ tech }) {
    return (
        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent-blue/10 text-accent-blue border border-accent-blue/20">
            {tech}
        </span>
    );
}

// ── Breadcrumb ────────────────────────────────────────────────────────
function Breadcrumb({ title }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} />
            <Link to="/#projects" className="hover:text-white transition-colors">Projects</Link>
            <ChevronRight size={13} />
            <span className="text-slate-300 truncate max-w-xs">{title}</span>
        </nav>
    );
}

// ── Related project card ──────────────────────────────────────────────
function RelatedCard({ project }) {
    const slug = project.slug || project._id;
    return (
        <Link
            to={`/projects/${slug}`}
            className="group flex gap-4 p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-accent-blue/30 transition-all"
        >
            {project.images?.[0]?.url && (
                <img
                    src={optimizeCloudinaryImage(project.images[0].url, 120)}
                    alt={project.title}
                    width={80}
                    height={60}
                    loading="lazy"
                    decoding="async"
                    className="w-20 h-16 object-cover rounded-xl flex-shrink-0"
                />
            )}
            <div className="min-w-0">
                <p className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-1">{project.category}</p>
                <h3 className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors truncate">
                    {project.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {project.tagline || project.description}
                </p>
            </div>
        </Link>
    );
}

// ── Main page ─────────────────────────────────────────────────────────
export default function ProjectDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { config, fetch: fetchConfig } = useSiteConfigStore();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!config) fetchConfig();
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setActiveImage(0);

        projectsAPI
            .getBySlug(slug)
            .then(({ data }) => {
                setProject(data.data);
                setLoading(false);
            })
            .catch((err) => {
                if (err?.response?.status === 404) {
                    setError("not-found");
                } else {
                    setError("error");
                }
                setLoading(false);
            });
    }, [slug]);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: project?.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ── Loading state ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-20 animate-pulse">
                    <div className="h-4 w-48 bg-white/5 rounded mb-8" />
                    <div className="h-10 w-3/4 bg-white/5 rounded mb-4" />
                    <div className="h-5 w-1/2 bg-white/5 rounded mb-8" />
                    <div className="h-80 bg-white/5 rounded-2xl mb-8" />
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${90 - i * 10}%` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Error / not found ────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-dark-bg flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                    <div className="text-5xl mb-4">{error === "not-found" ? "🔍" : "⚠️"}</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {error === "not-found" ? "Project not found" : "Something went wrong"}
                    </h1>
                    <p className="text-slate-400 mb-6">
                        {error === "not-found"
                            ? "This project doesn't exist or may have been removed."
                            : "Failed to load the project. Please try again."}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-blue-500 transition-colors"
                    >
                        <ArrowLeft size={15} /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const p = project;
    const pageUrl = `https://utkalbehera.com/projects/${p.slug || slug}`;

    // JSON-LD SoftwareApplication schema
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: p.title,
        description: p.tagline || p.description,
        url: p.liveUrl || pageUrl,
        applicationCategory: "WebApplication",
        operatingSystem: "Web",
        author: {
            "@type": "Person",
            name: "Utkal Behera",
            url: "https://utkalbehera.com",
        },
        ...(p.githubUrl && { codeRepository: p.githubUrl }),
        ...(p.images?.[0]?.url && { screenshot: p.images[0].url }),
        keywords: p.techStack?.join(", "),
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    };

    // BreadcrumbList schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://utkalbehera.com" },
            { "@type": "ListItem", position: 2, name: "Projects", item: "https://utkalbehera.com/#projects" },
            { "@type": "ListItem", position: 3, name: p.title, item: pageUrl },
        ],
    };

    return (
        <>
            <SEO
                title={`${p.title} | Utkal Behera`}
                description={p.tagline || p.description}
                keywords={`${p.title}, ${p.techStack?.join(", ")}, Utkal Behera, portfolio project`}
                image={p.images?.[0]?.url || "https://utkalbehera.com/og-image.png"}
                url={pageUrl}
                type="article"
                schema={[schema, breadcrumbSchema]}
            />

            <div className="min-h-screen bg-dark-bg text-slate-100">
                <Navbar />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24">
                    <Breadcrumb title={p.title} />

                    {/* ── HERO ─────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Category + date */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-bold uppercase tracking-wider">
                                <Tag size={11} /> {p.category}
                            </span>
                            {(p.startDate || p.endDate) && (
                                <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                                    <Calendar size={11} />
                                    {p.startDate}{p.endDate && p.endDate !== p.startDate ? ` – ${p.endDate}` : ""}
                                </span>
                            )}
                            {p.featured && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/25 text-amber-300 text-xs font-bold">
                                    ⭐ Featured
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
                            {p.title}
                        </h1>

                        {/* Tagline */}
                        {p.tagline && (
                            <p className="text-lg text-slate-300 mb-6 leading-relaxed max-w-3xl">
                                {p.tagline}
                            </p>
                        )}

                        {/* CTA buttons */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {p.liveUrl && (
                                <a
                                    href={p.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-semibold hover:bg-blue-500 transition-all shadow-glow-blue"
                                >
                                    <ExternalLink size={15} /> Live Demo
                                </a>
                            )}
                            {p.githubUrl && (
                                <a
                                    href={p.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
                                >
                                    <Github size={15} /> View Code
                                </a>
                            )}
                            {p.videoUrl && (
                                <a
                                    href={p.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-sm font-semibold transition-all border border-red-500/20"
                                >
                                    <Play size={15} fill="currentColor" /> Watch Demo
                                </a>
                            )}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-semibold transition-all border border-white/10"
                                aria-label="Share this project"
                            >
                                <Share2 size={15} />
                                {copied ? "Copied!" : "Share"}
                            </button>
                        </div>

                        {/* Hero image gallery */}
                        {p.images?.length > 0 && (
                            <div className="mb-12">
                                <div className="relative rounded-2xl overflow-hidden bg-dark-card border border-dark-border aspect-video">
                                    <img
                                        key={activeImage}
                                        src={optimizeCloudinaryImage(p.images[activeImage]?.url, 1200)}
                                        srcSet={cloudinarySrcSet(p.images[activeImage]?.url)}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 960px"
                                        alt={`${p.title} screenshot ${activeImage + 1}`}
                                        width={1200}
                                        height={675}
                                        loading="eager"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Thumbnail strip */}
                                {p.images.length > 1 && (
                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                                        {p.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveImage(i)}
                                                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                                    i === activeImage ? "border-accent-blue" : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                                aria-label={`View screenshot ${i + 1}`}
                                            >
                                                <img
                                                    src={optimizeCloudinaryImage(img.url, 120)}
                                                    alt=""
                                                    width={64}
                                                    height={48}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* ── 2-COLUMN LAYOUT ──────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ── MAIN CONTENT ─────────────────────────── */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Overview */}
                            {(p.overview || p.description) && (
                                <Section>
                                    <SectionTitle icon={Layers} title="Overview" />
                                    <p className="text-slate-300 leading-relaxed">
                                        {p.overview || p.description}
                                    </p>
                                </Section>
                            )}

                            {/* Problem → Solution */}
                            {p.problem && (
                                <Section>
                                    <SectionTitle icon={AlertTriangle} title="Problem & Solution" />
                                    <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                                        <p className="text-slate-300 leading-relaxed">{p.problem}</p>
                                    </div>
                                </Section>
                            )}

                            {/* Key Features */}
                            {p.features?.length > 0 && (
                                <Section>
                                    <SectionTitle icon={CheckCircle} title="Key Features" />
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {p.features.map((feat, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-3 p-4 rounded-xl bg-dark-card border border-dark-border"
                                            >
                                                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-slate-300 text-sm">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Section>
                            )}

                            {/* Architecture */}
                            {p.architecture && (
                                <Section>
                                    <SectionTitle icon={Code2} title="Architecture & Design" />
                                    <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{p.architecture}</p>
                                    </div>
                                </Section>
                            )}

                            {/* Challenges */}
                            {p.challenges && (
                                <Section>
                                    <SectionTitle icon={AlertTriangle} title="Challenges Faced" />
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{p.challenges}</p>
                                </Section>
                            )}

                            {/* Learnings */}
                            {p.learnings && (
                                <Section>
                                    <SectionTitle icon={Lightbulb} title="Key Learnings" />
                                    <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-line">{p.learnings}</p>
                                    </div>
                                </Section>
                            )}

                            {/* Metrics */}
                            {p.metrics && (
                                <Section>
                                    <SectionTitle icon={BarChart2} title="Impact & Metrics" />
                                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{p.metrics}</p>
                                </Section>
                            )}
                        </div>

                        {/* ── SIDEBAR ───────────────────────────────── */}
                        <aside className="space-y-6">
                            {/* Tech Stack */}
                            {p.techStack?.length > 0 && (
                                <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                        <Code2 size={15} className="text-accent-blue" /> Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {p.techStack.map((t, i) => (
                                            <TechBadge key={i} tech={t} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links */}
                            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border space-y-3">
                                <h3 className="text-sm font-bold text-white mb-4">Quick Links</h3>
                                {p.liveUrl && (
                                    <a
                                        href={p.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-medium hover:bg-accent-blue/20 transition-colors"
                                    >
                                        <ExternalLink size={15} /> Live Demo
                                    </a>
                                )}
                                {p.githubUrl && (
                                    <a
                                        href={p.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-colors"
                                    >
                                        <Github size={15} /> Source Code
                                    </a>
                                )}
                                {p.videoUrl && (
                                    <a
                                        href={p.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/15 transition-colors"
                                    >
                                        <Play size={15} /> Demo Video
                                    </a>
                                )}
                            </div>

                            {/* Timeline */}
                            {(p.startDate || p.endDate) && (
                                <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                        <Calendar size={15} className="text-accent-blue" /> Timeline
                                    </h3>
                                    <p className="text-slate-400 text-sm">
                                        {p.startDate}{p.endDate ? ` → ${p.endDate}` : " → Present"}
                                    </p>
                                </div>
                            )}

                            {/* Back to projects */}
                            <Link
                                to="/#projects"
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-slate-400 text-sm hover:text-white hover:border-white/20 transition-all"
                            >
                                <ArrowLeft size={15} /> All Projects
                            </Link>
                        </aside>
                    </div>

                    {/* ── RELATED PROJECTS ─────────────────────────── */}
                    {p.relatedProjects?.length > 0 && (
                        <Section className="mt-16 pt-12 border-t border-dark-border">
                            <SectionTitle icon={ArrowRight} title="Related Projects" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {p.relatedProjects.map((related) => (
                                    <RelatedCard key={related._id} project={related} />
                                ))}
                            </div>
                        </Section>
                    )}
                </div>

                <Footer config={config} />
            </div>
        </>
    );
}
