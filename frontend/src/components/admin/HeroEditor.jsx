import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useSiteConfigStore } from "../../store/index.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";
import { configAPI } from "../../services/api.js";

const TAB_LIST = ["Hero", "About", "Contact", "SEO", "Footer", "Theme"];

export default function HeroEditor() {
    const { config, fetch, update } = useSiteConfigStore();
    const [activeTab, setActiveTab] = useState("Hero");
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch();
    }, []);
    useEffect(() => {
        if (config) setForm(config);
    }, [config]);

    const set = (section, key, val) =>
        setForm((f) => ({
            ...f,
            [section]: { ...(f[section] || {}), [key]: val },
        }));

    const handleSave = async () => {
        setSaving(true);
        try {
            await update({
                hero: form.hero,
                about: form.about,
                contact: form.contact,
                seo: form.seo,
                footer: form.footer,
                theme: form.theme,
            });
            toast.success("Changes saved!");
        } catch {
            toast.error("Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleProfileUpload = async (e, section) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("image", file);
            fd.append("section", section);
            const { data } = await configAPI.uploadProfile(fd);
            toast.success("Image uploaded!");
            fetch();
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const inputClass = `w-full px-3 py-2.5 rounded-xl text-sm bg-dark-bg border border-dark-border
    text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-accent-blue transition-colors`;
    const label = (text) => (
        <label className="block text-xs text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
            {text}
        </label>
    );

    const sections = {
        Hero: (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {label("Name")}
                        <input
                            value={form.hero?.name || ""}
                            onChange={(e) =>
                                set("hero", "name", e.target.value)
                            }
                            className={inputClass}
                            placeholder="Utkal Behera"
                        />
                    </div>
                    <div>
                        {label("Title")}
                        <input
                            value={form.hero?.title || ""}
                            onChange={(e) =>
                                set("hero", "title", e.target.value)
                            }
                            className={inputClass}
                            placeholder="Full Stack Developer"
                        />
                    </div>
                </div>
                <div>
                    {label("Subtitle")}
                    <input
                        value={form.hero?.subtitle || ""}
                        onChange={(e) =>
                            set("hero", "subtitle", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
                <div>
                    {label("Tagline / Badge Text")}
                    <input
                        value={form.hero?.tagline || ""}
                        onChange={(e) => set("hero", "tagline", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {label("CTA Button 1 Text")}
                        <input
                            value={form.hero?.cta1Text || ""}
                            onChange={(e) =>
                                set("hero", "cta1Text", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                    <div>
                        {label("CTA Button 2 Text")}
                        <input
                            value={form.hero?.cta2Text || ""}
                            onChange={(e) =>
                                set("hero", "cta2Text", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
                <div>
                    {label("Profile Image")}
                    <div className="flex items-center gap-4">
                        {form.hero?.profileImage && (
                            <img
                                src={optimizeCloudinaryImage(
                                    form.hero.profileImage,
                                    600,
                                )}
                                alt="Profile"
                                loading="lazy"
                                decoding="async"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full object-cover border-2 border-dark-border"
                            />
                        )}
                        <label
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-dark-border
              text-slate-400 hover:border-accent-blue/50 hover:text-accent-blue transition-all cursor-pointer text-sm"
                        >
                            <Upload size={15} />{" "}
                            {uploading ? "Uploading..." : "Upload Photo"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleProfileUpload(e, "hero")}
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <label
                        className="block text-[10px] text-slate-400 font-bold
    uppercase tracking-wider mb-1.5"
                    >
                        Video CV — Google Drive ID or YouTube URL
                    </label>
                    <input
                        value={form.hero?.videoCV || ""}
                        onChange={(e) => set("hero", "videoCV", e.target.value)}
                        className={inputClass}
                        placeholder="https://youtu.be/VIDEO_ID or 1NEe4Yi660D3P5eLqGm04MXYtb_MLHv_r"
                    />
                    <p className="text-[10px] text-slate-600 mt-1">
                        Paste a Google Drive file ID or any YouTube link / ID.
                    </p>
                </div>
            </div>
        ),
        About: (
            <div className="space-y-4">
                <div>
                    {label("About Description")}
                    <textarea
                        value={form.about?.description || ""}
                        onChange={(e) =>
                            set("about", "description", e.target.value)
                        }
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="Write about yourself..."
                    />
                </div>
                <div>
                    {label("About Profile Image")}
                    <div className="flex items-center gap-4">
                        {form.about?.profileImage && (
                            <img
                                src={optimizeCloudinaryImage(
                                    form.about.profileImage,
                                    600,
                                )}
                                alt="About"
                                loading="lazy"
                                decoding="async"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-xl object-cover border border-dark-border"
                            />
                        )}
                        <label
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-dark-border
              text-slate-400 hover:border-accent-blue/50 hover:text-accent-blue cursor-pointer text-sm transition-all"
                        >
                            <Upload size={15} /> Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    handleProfileUpload(e, "about")
                                }
                            />
                        </label>
                    </div>
                </div>
            </div>
        ),
        Contact: (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {label("Display Email")}
                        <input
                            value={form.contact?.email || ""}
                            onChange={(e) =>
                                set("contact", "email", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                    <div>
                        {label("Receiver Email (for form)")}
                        <input
                            value={form.contact?.receiverEmail || ""}
                            onChange={(e) =>
                                set("contact", "receiverEmail", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        {label("Phone")}
                        <input
                            value={form.contact?.phone || ""}
                            onChange={(e) =>
                                set("contact", "phone", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                    <div>
                        {label("Location")}
                        <input
                            value={form.contact?.location || ""}
                            onChange={(e) =>
                                set("contact", "location", e.target.value)
                            }
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>
        ),
        SEO: (
            <div className="space-y-4">
                <div>
                    {label("Page Title")}
                    <input
                        value={form.seo?.title || ""}
                        onChange={(e) => set("seo", "title", e.target.value)}
                        className={inputClass}
                    />
                </div>
                <div>
                    {label("Meta Description")}
                    <textarea
                        value={form.seo?.description || ""}
                        onChange={(e) =>
                            set("seo", "description", e.target.value)
                        }
                        rows={3}
                        className={`${inputClass} resize-none`}
                    />
                </div>
                <div>
                    {label("Keywords (comma-separated)")}
                    <input
                        value={form.seo?.keywords || ""}
                        onChange={(e) => set("seo", "keywords", e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>
        ),
        Footer: (
            <div className="space-y-4">
                <div>
                    {label("Copyright Text")}
                    <input
                        value={form.footer?.copyright || ""}
                        onChange={(e) =>
                            set("footer", "copyright", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
                <div>
                    {label("Tagline")}
                    <input
                        value={form.footer?.tagline || ""}
                        onChange={(e) =>
                            set("footer", "tagline", e.target.value)
                        }
                        className={inputClass}
                    />
                </div>
            </div>
        ),
        Theme: (
            <div className="space-y-6">
                <p className="text-xs text-slate-500 leading-relaxed">
                    Changes are applied live across the entire portfolio
                    instantly after saving.
                </p>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                            Primary Color (Blue)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={form.theme?.primaryColor || "#4f8ef7"}
                                onChange={(e) =>
                                    set("theme", "primaryColor", e.target.value)
                                }
                                className="w-12 h-10 rounded-lg border border-dark-border bg-dark-bg cursor-pointer"
                            />
                            <input
                                value={form.theme?.primaryColor || "#4f8ef7"}
                                onChange={(e) =>
                                    set("theme", "primaryColor", e.target.value)
                                }
                                className={inputClass}
                                placeholder="#4f8ef7"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                            Accent Color (Purple)
                        </label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={form.theme?.accentColor || "#8b5cf6"}
                                onChange={(e) =>
                                    set("theme", "accentColor", e.target.value)
                                }
                                className="w-12 h-10 rounded-lg border border-dark-border bg-dark-bg cursor-pointer"
                            />
                            <input
                                value={form.theme?.accentColor || "#8b5cf6"}
                                onChange={(e) =>
                                    set("theme", "accentColor", e.target.value)
                                }
                                className={inputClass}
                                placeholder="#8b5cf6"
                            />
                        </div>
                    </div>
                </div>

                {/* Live preview of gradient */}
                <div>
                    <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                        Gradient Preview
                    </label>
                    <div
                        className="h-12 rounded-xl"
                        style={{
                            background: `linear-gradient(135deg, ${form.theme?.primaryColor || "#4f8ef7"}, ${form.theme?.accentColor || "#8b5cf6"})`,
                        }}
                    />
                </div>

                {/* Preset combinations */}
                <div>
                    <label className="block text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                        Quick Presets
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            {
                                name: "Default",
                                primary: "#4f8ef7",
                                accent: "#8b5cf6",
                            },
                            {
                                name: "Ocean",
                                primary: "#06b6d4",
                                accent: "#0ea5e9",
                            },
                            {
                                name: "Sunset",
                                primary: "#f97316",
                                accent: "#ec4899",
                            },
                            {
                                name: "Forest",
                                primary: "#22c55e",
                                accent: "#10b981",
                            },
                            {
                                name: "Rose Gold",
                                primary: "#f43f5e",
                                accent: "#fb923c",
                            },
                            {
                                name: "Midnight",
                                primary: "#6366f1",
                                accent: "#8b5cf6",
                            },
                        ].map((preset) => (
                            <button
                                key={preset.name}
                                type="button"
                                onClick={() => {
                                    set(
                                        "theme",
                                        "primaryColor",
                                        preset.primary,
                                    );
                                    set("theme", "accentColor", preset.accent);
                                }}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl
              border border-dark-border hover:border-accent-blue/30
              transition-all group"
                            >
                                <div
                                    className="w-full h-6 rounded-lg"
                                    style={{
                                        background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                                    }}
                                />
                                <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                                    {preset.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reset button */}
                <button
                    type="button"
                    onClick={() => {
                        set("theme", "primaryColor", "#4f8ef7");
                        set("theme", "accentColor", "#8b5cf6");
                    }}
                    className="w-full py-2.5 rounded-xl border border-dark-border
        text-slate-400 hover:text-white hover:border-red-500/30
        text-sm font-medium transition-all"
                >
                    ↺ Reset to Default Colors (#4f8ef7 + #8b5cf6)
                </button>
            </div>
        ),
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Site Configuration
                    </h2>
                    <p className="text-sm text-slate-500">
                        Edit all content and settings for your portfolio
                    </p>
                </div>
                <div className="flex gap-2">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-border text-slate-400 hover:text-white text-sm transition-all"
                    >
                        <Eye size={15} /> Preview
                    </a>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue transition-all disabled:opacity-60"
                    >
                        <Save size={15} /> {saving ? "Saving..." : "Save All"}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-dark-card border border-dark-border rounded-xl p-1">
                {TAB_LIST.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
              ${activeTab === tab ? "bg-grad-main text-white shadow-glow-blue" : "text-slate-400 hover:text-white"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-dark-card border border-dark-border rounded-2xl p-6"
            >
                {sections[activeTab]}
            </motion.div>
        </div>
    );
}
