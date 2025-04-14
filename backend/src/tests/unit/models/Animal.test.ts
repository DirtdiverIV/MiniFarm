// sonarignore:start
import { Animal } from '../../../models/Animal';
import { Farm } from '../../../models/Farm';

describe('Animal Model', () => {
  it('debería crear una instancia de Animal correctamente', () => {
    const animal = new Animal();
    animal.id = 1;
    animal.animal_type = 'Vaca';
    animal.identification_number = 'VC-12345';
    animal.sanitary_register = 'SR-789123';
    
    expect(animal).toBeInstanceOf(Animal);
    expect(animal.id).toBe(1);
    expect(animal.animal_type).toBe('Vaca');
    expect(animal.identification_number).toBe('VC-12345');
    expect(animal.sanitary_register).toBe('SR-789123');
  });

  it('debería manejar propiedades opcionales', () => {
    const animal = new Animal();
    animal.id = 1;
    animal.animal_type = 'Vaca';
    animal.identification_number = 'VC-12345';
    animal.sanitary_register = 'SR-789123';
    
    
    expect(animal.weight).toBeUndefined();
    expect(animal.age).toBeUndefined();
    expect(animal.estimated_production).toBeUndefined();
    expect(animal.incidents).toBeUndefined();
    
    
    animal.weight = 450.5;
    animal.age = 3;
    animal.estimated_production = 25.8;
    animal.incidents = 'Tratamiento antibiótico el 15/10/2023';
    
    expect(animal.weight).toBe(450.5);
    expect(animal.age).toBe(3);
    expect(animal.estimated_production).toBe(25.8);
    expect(animal.incidents).toBe('Tratamiento antibiótico el 15/10/2023');
    
    
    animal.weight = null;
    animal.age = null;
    animal.estimated_production = null;
    animal.incidents = null;
    
    expect(animal.weight).toBeNull();
    expect(animal.age).toBeNull();
    expect(animal.estimated_production).toBeNull();
    expect(animal.incidents).toBeNull();
  });

  it('debería relacionarse con una granja', () => {
    const animal = new Animal();
    animal.id = 1;
    animal.animal_type = 'Vaca';
    animal.identification_number = 'VC-12345';
    animal.sanitary_register = 'SR-789123';
    
    
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    
    animal.farm = farm;
    
    expect(animal.farm).toBe(farm);
    expect(animal.farm.id).toBe(1);
    expect(animal.farm.name).toBe('Granja Los Álamos');
  });

  it('debería tener fechas de creación y actualización', () => {
    const animal = new Animal();
    animal.id = 1;
    animal.animal_type = 'Vaca';
    animal.identification_number = 'VC-12345';
    animal.sanitary_register = 'SR-789123';
    
    
    const now = new Date();
    animal.created_at = now;
    animal.updated_at = now;
    
    expect(animal.created_at).toEqual(now);
    expect(animal.updated_at).toEqual(now);
  });
  
  it('debería crear un animal usando el método estático create', () => {
    
    const farm = Farm.create({
      id: 1,
      name: 'Granja Test'
    });
    
    
    const animal = Animal.create({
      id: 1,
      animal_type: 'Oveja',
      identification_number: 'OV-54321',
      sanitary_register: 'SR-456789',
      weight: 75.3,
      age: 2,
      estimated_production: 10.5,
      incidents: 'Vacunación 05/01/2023',
      farm: farm
    });
    
    expect(animal).toBeInstanceOf(Animal);
    expect(animal.id).toBe(1);
    expect(animal.animal_type).toBe('Oveja');
    expect(animal.identification_number).toBe('OV-54321');
    expect(animal.sanitary_register).toBe('SR-456789');
    expect(animal.weight).toBe(75.3);
    expect(animal.age).toBe(2);
    expect(animal.estimated_production).toBe(10.5);
    expect(animal.incidents).toBe('Vacunación 05/01/2023');
    expect(animal.farm).toBe(farm);
  });
  
  it('debería crear un animal con valores opcionales nulos usando el método estático create', () => {
    
    const animal = Animal.create({
      animal_type: 'Cabra',
      identification_number: 'CB-12345',
      sanitary_register: 'SR-123456'
    });
    
    expect(animal).toBeInstanceOf(Animal);
    expect(animal.animal_type).toBe('Cabra');
    expect(animal.weight).toBeNull();
    expect(animal.age).toBeNull();
    expect(animal.estimated_production).toBeNull();
    expect(animal.incidents).toBeNull();
    expect(animal.farm).toBeUndefined();
  });
}); 
// sonarignore:end