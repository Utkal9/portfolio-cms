import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import siteConfigRoutes from "./routes/siteConfigRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import certRoutes from "./routes/certRoutes.js";
import semesterRoutes from "./routes/semesterRoutes.js";
const app = express();

// ── CORS — allow all vercel + localhost ───────────────────────────────
const allowedOrigins = [
    "https://utkalbehera.com",
    "https://www.utkalbehera.com",
    process.env.FRONTEND_URL,
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) return callback(null, true);

            if (
                origin.includes("localhost") ||
                origin.includes("vercel.app") ||
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            return callback(new Error(`CORS blocked: ${origin}`));
        },
        credentials: true,
    }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/gallery/certs", certRoutes);
app.use("/api/semesters", semesterRoutes);
// ── Health check ──────────────────────────────────────────────────────
app.get("/api/health", (_, res) =>
    res.json({ status: "ok", time: new Date() }),
);

// ── LeetCode GraphQL proxy ────────────────────────────────────────────
app.get("/api/leetcode/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum { difficulty count }
          }
          profile { ranking reputation }
        }
        allQuestionsCount { difficulty count }
      }
    `;

        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Referer: "https://leetcode.com",
                "User-Agent": "Mozilla/5.0",
            },
            body: JSON.stringify({ query, variables: { username } }),
        });

        const json = await response.json();

        if (!json.data?.matchedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const user = json.data.matchedUser;
        const allCounts = json.data.allQuestionsCount;
        const acStats = user.submitStats.acSubmissionNum;

        res.json({
            status: "success",
            username: user.username,
            ranking: user.profile.ranking,
            reputation: user.profile.reputation,
            easySolved:
                acStats.find((s) => s.difficulty === "Easy")?.count || 0,
            mediumSolved:
                acStats.find((s) => s.difficulty === "Medium")?.count || 0,
            hardSolved:
                acStats.find((s) => s.difficulty === "Hard")?.count || 0,
            totalSolved:
                acStats.find((s) => s.difficulty === "All")?.count || 0,
            totalEasy:
                allCounts.find((q) => q.difficulty === "Easy")?.count || 0,
            totalMedium:
                allCounts.find((q) => q.difficulty === "Medium")?.count || 0,
            totalHard:
                allCounts.find((q) => q.difficulty === "Hard")?.count || 0,
            totalQuestions:
                allCounts.find((q) => q.difficulty === "All")?.count || 0,
        });
    } catch (err) {
        console.error("LeetCode API error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ── Seed admin ────────────────────────────────────────────────────────
async function seedAdmin() {
    try {
        const { User } = await import("./models/index.js");
        const email =
            process.env.ADMIN_EMAIL_DEFAULT || "utkalbehera59@gmail.com";
        const password = process.env.ADMIN_PASSWORD_DEFAULT || "Admin@123";
        const existing = await User.findOne({ email });
        if (!existing) {
            await User.create({
                email,
                password,
                name: "Utkal Behera",
                role: "admin",
            });
            console.log(`👤 Admin user created — ${email}`);
        } else {
            console.log(`👤 Admin user already exists — ${email}`);
        }
    } catch (err) {
        console.error("❌ Seed admin error:", err.message);
    }
}
async function migrateSiteConfig() {
    try {
        const { SiteConfig } = await import("./models/index.js");
        const config = await SiteConfig.findOne();
        if (!config) return;

        // Add education to sectionOrder if missing
        if (!config.sectionOrder.includes("education")) {
            const idx = config.sectionOrder.indexOf("certificates");
            const newOrder = [...config.sectionOrder];
            newOrder.splice(idx, 0, "education");
            config.sectionOrder = newOrder;
            await config.save();
            console.log(
                "✅ SiteConfig migrated — education added to sectionOrder",
            );
        }

        // Add education to sections if missing
        if (config.sections?.education === undefined) {
            config.sections = { ...config.sections, education: true };
            await config.save();
            console.log(
                "✅ SiteConfig migrated — education section visibility added",
            );
        }
        if (!config.sectionOrder.includes("academic")) {
            const idx = config.sectionOrder.indexOf("education");
            const newOrder = [...config.sectionOrder];
            newOrder.splice(idx + 1, 0, "academic");
            config.sectionOrder = newOrder;
            await config.save();
            console.log("✅ academic section added to sectionOrder");
        }
        if (config.sections?.academic === undefined) {
            config.sections = { ...config.sections, academic: true };
            await config.save();
        }
    } catch (err) {
        console.error("❌ Migration error:", err.message);
    }
}
// ── MongoDB + Server ──────────────────────────────────────────────────
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ MongoDB connected");
        await seedAdmin();
        await migrateSiteConfig();
    })
    .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`),
);
