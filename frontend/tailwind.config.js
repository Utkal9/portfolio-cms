/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // Dark theme
                dark: {
                    bg: "#0a0f1e",
                    bg2: "#0d1428",
                    bg3: "#111827",
                    card: "#131d35",
                    card2: "#1a2540",
                    border: "#1e2d4a",
                },
                // Light theme
                light: {
                    bg: "#f8faff",
                    bg2: "#eef2ff",
                    card: "#ffffff",
                    border: "#e2e8f0",
                },
                accent: {
                    blue: "#4f8ef7",
                    purple: "#8b5cf6",
                },
            },
            fontFamily: {
                display: [
                    '"Clash Display"',
                    '"Plus Jakarta Sans"',
                    "sans-serif",
                ],
                body: ['"DM Sans"', "system-ui", "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
            },
            backgroundImage: {
                "grad-main": "linear-gradient(135deg, #4f8ef7, #8b5cf6)",
                "grad-glow":
                    "radial-gradient(ellipse at 50% 0%, rgba(79,142,247,0.15) 0%, transparent 70%)",
                "grad-card":
                    "linear-gradient(145deg, rgba(19,29,53,0.8), rgba(26,37,64,0.4))",
            },
            animation: {
                "fade-up": "fadeUp 0.6s ease forwards",
                "fade-in": "fadeIn 0.4s ease forwards",
                "slide-right": "slideRight 0.5s ease forwards",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                float: "float 3s ease-in-out infinite",
                "spin-slow": "spin 8s linear infinite",
                "cursor-glow": "cursorGlow 0.1s ease",
                "gradient-x": "gradientX 4s ease infinite",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: 0, transform: "translateY(24px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
                slideRight: {
                    "0%": { opacity: 0, transform: "translateX(-24px)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                },
                glowPulse: {
                    "0%,100%": { boxShadow: "0 0 20px rgba(79,142,247,0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(139,92,246,0.5)" },
                },
                float: {
                    "0%,100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-12px)" },
                },
                gradientX: {
                    "0%,100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            boxShadow: {
                "glow-blue": "0 0 30px rgba(79,142,247,0.25)",
                "glow-purple": "0 0 30px rgba(139,92,246,0.25)",
                "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
                "card-light": "0 4px 24px rgba(79,142,247,0.08)",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
