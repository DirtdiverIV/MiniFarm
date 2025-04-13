import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Farm } from '../models/Farm';
import { FarmType } from '../models/FarmType';
import { ProductionType } from '../models/ProductionType';
import { Animal } from '../models/Animal';
import fs from 'fs';
import path from 'path';

const farmRepository = AppDataSource.getRepository(Farm);
const farmTypeRepository = AppDataSource.getRepository(FarmType);
const productionTypeRepository = AppDataSource.getRepository(ProductionType);
const animalRepository = AppDataSource.getRepository(Animal);

export const createFarm = async (req: Request, res: Response) => {
  try {
    const { name, farm_type_id, production_type_id, provincia, municipio } = req.body;

    if (!name || !farm_type_id || !production_type_id) {
      // Si hay un archivo cargado pero faltan datos, eliminamos el archivo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const farmType = await farmTypeRepository.findOne({ where: { id: farm_type_id } });
    const productionType = await productionTypeRepository.findOne({ where: { id: production_type_id } });

    if (!farmType || !productionType) {
      // Si hay un archivo cargado pero tipos inválidos, eliminamos el archivo
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ error: 'Tipo de granja o producción no válido' });
    }

    // Obtener la ruta de la imagen si se cargó
    const image_path = req.file ? `/uploads/farms/${req.file.filename}` : null;

    const newFarm = farmRepository.create({
      name,
      farm_type: farmType,
      production_type: productionType,
      image_path,
      provincia,
      municipio
    });

    const savedFarm = await farmRepository.save(newFarm);
    return res.status(201).json({ message: 'Granja creada', farm: savedFarm });
  } catch (error) {
    // Si hay un archivo cargado pero ocurre un error, eliminamos el archivo
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

const handleImageUpdate = async (farm: Farm, file: Express.Multer.File | undefined) => {
  if (!file) return;
  
  if (farm.image_path) {
    const oldImagePath = path.join(process.cwd(), farm.image_path.replace(/^\//, ''));
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  farm.image_path = `/uploads/farms/${file.filename}`;
};

const validateAndUpdateFarmType = async (farm: Farm, farmTypeId: number | undefined, file?: Express.Multer.File) => {
  if (!farmTypeId) return true;
  
  const farmType = await farmTypeRepository.findOne({ where: { id: farmTypeId } });
  if (!farmType) {
    if (file) {
      fs.unlinkSync(file.path);
    }
    return false;
  }
  farm.farm_type = farmType;
  return true;
};

const validateAndUpdateProductionType = async (farm: Farm, productionTypeId: number | undefined, file?: Express.Multer.File) => {
  if (!productionTypeId) return true;
  
  const productionType = await productionTypeRepository.findOne({ where: { id: productionTypeId } });
  if (!productionType) {
    if (file) {
      fs.unlinkSync(file.path);
    }
    return false;
  }
  farm.production_type = productionType;
  return true;
};

export const updateFarm = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    const { name, farm_type_id, production_type_id, provincia, municipio } = req.body;

    const farm = await farmRepository.findOne({
      where: { id: farmId },
      relations: ['farm_type', 'production_type']
    });

    if (!farm) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Granja no encontrada' });
    }

    // Validar y actualizar tipo de granja
    const isValidFarmType = await validateAndUpdateFarmType(farm, farm_type_id, req.file);
    if (!isValidFarmType) {
      return res.status(400).json({ error: 'Tipo de granja no válido' });
    }

    // Validar y actualizar tipo de producción
    const isValidProductionType = await validateAndUpdateProductionType(farm, production_type_id, req.file);
    if (!isValidProductionType) {
      return res.status(400).json({ error: 'Tipo de producción no válido' });
    }

    // Manejar actualización de imagen
    await handleImageUpdate(farm, req.file);

    farm.name = name ?? farm.name;
    farm.provincia = provincia !== undefined ? provincia : farm.provincia;
    farm.municipio = municipio !== undefined ? municipio : farm.municipio;

    const updatedFarm = await farmRepository.save(farm);
    return res.json({ message: 'Granja actualizada', farm: updatedFarm });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

    // Eliminar la imagen si existe
    if (farm.image_path) {
      const imagePath = path.join(process.cwd(), farm.image_path.replace(/^\//, ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
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
