// routes/userRoutes.js
import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // protect routes

const router = express.Router();

// Protected route: create user
router.post('/', verifyToken, createUser);

// Protected route: get all users
router.get('/', verifyToken, getUsers);

// Protected route: get user by ID
router.get('/:id', verifyToken, getUserById);

// Protected route: update user
router.patch('/:id', verifyToken, updateUser);

// Protected route: delete user
router.delete('/:id', verifyToken, deleteUser);

export default router;
