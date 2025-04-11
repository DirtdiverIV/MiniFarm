import { Router } from 'express';
import {
  createProductionType,
  getAllProductionTypes,
  getProductionTypeById,
  updateProductionType,
  deleteProductionType
} from '../controllers/productionTypeController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const productionTypeRouter = Router();

// Rutas protegidas
productionTypeRouter.post('/', authMiddleware, createProductionType);
productionTypeRouter.get('/', getAllProductionTypes);
productionTypeRouter.get('/:id', getProductionTypeById);
productionTypeRouter.put('/:id', authMiddleware, updateProductionType);
productionTypeRouter.delete('/:id', authMiddleware, deleteProductionType); 