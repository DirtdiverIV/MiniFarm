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
    farm1.name = 'Granja Bovina Cárnica';
    farm1.farm_type = farmTypes[0];
    farm1.production_type = productionTypes[0];
    // La ruta de la imagen debe comenzar con /uploads/farms/
    farm1.image_path = '/uploads/farms/farm-bovine-example.jpg';

    const farm2 = new Farm();
    farm2.name = 'Granja Ovina Láctea';
    farm2.farm_type = farmTypes[1];
    farm2.production_type = productionTypes[1];
    farm2.image_path = '/uploads/farms/farm-sheep-example.jpg';

    const farm3 = new Farm();
    farm3.name = 'Granja Porcina Cárnica';
    farm3.farm_type = farmTypes[2];
    farm3.production_type = productionTypes[0];
    farm3.image_path = '/uploads/farms/farm-pig-example.jpg';

    const farms = await farmRepository.save([farm1, farm2, farm3]);

    // Crear algunos animales de ejemplo
    const animalRepository = dataSource.getRepository(Animal);
    const animal1 = new Animal();
    animal1.animal_type = 'Vaca';
    animal1.identification_number = 'VAC001';
    animal1.weight = 500;
    animal1.estimated_production = 20;
    animal1.sanitary_register = 'SR001';
    animal1.age = 3;
    animal1.farm = farms[0];

    const animal2 = new Animal();
    animal2.animal_type = 'Oveja';
    animal2.identification_number = 'OVE001';
    animal2.weight = 60;
    animal2.estimated_production = 2;
    animal2.sanitary_register = 'SR002';
    animal2.age = 2;
    animal2.farm = farms[1];

    const animal3 = new Animal();
    animal3.animal_type = 'Cerdo';
    animal3.identification_number = 'CER001';
    animal3.weight = 100;
    animal3.estimated_production = 0;
    animal3.sanitary_register = 'SR003';
    animal3.age = 1;
    animal3.farm = farms[2];

    // Nuevos animales adicionales
    const animal4 = new Animal();
    animal4.animal_type = 'Toro';
    animal4.identification_number = 'TOR001';
    animal4.weight = 750;
    animal4.estimated_production = 0;
    animal4.sanitary_register = 'SR004';
    animal4.age = 4;
    animal4.farm = farms[0];

    const animal5 = new Animal();
    animal5.animal_type = 'Vaca';
    animal5.identification_number = 'VAC002';
    animal5.weight = 480;
    animal5.estimated_production = 18;
    animal5.sanitary_register = 'SR005';
    animal5.age = 5;
    animal5.farm = farms[0];

    const animal6 = new Animal();
    animal6.animal_type = 'Oveja';
    animal6.identification_number = 'OVE002';
    animal6.weight = 55;
    animal6.estimated_production = 1.8;
    animal6.sanitary_register = 'SR006';
    animal6.age = 3;
    animal6.farm = farms[1];

    const animal7 = new Animal();
    animal7.animal_type = 'Cabra';
    animal7.identification_number = 'CAB001';
    animal7.weight = 45;
    animal7.estimated_production = 2.5;
    animal7.sanitary_register = 'SR007';
    animal7.age = 2;
    animal7.farm = farms[1];

    const animal8 = new Animal();
    animal8.animal_type = 'Cerdo';
    animal8.identification_number = 'CER002';
    animal8.weight = 120;
    animal8.estimated_production = 0;
    animal8.sanitary_register = 'SR008';
    animal8.age = 1;
    animal8.farm = farms[2];

    const animal9 = new Animal();
    animal9.animal_type = 'Cerda';
    animal9.identification_number = 'CER003';
    animal9.weight = 110;
    animal9.estimated_production = 0;
    animal9.sanitary_register = 'SR009';
    animal9.age = 2;
    animal9.farm = farms[2];

    await animalRepository.save([animal1, animal2, animal3, animal4, animal5, animal6, animal7, animal8, animal9]);

    console.log('Seed completado exitosamente!');
  } catch (error) {
    console.error('Error durante el seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
