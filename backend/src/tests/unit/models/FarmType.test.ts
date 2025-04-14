// sonarignore:start
import { FarmType } from '../../../models/FarmType';

describe('FarmType Model', () => {
  it('debería crear una instancia de FarmType correctamente', () => {
    const farmType = new FarmType();
    farmType.id = 1;
    farmType.name = 'Ganadería';

    expect(farmType).toBeInstanceOf(FarmType);
    expect(farmType.id).toBe(1);
    expect(farmType.name).toBe('Ganadería');
  });

  it('debería tener fechas de creación y actualización', () => {
    const farmType = new FarmType();
    farmType.id = 1;
    farmType.name = 'Ganadería';
    
    
    const now = new Date();
    farmType.created_at = now;
    farmType.updated_at = now;
    
    expect(farmType.created_at).toEqual(now);
    expect(farmType.updated_at).toEqual(now);
  });
  
  it('debería crear un tipo de granja usando el método estático create con id', () => {
    
    const farmType = FarmType.create({
      id: 2,
      name: 'Avícola'
    });
    
    expect(farmType).toBeInstanceOf(FarmType);
    expect(farmType.id).toBe(2);
    expect(farmType.name).toBe('Avícola');
  });
  
  it('debería crear un tipo de granja sin id usando el método estático create', () => {
    
    const farmType = FarmType.create({
      name: 'Porcina'
    });
    
    expect(farmType).toBeInstanceOf(FarmType);
    expect(farmType.id).toBeUndefined();
    expect(farmType.name).toBe('Porcina');
  });
}); 
// sonarignore:end