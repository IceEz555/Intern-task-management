import express from 'express';
import { createTask } from '../controllers/taskController.js';

const router = express.Router();

// Route: POST /api/tasks
// หน้าที่: รับข้อมูลงานใหม่
router.post('/', createTask);

export default router;
