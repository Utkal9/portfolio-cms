import { useEffect, useState, lazy, Suspense } from "react";
import { useSiteConfigStore } from "../store/index.js";
import SEO from "../components/seo/SEO";
import { SectionSkeleton } from "../components/ui/Skeleton.jsx";
import ErrorBoundary from "../components/ui/ErrorBoundary.jsx";

// ── Always-loaded sections (above the fold / lightweight) ─────────────
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";

// ── Lazy-loaded sections (below the fold / heavy) ─────────────────────
// These are only downloaded when the browser reaches them.
// Three.js (CinematicIntro) and chart-heavy components are excluded from
// the main bundle, significantly reducing initial load time.
const About = lazy(() => import("../components/About.jsx"));
const SkillSection = lazy(() => import("../components/SkillSection.jsx"));
const ProjectGrid = lazy(() => import("../components/ProjectGrid.jsx"));
const ExperienceTimeline = lazy(() =>
    import("../components/ExperienceTimeline.jsx"),
);
const Certifications = lazy(() => import("../components/Certifications.jsx"));
const Education = lazy(() => import("../components/Education.jsx"));
const ContactSection = lazy(() => import("../components/ContactSection.jsx"));
const GithubStats = lazy(() => import("../components/GithubStats.jsx"));
const LeetcodeStats = lazy(() => import("../components/LeetcodeStats.jsx"));
const CinematicIntro = lazy(() =>
    import("../components/CinematicIntro.jsx"),
);

// ── Section map — keys match siteConfig.sections / sectionOrder ────────
const SECTION_MAP = {
    hero: Hero,           // not lazy — above the fold
    about: About,
    skills: SkillSection,
    projects: ProjectGrid,
    experience: ExperienceTimeline,
    education: Education,
    certificates: Certifications,
    github: GithubStats,
    leetcode: LeetcodeStats,
    contact: ContactSection,
};

// Non-lazy sections that should not be wrapped in Suspense
const EAGER_SECTIONS = new Set(["hero"]);

function applyTheme(config) {
    if (!config?.theme) return;
    const root = document.documentElement;
    if (config.theme.primaryColor) {
        root.style.setProperty("--accent-blue", config.theme.primaryColor);
    }
    if (config.theme.accentColor) {
        root.style.setProperty("--accent-purple", config.theme.accentColor);
    }
    const p = config.theme.primaryColor || "#4f8ef7";
    const a = config.theme.accentColor || "#8b5cf6";
    root.style.setProperty("--grad", `linear-gradient(135deg, ${p}, ${a})`);
}

export default function Portfolio() {
    const { config, fetch } = useSiteConfigStore();

    // Show intro once per session
    const [showIntro, setShowIntro] = useState(
        () => !sessionStorage.getItem("intro_seen"),
    );

    const handleIntroDone = () => {
        sessionStorage.setItem("intro_seen", "1");
        setShowIntro(false);
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        if (config) applyTheme(config);
    }, [config]);

    const order = config?.sectionOrder || Object.keys(SECTION_MAP);
    const visible = config?.sections || {};

    return (
        <>
            <SEO
                title="Utkal Behera | Full Stack MERN Developer"
                description="Official portfolio of Utkal Behera showcasing MERN projects, AI applications, internships, cloud deployments, and software engineering work."
                keywords="Utkal Behera, MERN Developer, React Developer, Full Stack Developer, Node.js, MongoDB, Next.js, Portfolio"
                url="https://utkalbehera.com/"
            />
            <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
                {/* Universe intro — shows once per session (lazy-loaded) */}
                {showIntro && (
                    <ErrorBoundary fallback={null}>
                        <Suspense fallback={null}>
                            <CinematicIntro onDone={handleIntroDone} />
                        </Suspense>
                    </ErrorBoundary>
                )}

                <Navbar />
                <main>
                    {order.map((key) => {
                        if (visible[key] === false) return null;
                        const Section = SECTION_MAP[key];
                        if (!Section) return null;

                        // Above-the-fold sections render eagerly (no Suspense)
                        if (EAGER_SECTIONS.has(key)) {
                            return <Section key={key} config={config} />;
                        }

                        // Below-the-fold sections: wrap in ErrorBoundary + Suspense
                        // so a single section failure never crashes the whole page
                        return (
                            <ErrorBoundary
                                key={key}
                                fallback={(err, reset) => (
                                    <div className="py-8 text-center text-gray-500 text-sm">
                                        <p>Could not load this section.</p>
                                        <button
                                            onClick={reset}
                                            className="mt-2 underline text-blue-400 hover:text-blue-300"
                                        >
                                            Retry
                                        </button>
                                    </div>
                                )}
                            >
                                <Suspense
                                    fallback={<SectionSkeleton rows={3} />}
                                >
                                    <Section config={config} />
                                </Suspense>
                            </ErrorBoundary>
                        );
                    })}
                </main>
                <Footer config={config} />
            </div>
        </>
    );
}
