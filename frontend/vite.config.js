import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            react(),
            visualizer({
                open: true,
                gzipSize: true,
                brotliSize: true,
                filename: "dist/stats.html",
            }),
        ],

        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ["react", "react-dom"],
                        router: ["react-router-dom"],
                        three: [
                            "three",
                            "@react-three/fiber",
                            "@react-three/drei",
                        ],
                        motion: ["framer-motion"],
                        icons: ["react-icons", "lucide-react"],
                    },
                },
            },
        },

        server: {
            proxy: {
                "/api": {
                    target: "http://localhost:5000",
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    };
});
