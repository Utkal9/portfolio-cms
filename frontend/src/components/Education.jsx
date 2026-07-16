import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    GraduationCap,
    ChevronDown,
    ChevronUp,
    BookOpen,
    Award,
    School,
    MapPin,
    Calendar,
} from "lucide-react";
import api from "../services/api.js";
import { semesterAPI } from "../services/api.js";

const GRADE_COLORS = {
    O: {
        bg: "bg-emerald-500/15",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
    },
    "A+": {
        bg: "bg-green-500/15",
        text: "text-green-400",
        border: "border-green-500/30",
    },
    A: {
        bg: "bg-blue-500/15",
        text: "text-blue-400",
        border: "border-blue-500/30",
    },
    "B+": {
        bg: "bg-cyan-500/15",
        text: "text-cyan-400",
        border: "border-cyan-500/30",
    },
    B: {
        bg: "bg-yellow-500/15",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
    },
    C: {
        bg: "bg-orange-500/15",
        text: "text-orange-400",
        border: "border-orange-500/30",
    },
    F: {
        bg: "bg-red-500/15",
        text: "text-red-400",
        border: "border-red-500/30",
    },
    IP: {
        bg: "bg-slate-500/15",
        text: "text-slate-400",
        border: "border-slate-500/30",
    },
};

function SGPACircle({ sgpa }) {
    const radius = 20;
    const stroke = 3.5;
    const normalizedRadius = radius - stroke;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (sgpa / 10) * circumference;

    const colorClass =
        sgpa >= 9
            ? "text-emerald-500"
            : sgpa >= 8
              ? "text-blue-500"
              : sgpa >= 7
                ? "text-yellow-500"
                : "text-red-500";

    return (
        <div className="relative flex items-center justify-center w-10 h-10 flex-shrink-0">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90"
                aria-hidden="true"
                focusable="false"
            >
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="text-slate-200 dark:text-dark-border"
                />
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + " " + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className={`${colorClass} transition-all duration-1000 ease-out`}
                />
            </svg>
            <span
                className={`absolute text-[9px] font-bold tracking-tight ${colorClass}`}
            >
                {Number(sgpa).toFixed(2)}
            </span>
        </div>
    );
}

function SemesterCard({ sem, index }) {
    const [open, setOpen] = useState(false);
    const totalCredits = sem.courses.reduce((s, c) => s + c.credits, 0);
    const isLeft = sem.semester % 2 !== 0;

    return (
        <div className="relative flex items-center justify-between w-full mb-8 group">
            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-grad-main flex items-center justify-center shadow-glow-blue text-white text-[10px] font-bold z-10 border-[3px] border-slate-50 dark:border-dark-bg transition-transform duration-300 group-hover:scale-110">
                S{sem.semester}
            </div>

            <motion.div
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`w-full ml-14 md:ml-0 md:w-[45%] ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}
            >
                <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden hover:border-accent-blue/40 transition-all duration-300 shadow-sm relative">
                    <div
                        className={`hidden md:block absolute top-4 w-3 h-3 bg-white dark:bg-dark-card border-t border-r border-slate-200 dark:border-dark-border transform rotate-45 ${isLeft ? "-right-[7px] border-l-0 border-b-0" : "-left-[7px] border-t-0 border-r-0 border-l border-b"}`}
                    />

                    <button
                        onClick={() => setOpen(!open)}
                        className="w-full p-4 text-left focus:outline-none relative z-10 bg-white dark:bg-dark-card"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                                        Semester {sem.semester}
                                    </h3>
                                    {sem.label && (
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 uppercase">
                                            {sem.label}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <BookOpen size={10} />{" "}
                                        {sem.courses.length} Courses
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Award size={10} /> {totalCredits}{" "}
                                        Credits
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex flex-col items-center">
                                    <SGPACircle sgpa={sem.sgpa} />
                                    <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                        SGPA
                                    </span>
                                </div>
                                <div className="text-slate-400 bg-slate-50 dark:bg-dark-bg2 p-1 rounded-md">
                                    {open ? (
                                        <ChevronUp size={14} />
                                    ) : (
                                        <ChevronDown size={14} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden bg-slate-50/50 dark:bg-dark-bg/30"
                            >
                                <div className="px-4 pb-4 border-t border-slate-100 dark:border-dark-border">
                                    <div className="overflow-x-auto mt-3">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-[9px] text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-dark-border">
                                                    <th className="text-left pb-2 font-bold">
                                                        Code
                                                    </th>
                                                    <th className="text-left pb-2 font-bold min-w-[120px]">
                                                        Course Name
                                                    </th>
                                                    <th className="text-center pb-2 font-bold">
                                                        Cr
                                                    </th>
                                                    <th className="text-center pb-2 font-bold">
                                                        Grade
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-dark-border/50">
                                                {sem.courses.map(
                                                    (course, i) => {
                                                        const gcolor =
                                                            GRADE_COLORS[
                                                                course.grade
                                                            ] ||
                                                            GRADE_COLORS["C"];
                                                        return (
                                                            <motion.tr
                                                                key={i}
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        i *
                                                                        0.04,
                                                                }}
                                                                className="hover:bg-slate-100 dark:hover:bg-dark-bg2 transition-colors"
                                                            >
                                                                <td className="py-2.5 pr-2">
                                                                    <span className="font-mono text-[10px] font-bold text-accent-blue bg-accent-blue/10 px-1.5 py-0.5 rounded">
                                                                        {
                                                                            course.code
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="py-2.5 pr-2 text-slate-700 dark:text-slate-300 text-xs font-medium">
                                                                    {
                                                                        course.name
                                                                    }
                                                                </td>
                                                                <td className="py-2.5 text-center text-slate-500 text-[11px]">
                                                                    {
                                                                        course.credits
                                                                    }
                                                                </td>
                                                                <td className="py-2.5 text-center">
                                                                    <span
                                                                        className={`inline-block px-2.5 py-1 rounded-lg
    text-xs font-bold border
    ${gcolor.bg} ${gcolor.text} ${gcolor.border}`}
                                                                    >
                                                                        {course.grade ===
                                                                        "IP"
                                                                            ? "⏳ IP"
                                                                            : course.grade}
                                                                    </span>
                                                                </td>
                                                            </motion.tr>
                                                        );
                                                    },
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default function Education() {
    const [education, setEducation] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [cgpa, setCgpa] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showTimeline, setShowTimeline] = useState(false);

    useEffect(() => {
        Promise.all([
            api.get("/education").catch(() => ({ data: { data: [] } })),
            semesterAPI.getAll().catch(() => ({ data: { data: [], cgpa: 0 } })),
        ])
            .then(([eduRes, semRes]) => {
                setEducation(eduRes.data?.data || []);
                setSemesters(semRes.data?.data || []);
                setCgpa(semRes.data?.cgpa || 0);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section
            id="education"
            className="py-20 bg-slate-50 dark:bg-dark-bg transition-colors duration-300 min-h-screen"
        >
            <div className="max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-xs font-bold tracking-[0.2em] text-accent-blue uppercase mb-2 block">
                        EDUCATION
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        Academic <span className="grad-text">Background</span>
                    </h2>
                </motion.div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-28 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border animate-pulse rounded-2xl"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {education.map((edu, index) => {
                            const isUniversityWithSemesters =
                                index === 0 && semesters.length > 0;
                            const Icon = isUniversityWithSemesters
                                ? GraduationCap
                                : School;

                            return (
                                <motion.div
                                    key={edu._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="w-full"
                                >
                                    <div
                                        onClick={() =>
                                            isUniversityWithSemesters &&
                                            setShowTimeline(!showTimeline)
                                        }
                                        className={`bg-white dark:bg-dark-card border ${isUniversityWithSemesters && showTimeline ? "border-accent-blue" : "border-slate-200 dark:border-dark-border"} rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${isUniversityWithSemesters ? "cursor-pointer hover:border-accent-blue/60 group shadow-sm hover:shadow-md" : "hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"} transition-all duration-300 relative overflow-hidden`}
                                    >
                                        <div className="flex items-center gap-5 w-full md:w-auto">
                                            <div
                                                className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-dark-bg2 flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-dark-border ${isUniversityWithSemesters ? "group-hover:bg-accent-blue/10 group-hover:border-accent-blue/30 transition-all" : ""}`}
                                            >
                                                <Icon
                                                    className={
                                                        isUniversityWithSemesters
                                                            ? "text-accent-blue"
                                                            : "text-slate-500 dark:text-slate-400"
                                                    }
                                                    size={
                                                        isUniversityWithSemesters
                                                            ? 26
                                                            : 24
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3
                                                    className={`text-lg font-bold text-slate-900 dark:text-white ${isUniversityWithSemesters ? "group-hover:text-accent-blue transition-colors" : ""}`}
                                                >
                                                    {edu.institution}
                                                </h3>
                                                <p
                                                    className={
                                                        isUniversityWithSemesters
                                                            ? "text-accent-blue font-medium text-sm mt-0.5"
                                                            : "text-slate-600 dark:text-slate-300 font-medium text-sm mt-0.5"
                                                    }
                                                >
                                                    {edu.degree}{" "}
                                                    {edu.field
                                                        ? `— ${edu.field}`
                                                        : ""}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    {edu.location && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin size={12} />{" "}
                                                            {edu.location}
                                                        </span>
                                                    )}
                                                    {(edu.startDate ||
                                                        edu.endDate) && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar
                                                                size={12}
                                                            />{" "}
                                                            {edu.startDate}{" "}
                                                            {edu.endDate
                                                                ? `- ${edu.endDate}`
                                                                : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                            {isUniversityWithSemesters && (
                                                <div className="flex flex-col items-end mr-2 md:mr-4">
                                                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider group-hover:text-slate-700 dark:group-hover:text-white transition-colors">
                                                        {showTimeline
                                                            ? "Close timeline"
                                                            : "Click to view semesters"}
                                                    </span>
                                                    {!showTimeline && (
                                                        <motion.div
                                                            animate={{
                                                                y: [0, 4, 0],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 1.5,
                                                            }}
                                                            className="text-accent-blue mt-1"
                                                        >
                                                            <ChevronDown
                                                                size={14}
                                                            />
                                                        </motion.div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center bg-slate-50 dark:bg-dark-bg2 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-dark-border min-w-[100px]">
                                                <span className="text-lg font-bold grad-text">
                                                    {isUniversityWithSemesters &&
                                                    cgpa
                                                        ? `${Number(cgpa).toFixed(2)} CGPA`
                                                        : edu.grade}
                                                </span>
                                                <span className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">
                                                    Grade
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {isUniversityWithSemesters && (
                                        <AnimatePresence>
                                            {showTimeline && (
                                                <motion.div
                                                    initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                    }}
                                                    exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.4,
                                                        ease: "easeInOut",
                                                    }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-10 pb-4 relative mt-2 border-t border-slate-200 dark:border-dark-border">
                                                        <div className="absolute left-6 md:left-1/2 top-4 bottom-0 w-px bg-slate-200 dark:bg-dark-border transform md:-translate-x-1/2" />
                                                        {semesters.map(
                                                            (sem, i) => (
                                                                <SemesterCard
                                                                    key={
                                                                        sem._id
                                                                    }
                                                                    sem={sem}
                                                                    index={i}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
