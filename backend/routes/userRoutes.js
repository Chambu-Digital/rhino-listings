// routes/userRoutes.js
import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // protect routes

const router = express.Router();

// Protected route: get all users
router.get('/', verifyToken, getUsers);

export default router;
