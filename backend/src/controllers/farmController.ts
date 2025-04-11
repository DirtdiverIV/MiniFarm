import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Farm } from '../models/Farm';

const farmRepository = AppDataSource.getRepository(Farm);

export const createFarm = async (req: Request, res: Response) => {
  try {
    const { name, farm_type, production_type, image_path } = req.body;

    if (!name || !farm_type || !production_type) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newFarm = farmRepository.create({
      name,
      farm_type,
      production_type,
      image_path: image_path || null
    });

    const savedFarm = await farmRepository.save(newFarm);
    return res.status(201).json({ message: 'Granja creada', farm: savedFarm });
  } catch (error) {
    console.error('Error creando granja:', error);
    return res.status(500).json({ error: 'Error creando granja' });
  }
};

export const getAllFarms = async (req: Request, res: Response) => {
  try {
    const farms = await farmRepository.find();
    return res.json(farms);
  } catch (error) {
    console.error('Error obteniendo granjas:', error);
    return res.status(500).json({ error: 'Error al obtener granjas' });
  }
};

export const getFarmById = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    const farm = await farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      return res.status(404).json({ error: 'Granja no encontrada' });
    }
    return res.json(farm);
  } catch (error) {
    console.error('Error obteniendo granja:', error);
    return res.status(500).json({ error: 'Error al obtener granja' });
  }
};

export const updateFarm = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    const { name, farm_type, production_type, image_path } = req.body;

    const farm = await farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      return res.status(404).json({ error: 'Granja no encontrada' });
    }

    farm.name = name ?? farm.name;
    farm.farm_type = farm_type ?? farm.farm_type;
    farm.production_type = production_type ?? farm.production_type;
    farm.image_path = image_path ?? farm.image_path;

    const updatedFarm = await farmRepository.save(farm);
    return res.json({ message: 'Granja actualizada', farm: updatedFarm });
  } catch (error) {
    console.error('Error actualizando granja:', error);
    return res.status(500).json({ error: 'Error al actualizar granja' });
  }
};

export const deleteFarm = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    const farm = await farmRepository.findOne({ where: { id: farmId } });
    if (!farm) {
      return res.status(404).json({ error: 'Granja no encontrada' });
    }
    await farmRepository.remove(farm);
    return res.json({ message: 'Granja eliminada' });
  } catch (error) {
    console.error('Error eliminando granja:', error);
    return res.status(500).json({ error: 'Error al eliminar granja' });
  }
};
