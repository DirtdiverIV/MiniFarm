import { Router } from 'express';
import {
  createFarm,
  getAllFarms,
  getFarmById,
  updateFarm,
  deleteFarm
} from '../controllers/farmController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadFarmImage, handleMulterError } from '../middlewares/uploadMiddleware';

export const farmRouter = Router();

farmRouter.get('/', getAllFarms);
farmRouter.get('/:id', getFarmById);

// Rutas protegidas
farmRouter.post('/', authMiddleware, uploadFarmImage, handleMulterError, createFarm);
farmRouter.put('/:id', authMiddleware, uploadFarmImage, handleMulterError, updateFarm);
farmRouter.delete('/:id', authMiddleware, deleteFarm);
