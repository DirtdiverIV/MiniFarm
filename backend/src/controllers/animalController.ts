import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Animal } from '../models/Animal';
import { Farm } from '../models/Farm';

const animalRepository = AppDataSource.getRepository(Animal);
const farmRepository = AppDataSource.getRepository(Farm);

export const createAnimal = async (req: Request, res: Response) => {
  try {
    const {
      farm_id,
      animal_type,
      identification_number,
      weight,
      estimated_production,
      sanitary_register,
      age,
      incidents
    } = req.body;

    if (!farm_id || !animal_type) {
      return res.status(400).json({ error: 'farm_id y animal_type son obligatorios' });
    }

   
    const farm = await farmRepository.findOne({ where: { id: farm_id } });
    if (!farm) {
      return res.status(404).json({ error: 'La granja especificada no existe' });
    }

    const newAnimal = animalRepository.create({
      animal_type,
      identification_number: identification_number ?? null,
      weight: weight ?? null,
      estimated_production: estimated_production ?? null,
      sanitary_register: sanitary_register ?? null,
      age: age ?? null,
      incidents: incidents ?? null,
      farm 
    });

    const savedAnimal = await animalRepository.save(newAnimal);
    return res.status(201).json({ message: 'Animal creado', animal: savedAnimal });
  } catch (error) {
    console.error('Error creando animal:', error);
    return res.status(500).json({ error: 'Error al crear animal' });
  }
};

export const getAnimalsByFarm = async (req: Request, res: Response) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    const animals = await animalRepository.find({ where: { farm: { id: farmId } } });
    return res.json(animals);
  } catch (error) {
    console.error('Error al obtener animales:', error);
    return res.status(500).json({ error: 'Error al obtener animales' });
  }
};

export const getAnimalById = async (req: Request, res: Response) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const animal = await animalRepository.findOne({
      where: { id: animalId },
      relations: ['farm']
    });
    if (!animal) {
      return res.status(404).json({ error: 'Animal no encontrado' });
    }
    return res.json(animal);
  } catch (error) {
    console.error('Error al obtener animal:', error);
    return res.status(500).json({ error: 'Error al obtener animal' });
  }
};

export const updateAnimal = async (req: Request, res: Response) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const {
      farm_id,
      animal_type,
      identification_number,
      weight,
      estimated_production,
      sanitary_register,
      age,
      incidents
    } = req.body;

    const animal = await animalRepository.findOne({ where: { id: animalId } });
    if (!animal) {
      return res.status(404).json({ error: 'Animal no encontrado' });
    }

    if (farm_id) {
      const farm = await farmRepository.findOne({ where: { id: farm_id } });
      if (!farm) {
        return res.status(404).json({ error: 'La granja especificada no existe' });
      }
      animal.farm = farm;
    }

    animal.animal_type = animal_type ?? animal.animal_type;
    animal.identification_number = identification_number ?? animal.identification_number;
    animal.weight = weight ?? animal.weight;
    animal.estimated_production = estimated_production ?? animal.estimated_production;
    animal.sanitary_register = sanitary_register ?? animal.sanitary_register;
    animal.age = age ?? animal.age;
    animal.incidents = incidents ?? animal.incidents;

    const updatedAnimal = await animalRepository.save(animal);
    return res.json({ message: 'Animal actualizado', animal: updatedAnimal });
  } catch (error) {
    console.error('Error al actualizar animal:', error);
    return res.status(500).json({ error: 'Error al actualizar animal' });
  }
};

export const deleteAnimal = async (req: Request, res: Response) => {
  try {
    const animalId = parseInt(req.params.id, 10);
    const animal = await animalRepository.findOne({ where: { id: animalId } });
    if (!animal) {
      return res.status(404).json({ error: 'Animal no encontrado' });
    }
    await animalRepository.remove(animal);
    return res.json({ message: 'Animal eliminado' });
  } catch (error) {
    console.error('Error al eliminar animal:', error);
    return res.status(500).json({ error: 'Error al eliminar animal' });
  }
};
