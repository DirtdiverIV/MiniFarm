import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Farm } from '../models/Farm';
import { FarmType } from '../models/FarmType';
import { ProductionType } from '../models/ProductionType';
import { Animal } from '../models/Animal';

const farmRepository = AppDataSource.getRepository(Farm);
const farmTypeRepository = AppDataSource.getRepository(FarmType);
const productionTypeRepository = AppDataSource.getRepository(ProductionType);
const animalRepository = AppDataSource.getRepository(Animal);

export const createFarm = async (req: Request, res: Response) => {
  try {
    const { name, farm_type_id, production_type_id, image_path } = req.body;

    if (!name || !farm_type_id || !production_type_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const farmType = await farmTypeRepository.findOne({ where: { id: farm_type_id } });
    const productionType = await productionTypeRepository.findOne({ where: { id: production_type_id } });

    if (!farmType || !productionType) {
      return res.status(400).json({ error: 'Tipo de granja o producción no válido' });
    }

    const newFarm = farmRepository.create({
      name,
      farm_type: farmType,
      production_type: productionType,
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
    const farms = await farmRepository.find({
      relations: ['farm_type', 'production_type']
    });
    return res.json(farms);
  } catch (error) {
    console.error('Error obteniendo granjas:', error);
    return res.status(500).json({ error: 'Error al obtener granjas' });
  }
};

export const getFarmById = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    const farm = await farmRepository.findOne({
      where: { id: farmId },
      relations: ['farm_type', 'production_type']
    });
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
    const { name, farm_type_id, production_type_id, image_path } = req.body;

    const farm = await farmRepository.findOne({
      where: { id: farmId },
      relations: ['farm_type', 'production_type']
    });
    if (!farm) {
      return res.status(404).json({ error: 'Granja no encontrada' });
    }

    if (farm_type_id) {
      const farmType = await farmTypeRepository.findOne({ where: { id: farm_type_id } });
      if (!farmType) {
        return res.status(400).json({ error: 'Tipo de granja no válido' });
      }
      farm.farm_type = farmType;
    }

    if (production_type_id) {
      const productionType = await productionTypeRepository.findOne({ where: { id: production_type_id } });
      if (!productionType) {
        return res.status(400).json({ error: 'Tipo de producción no válido' });
      }
      farm.production_type = productionType;
    }

    farm.name = name ?? farm.name;
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

    // Primero eliminamos los animales asociados
    await animalRepository.delete({ farm: { id: farmId } });
    
    // Luego eliminamos la granja
    await farmRepository.remove(farm);
    return res.json({ message: 'Granja y sus animales asociados eliminados' });
  } catch (error) {
    console.error('Error eliminando granja:', error);
    return res.status(500).json({ error: 'Error al eliminar granja' });
  }
};
