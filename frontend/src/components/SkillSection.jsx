import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSkillStore } from "../store/index.js";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";

// ── Map skill names to devicon SVG URLs ──────────────────────────────
const ICON_MAP = {
    // Frontend
    react: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "react.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "next.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    nextjs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    typescript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    javascript:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    tailwind:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    tailwindcss:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    html: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    css: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    bootstrap:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    vue: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    "vue.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    angular:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    redux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    // Backend
    "node.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    nodejs: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    express:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    "express.js":
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    mongodb:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    flask: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    django: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    mysql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    postgresql:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    graphql:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    firebase:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    // Cloud & DevOps
    docker: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    kubernetes:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg",
    aws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    git: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    linux: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    nginx: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg",
    // Languages
    "c++": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    c: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
    java: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    sql: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    // Tools
    postman:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
    vscode: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    wordpress:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
    cloudinary:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cloudinary/cloudinary-original.svg",
};

function getIconUrl(skillName) {
    return ICON_MAP[skillName.toLowerCase()] || null;
}

const CIRC = 163; // 2π × r(26)

// ── Circular progress ring ───────────────────────────────────────────
function RingCard({ skill, animate }) {
    const offset = animate ? CIRC - (CIRC * skill.level) / 100 : CIRC;
    const iconUrl = getIconUrl(skill.name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-3 p-5 rounded-2xl
        bg-white dark:bg-dark-card
        border border-slate-100 dark:border-dark-border
        hover:border-accent-blue/40 dark:hover:border-accent-blue/30
        shadow-card-light dark:shadow-none
        hover:shadow-glow-blue/15
        transition-all duration-300 cursor-default group relative overflow-hidden"
        >
            {/* Gradient shimmer on hover */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            />

            {/* Ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    className="-rotate-90 absolute inset-0"
                    aria-hidden="true"
                    focusable="false"
                >
                    <defs>
                        <linearGradient
                            id={`rg-${skill._id}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >
                            <stop offset="0%" stopColor="#4f8ef7" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-100 dark:text-dark-card2"
                    />
                    {/* Fill */}
                    <circle
                        cx="32"
                        cy="32"
                        r="26"
                        fill="none"
                        stroke={`url(#rg-${skill._id})`}
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={CIRC}
                        style={{
                            strokeDashoffset: offset,
                            transition:
                                "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
                        }}
                    />
                </svg>

                {/* Icon inside ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {iconUrl ? (
                        <img
                            src={optimizeCloudinaryImage(iconUrl, 200)}
                            alt={skill.name}
                            loading="lazy"
                            decoding="async"
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                            }}
                        />
                    ) : null}
                    <div
                        className="w-7 h-7 items-center justify-center text-xl"
                        style={{ display: iconUrl ? "none" : "flex" }}
                    >
                        {skill.icon || "⚡"}
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="text-center relative z-10">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight mb-0.5">
                    {skill.name}
                </div>
                <div className="text-[11px] font-extrabold grad-text">
                    {skill.level}%
                </div>
                <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
                    {skill.category}
                </div>
            </div>
        </motion.div>
    );
}

const CATEGORIES = [
    "All",
    "Frontend",
    "Backend",
    "Cloud & DevOps",
    "Languages",
    "Tools",
];

export default function SkillSection() {
    const { skills, fetch, loading } = useSkillStore();
    const [activeTab, setActiveTab] = useState("All");
    const [animated, setAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        fetch();
    }, []);

    // Trigger ring animation when section scrolls into view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setAnimated(true);
            },
            { threshold: 0.2 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const filtered =
        activeTab === "All"
            ? skills
            : skills.filter((s) => s.category === activeTab);

    // Get categories that actually have skills
    const availableCats = [
        "All",
        ...new Set(skills.map((s) => s.category).filter(Boolean)),
    ];

    return (
        <section
            id="skills"
            ref={ref}
            className="py-20 bg-slate-50/50 dark:bg-dark-bg2/50"
        >
            <div className="section-container">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-3 block">
                        Skills
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Technical <span className="grad-text">Expertise</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2 text-sm">
                        Technologies I use to build production-grade
                        applications
                    </p>
                </motion.div>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {availableCats.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200
                ${
                    activeTab === cat
                        ? "bg-grad-main text-white shadow-glow-blue"
                        : "bg-white dark:bg-dark-card2 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-dark-border hover:text-accent-blue hover:border-accent-blue/30"
                }`}
                        >
                            {cat}
                            {cat !== "All" && (
                                <span className="ml-1.5 opacity-60">
                                    {
                                        skills.filter((s) => s.category === cat)
                                            .length
                                    }
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Skill cards grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    >
                        {loading
                            ? Array(12)
                                  .fill(0)
                                  .map((_, i) => (
                                      <div
                                          key={i}
                                          className="skeleton h-36 rounded-2xl"
                                      />
                                  ))
                            : filtered.map((skill, i) => (
                                  <motion.div
                                      key={skill._id}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{
                                          duration: 0.3,
                                          delay: i * 0.04,
                                      }}
                                  >
                                      <RingCard
                                          skill={skill}
                                          animate={animated}
                                      />
                                  </motion.div>
                              ))}
                    </motion.div>
                </AnimatePresence>

                {/* Empty state */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <div className="text-4xl mb-3">⚡</div>
                        <p className="text-sm">
                            No skills in this category yet
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Add skills from the admin panel
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
