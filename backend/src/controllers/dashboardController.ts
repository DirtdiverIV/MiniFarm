import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { Animal } from '../models/Animal';
import { Farm } from '../models/Farm';
import { ProductionType } from '../models/ProductionType';
import { Not, IsNull } from 'typeorm';

const animalRepository = AppDataSource.getRepository(Animal);
const farmRepository = AppDataSource.getRepository(Farm);
const productionTypeRepository = AppDataSource.getRepository(ProductionType);

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Obtener el total de animales
    const totalAnimals = await animalRepository.count();

    // Obtener todas las granjas con sus tipos de producción
    const farms = await farmRepository.find({
      relations: ['production_type']
    });

    // Obtener los tipos de producción
    const productionTypes = await productionTypeRepository.find();
    const carneType = productionTypes.find(pt => pt.name === 'Cárnica');
    const lecheType = productionTypes.find(pt => pt.name === 'Láctea');

    // Calcular producción estimada de carne
    const carneFarms = farms.filter(farm => farm.production_type?.id === carneType?.id);
    const carneAnimals = await animalRepository.find({
      where: carneFarms.map(farm => ({ farm: { id: farm.id } }))
    });
    const totalCarneProduction = carneAnimals.reduce((sum, animal) => 
      sum + (animal.estimated_production === undefined ? 0 : animal.estimated_production), 0);

    // Calcular producción estimada de leche
    const lecheFarms = farms.filter(farm => farm.production_type?.id === lecheType?.id);
    const lecheAnimals = await animalRepository.find({
      where: lecheFarms.map(farm => ({ farm: { id: farm.id } }))
    });
    const totalLecheProduction = lecheAnimals.reduce((sum, animal) => 
      sum + (animal.estimated_production === undefined ? 0 : animal.estimated_production), 0);

    // Obtener animales con incidencias
    const animalsWithIncidents = await animalRepository.find({
      where: { incidents: Not(IsNull()) },
      relations: ['farm']
    });

    return res.json({
      total_animals: totalAnimals,
      total_carne_production: totalCarneProduction,
      total_leche_production: totalLecheProduction,
      animals_with_incidents: animalsWithIncidents.map(animal => ({
        id: animal.id,
        animal_type: animal.animal_type,
        identification_number: animal.identification_number,
        incidents: animal.incidents,
        farm_name: animal.farm.name
      }))
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    return res.status(500).json({ error: 'Error al obtener estadísticas del dashboard' });
  }
}; 