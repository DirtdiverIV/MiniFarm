// sonarignore:start

import { Farm } from '../../../models/Farm';
import { FarmType } from '../../../models/FarmType';
import { ProductionType } from '../../../models/ProductionType';

describe('Farm Model', () => {
  it('debería crear una instancia de Farm correctamente', () => {
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    
    const farmType = new FarmType();
    farmType.id = 1;
    farmType.name = 'Ganadera';
    
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Láctea';
    
    
    farm.farm_type = farmType;
    farm.production_type = productionType;
    
    expect(farm).toBeInstanceOf(Farm);
    expect(farm.id).toBe(1);
    expect(farm.name).toBe('Granja Los Álamos');
    expect(farm.farm_type).toBe(farmType);
    expect(farm.production_type).toBe(productionType);
  });

  it('debería manejar propiedades opcionales', () => {
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    
    expect(farm.image_path).toBeUndefined();
    
    
    farm.image_path = 'ruta/a/imagen.jpg';
    expect(farm.image_path).toBe('ruta/a/imagen.jpg');
    
    
    farm.image_path = null;
    expect(farm.image_path).toBeNull();
    
    
    expect(farm.provincia).toBeUndefined();
    expect(farm.municipio).toBeUndefined();
    
    
    farm.provincia = 'Córdoba';
    farm.municipio = 'Lucena';
    expect(farm.provincia).toBe('Córdoba');
    expect(farm.municipio).toBe('Lucena');
    
    
    farm.provincia = null;
    farm.municipio = null;
    expect(farm.provincia).toBeNull();
    expect(farm.municipio).toBeNull();
  });

  it('debería tener fechas de creación y actualización', () => {
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    
    const now = new Date();
    farm.created_at = now;
    farm.updated_at = now;
    
    expect(farm.created_at).toEqual(now);
    expect(farm.updated_at).toEqual(now);
  });
  
  it('debería crear una granja usando el método estático create', () => {
    
    const farmType = FarmType.create({
      id: 1,
      name: 'Agrícola'
    });
    
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Cereales';
    
    
    const farm = Farm.create({
      id: 1,
      name: 'Granja El Rancho',
      farm_type: farmType,
      production_type: productionType,
      image_path: '/imagenes/rancho.jpg',
      provincia: 'Sevilla',
      municipio: 'Carmona'
    });
    
    expect(farm).toBeInstanceOf(Farm);
    expect(farm.id).toBe(1);
    expect(farm.name).toBe('Granja El Rancho');
    expect(farm.farm_type).toBe(farmType);
    expect(farm.production_type).toBe(productionType);
    expect(farm.image_path).toBe('/imagenes/rancho.jpg');
    expect(farm.provincia).toBe('Sevilla');
    expect(farm.municipio).toBe('Carmona');
  });
  
  it('debería crear una granja con valores opcionales nulos usando el método estático create', () => {
    
    const farm = Farm.create({
      name: 'Granja Mínima'
    });
    
    expect(farm).toBeInstanceOf(Farm);
    expect(farm.name).toBe('Granja Mínima');
    expect(farm.farm_type).toBeUndefined();
    expect(farm.production_type).toBeUndefined();
    expect(farm.image_path).toBeNull();
    expect(farm.provincia).toBeNull();
    expect(farm.municipio).toBeNull();
  });
}); 
// sonarignore:end