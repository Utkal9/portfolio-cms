import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import SEO from "../components/seo/SEO.jsx";
import { blogAPI } from "../services/api.js";

export default function BlogListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        async function load() {
            try {
                const { data } = await blogAPI.getAll();
                if (active) setPosts(data.data || []);
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
    }, []);

    return (
        <>
            <SEO
                title="Blog | Utkal Behera"
                description="Engineering notes, product thinking, and developer insights from Utkal Behera."
                url="https://utkalbehera.com/blog"
            />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg px-6 py-24 text-slate-700 dark:text-slate-300">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-10">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent-blue">
                            Blog
                        </p>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-3">
                            Engineering notes and product thinking
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                            This section is CMS-managed so new articles can be
                            published without touching the codebase.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-48 rounded-3xl bg-slate-200 dark:bg-dark-card"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {posts.map((post) => (
                                <Link
                                    key={post._id}
                                    to={`/blog/${post.slug}`}
                                    className="rounded-3xl border border-slate-200/70 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 p-6 shadow-sm transition hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent-blue">
                                        <BookOpen size={14} />{" "}
                                        {post.category || "General"}
                                    </div>
                                    <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                                        {post.title}
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        {post.excerpt ||
                                            post.content?.slice(0, 180)}
                                    </p>
                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-blue">
                                        Read more <ArrowRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
