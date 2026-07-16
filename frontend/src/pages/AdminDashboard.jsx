import { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    Zap,
    Briefcase,
    GraduationCap,
    MessageSquare,
    Image,
    FileText,
    Link2,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Award,
    BookOpen,
} from "lucide-react";
import { useAuthStore, useMessageStore } from "../store/index.js";

import DashboardStats from "../components/admin/DashboardStats.jsx";
import ProjectManager from "../components/admin/ProjectManager.jsx";
import SkillManager from "../components/admin/SkillManager.jsx";
import ExperienceManager from "../components/admin/ExperienceManager.jsx";
import MessageViewer from "../components/admin/MessageViewer.jsx";
import GalleryManager from "../components/admin/GalleryManager.jsx";
import SocialManager from "../components/admin/SocialManager.jsx";
import HeroEditor from "../components/admin/HeroEditor.jsx";
import ResumeManager from "../components/admin/ResumeManager.jsx";
import CertificationManager from "../components/admin/CertificationManager.jsx";
import EducationManager from "../components/admin/EducationManager.jsx";
import SemesterManager from "../components/admin/SemesterManager.jsx";
const NAV = [
    {
        to: "/admin",
        icon: <LayoutDashboard size={17} />,
        label: "Dashboard",
        end: true,
    },
    { to: "/admin/hero", icon: <Settings size={17} />, label: "Site Config" },
    {
        to: "/admin/projects",
        icon: <FolderKanban size={17} />,
        label: "Projects",
    },
    { to: "/admin/skills", icon: <Zap size={17} />, label: "Skills" },
    {
        to: "/admin/experience",
        icon: <Briefcase size={17} />,
        label: "Experience",
    },
    {
        to: "/admin/education",
        icon: <GraduationCap size={17} />,
        label: "Education",
    },
    { to: "/admin/certs", icon: <Award size={17} />, label: "Certifications" },
    {
        to: "/admin/messages",
        icon: <MessageSquare size={17} />,
        label: "Messages",
        badge: true,
    },
    { to: "/admin/gallery", icon: <Image size={17} />, label: "Media" },
    { to: "/admin/social", icon: <Link2 size={17} />, label: "Social Links" },
    { to: "/admin/resume", icon: <FileText size={17} />, label: "Resume" },
    {
        to: "/admin/semesters",
        icon: <BookOpen size={17} />,
        label: "Semesters",
    },
];

function Sidebar({ onClose }) {
    const { logout } = useAuthStore();
    const { unread } = useMessageStore();
    const navigate = useNavigate();

    return (
        <aside className="flex flex-col bg-dark-bg2 border-r border-dark-border w-64 h-full">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-dark-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img
                        src="/logo/logo-icon.webp"
                        alt="UB"
                        className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                        <div className="text-sm font-bold text-white leading-tight">
                            Admin Panel
                        </div>
                        <div className="text-[10px] text-slate-500">
                            Portfolio CMS
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="md:hidden ml-auto text-slate-400 hover:text-white"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 overflow-y-auto">
                {NAV.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => {
                            if (window.innerWidth < 768) onClose();
                        }}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium
              transition-all duration-200 relative
              ${
                  isActive
                      ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/20"
                      : "text-slate-400 hover:text-white hover:bg-dark-card2"
              }`
                        }
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.badge && unread > 0 && (
                            <span
                                className="ml-auto text-[10px] font-bold px-1.5 py-0.5
                rounded-full bg-accent-blue text-white flex-shrink-0"
                            >
                                {unread}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-dark-border">
                <a
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
            text-slate-400 hover:text-white hover:bg-dark-card2 transition-all"
                >
                    <GraduationCap size={17} /> View Portfolio
                </a>
                <button
                    onClick={() => {
                        logout();
                        navigate("/admin/login");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all mt-1"
                >
                    <LogOut size={17} /> Logout
                </button>
            </div>
        </aside>
    );
}

export default function AdminDashboard() {
    const { user, loadMe } = useAuthStore();
    const { fetch: fetchMsgs, unread } = useMessageStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        loadMe();
        fetchMsgs();
    }, []);

    return (
        <div className="flex h-screen bg-dark-bg3 text-slate-100 overflow-hidden font-body">
            {/* Sidebar */}
            <div
                className={`
        fixed inset-y-0 left-0 z-30 md:relative md:z-auto
        ${sidebarOpen ? "flex" : "hidden md:flex"}
        flex-col
      `}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header
                    className="h-16 flex items-center justify-between px-6
          bg-dark-bg2 border-b border-dark-border flex-shrink-0"
                >
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen((v) => !v)}
                            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center
                bg-dark-card text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={18} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-white">
                                Portfolio CMS
                            </h1>
                            <p className="text-xs text-slate-500">
                                Welcome back,{" "}
                                {user?.name?.split(" ")[0] || "Admin"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {unread > 0 && (
                            <div className="relative">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center
                  bg-dark-card text-slate-400"
                                >
                                    <Bell size={16} />
                                </div>
                                <span
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full
                  bg-accent-blue text-white text-[9px] font-bold
                  flex items-center justify-center"
                                >
                                    {unread}
                                </span>
                            </div>
                        )}
                        <div
                            className="w-9 h-9 rounded-xl bg-grad-main flex items-center justify-center
              text-white text-xs font-bold shadow-glow-blue"
                        >
                            {user?.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase() || "UB"}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Routes>
                        <Route index element={<DashboardStats />} />
                        <Route path="hero" element={<HeroEditor />} />
                        <Route path="projects" element={<ProjectManager />} />
                        <Route path="skills" element={<SkillManager />} />
                        <Route
                            path="experience"
                            element={<ExperienceManager />}
                        />
                        <Route
                            path="education"
                            element={<EducationManager />}
                        />
                        <Route
                            path="certs"
                            element={<CertificationManager />}
                        />
                        <Route path="messages" element={<MessageViewer />} />
                        <Route path="gallery" element={<GalleryManager />} />
                        <Route path="social" element={<SocialManager />} />
                        <Route path="resume" element={<ResumeManager />} />
                        <Route path="semesters" element={<SemesterManager />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
