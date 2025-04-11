import { Router } from 'express';
import { userRouter } from './userRoutes';
import { farmRouter } from './farmRoutes';
import { animalRouter } from './animalRoutes';
import { farmTypeRouter } from './farmTypeRoutes';
import { productionTypeRouter } from './productionTypeRoutes';

export const router = Router();

router.use('/users', userRouter);
router.use('/farms', farmRouter);
router.use('/animals', animalRouter);
router.use('/farm-types', farmTypeRouter);
router.use('/production-types', productionTypeRouter); 