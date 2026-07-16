import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { galleryAPI } from "../../services/api.js";
import { optimizeCloudinaryImage } from "../../utils/cloudinary.js";

export default function GalleryManager() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const { data } = await galleryAPI.getAll();
            setImages(data.data || []);
        } catch {
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        try {
            for (const file of files) {
                const fd = new FormData();
                fd.append("image", file);
                await galleryAPI.upload(fd);
            }
            toast.success(`${files.length} image(s) uploaded!`);
            fetchImages();
        } catch {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this image from Cloudinary?")) return;
        try {
            await galleryAPI.delete(id);
            setImages((imgs) => imgs.filter((i) => i._id !== id));
            toast.success("Deleted");
        } catch {
            toast.error("Error");
        }
    };

    const handleCopy = (url) => {
        navigator.clipboard.writeText(url);
        setCopied(url);
        toast.success("URL copied!");
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Media Gallery
                    </h2>
                    <p className="text-sm text-slate-500">
                        Powered by Cloudinary · {images.length} files
                    </p>
                </div>
                <label
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl
          bg-grad-main text-white text-sm font-semibold hover:shadow-glow-blue
          transition-all cursor-pointer ${uploading ? "opacity-60 pointer-events-none" : ""}`}
                >
                    <Upload size={16} />{" "}
                    {uploading ? "Uploading..." : "Upload Images"}
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </label>
            </div>

            {/* Drop zone */}
            <label
                className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-dark-border
        rounded-2xl mb-6 text-slate-500 hover:border-accent-blue/40 hover:text-accent-blue
        transition-all cursor-pointer group"
            >
                <Upload
                    size={24}
                    className="mb-2 opacity-40 group-hover:opacity-70"
                />
                <span className="text-sm">Drag & drop or click to upload</span>
                <span className="text-xs mt-1 opacity-50">
                    JPG, PNG, WebP — stored in Cloudinary
                </span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleUpload}
                />
            </label>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {Array(10)
                        .fill(0)
                        .map((_, i) => (
                            <div
                                key={i}
                                className="skeleton aspect-square rounded-xl"
                            />
                        ))}
                </div>
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {images.map((img) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-dark-border"
                        >
                            <img
                                src={optimizeCloudinaryImage(img.url, 900)}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                width={900}
                                height={900}
                                className="w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                transition-opacity flex items-center justify-center gap-2"
                            >
                                <button
                                    onClick={() => handleCopy(img.url)}
                                    className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm text-white
                    hover:bg-accent-blue/60 flex items-center justify-center transition-colors"
                                >
                                    {copied === img.url ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(img._id)}
                                    className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm text-white
                    hover:bg-red-500/60 flex items-center justify-center transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {images.length === 0 && !loading && (
                        <div className="col-span-5 text-center py-16 text-slate-600 text-sm">
                            No images yet — upload some!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
