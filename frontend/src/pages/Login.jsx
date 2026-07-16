import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/index.js";

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
            {/* BG orbs */}
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5
        rounded-full blur-3xl pointer-events-none"
            />
            <div
                className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-purple/5
        rounded-full blur-3xl pointer-events-none"
            />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md"
            >
                <div className="bg-dark-card border border-dark-border rounded-3xl p-8 shadow-card-dark">
                    {/* ── Logo ── */}
                    <div className="text-center mb-8">
                        <img
                            src="/logo/logo-icon.webp"
                            alt="UB Logo"
                            loading="lazy"
                            decoding="async"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover shadow-glow-blue"
                        />
                        <h1
                            className="text-2xl font-bold text-white mb-1"
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                        >
                            Admin Panel
                        </h1>
                        <p className="text-sm text-slate-500">
                            Sign in to manage your portfolio
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-400
                uppercase tracking-wider mb-1.5"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            email: e.target.value,
                                        }))
                                    }
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
                            <label
                                className="block text-xs font-semibold text-slate-400
                uppercase tracking-wider mb-1.5"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={15}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type={show ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            password: e.target.value,
                                        }))
                                    }
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm
                    bg-dark-bg border border-dark-border text-slate-200
                    placeholder:text-slate-600
                    focus:outline-none focus:border-accent-blue
                    transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow((v) => !v)}
                                    aria-label={
                                        show ? "Hide password" : "Show password"
                                    }
                                    className="a11y-hit absolute right-3.5 top-1/2 -translate-y-1/2
                    text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {show ? (
                                        <EyeOff size={15} />
                                    ) : (
                                        <Eye size={15} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2
                py-3.5 rounded-xl bg-grad-main text-white font-bold text-sm
                shadow-glow-blue hover:shadow-glow-purple
                hover:scale-[1.02] transition-all duration-300 mt-2
                disabled:opacity-60 disabled:cursor-not-allowed
                disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div
                                    className="w-4 h-4 border-2 border-white/30
                    border-t-white rounded-full animate-spin"
                                />
                            ) : (
                                <>
                                    <Zap size={16} /> Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-dark-border text-center">
                        <a
                            href="/"
                            className="text-xs text-slate-500 hover:text-accent-blue transition-colors"
                        >
                            ← Back to Portfolio
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
