import { Router } from 'express';
import {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm
} from '../controllers/farmController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const farmRouter = Router();

farmRouter.get('/', getAllFarms);
farmRouter.get('/:id', getFarmById);

// Rutas protegidas
farmRouter.post('/', authMiddleware, createFarm);
farmRouter.put('/:id', authMiddleware, updateFarm);
farmRouter.delete('/:id', authMiddleware, deleteFarm);
