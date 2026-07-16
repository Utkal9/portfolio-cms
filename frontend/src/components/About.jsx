// About.jsx
import React, { useEffect, useState } from "react";
import api, { semesterAPI } from "../services/api.js";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Award } from "lucide-react";
import { optimizeCloudinaryImage } from "../utils/cloudinary.js";

export function About({ config }) {
    const about = config?.about || {};

    // State for dynamic CGPA
    const [cgpa, setCgpa] = useState("...");

    // Fetch exact CGPA from the semester backend on load
    useEffect(() => {
        semesterAPI
            .getAll()
            .then((res) => {
                if (res.data && res.data.cgpa) {
                    setCgpa(res.data.cgpa);
                } else {
                    setCgpa("N/A");
                }
            })
            .catch((err) => {
                console.warn("Failed to fetch CGPA", err);
                setCgpa("N/A");
            });
    }, []);

    // Calculate dynamic styles for the border loader
    const numCgpa = Number(cgpa) || 0;
    const pct = (numCgpa / 10) * 100;

    // Determine color based on CGPA
    const ringColorHex =
        numCgpa >= 9
            ? "#10b981" // emerald-500
            : numCgpa >= 8
              ? "#3b82f6" // blue-500
              : numCgpa >= 7
                ? "#eab308" // yellow-500
                : "#ef4444"; // red-500

    const textColorClass =
        numCgpa >= 9
            ? "text-emerald-500"
            : numCgpa >= 8
              ? "text-blue-500"
              : numCgpa >= 7
                ? "text-yellow-500"
                : "text-red-500";

    return (
        <section
            id="about"
            className="py-20 bg-white dark:bg-[#0a0f1c] transition-colors duration-300"
        >
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-bold tracking-[0.2em] text-accent-blue uppercase mb-2 block">
                        ABOUT ME
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Who I <span className="text-emerald-500">Am</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* --- Image Section with Squarish Border Loader --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <div className="relative inline-block">
                            {/* Outer Ring Loader Background */}
                            <div
                                className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-[2.5rem] p-1.5 md:p-2 shadow-xl relative z-0 transition-all duration-1000"
                                style={{
                                    // This draws the ring! Starts at top-center (0deg)
                                    background: `conic-gradient(from 0deg, ${ringColorHex} ${pct}%, rgba(100, 116, 139, 0.2) ${pct}%)`,
                                }}
                            >
                                {/* Inner gap to separate the ring from the image */}
                                <div className="w-full h-full rounded-[2.2rem] bg-white dark:bg-[#0a0f1c] p-2 flex items-center justify-center">
                                    {/* Actual Profile Image Container */}
                                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                                        {about.profileImage ? (
                                            <img
                                                src={optimizeCloudinaryImage(
                                                    about.profileImage,
                                                    600,
                                                )}
                                                alt="Profile"
                                                loading="lazy"
                                                decoding="async"
                                                width={600}
                                                height={600}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-7xl font-bold">
                                                UB
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* "Online Status" CGPA Badge at Bottom Right */}
                            <div className="absolute -bottom-3 -right-3 md:-bottom-5 md:-right-5 bg-white dark:bg-[#111827] border-4 border-white dark:border-[#0a0f1c] shadow-lg rounded-2xl p-3 md:p-4 flex flex-col items-center justify-center z-10 transform hover:scale-105 transition-transform">
                                <span
                                    className={`text-xl md:text-2xl font-black tracking-tight ${textColorClass}`}
                                >
                                    {numCgpa > 0 ? numCgpa.toFixed(2) : "..."}
                                </span>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                    CGPA
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- Text Section --- */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 md:text-lg">
                            {about.description ||
                                `I'm Utkal Behera, a passionate Full Stack Developer pursuing B.Tech in CSE at Lovely Professional University, Phagwara. I love building scalable web applications and have hands-on experience with MERN Stack, Next.js, and Cloud technologies.`}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: <GraduationCap size={18} />,
                                    label: "Education",
                                    value: "LPU, B.Tech CSE",
                                },
                                {
                                    icon: <MapPin size={18} />,
                                    label: "Location",
                                    value: "Phagwara, Punjab",
                                },
                                {
                                    icon: <Award size={18} />,
                                    label: "Rank 1",
                                    value: "NxtWave DSA (7k+ participants)",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-4 p-4 rounded-2xl
                    bg-slate-50 dark:bg-[#111827]
                    border border-slate-100 dark:border-slate-800 hover:border-accent-blue/40 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue flex-shrink-0 group-hover:bg-accent-blue group-hover:text-white transition-colors">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">
                                            {item.label}
                                        </div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-white">
                                            {item.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default About;
