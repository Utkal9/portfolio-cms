import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "./store/index.js";
import ErrorBoundary from "./components/ui/ErrorBoundary.jsx";
import { PageLoader } from "./components/ui/loading/index.js";

// ── Lazy pages ────────────────────────────────────────────────────────
// Each page gets its OWN Suspense so AnimatePresence never races with
// a chunk that hasn't loaded yet. This was the root cause of blank screens.
const Portfolio = lazy(() => import("./pages/Portfolio.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.jsx"));
const Blog = lazy(() => import("./pages/Blog.jsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.jsx"));
const TagPage = lazy(() => import("./pages/TagPage.jsx"));
const Search = lazy(() => import("./pages/Search.jsx"));

import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";
import GoogleAnalytics from "./components/analytics/GoogleAnalytics";
import Clarity from "./components/analytics/Clarity";

// ── Colour palette ───────────────────────────────────────────────────
const HUES = [195, 220, 245, 265, 285, 310]; // cyan→blue→indigo→violet→purple→pink

// ── Particle class ───────────────────────────────────────────────────
class Particle {
    constructor() {
        this.alive = false;
    }

    spawn(x, y, vx, vy) {
        this.x = x + (Math.random() - 0.5) * 6;
        this.y = y + (Math.random() - 0.5) * 6;
        this.vx = vx * 0.28 + (Math.random() - 0.5) * 2.2;
        this.vy = vy * 0.28 + (Math.random() - 0.5) * 2.2;
        this.ax = 0;
        this.ay = 0;
        this.life = 1;
        this.decay = 0.013 + Math.random() * 0.018;
        this.size = 1.8 + Math.random() * 2.8;
        this.hue = HUES[Math.floor(Math.random() * HUES.length)];
        this.sat = 85 + Math.random() * 15;
        this.lit = 60 + Math.random() * 20;
        this.alive = true;
    }

    update() {
        this.vx += this.ax;
        this.vy += this.ay;
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.x += this.vx;
        this.y += this.vy;
        this.ax = 0;
        this.ay = 0;
        this.life -= this.decay;
        if (this.life <= 0) this.alive = false;
    }

    draw(ctx) {
        const a = Math.max(0, this.life);
        const r = this.size * a;
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue},${this.sat}%,${this.lit}%,${a * 0.12})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue},${this.sat}%,${this.lit}%,${a * 0.9})`;
        ctx.fill();
    }
}

// ── Particle Cursor component ────────────────────────────────────────
function ParticleCursor() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const mouse = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: 0,
            vy: 0,
        };

        const onMove = (e) => {
            mouse.vx = e.clientX - mouse.x;
            mouse.vy = e.clientY - mouse.y;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener("mousemove", onMove);

        // Pre-allocated pool — no GC pressure
        const MAX = 260;
        const pool = Array.from({ length: MAX }, () => new Particle());

        const getDeadParticle = () => {
            for (let i = 0; i < MAX; i++) if (!pool[i].alive) return pool[i];
            return null;
        };

        function drawCursorDot(mx, my) {
            // Outer glow
            const grd = ctx.createRadialGradient(mx, my, 0, mx, my, 18);
            grd.addColorStop(0, "rgba(139,92,246,0.35)");
            grd.addColorStop(0.5, "rgba(79,142,247,0.15)");
            grd.addColorStop(1, "rgba(79,142,247,0)");
            ctx.beginPath();
            ctx.arc(mx, my, 18, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
            // Ring
            ctx.beginPath();
            ctx.arc(mx, my, 9, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(139,92,246,0.75)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
            // Core dot
            ctx.beginPath();
            ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.fill();
        }

        let spawnAcc = 0;
        let last = 0;
        let raf;
        const active = [];
        const CELL = 60;

        function loop(ts) {
            const dt = Math.min(ts - last, 32);
            last = ts;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn rate proportional to speed
            const spd = Math.hypot(mouse.vx, mouse.vy);
            spawnAcc += 0.6 + spd * 0.22;
            while (spawnAcc >= 1) {
                spawnAcc--;
                const p = getDeadParticle();
                if (p) p.spawn(mouse.x, mouse.y, mouse.vx, mouse.vy);
            }

            // Collect live particles
            active.length = 0;
            for (let i = 0; i < MAX; i++) {
                if (pool[i].alive) active.push(pool[i]);
            }

            // Grid-bucketed attraction — O(n) not O(n²)
            const grid = new Map();
            for (const p of active) {
                const key = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)}`;
                if (!grid.has(key)) grid.set(key, []);
                grid.get(key).push(p);
            }

            for (const p of active) {
                const gx = Math.floor(p.x / CELL);
                const gy = Math.floor(p.y / CELL);
                let count = 0;
                for (let dx = -1; dx <= 1 && count < 7; dx++) {
                    for (let dy = -1; dy <= 1 && count < 7; dy++) {
                        const bucket = grid.get(`${gx + dx},${gy + dy}`);
                        if (!bucket) continue;
                        for (const n of bucket) {
                            if (n === p || count >= 7) continue;
                            const ddx = n.x - p.x;
                            const ddy = n.y - p.y;
                            const dist = Math.hypot(ddx, ddy);
                            if (dist < 50 && dist > 1) {
                                const f = 0.0018 * (1 - dist / 50);
                                p.ax += ddx * f;
                                p.ay += ddy * f;
                                count++;
                            }
                        }
                    }
                }
                p.update();
            }

            // Draw particles
            for (const p of active) p.draw(ctx);

            // Cursor dot on top
            drawCursorDot(mouse.x, mouse.y);

            mouse.vx *= 0.75;
            mouse.vy *= 0.75;

            raf = requestAnimationFrame(loop);
        }

        raf = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="hidden md:block"
            aria-hidden="true"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 9999,
            }}
        />
    );
}

// ── Scroll Progress ──────────────────────────────────────────────────
function ScrollProgress() {
    const barRef = useRef(null);
    useEffect(() => {
        const fn = () => {
            const d = document.documentElement;
            if (barRef.current)
                barRef.current.style.width =
                    (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100 +
                    "%";
        };
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);
    return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}

// ── Page Transition ──────────────────────────────────────────────────
// IMPORTANT: mode="sync" lets the new page fade IN at the same time the
// old page fades OUT. mode="wait" held a blank gap between exit+entry
// whenever the lazy chunk was still loading when the exit finished.
function PageTransition({ children }) {
    const location = useLocation();
    return (
        <AnimatePresence mode="sync">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                style={{ willChange: "opacity" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// ── Lazy page wrapper (WITH page transition) ──────────────────────
// Used for public pages (Portfolio, Login) — animates on route change.
function LazyRoute({ component: Component }) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
                <PageTransition>
                    <Component />
                </PageTransition>
            </Suspense>
        </ErrorBoundary>
    );
}

// ── Lazy page wrapper (WITHOUT page transition) ────────────────────
// Used for AdminDashboard, which has its OWN internal <Routes>.
// PageTransition was keyed on location.pathname, so every admin sidebar
// click (/admin/experience → /admin/education) triggered AnimatePresence
// mode="wait" to exit-animate the ENTIRE dashboard shell, producing a
// blank white screen between every panel navigation.
function LazyRouteNoTransition({ component: Component }) {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
                <Component />
            </Suspense>
        </ErrorBoundary>
    );
}

function AppInner() {
    const { init } = useThemeStore();
    useEffect(() => {
        init();
    }, []);

    return (
        <>
            <GoogleAnalytics />
            <Clarity />
            <ParticleCursor />
            <ScrollProgress />
            <Toaster
                position="top-right"
                toastOptions={{
                    className: "toast-dark",
                    duration: 3000,
                    style: { fontFamily: "DM Sans, sans-serif" },
                }}
            />

            {/*
             * Routes no longer share a single Suspense.
             * Each route renders its own <LazyRoute> which has:
             *   ErrorBoundary → Suspense(PageSkeleton) → PageTransition → Page
             * This eliminates the blank white screen race condition entirely.
             */}
            <Routes>
                <Route
                    path="/*"
                    element={<LazyRoute component={Portfolio} />}
                />

                {/* Project detail pages — must come before the catch-all */}
                <Route
                    path="/projects/:slug"
                    element={<LazyRoute component={ProjectDetail} />}
                />

                {/* Blog pages */}
                <Route
                    path="/blog"
                    element={<LazyRoute component={Blog} />}
                />
                {/* Tag page — MUST come before /blog/:slug */}
                <Route
                    path="/blog/tag/:slug"
                    element={<LazyRoute component={TagPage} />}
                />
                <Route
                    path="/blog/:slug"
                    element={<LazyRoute component={BlogPost} />}
                />

                {/* Search */}
                <Route
                    path="/search"
                    element={<LazyRoute component={Search} />}
                />

                <Route
                    path="/admin/login"
                    element={<LazyRoute component={Login} />}
                />

                {/*
                 * AdminDashboard gets LazyRouteStatic (NO PageTransition).
                 * The dashboard has its own internal <Routes> for sub-panels.
                 * Using PageTransition here caused AnimatePresence mode="wait"
                 * to exit-animate the whole shell on every sidebar nav click,
                 * producing a blank screen between every admin panel.
                 */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute>
                            <LazyRouteNoTransition component={AdminDashboard} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            <AppInner />
        </BrowserRouter>
    );
}
