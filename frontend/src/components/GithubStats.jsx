import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, GitFork, ExternalLink, RefreshCw } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import axios from "axios";
import { Shimmer } from "./ui/loading/index.js";

const USERNAME = "Utkal9";

// GitHub token from env to avoid rate limiting
const GH_HEADERS = import.meta.env.VITE_GITHUB_TOKEN
    ? { Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}` }
    : {};

export function GithubStats() {
    const [user, setUser] = useState(null);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [u, r] = await Promise.all([
                axios.get(`https://api.github.com/users/${USERNAME}`, {
                    headers: GH_HEADERS,
                }),
                axios.get(
                    `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`,
                    { headers: GH_HEADERS },
                ),
            ]);
            setUser(u.data);
            setRepos(r.data);
        } catch (err) {
            console.warn("GitHub API error:", err.message);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <section
            id="github"
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
                        GitHub
                    </span>
                    <h2 className="section-heading text-slate-900 dark:text-white">
                        Open Source <span className="grad-text">Activity</span>
                    </h2>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-4" role="status" aria-label="Loading GitHub stats" aria-busy="true">
                        <Shimmer className="h-24 rounded-2xl max-w-lg mx-auto" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array(6).fill(0).map((_, i) => (
                                <div key={i} className="p-4 rounded-2xl border border-dark-border space-y-2">
                                    <Shimmer className="w-3/4 h-4" />
                                    <Shimmer className="w-full h-3" />
                                    <Shimmer className="w-1/2 h-3" />
                                    <div className="flex gap-3 pt-1">
                                        <Shimmer className="w-12 h-3 rounded-full" />
                                        <Shimmer className="w-12 h-3 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="text-center py-12">
                        <p className="text-slate-400 text-sm mb-4">
                            GitHub API rate limit reached — try again in a
                            minute
                        </p>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-grad-main text-white text-sm font-semibold mx-auto
                hover:shadow-glow-blue transition-all"
                        >
                            <RefreshCw size={14} /> Try Again
                        </button>
                    </div>
                )}

                {/* Content */}
                {!loading && !error && (
                    <>
                        {/* User profile card */}
                        {user && (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col sm:flex-row items-center justify-center
                  gap-4 mb-10"
                            >
                                <div
                                    className="flex flex-col sm:flex-row items-center gap-4 p-5 rounded-2xl
                  bg-white dark:bg-dark-card
                  border border-slate-100 dark:border-dark-border
                  shadow-card-light dark:shadow-none w-full max-w-xl"
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        loading="lazy"
                                        decoding="async"
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-full border-2 border-accent-blue/30 flex-shrink-0"
                                    />

                                    <div className="flex-1 text-center sm:text-left">
                                        <div className="font-bold text-slate-900 dark:text-white text-base">
                                            {user.name || user.login}
                                        </div>
                                        <a
                                            href={user.html_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-accent-blue hover:underline
                        flex items-center gap-1 justify-center sm:justify-start"
                                        >
                                            <Github size={11} /> @{user.login}
                                        </a>
                                        {user.bio && (
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                                {user.bio}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-6">
                                        {[
                                            {
                                                label: "Repos",
                                                value: user.public_repos,
                                            },
                                            {
                                                label: "Followers",
                                                value: user.followers,
                                            },
                                            {
                                                label: "Following",
                                                value: user.following,
                                            },
                                        ].map((s) => (
                                            <div
                                                key={s.label}
                                                className="text-center"
                                            >
                                                <div className="text-lg font-extrabold grad-text">
                                                    {s.value}
                                                </div>
                                                <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                                                    {s.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* GitHub Contribution Heatmap */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center mb-12 overflow-x-auto p-6 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border"
                        >
                            <GitHubCalendar
                                username={USERNAME}
                                blockSize={12}
                                blockMargin={4}
                                fontSize={12}
                                theme={{
                                    light: [
                                        "#ebedf0",
                                        "#9be9a8",
                                        "#40c463",
                                        "#30a14e",
                                        "#216e39",
                                    ],
                                    dark: [
                                        "#161b22",
                                        "#0e4429",
                                        "#006d32",
                                        "#26a641",
                                        "#39d353",
                                    ],
                                }}
                            />
                        </motion.div>

                        {/* Repos grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {repos.map((repo, i) => (
                                <motion.a
                                    key={repo.id}
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: i * 0.06,
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="block p-5 rounded-2xl
                    bg-white dark:bg-dark-card
                    border border-slate-100 dark:border-dark-border
                    hover:border-accent-blue/40 dark:hover:border-accent-blue/30
                    hover:shadow-glow-blue/10
                    transition-all duration-300 group"
                                >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <Github
                                                size={14}
                                                className="text-slate-400 flex-shrink-0"
                                            />
                                            <h4
                                                className="font-bold text-sm text-slate-900 dark:text-white
                        group-hover:text-accent-blue transition-colors truncate"
                                            >
                                                {repo.name}
                                            </h4>
                                        </div>
                                        <ExternalLink
                                            size={12}
                                            className="text-slate-400 flex-shrink-0 mt-0.5
                      group-hover:text-accent-blue transition-colors"
                                        />
                                    </div>

                                    {repo.description && (
                                        <p
                                            className="text-xs text-slate-500 dark:text-slate-400
                      line-clamp-2 mb-3 leading-relaxed"
                                        >
                                            {repo.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-slate-400">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full bg-accent-blue" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Star size={11} />{" "}
                                            {repo.stargazers_count}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork size={11} />{" "}
                                            {repo.forks_count}
                                        </span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* View all button */}
                        <div className="text-center mt-8">
                            <a
                                href={`https://github.com/${USERNAME}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  border border-slate-200 dark:border-dark-border
                  text-slate-700 dark:text-slate-300 text-sm font-medium
                  hover:border-accent-blue/40 hover:text-accent-blue
                  transition-all"
                            >
                                <Github size={16} /> View all repositories
                            </a>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default GithubStats;
