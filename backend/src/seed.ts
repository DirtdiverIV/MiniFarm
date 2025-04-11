import 'reflect-metadata';
import { AppDataSource } from './config/dataSource';
import { User } from './models/User';
import { Farm } from './models/Farm';
import { Animal } from './models/Animal';
import bcrypt from 'bcrypt';

async function seedData() {
  try {
    console.log('Conectando BD para seeding...');
  await AppDataSource.initialize();
    console.log('Conexión TypeORM inicializada para seeding...');

    const userRepo = AppDataSource.getRepository(User);
    const farmRepo = AppDataSource.getRepository(Farm);
    const animalRepo = AppDataSource.getRepository(Animal);

    // ==========================
    // 1. Crear Users
    // ==========================
    const saltRounds = 10;

    const adminPass = await bcrypt.hash('123456', saltRounds);
    const userPass = await bcrypt.hash('123456', saltRounds);

    const adminUser = userRepo.create({
      email: 'admin@mail.com',
      password_hash: adminPass,
      role: 'admin'
    });
    const normalUser = userRepo.create({
      email: 'user@mail.com',
      password_hash: userPass,
      role: 'user'
    });

    await userRepo.save([adminUser, normalUser]);
    console.log('Usuarios creados:', [adminUser.email, normalUser.email]);

    // ==========================
    // 2. Crear Farms
    // ==========================
    const farm1 = farmRepo.create({
      name: 'Granja Las Rosas',
      farm_type: 'bovina',
      production_type: 'leche',
      image_path: '/images/granja_las_rosas.jpg'
    });
    const farm2 = farmRepo.create({
      name: 'Granja El Prado',
      farm_type: 'porcina',
      production_type: 'carne',
      image_path: '/images/granja_el_prado.jpg'
    });
    const farm3 = farmRepo.create({
      name: 'Granja Los Pinos',
      farm_type: 'ovina',
      production_type: 'carne',
      image_path: '/images/granja_los_pinos.jpg'
    });

    await farmRepo.save([farm1, farm2, farm3]);
    console.log('Granjas creadas:', [farm1.name, farm2.name, farm3.name]);

    // ==========================
    // 3. Crear Animals
    // ==========================
    // Farm1 -> bovina (vacas)
    const animal1 = animalRepo.create({
      animal_type: 'vaca',
      identification_number: 'V-001',
      weight: 450.5,
      estimated_production: 30,
      sanitary_register: 'REG-ABC-001',
      age: 3,
      incidents: null, // sin incidencias (vacío)
      farm: farm1
    });
    const animal2 = animalRepo.create({
      animal_type: 'vaca',
      identification_number: 'V-002',
      weight: 520,
      estimated_production: 32,
      sanitary_register: 'REG-ABC-002',
      age: 4,
      incidents: 'Cojea levemente',
      farm: farm1
    });

    // Farm2 -> porcina (cerdos)
    const animal3 = animalRepo.create({
      animal_type: 'cerdo',
      identification_number: 'C-101',
      weight: 120.5,
      estimated_production: 10,
      sanitary_register: 'REG-DEF-101',
      age: 1,
      incidents: null, // sin incidencias
      farm: farm2
    });
    const animal4 = animalRepo.create({
      animal_type: 'cerdo',
      identification_number: 'C-102',
      weight: 135.0,
      estimated_production: 11,
      sanitary_register: 'REG-DEF-102',
      age: 2,
      incidents: 'Sarna detectada',
      farm: farm2
    });

    // Farm3 -> ovina (ovejas)
    const animal5 = animalRepo.create({
      animal_type: 'oveja',
      identification_number: 'O-201',
      weight: 60,
      estimated_production: 6,
      sanitary_register: 'REG-XYZ-201',
      age: 2,
      incidents: 'Ha perdido algo de peso',
      farm: farm3
    });
    const animal6 = animalRepo.create({
      animal_type: 'oveja',
      identification_number: 'O-202',
      weight: 65,
      estimated_production: 7,
      sanitary_register: 'REG-XYZ-202',
      age: 3,
      incidents: null, // sin incidencias
      farm: farm3
    });

    await animalRepo.save([animal1, animal2, animal3, animal4, animal5, animal6]);
    console.log('Animales creados.');

    await AppDataSource.destroy();
    console.log('Seed finalizado con éxito. Conexión cerrada.');
  } catch (error) {
    console.error('Error en el seeding:', error);
  }
}

// Ejecutar la función
seedData()
  .then(() => {
    console.log('Seeding completado!');
    process.exit(0); 
  })
  .catch((err) => {
    console.error('Error en seeding:', err);
    process.exit(1);
  });
