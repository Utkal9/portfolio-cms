import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import SEO from "../components/seo/SEO.jsx";
import { blogAPI } from "../services/api.js";

export default function BlogDetailPage() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                const { data } = await blogAPI.getBySlug(slug);
                if (active) setPost(data.data);
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
            "@type": "BlogPosting",
            headline: post?.title || "Blog",
            description: post?.seoDescription || post?.excerpt || "",
            image: post?.ogImage || "https://utkalbehera.com/og-image.png",
            author: {
                "@type": "Person",
                name: post?.author || "Utkal Behera",
            },
            datePublished:
                post?.publishedAt ||
                post?.createdAt ||
                new Date().toISOString(),
        }),
        [post],
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg px-6 py-24" />
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
                <Link to="/blog" className="text-accent-blue">
                    Back to blog
                </Link>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={post.seoTitle || post.title}
                description={post.seoDescription || post.excerpt}
                keywords={post.seoKeywords}
                url={`https://utkalbehera.com/blog/${post.slug}`}
                type="article"
                image={post.ogImage || "https://utkalbehera.com/og-image.png"}
                jsonLd={jsonLd}
            />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg px-6 py-24 text-slate-700 dark:text-slate-300">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-accent-blue mb-8"
                    >
                        <ArrowLeft size={16} /> Back to blog
                    </Link>
                    <article className="rounded-3xl border border-slate-200/70 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 p-8 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-blue">
                            {post.category || "General"}
                        </p>
                        <h1 className="mt-3 text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                            {post.title}
                        </h1>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            {post.excerpt}
                        </p>
                        <div
                            className="prose prose-invert mt-8 max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: post.content || "<p>Coming soon.</p>",
                            }}
                        />
                    </article>
                </div>
            </div>
        </>
    );
}
