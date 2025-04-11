import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const userRouter = Router();

// Rutas públicas
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Rutas protegidas
userRouter.get('/', authMiddleware, getAllUsers);
userRouter.put('/:id', authMiddleware, updateUser);
userRouter.delete('/:id', authMiddleware, deleteUser);
