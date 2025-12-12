import express from 'express';
import { createTask, updateTask, deleteTask, getTasksByUser } from '../controllers/taskController.js';

const router = express.Router();

// Route: POST /api/tasks
// หน้าที่: รับข้อมูลงานใหม่
router.post('/', createTask);
router.put('/:task_id', updateTask);
router.delete('/:id', deleteTask);
router.get('/user/:userId', getTasksByUser); // For Personal Board

export default router;
