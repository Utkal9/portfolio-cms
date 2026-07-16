import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
    "#4f8ef7",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
];
const WORDS = [
    "EC2",
    "S3",
    "Lambda",
    "Docker",
    "K8s",
    "VPC",
    "IAM",
    "CloudFront",
    "RDS",
    "EKS",
    "Terraform",
    "CI/CD",
    "DevOps",
    "MERN",
    "Redis",
    "Nginx",
    "Git",
    "Node.js",
    "React",
    "MongoDB",
];
const PILLS = [
    "AWS",
    "GCP",
    "Docker",
    "Kubernetes",
    "MERN",
    "DevOps",
    "Terraform",
    "Node.js",
];
const LETTERS = ["U", "T", "K", "A", "L"];
const SUBTITLE = "Cloud & Full Stack Developer";

function rand(a, b) {
    return a + Math.random() * (b - a);
}

function makeParticle(W, H) {
    return {
        x: rand(0, W),
        y: H + rand(0, 200),
        vy: -rand(0.35, 1.2),
        vx: (Math.random() - 0.5) * 0.5,
        size: rand(12, 40),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: rand(0.1, 0.45),
        type: Math.random() > 0.45 ? "cloud" : "word",
        word: WORDS[Math.floor(Math.random() * WORDS.length)],
        delay: rand(0, 3500),
        born: Date.now(),
    };
}

function makeStars(W, H, n = 130) {
    return Array.from({ length: n }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.3, 1.8),
        alpha: rand(0.1, 0.7),
        twinkle: rand(0, Math.PI * 2),
        speed: rand(0.008, 0.035),
    }));
}

function drawCloud(ctx, cx, cy, w, h, color, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const r = h * 0.42;
    const x = cx - w / 2;
    const y = cy - h / 2;
    ctx.beginPath();
    ctx.arc(x + r, y + h - r, r, Math.PI, Math.PI * 1.5);
    ctx.arc(x + w * 0.35, y + r * 0.9, r * 0.85, Math.PI, 0);
    ctx.arc(x + w - r * 1.1, y + r * 1.05, r * 0.95, Math.PI, 0);
    ctx.arc(x + w - r * 0.5, y + h - r, r * 0.7, Math.PI * 1.5, 0);
    ctx.lineTo(x + w - r * 0.5, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

export default function CloudIntro({ onDone }) {
    const canvasRef = useRef(null);
    const rafRef = useRef(null);
    const starsRef = useRef([]);
    const particleRef = useRef([]);
    const [typed, setTyped] = useState("");
    const [showSub, setShowSub] = useState(false);
    const [showUI, setShowUI] = useState(false);
    const [exiting, setExiting] = useState(false);

    // Canvas setup
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        starsRef.current = makeStars(W, H);
        particleRef.current = Array.from({ length: 55 }, () =>
            makeParticle(W, H),
        );

        const ctx = canvas.getContext("2d");

        function animate() {
            rafRef.current = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, W, H);
            const now = Date.now();

            // Stars
            starsRef.current.forEach((s) => {
                s.twinkle += s.speed;
                const a = s.alpha * (0.55 + 0.45 * Math.sin(s.twinkle));
                ctx.save();
                ctx.globalAlpha = a;
                ctx.fillStyle = "#ffffff";
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Particles
            particleRef.current.forEach((p) => {
                if (now - p.born < p.delay) return;
                p.y += p.vy;
                p.x += p.vx;

                if (p.y < -120) {
                    Object.assign(p, makeParticle(W, H));
                    p.y = H + 20;
                    p.born = now;
                    p.delay = rand(0, 800);
                    return;
                }

                const elapsed = now - p.born - p.delay;
                const fadeIn = Math.min(1, elapsed / 1200);
                const fadeOut = Math.max(
                    0,
                    1 -
                        Math.pow(
                            Math.max(0, (H * 0.08 - p.y) / (H * 0.08)),
                            1.5,
                        ),
                );
                const alpha = p.alpha * fadeIn * fadeOut;

                if (p.type === "cloud") {
                    drawCloud(
                        ctx,
                        p.x,
                        p.y,
                        p.size * 2.4,
                        p.size,
                        p.color,
                        alpha,
                    );
                } else {
                    ctx.save();
                    ctx.globalAlpha = Math.min(1, alpha * 1.4);
                    ctx.fillStyle = p.color;
                    ctx.font = `700 ${Math.max(10, p.size * 0.38)}px monospace`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(p.word, p.x, p.y);
                    ctx.restore();
                }
            });
        }
        animate();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            starsRef.current = makeStars(window.innerWidth, window.innerHeight);
            particleRef.current = Array.from({ length: 55 }, () =>
                makeParticle(window.innerWidth, window.innerHeight),
            );
        };
        window.addEventListener("resize", resize);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    // Phase timeline
    useEffect(() => {
        const t1 = setTimeout(() => setShowSub(true), 800);
        const t2 = setTimeout(() => setShowUI(true), 2200);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    // Typewriter
    useEffect(() => {
        if (!showSub) return;
        let i = 0;
        const iv = setInterval(() => {
            setTyped(SUBTITLE.slice(0, i + 1));
            i++;
            if (i >= SUBTITLE.length) clearInterval(iv);
        }, 46);
        return () => clearInterval(iv);
    }, [showSub]);

    const handleSkip = useCallback(() => {
        setExiting(true);
        setTimeout(onDone, 700);
    }, [onDone]);

    // Auto-advance after 10s
    useEffect(() => {
        const t = setTimeout(handleSkip, 10000);
        return () => clearTimeout(t);
    }, [handleSkip]);

    return (
        <AnimatePresence>
            {!exiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999,
                        background: "#050b18",
                        overflow: "hidden",
                    }}
                >
                    {/* Canvas */}
                    <canvas
                        ref={canvasRef}
                        style={{ position: "absolute", inset: 0 }}
                    />

                    {/* Grid */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            backgroundImage: `linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)`,
                            backgroundSize: "48px 48px",
                        }}
                    />

                    {/* Radial glow */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            background:
                                "radial-gradient(ellipse 65% 50% at 50% 55%, rgba(79,142,247,0.12) 0%, transparent 70%)",
                        }}
                    />

                    {/* Corner decorations */}
                    {[
                        {
                            top: 18,
                            left: 18,
                            borderTop: "1.5px solid rgba(79,142,247,0.35)",
                            borderLeft: "1.5px solid rgba(79,142,247,0.35)",
                        },
                        {
                            top: 18,
                            right: 18,
                            borderTop: "1.5px solid rgba(79,142,247,0.35)",
                            borderRight: "1.5px solid rgba(79,142,247,0.35)",
                        },
                        {
                            bottom: 18,
                            left: 18,
                            borderBottom: "1.5px solid rgba(79,142,247,0.35)",
                            borderLeft: "1.5px solid rgba(79,142,247,0.35)",
                        },
                        {
                            bottom: 18,
                            right: 18,
                            borderBottom: "1.5px solid rgba(79,142,247,0.35)",
                            borderRight: "1.5px solid rgba(79,142,247,0.35)",
                        },
                    ].map((s, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                width: 22,
                                height: 22,
                                ...s,
                            }}
                        />
                    ))}

                    {/* Scan line effect */}
                    <motion.div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            height: 1,
                            pointerEvents: "none",
                            background:
                                "linear-gradient(90deg, transparent, rgba(79,142,247,0.4), transparent)",
                        }}
                        animate={{ top: ["0%", "100%"] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear",
                            repeatDelay: 2,
                        }}
                    />

                    {/* Main UI */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 24px",
                            textAlign: "center",
                        }}
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.7,
                                type: "spring",
                                stiffness: 200,
                                damping: 18,
                            }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 22,
                                background:
                                    "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 28,
                                boxShadow:
                                    "0 0 60px rgba(79,142,247,0.6), 0 0 120px rgba(139,92,246,0.3)",
                            }}
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        "0 0 60px rgba(79,142,247,0.6)",
                                        "0 0 80px rgba(79,142,247,0.9)",
                                        "0 0 60px rgba(79,142,247,0.6)",
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <svg
                                width="44"
                                height="36"
                                viewBox="0 0 24 18"
                                fill="none"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path
                                    d="M20 9.5h-.9A7 7 0 1 0 7 13.5H20a3.5 3.5 0 0 0 0-7z"
                                    fill="white"
                                    opacity="0.95"
                                />
                                <circle
                                    cx="10"
                                    cy="9"
                                    r="1.2"
                                    fill="rgba(79,142,247,0.6)"
                                />
                                <circle
                                    cx="14"
                                    cy="7"
                                    r="0.8"
                                    fill="rgba(139,92,246,0.5)"
                                />
                            </svg>
                        </motion.div>

                        {/* Name letters */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 16,
                            }}
                        >
                            {LETTERS.map((letter, i) => (
                                <motion.span
                                    key={i}
                                    initial={{
                                        opacity: 0,
                                        y: 50,
                                        rotateX: -90,
                                    }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{
                                        duration: 0.65,
                                        delay: 0.25 + i * 0.12,
                                        type: "spring",
                                        stiffness: 280,
                                        damping: 22,
                                    }}
                                    style={{
                                        fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
                                        fontWeight: 900,
                                        letterSpacing: "0.04em",
                                        background:
                                            "linear-gradient(135deg, #fff 20%, #4f8ef7 60%, #8b5cf6 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        lineHeight: 1,
                                        textShadow: "none",
                                        display: "block",
                                    }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </div>

                        {/* Subtitle typewriter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: showSub ? 1 : 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                fontFamily: "monospace",
                                fontSize: "clamp(0.78rem, 2.2vw, 0.98rem)",
                                color: "rgba(148,163,200,0.9)",
                                letterSpacing: "0.09em",
                                minHeight: "1.5em",
                                marginBottom: 24,
                            }}
                        >
                            {typed}
                            <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                style={{ color: "#4f8ef7", marginLeft: 2 }}
                            >
                                |
                            </motion.span>
                        </motion.div>

                        {/* Tech pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5, duration: 0.6 }}
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                gap: 8,
                                maxWidth: 420,
                                marginBottom: 28,
                            }}
                        >
                            {PILLS.map((tag, i) => (
                                <motion.span
                                    key={tag}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: 1.55 + i * 0.07,
                                        type: "spring",
                                        stiffness: 400,
                                    }}
                                    style={{
                                        padding: "5px 13px",
                                        borderRadius: 999,
                                        fontSize: "0.7rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.07em",
                                        background: "rgba(79,142,247,0.1)",
                                        border: "1px solid rgba(79,142,247,0.32)",
                                        color: "#6ba3fa",
                                    }}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Progress bar + button */}
                        <AnimatePresence>
                            {showUI && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    {/* Progress */}
                                    <div
                                        style={{
                                            width: 260,
                                            height: 2,
                                            background: "rgba(79,142,247,0.15)",
                                            borderRadius: 999,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <motion.div
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{
                                                duration: 7.8,
                                                ease: "linear",
                                            }}
                                            onAnimationComplete={handleSkip}
                                            style={{
                                                height: "100%",
                                                background:
                                                    "linear-gradient(90deg, #4f8ef7, #8b5cf6)",
                                                borderRadius: 999,
                                            }}
                                        />
                                    </div>

                                    {/* Skip button */}
                                    <motion.button
                                        onClick={handleSkip}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.96 }}
                                        style={{
                                            padding: "12px 34px",
                                            borderRadius: 14,
                                            background:
                                                "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: "0.88rem",
                                            border: "none",
                                            cursor: "pointer",
                                            letterSpacing: "0.05em",
                                            boxShadow:
                                                "0 0 32px rgba(79,142,247,0.45)",
                                        }}
                                    >
                                        Enter Portfolio →
                                    </motion.button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom fade */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 140,
                            pointerEvents: "none",
                            background:
                                "linear-gradient(to top, rgba(5,11,24,0.5), transparent)",
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
