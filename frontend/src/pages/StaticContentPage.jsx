import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SEO from "../components/seo/SEO.jsx";
import { configAPI } from "../services/api.js";

const DEFAULTS = {
    about: {
        title: "About",
        body: "I build modern web platforms with a strong focus on performance, CMS-driven content, and developer experience.",
    },
    contact: {
        title: "Contact",
        body: "Reach out for product engineering, developer platform work, or collaborations.",
    },
    privacy: {
        title: "Privacy Policy",
        body: "This site respects your privacy and uses minimal analytics for performance insights.",
    },
    terms: {
        title: "Terms",
        body: "Use of this site is subject to local laws and the stated terms of service.",
    },
};

export default function StaticContentPage({ slug: initialSlug }) {
    const { slug: routeSlug } = useParams();
    const [config, setConfig] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await configAPI.get();
                setConfig(data.data);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    const slug = initialSlug || routeSlug;

    const page = useMemo(() => {
        const key =
            slug === "privacy-policy"
                ? "privacy"
                : slug === "terms"
                  ? "terms"
                  : "about";
        const content =
            config?.pages?.[key] || config?.seo?.[key] || DEFAULTS[key];
        return content;
    }, [config, slug]);

    return (
        <>
            <SEO
                title={`${page.title} | Utkal Behera`}
                description={page.body}
                url={`https://utkalbehera.com/${slug}`}
            />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg px-6 py-24 text-slate-700 dark:text-slate-300">
                <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/70 dark:border-dark-border bg-white/80 dark:bg-dark-card/80 p-8 shadow-sm">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                        {page.title}
                    </h1>
                    <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {page.body}
                    </p>
                    <div className="mt-8">
                        <Link to="/" className="text-accent-blue font-semibold">
                            Return home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
