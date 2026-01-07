import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { checkAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(checkAuth);

router.get('/stats', getDashboardStats);

export default router;
