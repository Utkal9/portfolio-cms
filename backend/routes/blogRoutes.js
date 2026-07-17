import express from "express";
import {
    getBlogs,
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} from "../controllers/blogController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/all", auth, getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.post("/", auth, createBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

export default router;
