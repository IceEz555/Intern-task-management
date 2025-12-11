import express from 'express';
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = express.Router();

// Route: POST /api/tasks
// หน้าที่: รับข้อมูลงานใหม่
router.post('/', createTask);
router.put('/:task_id', updateTask);
router.delete('/:id', deleteTask);
export default router;
