import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useThemeStore, useSiteConfigStore } from "../store/index.js";

const NAV_ITEMS = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const { isDark, toggle } = useThemeStore();
    const { config } = useSiteConfigStore();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState("");

    const name = config?.hero?.name || "Utkal Behera";

    // Dynamic nav items based on section visibility
    const visibleNav = NAV_ITEMS.filter((item) => {
        const key = item.href.slice(1);
        // If config not loaded yet show all, else respect visibility
        if (!config?.sections) return true;
        return config.sections[key] !== false;
    });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const ids = NAV_ITEMS.map((i) => i.href.slice(1));
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                }),
            { rootMargin: "-40% 0px -55% 0px" },
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    const navBg = scrolled
        ? "bg-white/80 dark:bg-dark-bg2/90 backdrop-blur-xl shadow-sm dark:shadow-dark-border/20 shadow-slate-200/60"
        : "bg-transparent";

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2 group">
                    <img
                        src="/logo/logo-icon.webp"
                        alt="UB Logo"
                        loading="lazy"
                        decoding="async"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-xl object-cover
              group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="font-bold text-slate-800 dark:text-white hidden sm:block font-display">
                        {name.split(" ")[0]}
                        <span className="grad-text">.</span>
                    </span>
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1">
                    {visibleNav.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                    active === item.href.slice(1)
                        ? "text-accent-blue dark:text-accent-blue"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
                        >
                            {item.label}
                            {active === item.href.slice(1) && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute inset-0 bg-blue-50 dark:bg-accent-blue/10 rounded-lg -z-10"
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </a>
                    ))}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggle}
                        className="a11y-hit w-9 h-9 rounded-xl flex items-center justify-center
              bg-slate-100 dark:bg-dark-card2 hover:bg-slate-200 dark:hover:bg-dark-card
              text-slate-600 dark:text-slate-300 transition-all duration-200"
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {isDark ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun size={16} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon size={16} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    <a
                        href="#contact"
                        className="hidden sm:block px-4 py-2 rounded-xl text-sm font-semibold
              bg-grad-main text-white shadow-glow-blue hover:shadow-glow-purple
              transition-all duration-300 hover:scale-105"
                    >
                        Hire Me
                    </a>

                    <button
                        onClick={() => setMenuOpen((v) => !v)}
                        className="a11y-hit md:hidden w-9 h-9 rounded-xl flex items-center justify-center
              bg-slate-100 dark:bg-dark-card2 text-slate-600 dark:text-slate-300"
                        aria-label={
                            menuOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                    >
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-dark-bg2
              border-t border-slate-100 dark:border-dark-border"
                    >
                        <div className="px-6 py-4 flex flex-col gap-1">
                            {visibleNav.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors
                    ${
                        active === item.href.slice(1)
                            ? "text-accent-blue bg-accent-blue/10"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-card2"
                    }`}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setMenuOpen(false)}
                                className="mt-2 py-3 px-4 rounded-xl text-sm font-semibold
                  text-center bg-grad-main text-white"
                            >
                                Hire Me
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
