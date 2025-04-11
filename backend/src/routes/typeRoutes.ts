import { Router } from 'express';
import {
  getAllFarmTypes,
  getAllProductionTypes
} from '../controllers/typeController';

export const typeRouter = Router();

// Rutas públicas
typeRouter.get('/farm-types', getAllFarmTypes);
typeRouter.get('/production-types', getAllProductionTypes); 