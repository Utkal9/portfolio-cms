import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Code2,
    ExternalLink,
    Trophy,
    RefreshCw,
    TrendingUp,
    Flame,
    Target,
    Award,
    Calendar,
    Zap,
} from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";

const USERNAME = "utkal59";

// Helper to detect dark mode
const isDarkMode = () => document.documentElement.classList.contains("dark");

// Compute streak from activities
const computeStreak = (activities) => {
    if (!activities || activities.length === 0)
        return { current: 0, longest: 0 };

    let currentStreak = 0;
    let longestStreak = 0;
    let streakRunning = true;

    const sorted = [...activities].sort(
        (a, b) => new Date(b.date) - new Date(a.date),
    );

    for (let i = 0; i < sorted.length; i++) {
        if (sorted[i].count > 0 && streakRunning) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            streakRunning = false;
        }
    }

    // Also compute forward streak
    let tempLongest = 0;
    let tempCurrent = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
        if (sorted[i].count > 0) {
            tempCurrent++;
            tempLongest = Math.max(tempLongest, tempCurrent);
        } else {
            tempCurrent = 0;
        }
    }

    return {
        current: currentStreak,
        longest: Math.max(longestStreak, tempLongest),
    };
};

// Error boundary component for the calendar (optional but safe)
class CalendarErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center py-6 text-slate-400 text-sm">
                    ⚠️ Calendar data could not be displayed
                </div>
            );
        }
        return this.props.children;
    }
}

export default function LeetcodeStats() {
    const [stats, setStats] = useState(null);
    const [calendarData, setCalendarData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [darkMode, setDarkMode] = useState(isDarkMode());
    const calendarRef = useRef(null);

    // Watch for dark mode changes
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    setDarkMode(isDarkMode());
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const base =
                import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const res = await fetch(`${base}/leetcode/${USERNAME}`);

            if (!res.ok) {
                console.warn(
                    `LeetCode stats fetch failed: ${res.status} ${res.statusText}`,
                );
                setError(true);
                return;
            }

            const data = await res.json();

            if (data && data.status === "success") {
                setStats(data);
            } else {
                setError(true);
            }

            // Fetch calendar data (rate-limited endpoint)
            try {
                const calRes = await fetch(
                    `https://alfa-leetcode-api.onrender.com/${USERNAME}/calendar`,
                );

                if (!calRes.ok) {
                    if (calRes.status === 429) {
                        console.warn(
                            "LeetCode calendar request rate-limited (429). Showing fallback calendar.",
                        );
                    } else {
                        console.warn(
                            `LeetCode calendar fetch failed: ${calRes.status} ${calRes.statusText}`,
                        );
                    }
                    // Do not call calRes.json() when non-OK — show fallback UI instead
                    setCalendarData(null);
                } else {
                    const calData = await calRes.json();
                    if (calData && calData.submissionCalendar) {
                        setCalendarData(calData.submissionCalendar);
                    } else {
                        setCalendarData(null);
                    }
                }
            } catch (calErr) {
                console.warn("Failed to fetch LeetCode calendar:", calErr);
                setCalendarData(null);
            }
        } catch (err) {
            console.warn("LeetCode fetch error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const bars = stats
        ? [
              {
                  label: "Easy",
                  solved: stats.easySolved || 0,
                  total: stats.totalEasy || 1,
                  color: "from-green-400 to-green-500",
                  bg: "bg-green-500/10",
                  text: "text-green-400",
              },
              {
                  label: "Medium",
                  solved: stats.mediumSolved || 0,
                  total: stats.totalMedium || 1,
                  color: "from-amber-400 to-orange-500",
                  bg: "bg-amber-500/10",
                  text: "text-amber-400",
              },
              {
                  label: "Hard",
                  solved: stats.hardSolved || 0,
                  total: stats.totalHard || 1,
                  color: "from-red-400 to-red-500",
                  bg: "bg-red-500/10",
                  text: "text-red-400",
              },
          ]
        : [];

    // Transform submission calendar
    const getCalendarActivities = useCallback(() => {
        const rawCalendar = calendarData || (stats && stats.submissionCalendar);
        if (!rawCalendar) return null;

        try {
            const calendarObj =
                typeof rawCalendar === "string"
                    ? JSON.parse(rawCalendar)
                    : rawCalendar;
            const activities = [];
            const today = new Date();

            for (let i = 365; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split("T")[0];
                activities.push({ date: dateStr, count: 0, level: 0 });
            }

            Object.keys(calendarObj).forEach((timestamp) => {
                const count = calendarObj[timestamp];
                const date = new Date(parseInt(timestamp) * 1000);
                const dateStr = date.toISOString().split("T")[0];
                const activity = activities.find((a) => a.date === dateStr);
                if (activity) {
                    activity.count += count;
                    if (activity.count === 1) activity.level = 1;
                    else if (activity.count >= 2 && activity.count <= 3)
                        activity.level = 2;
                    else if (activity.count >= 4 && activity.count <= 5)
                        activity.level = 3;
                    else if (activity.count >= 6) activity.level = 4;
                }
            });

            return activities;
        } catch (e) {
            console.error("Failed to parse calendar data", e);
            return null;
        }
    }, [calendarData, stats]);

    const activityData = getCalendarActivities();
    const streak = activityData
        ? computeStreak(activityData)
        : { current: 0, longest: 0 };

    // Responsive block size
    const getBlockSize = () => {
        if (typeof window !== "undefined" && window.innerWidth < 640) return 10;
        if (typeof window !== "undefined" && window.innerWidth < 768) return 11;
        return 12;
    };

    const [blockSize, setBlockSize] = useState(getBlockSize());

    useEffect(() => {
        const handleResize = () => setBlockSize(getBlockSize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ✅ CORRECT THEME FORMAT for react-activity-calendar
    // The library expects exactly 5 colors per theme (level0–level4).
    // We provide both light and dark arrays.
    const heatmapTheme = {
        light: [
            "#ebedf0", // level0 – no submissions
            "#9be9a8", // level1 – 1 submission
            "#40c463", // level2 – 2-3 submissions
            "#30a14e", // level3 – 4-5 submissions
            "#216e39", // level4 – 6+ submissions
        ],
        dark: [
            "#161b22", // dark background for level0
            "#0e4429", // level1
            "#006d32", // level2
            "#26a641", // level3
            "#39d353", // level4
        ],
    };

    // Acceptance rate
    const acceptanceRate =
        stats?.totalSolved && stats?.totalSubmissions
            ? (
                  (stats.totalSubmissions.accepted /
                      stats.totalSubmissions.total) *
                  100
              ).toFixed(1)
            : null;

    return (
        <section
            id="leetcode"
            className="py-16 md:py-24 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-transparent to-accent-purple/5 dark:from-accent-blue/10 dark:via-transparent dark:to-accent-purple/10 pointer-events-none" />

            <div className="section-container relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <span className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-3 block">
                        LeetCode
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Problem <span className="grad-text">Solving</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg mx-auto">
                        Data structures & algorithms practice with consistent
                        daily submissions
                    </p>
                </motion.div>

                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative group"
                    >
                        {/* Glowing border effect */}
                        <div className="absolute -inset-px bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-blue/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-slate-200/50 dark:border-dark-border shadow-xl dark:shadow-2xl overflow-hidden">
                            {/* Top Section */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 flex items-center justify-center">
                                        <Code2
                                            size={24}
                                            className="text-amber-400"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-slate-900 dark:text-white">
                                            {USERNAME}
                                        </div>
                                        <a
                                            href={`https://leetcode.com/u/${USERNAME}/`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-accent-blue hover:underline flex items-center gap-1 transition-colors"
                                        >
                                            @{USERNAME}
                                            <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {stats?.contestRating && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                                            <Award
                                                size={14}
                                                className="text-purple-400"
                                            />
                                            <div>
                                                <div className="text-xs font-bold text-purple-400">
                                                    {stats.contestRating}
                                                </div>
                                                <div className="text-[10px] text-slate-400">
                                                    Contest Rating
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={fetchStats}
                                        title="Refresh live stats"
                                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-dark-card2 text-slate-500 hover:text-accent-blue hover:bg-accent-blue/10 transition-all duration-300"
                                    >
                                        <RefreshCw
                                            size={14}
                                            className={
                                                loading ? "animate-spin" : ""
                                            }
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Loading State */}
                            <AnimatePresence mode="wait">
                                {loading && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="py-12"
                                    >
                                        <div className="space-y-4">
                                            <div className="h-16 bg-slate-100 dark:bg-dark-card2 rounded-xl animate-pulse" />
                                            <div className="space-y-3">
                                                <div className="h-10 bg-slate-100 dark:bg-dark-card2 rounded-lg animate-pulse" />
                                                <div className="h-10 bg-slate-100 dark:bg-dark-card2 rounded-lg animate-pulse" />
                                                <div className="h-10 bg-slate-100 dark:bg-dark-card2 rounded-lg animate-pulse" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Error State */}
                                {!loading && error && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <Zap
                                                size={28}
                                                className="text-red-400"
                                            />
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                            Unable to fetch LeetCode stats
                                        </p>
                                        <button
                                            onClick={fetchStats}
                                            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:shadow-lg transition-all duration-300"
                                        >
                                            Try Again
                                        </button>
                                    </motion.div>
                                )}

                                {/* Content */}
                                {!loading && !error && stats && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {/* Total Solved */}
                                        <div className="text-center mb-8">
                                            <motion.div
                                                initial={{
                                                    scale: 0.5,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                transition={{
                                                    delay: 0.2,
                                                    type: "spring",
                                                }}
                                                className="text-7xl font-extrabold grad-text mb-2"
                                            >
                                                {stats.totalSolved || 0}
                                            </motion.div>
                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Problems Solved
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                out of{" "}
                                                {stats.totalQuestions?.toLocaleString() ||
                                                    "—"}{" "}
                                                on LeetCode
                                            </div>
                                        </div>

                                        {/* Progress Bars */}
                                        <div className="space-y-5 mb-8">
                                            {bars.map((bar, idx) => (
                                                <motion.div
                                                    key={bar.label}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: idx * 0.1,
                                                    }}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`w-2 h-2 rounded-full ${bar.text.replace("text", "bg")}`}
                                                            />
                                                            <span
                                                                className={`text-sm font-semibold ${bar.text}`}
                                                            >
                                                                {bar.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                                {bar.solved}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                / {bar.total}
                                                            </span>
                                                            <span className="text-xs font-mono text-slate-500">
                                                                (
                                                                {(
                                                                    (bar.solved /
                                                                        bar.total) *
                                                                    100
                                                                ).toFixed(1)}
                                                                %)
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 dark:bg-dark-card2 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            animate={{
                                                                width: `${(bar.solved / bar.total) * 100}%`,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                ease: [
                                                                    0.22, 1,
                                                                    0.36, 1,
                                                                ],
                                                            }}
                                                            className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-blue/5 to-transparent border border-accent-blue/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Target
                                                        size={14}
                                                        className="text-accent-blue"
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        Rank
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                    #
                                                    {stats.ranking?.toLocaleString() ||
                                                        "—"}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-gradient-to-br from-accent-purple/5 to-transparent border border-accent-purple/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <TrendingUp
                                                        size={14}
                                                        className="text-accent-purple"
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        Acceptance
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {acceptanceRate || "—"}%
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Flame
                                                        size={14}
                                                        className="text-amber-400"
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        Current Streak
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {streak.current} days
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Award
                                                        size={14}
                                                        className="text-green-400"
                                                    />
                                                    <span className="text-xs text-slate-500">
                                                        Longest Streak
                                                    </span>
                                                </div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {streak.longest} days
                                                </div>
                                            </div>
                                        </div>

                                        {/* Calendar Heatmap - LeetCode Style */}
                                        {activityData && (
                                            <div className="pt-6 border-t border-slate-200 dark:border-dark-border">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar
                                                            size={14}
                                                            className="text-accent-blue"
                                                        />
                                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                            Submission Activity
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Horizontal scroll wrapper */}
                                                <div className="overflow-x-auto pb-4 custom-scrollbar">
                                                    <div className="min-w-[720px] md:min-w-full">
                                                        <ActivityCalendar
                                                            data={activityData}
                                                            blockSize={12} // Square cells (LeetCode uses ~12px)
                                                            blockMargin={3} // Small gap between cells
                                                            fontSize={11}
                                                            theme={{
                                                                light: [
                                                                    "#ebedf0", // level 0
                                                                    "#9be9a8", // level 1
                                                                    "#40c463", // level 2
                                                                    "#30a14e", // level 3
                                                                    "#216e39", // level 4
                                                                ],
                                                                dark: [
                                                                    "#161b22",
                                                                    "#0e4429",
                                                                    "#006d32",
                                                                    "#26a641",
                                                                    "#39d353",
                                                                ],
                                                            }}
                                                            labels={{
                                                                // Remove the total count line (LeetCode doesn't show it)
                                                                totalCount: false,
                                                                // Weekday headings: single letters
                                                                weekdays: [
                                                                    "S",
                                                                    "M",
                                                                    "T",
                                                                    "W",
                                                                    "T",
                                                                    "F",
                                                                    "S",
                                                                ],
                                                                // Month names as abbreviations
                                                                months: [
                                                                    "Jan",
                                                                    "Feb",
                                                                    "Mar",
                                                                    "Apr",
                                                                    "May",
                                                                    "Jun",
                                                                    "Jul",
                                                                    "Aug",
                                                                    "Sep",
                                                                    "Oct",
                                                                    "Nov",
                                                                    "Dec",
                                                                ],
                                                            }}
                                                            // Hide the color legend (LeetCode only shows tooltips)
                                                            hideColorLegend={
                                                                true
                                                            }
                                                            // Ensure we show all 365 days
                                                            showWeekdayLabels={
                                                                true
                                                            }
                                                            // Correct week start (Sunday = 0)
                                                            weekStart={0}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
