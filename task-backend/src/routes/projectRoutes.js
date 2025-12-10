import express from 'express';
import { getProjects, createProject, getProjectById } from '../controllers/projectController.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', getProjects);

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects/:id - Get project details
router.get('/:id', getProjectById);



export default router;
