import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Award, Shield } from "lucide-react";
import { certsAPI } from "../services/api.js";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";
import { Shimmer } from "./ui/loading/index.js";

export default function Certifications() {
    const [certs, setCerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        certsAPI
            .getAll()
            .then((res) => setCerts(res.data?.data || []))
            .catch(() => setCerts([]))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && certs.length === 0) return null;

    return (
        <section
            id="certificates"
            className="py-20 bg-slate-50/50 dark:bg-dark-bg2/50"
        >
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-3 block">
                        Certifications
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Credentials &{" "}
                        <span className="grad-text">Achievements</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto mt-2 text-sm">
                        Verified certifications and course completions
                    </p>
                </motion.div>

                {loading && (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        role="status"
                        aria-label="Loading certifications"
                        aria-busy="true"
                    >
                        {Array(3).fill(0).map((_, i) => (
                            <div key={i} className="p-5 rounded-2xl border border-slate-200 dark:border-dark-border space-y-3">
                                <Shimmer className="w-full h-32 rounded-xl" />
                                <Shimmer className="w-3/4 h-5" />
                                <Shimmer className="w-1/2 h-3" />
                                <Shimmer className="w-24 h-6 rounded-full" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certs.map((cert, i) => (
                            <motion.div
                                key={cert._id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className="relative p-6 rounded-2xl
                  bg-white dark:bg-dark-card
                  border border-slate-100 dark:border-dark-border
                  hover:border-accent-blue/40 dark:hover:border-accent-blue/30
                  shadow-sm dark:shadow-none
                  hover:shadow-glow-blue/10
                  transition-all duration-300 group overflow-hidden"
                            >
                                <div
                                    className="absolute top-0 left-0 right-0 h-1
                  bg-gradient-to-r from-accent-blue to-accent-purple rounded-t-2xl
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                />

                                {cert.image?.url ? (
                                    <div
                                        className="mb-4 rounded-xl overflow-hidden
                    border border-slate-100 dark:border-dark-border"
                                    >
                                        <img
                                            src={optimizeCloudinaryImage(
                                                cert.image.url,
                                                600,
                                            )}
                                            alt={cert.title}
                                            loading="lazy"
                                            decoding="async"
                                            width={600}
                                            height={144}
                                            className="w-full h-36 object-cover
                        group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-2xl
                    bg-gradient-to-br from-accent-blue to-accent-purple
                    flex items-center justify-center mb-4 shadow-glow-blue"
                                    >
                                        <Award
                                            size={22}
                                            className="text-white"
                                        />
                                    </div>
                                )}

                                <h3
                                    className="font-bold text-slate-900 dark:text-white text-base mb-1
                  group-hover:text-accent-blue transition-colors leading-tight"
                                >
                                    {cert.title}
                                </h3>
                                <div className="text-sm text-accent-blue font-semibold mb-1">
                                    {cert.issuer}
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="text-xs text-slate-400">
                                        {cert.date}
                                    </div>
                                    <div
                                        className="flex items-center gap-1 px-2 py-0.5 rounded-full
                    bg-green-500/10 border border-green-500/20"
                                    >
                                        <Shield
                                            size={9}
                                            className="text-green-500"
                                        />
                                        <span className="text-[9px] text-green-500 font-bold">
                                            Verified
                                        </span>
                                    </div>
                                </div>

                                {cert.verificationUrl && (
                                    <a
                                        href={cert.verificationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 text-xs font-medium
                      text-slate-500 hover:text-accent-blue transition-colors"
                                    >
                                        <ExternalLink size={11} /> View
                                        Certificate
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
