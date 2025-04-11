import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { FarmType } from '../models/FarmType';

const farmTypeRepository = AppDataSource.getRepository(FarmType);

export const createFarmType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const newFarmType = farmTypeRepository.create({ name });
    const savedFarmType = await farmTypeRepository.save(newFarmType);
    return res.status(201).json({ message: 'Tipo de granja creado', farmType: savedFarmType });
  } catch (error) {
    console.error('Error creando tipo de granja:', error);
    return res.status(500).json({ error: 'Error creando tipo de granja' });
  }
};

export const getAllFarmTypes = async (req: Request, res: Response) => {
  try {
    const farmTypes = await farmTypeRepository.find();
    return res.json(farmTypes);
  } catch (error) {
    console.error('Error obteniendo tipos de granja:', error);
    return res.status(500).json({ error: 'Error al obtener tipos de granja' });
  }
};

export const getFarmTypeById = async (req: Request, res: Response) => {
  try {
    const farmTypeId = parseInt(req.params.id, 10);
    const farmType = await farmTypeRepository.findOne({ where: { id: farmTypeId } });
    if (!farmType) {
      return res.status(404).json({ error: 'Tipo de granja no encontrado' });
    }
    return res.json(farmType);
  } catch (error) {
    console.error('Error obteniendo tipo de granja:', error);
    return res.status(500).json({ error: 'Error al obtener tipo de granja' });
  }
};

export const updateFarmType = async (req: Request, res: Response) => {
  try {
    const farmTypeId = parseInt(req.params.id, 10);
    const { name } = req.body;

    const farmType = await farmTypeRepository.findOne({ where: { id: farmTypeId } });
    if (!farmType) {
      return res.status(404).json({ error: 'Tipo de granja no encontrado' });
    }

    farmType.name = name ?? farmType.name;
    const updatedFarmType = await farmTypeRepository.save(farmType);
    return res.json({ message: 'Tipo de granja actualizado', farmType: updatedFarmType });
  } catch (error) {
    console.error('Error actualizando tipo de granja:', error);
    return res.status(500).json({ error: 'Error al actualizar tipo de granja' });
  }
};

export const deleteFarmType = async (req: Request, res: Response) => {
  try {
    const farmTypeId = parseInt(req.params.id, 10);
    const farmType = await farmTypeRepository.findOne({ where: { id: farmTypeId } });
    if (!farmType) {
      return res.status(404).json({ error: 'Tipo de granja no encontrado' });
    }
    await farmTypeRepository.remove(farmType);
    return res.json({ message: 'Tipo de granja eliminado' });
  } catch (error) {
    console.error('Error eliminando tipo de granja:', error);
    return res.status(500).json({ error: 'Error al eliminar tipo de granja' });
  }
}; 