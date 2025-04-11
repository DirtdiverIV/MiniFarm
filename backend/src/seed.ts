import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { FarmType } from './models/FarmType';
import { ProductionType } from './models/ProductionType';
import { Farm } from './models/Farm';
import { Animal } from './models/Animal';
import { User } from './models/User';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.CONNECTION_STRING,
  entities: [User, Farm, Animal, FarmType, ProductionType],
  synchronize: true,
});

async function seed() {
  try {
    await dataSource.initialize();

    // Creamos tipos de granja
    const farmTypes = await dataSource.getRepository(FarmType).save([
      { name: 'Bovina' },
      { name: 'Ovina' },
      { name: 'Porcina' }
    ]);

    // Creamos tipos de producción
    const productionTypes = await dataSource.getRepository(ProductionType).save([
      { name: 'Cárnica' },
      { name: 'Láctea' }
    ]);

    // Creamos usuario administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await dataSource.getRepository(User).save({
      email: 'admin@minifarm.com',
      password_hash: hashedPassword,
      role: 'admin'
    });

    // Creamos algunas granjas de ejemplo
    const farmRepository = dataSource.getRepository(Farm);
    const farm1 = new Farm();
    farm1.name = 'Granja Bovina Cárnica';
    farm1.farm_type = farmTypes[0];
    farm1.production_type = productionTypes[0];
    farm1.image_path = null;

    const farm2 = new Farm();
    farm2.name = 'Granja Ovina Láctea';
    farm2.farm_type = farmTypes[1];
    farm2.production_type = productionTypes[1];
    farm2.image_path = null;

    const farm3 = new Farm();
    farm3.name = 'Granja Porcina Cárnica';
    farm3.farm_type = farmTypes[2];
    farm3.production_type = productionTypes[0];
    farm3.image_path = null;

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

    await animalRepository.save([animal1, animal2, animal3]);

    console.log('Seed completado exitosamente!');
  } catch (error) {
    console.error('Error durante el seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
