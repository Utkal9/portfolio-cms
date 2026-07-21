import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── USER / ADMIN ────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin"], default: "admin" },
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = async function (candidate) {
    return bcrypt.compare(candidate, this.password);
};

// ── SITE CONFIG ─────────────────────────────────────────────────────────────
const siteConfigSchema = new mongoose.Schema(
    {
        hero: {
            name: { type: String, default: "Utkal Behera" },
            title: { type: String, default: "Full Stack Developer" },
            subtitle: {
                type: String,
                default: "MERN Stack · Next.js · Cloud & DevOps",
            },
            tagline: {
                type: String,
                default: "Open to Internships & Placements",
            },
            cta1Text: { type: String, default: "View Projects" },
            cta1Link: { type: String, default: "#projects" },
            cta2Text: { type: String, default: "Download CV" },
            cta2Link: { type: String, default: "/api/resume/download" },
            profileImage: { type: String, default: "" },
            profileImagePublicId: { type: String, default: "" },
            videoCV: { type: String, default: "" },
        },
        about: {
            description: { type: String, default: "" },
            profileImage: { type: String, default: "" },
            profileImagePublicId: { type: String, default: "" },
        },
        contact: {
            email: { type: String, default: "utkalbehera59@gmail.com" },
            receiverEmail: { type: String, default: "utkalbehera59@gmail.com" },
            phone: { type: String, default: "+91-9692743044" },
            location: { type: String, default: "Phagwara, Punjab" },
        },
        footer: {
            copyright: {
                type: String,
                default: "© 2025 Utkal Behera. All rights reserved.",
            },
            tagline: {
                type: String,
                default: "Built with ❤️ using MERN Stack",
            },
        },
        seo: {
            title: {
                type: String,
                default: "Utkal Behera | Full Stack Developer",
            },
            description: {
                type: String,
                default: "Portfolio of Utkal Behera - MERN Stack Developer",
            },
            keywords: {
                type: String,
                default: "MERN, Full Stack, React, Node.js, Portfolio",
            },
        },
        // Visibility toggles per section
        sections: {
            hero: { type: Boolean, default: true },
            about: { type: Boolean, default: true },
            skills: { type: Boolean, default: true },
            projects: { type: Boolean, default: true },
            experience: { type: Boolean, default: true },
            education: { type: Boolean, default: true },
            certificates: { type: Boolean, default: true },
            github: { type: Boolean, default: true },
            leetcode: { type: Boolean, default: true },
            contact: { type: Boolean, default: true },
        },
        // Section order (array of section keys)
        sectionOrder: {
            type: [String],
            default: [
                "hero",
                "about",
                "skills",
                "projects",
                "education",
                "experience",
                "certificates",
                "github",
                "leetcode",
                "contact",
            ],
        },
        theme: {
            primaryColor: { type: String, default: "#4f8ef7" }, // Default accent-blue
            accentColor: { type: String, default: "#8b5cf6" }, // <--- Fixed naming and default color
            backgroundColor: { type: String, default: "#0a0f1c" }, // Default dark-bg
            cardColor: { type: String, default: "#111827" }, // Default dark-card
            fontFamily: { type: String, default: "Plus Jakarta Sans" },
        },
    },
    { timestamps: true },
);

// ── PROJECT ──────────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        // SEO-friendly URL slug (auto-generated from title, editable by admin)
        slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
        description: { type: String, required: true },
        tagline: { type: String, default: "" }, // ← one-line punchy description
        problem: { type: String, default: "" }, // ← problem → solution statement
        // Rich detail fields for project landing pages (Phase 4)
        overview: { type: String, default: "" },      // extended overview
        challenges: { type: String, default: "" },    // technical challenges faced
        learnings: { type: String, default: "" },     // key learnings
        architecture: { type: String, default: "" },  // architecture notes
        metrics: { type: String, default: "" },       // impact metrics / stats
        features: [{ type: String }], // ← feature bullet points
        techStack: [{ type: String }],
        images: [{ url: String, publicId: String }],
        liveUrl: { type: String, default: "" },
        githubUrl: { type: String, default: "" },
        videoUrl: { type: String, default: "" },
        featured: { type: Boolean, default: false },
        category: { type: String, default: "Web" },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
        startDate: { type: String },
        endDate: { type: String },
        // Related projects for internal linking (stores project IDs)
        relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    },
    { timestamps: true },
);


// ── SKILL ────────────────────────────────────────────────────────────────────
const skillSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        icon: { type: String, default: "⚡" },
        level: { type: Number, min: 0, max: 100, required: true },
        category: {
            type: String,
            default: "Frontend",
            enum: [
                "Frontend",
                "Backend",
                "Cloud & DevOps",
                "Languages",
                "Tools",
            ],
        },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── EXPERIENCE ───────────────────────────────────────────────────────────────
const experienceSchema = new mongoose.Schema(
    {
        role: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: String, required: true },
        endDate: { type: String, default: "Present" },
        description: { type: String },
        techStack: [{ type: String }],
        certificate: { url: String, publicId: String },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── CERTIFICATE ──────────────────────────────────────────────────────────────
const certificateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        date: { type: String },
        image: { url: String, publicId: String },
        verificationUrl: { type: String, default: "" },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── MESSAGE ──────────────────────────────────────────────────────────────────
const messageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, default: "" },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

// ── SOCIAL LINK ──────────────────────────────────────────────────────────────
const socialLinkSchema = new mongoose.Schema(
    {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String },
        label: { type: String },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── RESUME ───────────────────────────────────────────────────────────────────
const resumeSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String },
        filename: { type: String },
        active: { type: Boolean, default: true },
    },
    { timestamps: true },
);

// ── EDUCATION ────────────────────────────────────────────────────────────────
const educationSchema = new mongoose.Schema(
    {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        field: { type: String },
        grade: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        location: { type: String },
        order: { type: Number, default: 0 },
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);
// ── SEMESTER ─────────────────────────────────────────────────────────────────
const courseSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    grade: {
        type: String,
        required: true,
        enum: ["O", "A+", "A", "B+", "B", "C", "F"],
    },
});

const semesterSchema = new mongoose.Schema(
    {
        semester: { type: Number, required: true }, // 1-8
        year: { type: String, required: true }, // e.g. "2022-23"
        label: { type: String, default: "" }, // e.g. "Odd Semester"
        courses: [courseSchema],
        visible: { type: Boolean, default: true },
    },
    { timestamps: true },
);
// Exports
export const User = mongoose.model("User", userSchema);
export const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);
export const Project = mongoose.model("Project", projectSchema);
export const Skill = mongoose.model("Skill", skillSchema);
export const Experience = mongoose.model("Experience", experienceSchema);
export const Certificate = mongoose.model("Certificate", certificateSchema);
export const Message = mongoose.model("Message", messageSchema);
export const SocialLink = mongoose.model("SocialLink", socialLinkSchema);
export const Resume = mongoose.model("Resume", resumeSchema);
export const Education = mongoose.model("Education", educationSchema);
export const Semester = mongoose.model("Semester", semesterSchema);

// ── BLOG ──────────────────────────────────────────────────────────────────────
const blogCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        description: { type: String, default: "" },
        color: { type: String, default: "#6366f1" }, // accent colour for UI
    },
    { timestamps: true },
);

const blogTagSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    },
    { timestamps: true },
);

const blogPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        excerpt: { type: String, default: "", maxlength: 300 }, // short summary for cards / meta
        content: { type: String, default: "" },                 // rich-text HTML from editor
        featuredImage: { url: String, publicId: String },
        author: { type: String, default: "Utkal Behera" },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogTag" }],

        // SEO fields (admin-editable)
        seoTitle: { type: String, default: "" },
        seoDescription: { type: String, default: "" },
        ogImage: { type: String, default: "" },    // URL override for OG image
        canonical: { type: String, default: "" },  // canonical URL if syndicating

        // Publishing
        status: {
            type: String,
            enum: ["draft", "published", "scheduled"],
            default: "draft",
        },
        publishedAt: { type: Date },
        scheduledAt: { type: Date },

        // Engagement
        readingTime: { type: Number, default: 0 }, // minutes, auto-computed
        views: { type: Number, default: 0 },

        // Internal linking
        relatedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    },
    { timestamps: true },
);

// Auto-compute reading time before save (200 wpm average)
blogPostSchema.pre("save", function (next) {
    if (this.content) {
        const words = this.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
        this.readingTime = Math.max(1, Math.ceil(words / 200));
    }
    // Set publishedAt when status transitions to published
    if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

export const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);
export const BlogTag = mongoose.model("BlogTag", blogTagSchema);
export const BlogPost = mongoose.model("BlogPost", blogPostSchema);

