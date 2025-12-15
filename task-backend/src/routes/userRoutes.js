import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, updateProfile } from '../controllers/userController.js';
const router = express.Router();

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/profile', updateProfile);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
export default router;
