import express from 'express';
import { getProjects, createProject, getProjectById, addProjectMember, removeProjectMember, updateProject, deleteProject } from '../controllers/projectController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(checkAuth); // Protect all project routes

// GET /api/projects - Get all projects
router.get('/', getProjects);

// POST /api/projects - Create a new project
router.post('/', createProject);

// GET /api/projects/:id - Get project details
router.get('/:id', getProjectById);

// PUT /api/projects/:id - Update project details
router.put('/:id', updateProject);

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', deleteProject);

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', addProjectMember);

// DELETE /api/projects/:id/members/:userId - Remove member from project
router.delete('/:id/members/:userId', removeProjectMember);



export default router;
