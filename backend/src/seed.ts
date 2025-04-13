import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FarmType } from './models/FarmType';
import { ProductionType } from './models/ProductionType';
import { Farm } from './models/Farm';
import { Animal } from './models/Animal';
import { User } from './models/User';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.CONNECTION_STRING,
  entities: [User, Farm, Animal, FarmType, ProductionType],
  synchronize: true,
});

// Función para asegurar que existan las carpetas de uploads
function ensureUploadDirs() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const farmUploadsDir = path.join(uploadsDir, 'farms');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  
  if (!fs.existsSync(farmUploadsDir)) {
    fs.mkdirSync(farmUploadsDir);
  }
}

async function seed() {
  try {
    // Asegurar que las carpetas de uploads existen
    ensureUploadDirs();
    
    await dataSource.initialize();

    // Verificar y crear tipos de granja
    const farmTypeRepository = dataSource.getRepository(FarmType);
    let farmTypes = [];
    
    // Buscar tipos de granja existentes
    const existingBovinaType = await farmTypeRepository.findOne({ where: { name: 'Bovina' } });
    const existingOvinaType = await farmTypeRepository.findOne({ where: { name: 'Ovina' } });
    const existingPorcinaType = await farmTypeRepository.findOne({ where: { name: 'Porcina' } });
    
    // Crear array con tipos existentes o nuevos
    farmTypes = [
      existingBovinaType === null ? await farmTypeRepository.save({ name: 'Bovina' }) : existingBovinaType,
      existingOvinaType === null ? await farmTypeRepository.save({ name: 'Ovina' }) : existingOvinaType,
      existingPorcinaType === null ? await farmTypeRepository.save({ name: 'Porcina' }) : existingPorcinaType
    ];

    // Verificar y crear tipos de producción
    const productionTypeRepository = dataSource.getRepository(ProductionType);
    let productionTypes = [];
    
    // Buscar tipos de producción existentes
    const existingCarnicaType = await productionTypeRepository.findOne({ where: { name: 'Cárnica' } });
    const existingLacteaType = await productionTypeRepository.findOne({ where: { name: 'Láctea' } });
    
    // Crear array con tipos existentes o nuevos
    productionTypes = [
      existingCarnicaType === null ? await productionTypeRepository.save({ name: 'Cárnica' }) : existingCarnicaType,
      existingLacteaType === null ? await productionTypeRepository.save({ name: 'Láctea' }) : existingLacteaType
    ];

    // Creamos usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await dataSource.getRepository(User).save({
      email: 'admin@minifarm.com',
      password_hash: hashedPassword,
      role: 'admin'
    });

    // Creamos algunas granjas de ejemplo con rutas de imágenes según el nuevo sistema
    const farmRepository = dataSource.getRepository(Farm);
    const farm1 = new Farm();
    farm1.name = 'Finca Vacuna La Campiña';
    farm1.farm_type = farmTypes[0];
    farm1.production_type = productionTypes[0];
    // La ruta de la imagen debe comenzar con /uploads/farms/
    farm1.image_path = '/uploads/farms/farm-bovine-example.jpg';
    farm1.provincia = 'Sevilla';
    farm1.municipio = 'Dos Hermanas';

    const farm2 = new Farm();
    farm2.name = 'Majada Ovina El Serranillo';
    farm2.farm_type = farmTypes[1];
    farm2.production_type = productionTypes[1];
    farm2.image_path = '/uploads/farms/farm-sheep-example.jpg';
    farm2.provincia = 'Córdoba';
    farm2.municipio = 'Pozoblanco';

    const farm3 = new Farm();
    farm3.name = 'Cebo Ibérico La Dehesa';
    farm3.farm_type = farmTypes[2];
    farm3.production_type = productionTypes[0];
    farm3.image_path = '/uploads/farms/farm-pig-example.jpg';
    farm3.provincia = 'Huelva';
    farm3.municipio = 'Jabugo';

    const farms = await farmRepository.save([farm1, farm2, farm3]);

    // --- Inicio: Nuevas Granjas Adicionales ---
    // Mapeo de tipos de granja a imágenes de ejemplo
    const exampleImagePaths = {
        'Bovina': '/uploads/farms/farm-bovine-example.jpg',
        'Ovina': '/uploads/farms/farm-sheep-example.jpg',
        'Porcina': '/uploads/farms/farm-pig-example.jpg'
    };

    const newFarmsData = [
      { name: 'Finca El Robledal', farm_type: farmTypes[0], production_type: productionTypes[0], provincia: 'Cáceres', municipio: 'Plasencia' },
      { name: 'Dehesa La Encina', farm_type: farmTypes[1], production_type: productionTypes[1], provincia: 'Badajoz', municipio: 'Mérida' },
      { name: 'Cortijo Los Alcornoques', farm_type: farmTypes[2], production_type: productionTypes[0], provincia: 'Huelva', municipio: 'Aracena' },
      { name: 'Ganadería Sierra Morena', farm_type: farmTypes[0], production_type: productionTypes[1], provincia: 'Jaén', municipio: 'Andújar' },
      { name: 'Pastos del Guadiana', farm_type: farmTypes[1], production_type: productionTypes[0], provincia: 'Ciudad Real', municipio: 'Almadén' },
      { name: 'Hacienda El Mirador', farm_type: farmTypes[0], production_type: productionTypes[0], provincia: 'Málaga', municipio: 'Ronda' },
      { name: 'Valle de Los Pedroches', farm_type: farmTypes[2], production_type: productionTypes[1], provincia: 'Córdoba', municipio: 'Villanueva de Córdoba' },
      { name: 'Campo Charro', farm_type: farmTypes[0], production_type: productionTypes[1], provincia: 'Salamanca', municipio: 'Guijuelo' },
      { name: 'Tierras de Barros', farm_type: farmTypes[1], production_type: productionTypes[0], provincia: 'Badajoz', municipio: 'Almendralejo' },
      { name: 'La Mancha Ganadera', farm_type: farmTypes[2], production_type: productionTypes[0], provincia: 'Toledo', municipio: 'Consuegra' },
    ];

    const newFarms: Farm[] = [];
    for (const farmData of newFarmsData) {
        const newFarm = new Farm();
        newFarm.name = farmData.name;
        newFarm.farm_type = farmData.farm_type;
        newFarm.production_type = farmData.production_type;
        // Asignar imagen de ejemplo según el tipo de granja
        const farmTypeName = farmData.farm_type.name as keyof typeof exampleImagePaths;
        newFarm.image_path = exampleImagePaths[farmTypeName] || '/uploads/farms/default-farm.jpg'; // Usar imagen por defecto si no coincide
        newFarm.provincia = farmData.provincia;
        newFarm.municipio = farmData.municipio;
        newFarms.push(newFarm);
    }

    const savedNewFarms = await farmRepository.save(newFarms);
    const allFarms = [...farms, ...savedNewFarms]; // Combinar granjas iniciales y nuevas

    // --- Fin: Nuevas Granjas Adicionales ---

    // Crear algunos animales de ejemplo
    const animalRepository = dataSource.getRepository(Animal);
    
    // Helper para calcular producción estimada
    const calculateEstimatedProduction = (farm: Farm, weight: number | null): number | null => {
      if (!weight) return null;
      if (farm.production_type.name === 'Láctea') {
        // Producción láctea (ej. litros/día) - Valor aleatorio
        return Math.floor(Math.random() * 30);
      } else if (farm.production_type.name === 'Cárnica') {
        // Producción cárnica (ej. % peso aprovechable) - Porcentaje aleatorio del peso
        const yieldPercentage = Math.random() * (0.6 - 0.4) + 0.4; // Entre 40% y 60%
        return parseFloat((weight * yieldPercentage).toFixed(2)); // Redondear a 2 decimales
      }
      return null;
    };

    const animal1 = new Animal();
    animal1.animal_type = 'Vaca';
    animal1.identification_number = 'VAC001';
    animal1.weight = 500;
    animal1.estimated_production = calculateEstimatedProduction(farms[0], animal1.weight);
    animal1.sanitary_register = 'SR001';
    animal1.age = 3;
    animal1.farm = farms[0];

    const animal2 = new Animal();
    animal2.animal_type = 'Oveja';
    animal2.identification_number = 'OVE001';
    animal2.weight = 60;
    animal2.estimated_production = calculateEstimatedProduction(farms[1], animal2.weight);
    animal2.sanitary_register = 'SR002';
    animal2.age = 2;
    animal2.farm = farms[1];

    const animal3 = new Animal();
    animal3.animal_type = 'Cerdo';
    animal3.identification_number = 'CER001';
    animal3.weight = 100;
    animal3.estimated_production = calculateEstimatedProduction(farms[2], animal3.weight);
    animal3.sanitary_register = 'SR003';
    animal3.age = 1;
    animal3.farm = farms[2];

    // Nuevos animales adicionales
    const animal4 = new Animal();
    animal4.animal_type = 'Toro';
    animal4.identification_number = 'TOR001';
    animal4.weight = 750;
    animal4.estimated_production = calculateEstimatedProduction(farms[0], animal4.weight);
    animal4.sanitary_register = 'SR004';
    animal4.age = 4;
    animal4.farm = farms[0];

    const animal5 = new Animal();
    animal5.animal_type = 'Vaca';
    animal5.identification_number = 'VAC002';
    animal5.weight = 480;
    animal5.estimated_production = calculateEstimatedProduction(farms[0], animal5.weight);
    animal5.sanitary_register = 'SR005';
    animal5.age = 5;
    animal5.farm = farms[0];

    const animal6 = new Animal();
    animal6.animal_type = 'Oveja';
    animal6.identification_number = 'OVE002';
    animal6.weight = 55;
    animal6.estimated_production = calculateEstimatedProduction(farms[1], animal6.weight);
    animal6.sanitary_register = 'SR006';
    animal6.age = 3;
    animal6.farm = farms[1];

    const animal7 = new Animal();
    animal7.animal_type = 'Cabra';
    animal7.identification_number = 'CAB001';
    animal7.weight = 45;
    animal7.estimated_production = calculateEstimatedProduction(farms[1], animal7.weight);
    animal7.sanitary_register = 'SR007';
    animal7.age = 2;
    animal7.farm = farms[1];

    const animal8 = new Animal();
    animal8.animal_type = 'Cerdo';
    animal8.identification_number = 'CER002';
    animal8.weight = 120;
    animal8.estimated_production = calculateEstimatedProduction(farms[2], animal8.weight);
    animal8.sanitary_register = 'SR008';
    animal8.age = 1;
    animal8.farm = farms[2];

    const animal9 = new Animal();
    animal9.animal_type = 'Cerda';
    animal9.identification_number = 'CER003';
    animal9.weight = 110;
    animal9.estimated_production = calculateEstimatedProduction(farms[2], animal9.weight);
    animal9.sanitary_register = 'SR009';
    animal9.age = 2;
    animal9.farm = farms[2];

    // Guardar los animales iniciales actualizados
    const initialAnimals = [animal1, animal2, animal3, animal4, animal5, animal6, animal7, animal8, animal9];
    await animalRepository.save(initialAnimals);

    // --- Inicio: Nuevos Animales Adicionales para Nuevas Granjas ---
    const newAnimals: Animal[] = [];
    const animalTypesPerFarmType = {
        'Bovina': ['Vaca', 'Toro', 'Ternero'],
        'Ovina': ['Oveja', 'Carnero', 'Cordero'],
        'Porcina': ['Cerdo', 'Cerda', 'Lechón']
    };

    let animalCounter = 10; // Empezar contador para IDs únicos
    for (const farm of allFarms) {
        const farmTypeKey = farm.farm_type.name as keyof typeof animalTypesPerFarmType;
        const possibleAnimalTypes = animalTypesPerFarmType[farmTypeKey] || ['Animal Genérico']; // Fallback

        for (let i = 0; i < 10; i++) { // Crear 10 animales por nueva granja
            const animal = new Animal();
            const animalType = possibleAnimalTypes[Math.floor(Math.random() * possibleAnimalTypes.length)];
            const idSuffix = String(animalCounter++).padStart(3, '0');
            const idPrefix = animalType.substring(0, 3).toUpperCase();

            animal.animal_type = animalType;
            animal.identification_number = `${idPrefix}${idSuffix}`;
            animal.weight = Math.floor(Math.random() * 800) + 50; // Peso aleatorio entre 50 y 850
            
            // Calcular producción estimada según tipo de granja y peso
            animal.estimated_production = calculateEstimatedProduction(farm, animal.weight);
            
            // Asignar registro sanitario con formato consistente
            animal.sanitary_register = `SR${idSuffix}`;

            // Añadir incidencias aleatorias a ~20% de los animales en el campo 'incidents'
            if (Math.random() < 0.2) {
                const incidencias = [
                    'INCIDENCIA: Infección intestinal',
                    'PENDIENTE_REVISION: Sin vacunar',
                    'ALERTA: Mastitis detectada',
                    'OBSERVACION: Pérdida de peso notable',
                    'INCIDENCIA: Neumonía Bovina',
                    'PENDIENTE_REVISION: Parasitosis externa',
                    'ALERTA: Posible Brucelosis',
                    'OBSERVACION: Aislamiento social'
                ];
                animal.incidents = incidencias[Math.floor(Math.random() * incidencias.length)];
            }
            
            animal.age = Math.floor(Math.random() * 10) + 1; // Edad aleatoria entre 1 y 10
            animal.farm = farm;
            newAnimals.push(animal);
        }
    }

    await animalRepository.save(newAnimals);
    // --- Fin: Nuevos Animales Adicionales para Nuevas Granjas ---

    console.log('Seed completado exitosamente!');
  } catch (error) {
    console.error('Error durante el seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
