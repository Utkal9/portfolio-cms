import express from "express";
import {
    getPosts,
    getAllPosts,
    getPost,
    getAdjacentPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getTags,
    createTag,
    deleteTag,
} from "../controllers/blogController.js";
import auth from "../middleware/authMiddleware.js";
import { uploadAny } from "../config/cloudinary.js";

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────────────────
// IMPORTANT: specific paths must come before /:slug to avoid param collisions
router.get("/categories", getCategories);
router.get("/tags", getTags);
router.get("/", getPosts);
router.get("/:slug/adjacent", getAdjacentPosts); // prev/next navigation
router.get("/:slug", getPost);

// ── Admin-only routes ──────────────────────────────────────────────────────
router.get("/admin/all", auth, getAllPosts);
router.get("/admin/:id", auth, getPostById);

router.post("/", auth, uploadAny.single("featuredImage"), createPost);
router.put("/:id", auth, uploadAny.single("featuredImage"), updatePost);
router.delete("/:id", auth, deletePost);

// Categories (admin)
router.post("/categories", auth, createCategory);
router.put("/categories/:id", auth, updateCategory);
router.delete("/categories/:id", auth, deleteCategory);

// Tags (admin)
router.post("/tags", auth, createTag);
router.delete("/tags/:id", auth, deleteTag);

export default router;
