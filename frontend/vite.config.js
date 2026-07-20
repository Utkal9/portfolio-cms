import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            react(),
            // Bundle visualizer — only generates stats.html, never auto-opens the browser
            visualizer({
                open: false,
                gzipSize: true,
                brotliSize: true,
                filename: "dist/stats.html",
            }),
        ],

        build: {
            // Target modern browsers for smaller output
            target: "esnext",
            // Use esbuild for faster minification
            minify: "esbuild",
            // Warn on chunks > 500 KB
            chunkSizeWarningLimit: 500,
            rollupOptions: {
                output: {
                    manualChunks: {
                        // Core React runtime — never changes, long-lived cache
                        react: ["react", "react-dom"],
                        // Routing
                        router: ["react-router-dom"],
                        // Heavy 3D — only loaded by CinematicIntro (lazy)
                        three: [
                            "three",
                            "@react-three/fiber",
                            "@react-three/drei",
                        ],
                        // Animation libraries
                        motion: ["framer-motion"],
                        // Icon libraries
                        icons: ["react-icons", "lucide-react"],
                        // DnD (admin only)
                        dnd: [
                            "@dnd-kit/core",
                            "@dnd-kit/sortable",
                            "@dnd-kit/utilities",
                        ],
                        // Audio (CinematicIntro only)
                        audio: ["howler"],
                        // GSAP (animation)
                        gsap: ["gsap"],
                    },
                },
            },
        },

        server: {
            proxy: {
                "/api": {
                    target: env.VITE_API_URL || "http://localhost:5000",
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
