import { Router } from 'express';
import {
  createAnimal,
  getAnimalsByFarm,
  getAnimalById,
  updateAnimal,
  deleteAnimal
} from '../controllers/animalController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const animalRouter = Router();

animalRouter.get('/farm/:farmId', getAnimalsByFarm);
animalRouter.get('/:id', getAnimalById);

animalRouter.post('/', authMiddleware, createAnimal);
animalRouter.put('/:id', authMiddleware, updateAnimal);
animalRouter.delete('/:id', authMiddleware, deleteAnimal);
