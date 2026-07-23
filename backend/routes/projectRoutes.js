import express from 'express';
import {
    getProjects,
    getAllProjects,
    getProject,
    getProjectBySlug,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    migrateSlugs,
} from '../controllers/projectController.js';
import auth from '../middleware/authMiddleware.js';
import { uploadProject } from '../config/cloudinary.js';

const router = express.Router();

// ── Public routes ──────────────────────────────────────────────────────────
router.get('/', getProjects);
// IMPORTANT: static paths before /:id to avoid CastError
router.get('/slug/:slug', getProjectBySlug);
router.get('/all', auth, getAllProjects);
router.get('/:id', getProject);

// ── Admin routes ───────────────────────────────────────────────────────────
router.post('/', auth, uploadProject.array('images', 5), createProject);
// migrate-slugs MUST come before /:id
router.post('/migrate-slugs', auth, migrateSlugs);
router.put('/:id', auth, uploadProject.array('images', 5), updateProject);
router.delete('/:id', auth, deleteProject);
router.patch('/reorder', auth, reorderProjects);

export default router;

