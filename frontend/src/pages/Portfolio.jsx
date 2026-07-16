import { useEffect, useState } from "react";
import { useSiteConfigStore } from "../store/index.js";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import SkillSection from "../components/SkillSection.jsx";
import ProjectGrid from "../components/ProjectGrid.jsx";
import ExperienceTimeline from "../components/ExperienceTimeline.jsx";
import Certifications from "../components/Certifications.jsx";
import Education from "../components/Education.jsx";
import ContactSection from "../components/ContactSection.jsx";
import Footer from "../components/Footer.jsx";
import GithubStats from "../components/GithubStats.jsx";
import LeetcodeStats from "../components/LeetcodeStats.jsx";
import { lazy, Suspense } from "react";
const CinematicIntro = lazy(() => import("../components/CinematicIntro.jsx"));

const SECTION_MAP = {
    hero: Hero,
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
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
            {/* Universe intro — shows once per session (lazy-loaded) */}
            {showIntro && (
                <Suspense fallback={null}>
                    <CinematicIntro onDone={handleIntroDone} />
                </Suspense>
            )}

            <Navbar />
            <main>
                {order.map((key) => {
                    if (visible[key] === false) return null;
                    const Section = SECTION_MAP[key];
                    if (!Section) return null;
                    return <Section key={key} config={config} />;
                })}
            </main>
            <Footer config={config} />
        </div>
    );
}
