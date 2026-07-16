import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Volume2, X } from "lucide-react";

import {
    buildVideoEmbed,
    buildVideoOpenUrl,
    buildVideoThumbnail,
} from "../utils/video";
// ── Video CV Modal (with sound) ───────────────────────────────────────
export default function VideoCVModal({ videoSource, onClose }) {
    useEffect(() => {
        const h = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", h);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", h);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const embedUrl = buildVideoEmbed(videoSource);
    const thumbUrl = buildVideoThumbnail(videoSource);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9998,
                background: "rgba(0,0,0,0.9)",
                backdropFilter: "blur(16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
        >
            <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 32 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 32 }}
                transition={{ type: "spring", stiffness: 280, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
                style={{ width: "100%", maxWidth: 720, position: "relative" }}
            >
                {/* Glow ring */}
                <div
                    style={{
                        position: "absolute",
                        inset: -4,
                        background: "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                        borderRadius: 28,
                        filter: "blur(16px)",
                        opacity: 0.35,
                        pointerEvents: "none",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        background: "#070d1a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 24,
                        overflow: "hidden",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 20px",
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    background:
                                        "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Volume2 size={16} color="white" />
                            </div>
                            <div>
                                <div
                                    style={{
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: 14,
                                    }}
                                >
                                    Video CV — Utkal Behera
                                </div>
                                <div
                                    style={{
                                        color: "#64748b",
                                        fontSize: 11,
                                        marginTop: 2,
                                    }}
                                >
                                    Full Stack Developer · MERN & Cloud · Sound
                                    enabled
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#94a3b8",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Video 16:9 */}
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            paddingTop: "56.25%",
                            background: "#000",
                        }}
                    >
                        <iframe
                            src={embedUrl}
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            title="Utkal Behera Video CV"
                        />
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 20px",
                            borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div style={{ display: "flex", gap: 8 }}>
                            {["MERN", "Cloud", "DevOps", "Next.js"].map((t) => (
                                <span
                                    key={t}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "4px 10px",
                                        borderRadius: 999,
                                        background: "rgba(79,142,247,0.1)",
                                        color: "#4f8ef7",
                                        border: "1px solid rgba(79,142,247,0.2)",
                                    }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                        <a
                            href={buildVideoOpenUrl(videoSource)}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                fontSize: 11,
                                color: "#4f8ef7",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <ExternalLink size={11} />
                            {videoSource.type === "youtube"
                                ? "Open in YouTube"
                                : "Open in Drive"}
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
