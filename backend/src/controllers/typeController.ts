import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { FarmType } from '../models/FarmType';
import { ProductionType } from '../models/ProductionType';

const farmTypeRepository = AppDataSource.getRepository(FarmType);
const productionTypeRepository = AppDataSource.getRepository(ProductionType);

export const getAllFarmTypes = async (req: Request, res: Response) => {
  try {
    const farmTypes = await farmTypeRepository.find();
    return res.json(farmTypes);
  } catch (error) {
    console.error('Error al obtener tipos de granja:', error);
    return res.status(500).json({ error: 'Error al obtener tipos de granja' });
  }
};

export const getAllProductionTypes = async (req: Request, res: Response) => {
  try {
    const productionTypes = await productionTypeRepository.find();
    return res.json(productionTypes);
  } catch (error) {
    console.error('Error al obtener tipos de producción:', error);
    return res.status(500).json({ error: 'Error al obtener tipos de producción' });
  }
}; 