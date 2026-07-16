import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    MapPin,
    X,
    ExternalLink,
    Award,
    Calendar,
} from "lucide-react";
import { useExperienceStore } from "../store/index.js";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";

function ExperienceModal({ exp, onClose }) {
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 24 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto
            bg-white dark:bg-dark-card
            border border-slate-100 dark:border-dark-border
            rounded-3xl shadow-2xl"
                >
                    {/* Header gradient bar */}
                    <div className="h-1.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-t-3xl" />

                    <div className="p-8">
                        {/* Close */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-2xl bg-gradient-to-br
                  from-accent-blue/15 to-accent-purple/15
                  border border-accent-blue/20
                  flex items-center justify-center flex-shrink-0"
                                >
                                    <Briefcase
                                        size={24}
                                        className="text-accent-blue"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {exp.role}
                                    </h2>
                                    <p className="text-accent-blue font-semibold mt-0.5">
                                        {exp.company}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-slate-100 dark:bg-dark-bg2 text-slate-400
                  hover:text-white hover:bg-red-500/20 transition-all flex-shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <span
                                className="flex items-center gap-1.5 text-xs font-semibold
                px-3 py-1.5 rounded-full
                bg-accent-blue/10 text-accent-blue border border-accent-blue/20"
                            >
                                <Calendar size={11} />
                                {exp.startDate} – {exp.endDate || "Present"}
                            </span>
                            {exp.location && (
                                <span
                                    className="flex items-center gap-1.5 text-xs font-semibold
                  px-3 py-1.5 rounded-full
                  bg-slate-100 dark:bg-dark-bg2 text-slate-500 dark:text-slate-400
                  border border-slate-200 dark:border-dark-border"
                                >
                                    <MapPin size={11} /> {exp.location}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {exp.description && (
                            <div className="mb-6">
                                <h4
                                    className="text-xs font-bold text-slate-400 uppercase
                  tracking-widest mb-3"
                                >
                                    About this role
                                </h4>
                                <p
                                    className="text-slate-600 dark:text-slate-300 text-sm
                  leading-relaxed whitespace-pre-wrap"
                                >
                                    {exp.description}
                                </p>
                            </div>
                        )}

                        {/* Tech stack */}
                        {exp.techStack?.length > 0 && (
                            <div className="mb-6">
                                <h4
                                    className="text-xs font-bold text-slate-400 uppercase
                  tracking-widest mb-3"
                                >
                                    Technologies used
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {exp.techStack.map((t) => (
                                        <span
                                            key={t}
                                            className="text-xs px-3 py-1.5 rounded-xl font-semibold
                        bg-accent-blue/10 text-accent-blue
                        border border-accent-blue/20"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certificate */}
                        {exp.certificate?.url && (
                            <div className="mt-2">
                                <h4
                                    className="text-xs font-bold text-slate-400 uppercase
                  tracking-widest mb-3 flex items-center gap-2"
                                >
                                    <Award size={12} /> Certificate
                                </h4>
                                <div
                                    className="rounded-2xl overflow-hidden border
                  border-slate-100 dark:border-dark-border mb-3"
                                >
                                    <img
                                        src={optimizeCloudinaryImage(
                                            exp.certificate.url,
                                            600,
                                        )}
                                        alt="Experience Certificate"
                                        loading="lazy"
                                        decoding="async"
                                        width={600}
                                        height={288}
                                        className="w-full object-cover max-h-72"
                                    />
                                </div>
                                <a
                                    href={exp.certificate.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                    bg-gradient-to-r from-accent-blue to-accent-purple
                    text-white text-sm font-bold
                    hover:shadow-glow-blue transition-all"
                                >
                                    <ExternalLink size={14} /> View Full
                                    Certificate
                                </a>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function TimelineItem({ exp, index, onClick }) {
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
        flex-col items-start md:items-center gap-6 md:gap-12`}
        >
            {/* Card */}
            <div
                className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}
            >
                <motion.div
                    whileHover={{ y: -4 }}
                    onClick={() => onClick(exp)}
                    className="p-6 rounded-2xl bg-white dark:bg-dark-card
            border border-slate-100 dark:border-dark-border
            shadow-sm dark:shadow-none
            hover:border-accent-blue/40 dark:hover:border-accent-blue/30
            hover:shadow-glow-blue/10
            transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                    {/* Hover gradient top */}
                    <div
                        className="absolute top-0 left-0 right-0 h-0.5
            bg-gradient-to-r from-accent-blue to-accent-purple
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    {/* Click hint */}
                    <div
                        className="absolute top-3 right-3 opacity-0
            group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <span
                            className="text-[10px] font-bold text-accent-blue
              bg-accent-blue/10 border border-accent-blue/20
              px-2 py-0.5 rounded-full"
                        >
                            Click to view
                        </span>
                    </div>

                    {/* Date badge */}
                    <div
                        className={`flex items-center gap-2 mb-2
            ${isLeft ? "md:justify-end" : ""}`}
                    >
                        <span
                            className="text-xs px-2.5 py-1 rounded-full
              bg-accent-blue/10 text-accent-blue font-semibold"
                        >
                            {exp.startDate} – {exp.endDate || "Present"}
                        </span>
                        {exp.certificate?.url && (
                            <span
                                className="text-[10px] px-2 py-1 rounded-full
                bg-amber-500/10 text-amber-500
                border border-amber-500/20 font-bold
                flex items-center gap-1"
                            >
                                <Award size={9} /> Certified
                            </span>
                        )}
                    </div>

                    <h3
                        className="text-lg font-bold text-slate-900 dark:text-white mb-1
            group-hover:text-accent-blue transition-colors"
                    >
                        {exp.role}
                    </h3>
                    <p className="text-accent-blue font-semibold text-sm mb-2">
                        {exp.company}
                    </p>

                    {exp.location && (
                        <div
                            className={`flex items-center gap-1 text-xs text-slate-400 mb-3
              ${isLeft ? "md:justify-end" : ""}`}
                        >
                            <MapPin size={11} /> {exp.location}
                        </div>
                    )}

                    <p
                        className="text-slate-500 dark:text-slate-400 text-sm
            leading-relaxed line-clamp-2"
                    >
                        {exp.description}
                    </p>

                    {exp.techStack?.length > 0 && (
                        <div
                            className={`flex flex-wrap gap-1.5 mt-3
              ${isLeft ? "md:justify-end" : ""}`}
                        >
                            {exp.techStack.slice(0, 4).map((t) => (
                                <span
                                    key={t}
                                    className="text-[10px] px-2 py-0.5 rounded-full
                    bg-accent-blue/10 text-accent-blue
                    border border-accent-blue/20 font-medium"
                                >
                                    {t}
                                </span>
                            ))}
                            {exp.techStack.length > 4 && (
                                <span
                                    className="text-[10px] px-2 py-0.5 rounded-full
                  bg-slate-100 dark:bg-dark-bg2 text-slate-400"
                                >
                                    +{exp.techStack.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Center dot */}
            <div
                className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-full
        bg-gradient-to-br from-accent-blue to-accent-purple
        items-center justify-center shadow-glow-blue z-10"
            >
                <Briefcase size={18} className="text-white" />
            </div>

            {/* Spacer */}
            <div className="flex-1 hidden md:block" />
        </motion.div>
    );
}

export default function ExperienceTimeline() {
    const { experience, fetch, loading } = useExperienceStore();
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetch();
    }, []);

    return (
        <section
            id="experience"
            className="py-20 bg-slate-50/50 dark:bg-dark-bg2/50"
        >
            <div className="section-container">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span
                        className="text-xs font-bold tracking-widest
            text-accent-blue uppercase mb-3 block"
                    >
                        Experience
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Work <span className="grad-text">Timeline</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        Click any card to view full details & certificate
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    <div
                        className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px
            bg-gradient-to-b from-accent-blue/30 via-accent-purple/20 to-transparent"
                    />

                    <div className="flex flex-col gap-12">
                        {loading
                            ? Array(2)
                                  .fill(0)
                                  .map((_, i) => (
                                      <div
                                          key={i}
                                          className="skeleton h-36 rounded-2xl"
                                      />
                                  ))
                            : experience.map((exp, i) => (
                                  <TimelineItem
                                      key={exp._id}
                                      exp={exp}
                                      index={i}
                                      onClick={setSelected}
                                  />
                              ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selected && (
                <ExperienceModal
                    exp={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </section>
    );
}
