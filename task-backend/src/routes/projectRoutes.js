import express from 'express';
import { getProjects, createProject } from '../controllers/projectController.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', getProjects);

// POST /api/projects - Create a new project
router.post('/', createProject);

export default router;
