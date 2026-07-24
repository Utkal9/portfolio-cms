import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Download, FileText, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { resumeAPI } from "../../services/api.js";
import { Spinner, Shimmer } from "../ui/loading/index.js";

export default function ResumeManager() {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchResume = async () => {
        try {
            const { data } = await resumeAPI.get();
            setResume(data.data);
        } catch {
            /* no resume yet */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResume();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files allowed");
            return;
        }
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("resume", file);
            const { data } = await resumeAPI.upload(fd);
            setResume(data.data);
            toast.success("Resume uploaded successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Resume</h2>
                <p className="text-sm text-slate-500">
                    Upload your CV/Resume PDF — visitors can download it
                </p>
            </div>

            {/* Upload zone */}
            <label
                className={`flex flex-col items-center justify-center h-40 border-2 border-dashed
        rounded-2xl mb-6 transition-all cursor-pointer group
        ${
            uploading
                ? "border-accent-blue/50 bg-accent-blue/5"
                : "border-dark-border hover:border-accent-blue/50 hover:bg-accent-blue/5"
        }`}
            >
                {uploading ? (
                    <>
                        <Spinner size="lg" color="text-accent-blue" className="mb-3" />
                        <span className="text-sm text-accent-blue font-medium">
                            Uploading to Cloudinary...
                        </span>
                    </>
                ) : (
                    <>
                        <Upload
                            size={28}
                            className="text-slate-500 group-hover:text-accent-blue mb-3 transition-colors"
                        />
                        <span className="text-sm text-slate-400 group-hover:text-accent-blue transition-colors font-medium">
                            Click to upload PDF
                        </span>
                        <span className="text-xs text-slate-600 mt-1">
                            PDF only · Max 10MB
                        </span>
                    </>
                )}
                <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleUpload}
                    disabled={uploading}
                />
            </label>

            {/* Current resume */}
            {loading ? (
                <Shimmer className="h-24 rounded-2xl" />
            ) : resume ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-5 p-5 bg-dark-card border border-dark-border rounded-2xl"
                >
                    <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={22} className="text-accent-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                            {resume.filename || "Resume.pdf"}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                            Uploaded{" "}
                            {new Date(resume.createdAt).toLocaleDateString()} ·
                            Active
                        </div>
                        <a
                            href={resume.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-accent-blue hover:underline mt-0.5 block truncate"
                        >
                            {resume.url}
                        </a>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <a
                            href={resume.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                bg-grad-main text-white text-xs font-semibold hover:shadow-glow-blue transition-all"
                        >
                            <Download size={13} /> Download
                        </a>
                        <label
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl
              border border-dark-border text-slate-400 hover:text-accent-blue
              hover:border-accent-blue/30 text-xs font-medium transition-all cursor-pointer"
                        >
                            <Upload size={13} /> Replace
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={handleUpload}
                            />
                        </label>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center py-10 text-slate-600">
                    <FileText size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No resume uploaded yet</p>
                    <p className="text-xs mt-1 text-slate-700">
                        Upload a PDF above to enable the Download CV button
                    </p>
                </div>
            )}
        </div>
    );
}
