import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from "framer-motion";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
// ── Avatar + silent video ─────────────────────────────────────────────
export default function AvatarCard({ profileImage }) {
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const springX = useSpring(mouseX, { stiffness: 120, damping: 18 });
    const springY = useSpring(mouseY, { stiffness: 120, damping: 18 });
    const rotateX = useTransform(springY, [0, 1], ["10deg", "-10deg"]);
    const rotateY = useTransform(springX, [0, 1], ["-10deg", "10deg"]);
    const glareX = useTransform(springX, [0, 1], ["0%", "100%"]);
    const glareY = useTransform(springY, [0, 1], ["0%", "100%"]);
    const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 55%)`;

    return (
        <motion.div
            style={{ perspective: 1200 }}
            onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mouseX.set((e.clientX - r.left) / r.width);
                mouseY.set((e.clientY - r.top) / r.height);
            }}
            onMouseLeave={() => {
                mouseX.set(0.5);
                mouseY.set(0.5);
            }}
            className="relative flex justify-center w-full"
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[400px] lg:h-[400px]"
            >
                {/* Spinning conic gradient aura */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        inset: -16,
                        borderRadius: "50%",
                        background:
                            "conic-gradient(from 0deg, #4f8ef7, #8b5cf6, #06b6d4, #10b981, #4f8ef7)",
                        filter: "blur(20px)",
                        opacity: 0.22,
                        pointerEvents: "none",
                    }}
                />

                {/* Outer rings */}
                <div
                    style={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.08)",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: -14,
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.04)",
                        pointerEvents: "none",
                    }}
                />

                {/* Main circle */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid rgba(15,23,42,0.08)",
                        cursor: "default",
                        zIndex: 10,
                    }}
                >
                    {/* Profile photo — always present as base */}
                    {profileImage && (
                        <img
                            src={optimizeCloudinaryImage(profileImage, 800)}
                            alt="Utkal Behera"
                            loading="eager"
                            decoding="async"
                            fetchpriority="high"
                            width={800}
                            height={800}
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "top",
                            }}
                            draggable={false}
                        />
                    )}

                    {/* Fallback UB if no photo */}
                    {!profileImage && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "4rem",
                                fontWeight: 900,
                                color: "white",
                            }}
                        >
                            UB
                        </div>
                    )}

                    {/* Glare overlay */}
                    <motion.div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: glare,
                            mixBlendMode: "overlay",
                            opacity: 0.3,
                            pointerEvents: "none",
                        }}
                    />
                </div>

                {/* Badge — Top Skill */}
                <motion.div
                    style={{ translateZ: 60 }}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-8 -left-6 z-20
            flex items-center gap-3 px-4 py-3 rounded-2xl
            bg-slate-900/90 dark:bg-[#0d1424]/90 border border-slate-200/10 dark:border-white/12
            backdrop-blur-xl shadow-xl"
                >
                    <div
                        className="w-9 h-9 rounded-xl bg-accent-blue/20
            border border-accent-blue/30
            flex items-center justify-center text-lg text-white"
                    >
                        ⚛
                    </div>
                    <div>
                        <div
                            className="text-[10px] text-slate-300 dark:text-slate-400 font-bold
              uppercase tracking-widest"
                        >
                            Top Skill
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">
                            React & Next.js
                        </div>
                    </div>
                </motion.div>

                {/* Badge — Available */}
                <motion.div
                    style={{ translateZ: 80 }}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-14 -right-6 z-20
            flex items-center gap-3 px-4 py-3 rounded-2xl
            bg-slate-900/90 dark:bg-[#0d1424]/90 border border-slate-200/10 dark:border-white/12
            backdrop-blur-xl shadow-xl"
                >
                    <div className="relative w-3 h-3">
                        <span
                            className="absolute inset-0 rounded-full bg-emerald-400
              animate-ping opacity-75"
                        />
                        <span className="relative block w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm font-bold text-white">
                        Available for Work
                    </span>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
