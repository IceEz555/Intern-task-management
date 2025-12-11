import express from 'express';
import { getProjects, createProject, getProjectById, addProjectMember, removeProjectMember, updateProject } from '../controllers/projectController.js';

const router = express.Router();

// GET /api/projects - Get all projects
router.get('/', getProjects);

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects/:id - Get project details
router.get('/:id', getProjectById);

// PUT /api/projects/:id - Update project details
router.put('/:id', updateProject);

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', addProjectMember);

// DELETE /api/projects/:id/members/:userId - Remove member from project
router.delete('/:id/members/:userId', removeProjectMember);



export default router;
