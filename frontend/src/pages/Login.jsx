import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/index.js";
import { ButtonLoader } from "../components/ui/loading/index.js";

export default function Login() {
    const { login, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) navigate("/admin");
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success("Welcome back! 👋");
            navigate("/admin");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* BG gradient orbs */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                           rounded-full blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(79,142,247,0.08) 0%, transparent 70%)" }}
            />
            <div
                className="absolute bottom-0 right-1/4 w-72 h-72 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", filter: "blur(40px)" }}
            />

            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-card-dark">
                    {/* ── Logo ── */}
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-4">
                            <img
                                src="/logo/logo-icon.webp"
                                alt="UB Logo"
                                loading="lazy"
                                decoding="async"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-2xl object-cover shadow-glow-blue"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Admin Panel
                        </h1>
                        <p className="text-sm text-slate-500">Sign in to manage your portfolio</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Email
                            </label>
                            <div className="relative flex items-center">
                                <Mail
                                    size={15}
                                    className="absolute left-3.5 text-slate-500 pointer-events-none z-10"
                                />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                    placeholder="admin@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm
                                               bg-dark-bg border border-dark-border text-slate-200
                                               placeholder:text-slate-600
                                               focus:outline-none focus:border-accent-blue
                                               transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative flex items-center">
                                <Lock
                                    size={15}
                                    className="absolute left-3.5 text-slate-500 pointer-events-none z-10"
                                />
                                <input
                                    type={show ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 rounded-xl text-sm
                                               bg-dark-bg border border-dark-border text-slate-200
                                               placeholder:text-slate-600
                                               focus:outline-none focus:border-accent-blue
                                               transition-colors"
                                />
                                {/* Eye toggle — absolutely on the right inside the input row */}
                                <button
                                    type="button"
                                    onClick={() => setShow((v) => !v)}
                                    aria-label={show ? "Hide password" : "Show password"}
                                    className="absolute right-3.5 flex items-center justify-center
                                               w-6 h-6 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <ButtonLoader
                            type="submit"
                            loading={loading}
                            loadingText="Signing in…"
                            className="w-full py-3.5 rounded-xl bg-grad-main text-white font-bold text-sm
                                       shadow-glow-blue hover:shadow-glow-purple
                                       hover:scale-[1.02] transition-all duration-300 mt-1
                                       disabled:hover:scale-100"
                        >
                            <Zap size={16} /> Sign In
                        </ButtonLoader>
                    </form>

                    <div className="mt-6 pt-5 border-t border-dark-border text-center">
                        <a
                            href="/"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-accent-blue transition-colors"
                        >
                            <ArrowLeft size={12} /> Back to Portfolio
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
