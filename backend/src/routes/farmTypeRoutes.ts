import { Router } from 'express';
import {
  createFarmType,
  getAllFarmTypes,
  getFarmTypeById,
  updateFarmType,
  deleteFarmType
} from '../controllers/farmTypeController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const farmTypeRouter = Router();

// Rutas protegidas
farmTypeRouter.post('/', authMiddleware, createFarmType);
farmTypeRouter.get('/', getAllFarmTypes);
farmTypeRouter.get('/:id', getFarmTypeById);
farmTypeRouter.put('/:id', authMiddleware, updateFarmType);
farmTypeRouter.delete('/:id', authMiddleware, deleteFarmType); 