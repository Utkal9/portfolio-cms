import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/*
  CinematicIntro.jsx
  Advanced futuristic portfolio intro
  Flow:
  1. Boot
  2. Memory
  3. Build
  4. Identity
  5. Enter
*/

const PHASES = ["boot", "memory", "build", "identity", "enter"];

const BOOT_LINES = [
    "[OK] Initializing system core...",
    "[OK] Detecting developer profile...",
    "[OK] Loading motion engine...",
    "[OK] Syncing interface layers...",
    "[OK] Establishing cloud bridge...",
    "[OK] Loading cinematic sequence...",
    "[OK] Profile ready.",
];

const MEMORY_LINES = [
    "> Accessing memory fragments...",
    "> Scanning first commits...",
    "> Loading problem-solving modules...",
    "> Activating persistence layer...",
    "> Loading MERN stack archive...",
    "> Sync complete.",
];

const BUILD_NODES = [
    {
        id: "react",
        label: "React",
        sub: "UI layer",
        icon: "◌",
        x: -220,
        y: -78,
        color: "#7dd3fc",
    },
    {
        id: "node",
        label: "Node.js",
        sub: "Runtime",
        icon: "◆",
        x: 220,
        y: -78,
        color: "#86efac",
    },
    {
        id: "mongo",
        label: "MongoDB",
        sub: "Data layer",
        icon: "◈",
        x: -220,
        y: 78,
        color: "#34d399",
    },
    {
        id: "express",
        label: "Express",
        sub: "API layer",
        icon: "▣",
        x: 220,
        y: 78,
        color: "#e5e7eb",
    },
    {
        id: "cloud",
        label: "Cloud",
        sub: "Deployments",
        icon: "☁",
        x: 0,
        y: -165,
        color: "#fbbf24",
    },
    {
        id: "ship",
        label: "Delivery",
        sub: "Production",
        icon: "➤",
        x: 0,
        y: 165,
        color: "#a78bfa",
    },
];

const STATS = [
    { label: "Projects Built", value: "12+" },
    { label: "Systems Shipped", value: "5+" },
    { label: "Tech Stack", value: "MERN + Cloud" },
    { label: "Focus", value: "Scalable Apps" },
];

const MENU_OPTIONS = [
    {
        key: "1",
        label: "Explore Projects",
        section: "#projects",
        color: "#7dd3fc",
    },
    { key: "2", label: "View Skills", section: "#skills", color: "#a78bfa" },
    { key: "3", label: "Experience", section: "#experience", color: "#34d399" },
    { key: "4", label: "Contact", section: "#contact", color: "#fbbf24" },
];

function useTypewriter(text, speed = 30, active = true) {
    const [output, setOutput] = useState("");
    useEffect(() => {
        if (!active) return;
        setOutput("");
        let i = 0;
        const iv = setInterval(() => {
            i += 1;
            setOutput(text.slice(0, i));
            if (i >= text.length) clearInterval(iv);
        }, speed);
        return () => clearInterval(iv);
    }, [text, speed, active]);
    return output;
}

function useTypewriterLines(lines, gap = 700, active = true) {
    const [visible, setVisible] = useState([]);
    useEffect(() => {
        if (!active) return;
        setVisible([]);
        const timers = lines.map((line, i) =>
            setTimeout(() => {
                setVisible((prev) => [...prev, line]);
            }, i * gap),
        );
        return () => timers.forEach(clearTimeout);
    }, [lines, gap, active]);
    return visible;
}

function splitText(text) {
    return text.split("").map((ch, index) => ({ ch, index }));
}

function FuturisticBackdrop() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[#04070d]" />
            <div
                className="absolute inset-0 opacity-50"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, rgba(125,211,252,0.16), transparent 28%), radial-gradient(circle at 80% 30%, rgba(167,139,250,0.14), transparent 24%), radial-gradient(circle at 50% 80%, rgba(52,211,153,0.12), transparent 26%)",
                }}
            />
            <div
                className="absolute inset-0 opacity-[0.22]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                    maskImage:
                        "radial-gradient(circle at center, black 34%, transparent 82%)",
                    WebkitMaskImage:
                        "radial-gradient(circle at center, black 34%, transparent 82%)",
                }}
            />
            <motion.div
                animate={{
                    x: ["-10%", "10%", "-10%"],
                    y: ["-6%", "4%", "-6%"],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sky-500/10 via-violet-500/10 to-emerald-500/10 blur-3xl"
            />
        </div>
    );
}

function ScanlineOverlay() {
    return (
        <div
            className="pointer-events-none absolute inset-0 z-20 opacity-25"
            style={{
                backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px)",
            }}
        />
    );
}

function Cursor() {
    return (
        <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="ml-1 inline-block text-sky-300"
        >
            █
        </motion.span>
    );
}

function SceneShell({
    title,
    subtitle,
    index,
    total,
    children,
    accent = "sky",
}) {
    const accentMap = {
        sky: "from-sky-400/20 via-sky-400/8 to-transparent",
        violet: "from-violet-400/20 via-violet-400/8 to-transparent",
        emerald: "from-emerald-400/20 via-emerald-400/8 to-transparent",
        amber: "from-amber-400/20 via-amber-400/8 to-transparent",
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#02050a] text-white !cursor-auto"
        >
            <FuturisticBackdrop />
            <ScanlineOverlay />
            <div
                className={`absolute inset-0 bg-gradient-to-b ${accentMap[accent]}`}
            />

            <div className="relative z-30 w-full max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <div className="text-[10px] tracking-[0.4em] text-slate-400">
                            PHASE {index + 1}/{total}
                        </div>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                            {title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                            {subtitle}
                        </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] tracking-[0.28em] text-slate-300 backdrop-blur">
                        CINEMATIC
                    </div>
                </div>

                {children}
            </div>
        </motion.div>
    );
}

function FloatingNode({ node, active, hovered, onHover }) {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: active ? 1 : 0,
                opacity: active ? 1 : 0,
                y: [0, -7, 0],
            }}
            transition={{
                scale: { duration: 0.35 },
                opacity: { duration: 0.25 },
                y: {
                    duration: 2.8 + Math.random() * 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                },
            }}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-2"
            style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
            }}
        >
            <div
                className="flex h-16 w-16 items-center justify-center rounded-full border backdrop-blur-md transition-shadow duration-300"
                style={{
                    borderColor: `${node.color}50`,
                    background: `radial-gradient(circle, ${node.color}16, ${node.color}06)`,
                    boxShadow:
                        hovered === node.id
                            ? `0 0 25px ${node.color}55, 0 0 60px ${node.color}20`
                            : `0 0 12px ${node.color}22`,
                    color: node.color,
                }}
            >
                <span className="text-2xl">{node.icon}</span>
            </div>

            <div className="text-center">
                <div
                    className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                    style={{ color: node.color }}
                >
                    {node.label}
                </div>
            </div>

            <AnimatePresence>
                {hovered === node.id && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-full mt-3 rounded-xl border border-white/10 bg-[#07111d]/95 px-3 py-2 text-[11px] text-slate-300 backdrop-blur-md"
                    >
                        {node.sub}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function BootScene({ onDone, index, total }) {
    const visible = useTypewriterLines(BOOT_LINES, 620, true);
    const progress = Math.min(100, (visible.length / BOOT_LINES.length) * 100);

    useEffect(() => {
        if (visible.length === BOOT_LINES.length) {
            const t = setTimeout(onDone, 700);
            return () => clearTimeout(t);
        }
    }, [visible, onDone]);

    return (
        <SceneShell
            title="System Boot"
            subtitle="A precise startup sequence with a product-level visual language."
            index={index}
            total={total}
            accent="sky"
        >
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-sky-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-5 flex items-center justify-between">
                    <div className="text-[10px] tracking-[0.35em] text-sky-300/80">
                        INITIALIZING CORE
                    </div>
                    <div className="text-xs text-sky-300">
                        {Math.round(progress)}%
                    </div>
                </div>

                <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-2 font-mono text-sm sm:text-[15px]">
                        {visible.map((line, i) => (
                            <motion.p
                                key={`${line}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.24 }}
                                className="text-slate-300"
                            >
                                {line}
                            </motion.p>
                        ))}
                        {visible.length > 0 && (
                            <div className="pt-1">
                                <Cursor />
                            </div>
                        )}
                    </div>

                    <div className="grid gap-3">
                        {[
                            { label: "Kernel", value: "Stable" },
                            { label: "Memory", value: "Verified" },
                            { label: "Profile", value: "Loaded" },
                        ].map((card) => (
                            <div
                                key={card.label}
                                className="rounded-2xl border border-white/8 bg-black/30 px-4 py-4"
                            >
                                <div className="text-[10px] tracking-[0.3em] text-slate-500">
                                    {card.label}
                                </div>
                                <div className="mt-2 text-sm font-medium text-white">
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SceneShell>
    );
}

function MemoryScene({ onDone, index, total }) {
    const visible = useTypewriterLines(MEMORY_LINES, 760, true);
    const bar = Math.min(100, (visible.length / MEMORY_LINES.length) * 100);

    useEffect(() => {
        if (visible.length === MEMORY_LINES.length) {
            const t = setTimeout(onDone, 800);
            return () => clearTimeout(t);
        }
    }, [visible, onDone]);

    return (
        <SceneShell
            title="Memory Scan"
            subtitle="Your journey is treated like a high-resolution archive."
            index={index}
            total={total}
            accent="violet"
        >
            <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-8">
                    <div className="mb-5 text-[10px] tracking-[0.35em] text-violet-300/80">
                        MEMORY FRAGMENTS
                    </div>

                    <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Scanning archive</span>
                        <span>{Math.round(bar)}%</span>
                    </div>

                    <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${bar}%` }}
                            transition={{ duration: 0.3 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400"
                        />
                    </div>

                    <div className="space-y-2 font-mono text-sm sm:text-[15px]">
                        {visible.map((line, i) => (
                            <motion.p
                                key={`${line}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.24 }}
                                className="text-slate-300"
                            >
                                {line}
                            </motion.p>
                        ))}
                        {visible.length > 0 && (
                            <div className="pt-1">
                                <Cursor />
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl sm:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(167,139,250,0.15),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(125,211,252,0.12),transparent_22%),radial-gradient(circle_at_80%_80%,rgba(52,211,153,0.12),transparent_24%)]" />
                    <div className="relative z-10">
                        <div className="mb-5 text-[10px] tracking-[0.35em] text-violet-300/80">
                            ARCHIVE VIEW
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                "Early commits",
                                "Debug loops",
                                "Late-night focus",
                                "First deploy",
                            ].map((item, i) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-200"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-violet-500/15 bg-black/30 p-4 font-mono text-xs text-slate-300">
                            “Accessing memory fragments...”
                        </div>

                        <div className="mt-6 grid grid-cols-12 gap-2">
                            {Array.from({ length: 72 }, (_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0.1 }}
                                    animate={{
                                        opacity:
                                            i < (bar / 100) * 72 ? 1 : 0.14,
                                    }}
                                    transition={{ delay: i * 0.01 }}
                                    className="h-3 rounded-[4px]"
                                    style={{
                                        background:
                                            i < (bar / 100) * 72
                                                ? "linear-gradient(180deg, rgba(167,139,250,0.95), rgba(125,211,252,0.9))"
                                                : "rgba(255,255,255,0.08)",
                                        boxShadow:
                                            i < (bar / 100) * 72
                                                ? "0 0 14px rgba(167,139,250,0.25)"
                                                : "none",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SceneShell>
    );
}

function BuildScene({ onDone, index, total }) {
    const [active, setActive] = useState([]);
    const [installing, setInstalling] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [showCore, setShowCore] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers = BUILD_NODES.map((node, i) =>
            setTimeout(() => {
                setInstalling(node.label);
                setStep(i + 1);

                setTimeout(() => {
                    setActive((prev) => [...prev, node.id]);
                    setInstalling(null);

                    if (i === BUILD_NODES.length - 1) {
                        setTimeout(() => {
                            setShowCore(true);
                            setTimeout(onDone, 1200);
                        }, 500);
                    }
                }, 420);
            }, i * 620),
        );

        return () => timers.forEach(clearTimeout);
    }, [onDone]);

    const progress = Math.min(100, (step / BUILD_NODES.length) * 100);

    return (
        <SceneShell
            title="System Build"
            subtitle="The interface assembles a production-ready stack in real time."
            index={index}
            total={total}
            accent="emerald"
        >
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-emerald-950/15 backdrop-blur-xl sm:p-8">
                    <div className="mb-5 text-[10px] tracking-[0.35em] text-emerald-300/80">
                        STACK ASSEMBLY
                    </div>

                    <div className="mb-4 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Installing core modules</span>
                        <span>{Math.round(progress)}%</span>
                    </div>

                    <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.35 }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500"
                        />
                    </div>

                    <div className="space-y-3">
                        {BUILD_NODES.map((node) => {
                            const done = active.includes(node.id);
                            const isInstalling = installing === node.label;
                            return (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0.35 }}
                                    animate={{ opacity: done ? 1 : 0.35 }}
                                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/30 px-4 py-3"
                                >
                                    <span
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs"
                                        style={{
                                            borderColor: done
                                                ? `${node.color}60`
                                                : "rgba(255,255,255,0.08)",
                                            color: done
                                                ? node.color
                                                : "#64748b",
                                            background: done
                                                ? `${node.color}10`
                                                : "rgba(255,255,255,0.02)",
                                        }}
                                    >
                                        {done ? "✓" : isInstalling ? "»" : "·"}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="text-sm font-medium"
                                            style={{
                                                color: done
                                                    ? node.color
                                                    : "#cbd5e1",
                                            }}
                                        >
                                            {node.label}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {node.sub}
                                        </div>
                                    </div>
                                    {isInstalling && (
                                        <motion.div
                                            animate={{
                                                opacity: [0.35, 1, 0.35],
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                repeat: Infinity,
                                            }}
                                            className="text-sky-300"
                                        >
                                            processing
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {showCore && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-300"
                        >
                            ✓ MERN stack initialized
                        </motion.div>
                    )}
                </div>

                <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl sm:p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.14),transparent_22%),radial-gradient(circle_at_50%_20%,rgba(125,211,252,0.12),transparent_24%)]" />
                    <div className="relative z-10 flex h-full items-center justify-center">
                        <AnimatePresence>
                            {showCore && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="absolute flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-sm font-bold text-white shadow-[0_0_50px_rgba(52,211,153,0.22)]"
                                >
                                    MERN
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <svg
                            className="absolute inset-0 h-full w-full"
                            aria-hidden="true"
                            focusable="false"
                        >
                            {BUILD_NODES.map((node) => {
                                if (!active.includes(node.id) || !showCore)
                                    return null;
                                const cx = 50;
                                const cy = 50;
                                const nx = 50 + node.x / 6;
                                const ny = 50 + node.y / 4.8;

                                return (
                                    <line
                                        key={node.id}
                                        x1={`${cx}%`}
                                        y1={`${cy}%`}
                                        x2={`${nx}%`}
                                        y2={`${ny}%`}
                                        stroke={node.color}
                                        strokeWidth="1"
                                        strokeOpacity="0.42"
                                        strokeDasharray="5 7"
                                    />
                                );
                            })}
                        </svg>

                        {BUILD_NODES.map((node) => (
                            <FloatingNode
                                key={node.id}
                                node={node}
                                active={active.includes(node.id)}
                                hovered={hovered}
                                onHover={setHovered}
                            />
                        ))}
                    </div>

                    <div className="absolute bottom-6 left-6 z-10 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-[10px] tracking-[0.25em] text-slate-400">
                        HIGH-LEVEL ARCHITECTURE
                    </div>
                </div>
            </div>
        </SceneShell>
    );
}

function IdentityScene({ onDone, index, total }) {
    const [showName, setShowName] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(false);
    const [showStats, setShowStats] = useState(false);

    useEffect(() => {
        const a = setTimeout(() => setShowName(true), 300);
        const b = setTimeout(() => setShowTitle(true), 900);
        const c = setTimeout(() => setShowSubtitle(true), 1450);
        const d = setTimeout(() => setShowStats(true), 2000);
        const e = setTimeout(onDone, 4300);

        return () => {
            clearTimeout(a);
            clearTimeout(b);
            clearTimeout(c);
            clearTimeout(d);
            clearTimeout(e);
        };
    }, [onDone]);

    return (
        <SceneShell
            title="Identity Reveal"
            subtitle="A clean hero moment with high-end confidence and motion restraint."
            index={index}
            total={total}
            accent="violet"
        >
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="text-[10px] tracking-[0.35em] text-violet-300/80">
                        DEVELOPER IDENTITY
                    </div>

                    <AnimatePresence>
                        {showName && (
                            <motion.h1
                                initial={{
                                    opacity: 0,
                                    y: 18,
                                    filter: "blur(6px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)",
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="mt-5 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl"
                            >
                                Utkal Behera
                            </motion.h1>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showTitle && (
                            <motion.div
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.55 }}
                                className="mt-4 text-[11px] uppercase tracking-[0.35em] text-sky-300 sm:text-sm"
                            >
                                Full Stack Developer
                                <span className="mx-3 text-white/15">|</span>
                                MERN & Cloud
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showSubtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55 }}
                                className="mt-6 max-w-2xl text-balance text-lg leading-8 text-slate-300 sm:text-xl"
                            >
                                I build scalable, real-world applications with
                                clean systems, reliable architecture, and
                                product-focused execution.
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {STATS.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={
                                    showStats
                                        ? { opacity: 1, y: 0 }
                                        : { opacity: 0, y: 10 }
                                }
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="rounded-2xl border border-white/10 bg-black/30 p-4"
                            >
                                <div className="text-[10px] tracking-[0.3em] text-slate-500">
                                    {item.label}
                                </div>
                                <div className="mt-2 text-lg font-semibold text-white">
                                    {item.value}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-xl sm:p-8">
                    <div className="mb-5 text-[10px] tracking-[0.35em] text-violet-300/80">
                        PERFORMANCE METERS
                    </div>

                    {[
                        {
                            label: "Execution",
                            value: 98,
                            color: "bg-emerald-400",
                        },
                        {
                            label: "Creativity",
                            value: 95,
                            color: "bg-violet-400",
                        },
                        {
                            label: "Problem Solving",
                            value: 93,
                            color: "bg-sky-400",
                        },
                        {
                            label: "Cloud Readiness",
                            value: 90,
                            color: "bg-amber-400",
                        },
                    ].map((meter, i) => (
                        <div key={meter.label} className="mb-4 last:mb-0">
                            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                <span>{meter.label}</span>
                                <span>{meter.value}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={
                                        showStats
                                            ? { width: `${meter.value}%` }
                                            : { width: 0 }
                                    }
                                    transition={{
                                        duration: 0.9,
                                        delay: i * 0.1,
                                    }}
                                    className={`h-full rounded-full ${meter.color}`}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="text-[10px] tracking-[0.3em] text-slate-500">
                            STATUS
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
                            Ready for portfolio entry
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-violet-500/15 bg-violet-500/8 p-4 font-mono text-xs text-slate-300">
                        “From ideas… to scalable applications.”
                    </div>
                </div>
            </div>
        </SceneShell>
    );
}

function EnterScene({ onEnter, index, total }) {
    const prompt = useTypewriter(
        "Press ENTER to continue, or click to enter the portfolio.",
        28,
        true,
    );

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Enter") onEnter();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onEnter]);

    return (
        <SceneShell
            title="Enter Portfolio"
            subtitle="A confident final call-to-action that transitions into the real experience."
            index={index}
            total={total}
            accent="amber"
        >
            <div className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-14 text-center shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-10 lg:px-14">
                <div className="text-[10px] tracking-[0.35em] text-amber-300/85">
                    FINAL FRAME
                </div>

                <motion.h3
                    initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7 }}
                    className="mt-5 text-3xl font-bold text-white sm:text-5xl lg:text-6xl"
                >
                    Enter My World
                </motion.h3>

                <p className="mt-4 max-w-2xl text-balance text-base leading-7 text-slate-300 sm:text-lg">
                    The intro ends here. The portfolio begins with clarity,
                    depth, and a premium first impression.
                </p>

                <div className="mt-7 min-h-8 font-mono text-sm text-slate-300">
                    {prompt}
                    <Cursor />
                </div>

                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onEnter}
                        className="!cursor-pointer rounded-2xl bg-gradient-to-r from-amber-300 via-orange-500 to-violet-600 px-8 py-4 text-sm font-semibold tracking-[0.2em] text-black shadow-[0_0_40px_rgba(251,191,36,0.18)]"
                    >
                        ENTER PORTFOLIO
                    </motion.button>

                    <div className="text-[11px] tracking-[0.25em] text-slate-500">
                        PRESS ENTER OR CLICK
                    </div>
                </div>
            </div>
        </SceneShell>
    );
}

export default function CinematicIntro({ onDone }) {
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [skipArmed, setSkipArmed] = useState(false);

    const phase = PHASES[phaseIndex];

    const advance = () => {
        setPhaseIndex((p) => Math.min(p + 1, PHASES.length - 1));
    };

    const finish = () => {
        setExiting(true);
        setTimeout(() => onDone?.(), 650);
    };

    useEffect(() => {
        if (phase === "enter") return;
        const timer = setTimeout(
            () => advance(),
            {
                boot: 4600,
                memory: 4200,
                build: 6200,
                identity: 4400,
            }[phase] ?? 4000,
        );

        return () => clearTimeout(timer);
    }, [phase]);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") finish();
            if (e.key === "Enter" && phase === "enter") finish();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [phase]);

    const handleSkip = () => {
        if (!skipArmed) {
            setSkipArmed(true);
            setTimeout(() => setSkipArmed(false), 1800);
            return;
        }
        finish();
    };

    return (
        <AnimatePresence>
            {!exiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65 }}
                    className="fixed inset-0 z-[9999] overflow-hidden bg-black !cursor-auto"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45 }}
                            className="absolute inset-0 !cursor-auto"
                        >
                            {phase === "boot" && (
                                <BootScene
                                    onDone={advance}
                                    index={phaseIndex}
                                    total={PHASES.length}
                                />
                            )}
                            {phase === "memory" && (
                                <MemoryScene
                                    onDone={advance}
                                    index={phaseIndex}
                                    total={PHASES.length}
                                />
                            )}
                            {phase === "build" && (
                                <BuildScene
                                    onDone={advance}
                                    index={phaseIndex}
                                    total={PHASES.length}
                                />
                            )}
                            {phase === "identity" && (
                                <IdentityScene
                                    onDone={advance}
                                    index={phaseIndex}
                                    total={PHASES.length}
                                />
                            )}
                            {phase === "enter" && (
                                <EnterScene
                                    onEnter={finish}
                                    index={phaseIndex}
                                    total={PHASES.length}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={handleSkip}
                        className="absolute right-4 top-4 z-40 !cursor-pointer rounded-xl border border-white/10 bg-black/55 px-4 py-2 text-[11px] tracking-[0.2em] text-slate-300 backdrop-blur-md transition hover:border-sky-400/30 hover:text-white"
                    >
                        {skipArmed ? "CLICK AGAIN TO SKIP" : "SKIP"}
                    </button>

                    <div className="absolute left-4 top-4 z-40 rounded-xl border border-white/10 bg-black/45 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-slate-400 backdrop-blur-md">
                        MY DEVELOPER JOURNEY
                    </div>

                    <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
                        {PHASES.map((_, i) => (
                            <div
                                key={i}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: i === phaseIndex ? 24 : 7,
                                    height: 7,
                                    background:
                                        i < phaseIndex
                                            ? "rgba(125,211,252,0.9)"
                                            : i === phaseIndex
                                              ? "linear-gradient(90deg, rgba(125,211,252,1), rgba(167,139,250,1))"
                                              : "rgba(125,211,252,0.16)",
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
