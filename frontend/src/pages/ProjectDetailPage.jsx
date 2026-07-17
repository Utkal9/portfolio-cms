import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, Play, Share2 } from "lucide-react";
import { projectsAPI } from "../services/api.js";
import SEO from "../components/seo/SEO.jsx";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";

function Section({ title, children }) {
    return (
        <section className="rounded-2xl border border-slate-200/70 dark:border-dark-border bg-white/70 dark:bg-dark-card/70 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {title}
            </h2>
            <div className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                {children}
            </div>
        </section>
    );
}

export default function ProjectDetailPage() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                const { data } = await projectsAPI.getBySlug(slug);
                if (active) setProject(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                if (active) setLoading(false);
            }
        }
        load();
        return () => {
            active = false;
        };
    }, [slug]);

    const jsonLd = useMemo(
        () => ({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project?.title || "Project",
            description: project?.seoDescription || project?.description || "",
            url:
                project?.canonicalUrl ||
                `https://utkalbehera.com/projects/${project?.slug}`,
            author: {
                "@type": "Person",
                name: "Utkal Behera",
            },
        }),
        [project],
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-700 dark:text-slate-300 px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <div className="h-8 w-40 rounded bg-slate-200 dark:bg-dark-card mb-6" />
                    <div className="h-64 rounded-3xl bg-slate-200 dark:bg-dark-card" />
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Project not found
                    </h1>
                    <Link
                        to="/projects"
                        className="mt-4 inline-flex items-center text-accent-blue"
                    >
                        Back to projects
                    </Link>
                </div>
            </div>
        );
    }

    const shareUrl =
        project.canonicalUrl ||
        `https://utkalbehera.com/projects/${project.slug}`;

    return (
        <>
            <SEO
                title={project.seoTitle || project.title}
                description={project.seoDescription || project.description}
                keywords={project.seoKeywords || project.techStack?.join(", ")}
                url={shareUrl}
                type="article"
                image={
                    project.ogImage ||
                    project.images?.[0]?.url ||
                    "https://utkalbehera.com/og-image.png"
                }
                jsonLd={jsonLd}
            />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-slate-700 dark:text-slate-300">
                <div className="max-w-6xl mx-auto px-6 py-24">
                    <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 text-sm text-accent-blue mb-8"
                    >
                        <ArrowLeft size={16} /> Back to projects
                    </Link>

                    <div className="rounded-3xl overflow-hidden border border-slate-200/70 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 shadow-xl">
                        <div className="relative h-80 md:h-[28rem]">
                            <img
                                src={optimizeCloudinaryImage(
                                    project.images?.[0]?.url ||
                                        project.ogImage ||
                                        "",
                                    1600,
                                )}
                                alt={project.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-[0.25em] border border-white/20 mb-4">
                                    {project.category}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-white mb-3">
                                    {project.title}
                                </h1>
                                <p className="max-w-3xl text-sm md:text-base text-slate-200">
                                    {project.tagline || project.description}
                                </p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap gap-3 mb-8">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full bg-grad-main px-4 py-2 text-sm font-semibold text-white"
                                    >
                                        <ExternalLink size={14} /> Live Demo
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-dark-border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
                                    >
                                        <Github size={14} /> GitHub
                                    </a>
                                )}
                                {project.videoUrl && (
                                    <a
                                        href={project.videoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500"
                                    >
                                        <Play size={14} /> Watch Demo
                                    </a>
                                )}
                                <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-dark-border px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    <Share2 size={14} /> Share
                                </button>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
                                <div className="space-y-6">
                                    {project.problem && (
                                        <Section title="Problem Statement">
                                            <p>{project.problem}</p>
                                        </Section>
                                    )}
                                    {project.businessValue && (
                                        <Section title="Business Value">
                                            <p>{project.businessValue}</p>
                                        </Section>
                                    )}
                                    {project.architecture && (
                                        <Section title="Architecture">
                                            <p>{project.architecture}</p>
                                        </Section>
                                    )}
                                    {project.systemDesign && (
                                        <Section title="System Design">
                                            <p>{project.systemDesign}</p>
                                        </Section>
                                    )}
                                    {project.databaseDesign && (
                                        <Section title="Database Design">
                                            <p>{project.databaseDesign}</p>
                                        </Section>
                                    )}
                                    {project.apiFlow && (
                                        <Section title="API Flow">
                                            <p>{project.apiFlow}</p>
                                        </Section>
                                    )}
                                    {project.challenges && (
                                        <Section title="Challenges">
                                            <p>{project.challenges}</p>
                                        </Section>
                                    )}
                                    {project.lessons && (
                                        <Section title="Lessons Learned">
                                            <p>{project.lessons}</p>
                                        </Section>
                                    )}
                                    {project.performance && (
                                        <Section title="Performance">
                                            <p>{project.performance}</p>
                                        </Section>
                                    )}
                                    {project.security && (
                                        <Section title="Security">
                                            <p>{project.security}</p>
                                        </Section>
                                    )}
                                    {project.scalability && (
                                        <Section title="Scalability">
                                            <p>{project.scalability}</p>
                                        </Section>
                                    )}
                                    {project.roadmap && (
                                        <Section title="Future Roadmap">
                                            <p>{project.roadmap}</p>
                                        </Section>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <Section title="Tech Stack">
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full border border-accent-blue/20 bg-accent-blue/10 px-3 py-1 text-xs font-semibold text-accent-blue"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </Section>
                                    <Section title="Highlights">
                                        <ul className="space-y-2">
                                            {project.features?.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex gap-2"
                                                >
                                                    <span className="text-accent-blue">
                                                        •
                                                    </span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Section>
                                    <Section title="Media">
                                        <div className="space-y-3">
                                            {project.images
                                                ?.slice(1)
                                                .map((img) => (
                                                    <img
                                                        key={
                                                            img.publicId ||
                                                            img.url
                                                        }
                                                        src={optimizeCloudinaryImage(
                                                            img.url,
                                                            900,
                                                        )}
                                                        alt={project.title}
                                                        className="w-full rounded-xl object-cover"
                                                    />
                                                ))}
                                        </div>
                                    </Section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
