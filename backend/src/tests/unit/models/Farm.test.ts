import { Farm } from '../../../models/Farm';
import { FarmType } from '../../../models/FarmType';
import { ProductionType } from '../../../models/ProductionType';

describe('Farm Model', () => {
  it('debería crear una instancia de Farm correctamente', () => {
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    // Crear instancias de tipo de granja y tipo de producción
    const farmType = new FarmType();
    farmType.id = 1;
    farmType.name = 'Ganadera';
    
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Láctea';
    
    // Asignar tipos a la granja
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
    
    // image_path es opcional (puede ser null)
    expect(farm.image_path).toBeUndefined();
    
    // Establecer un valor
    farm.image_path = 'ruta/a/imagen.jpg';
    expect(farm.image_path).toBe('ruta/a/imagen.jpg');
    
    // Establecer null
    farm.image_path = null;
    expect(farm.image_path).toBeNull();
  });

  it('debería tener fechas de creación y actualización', () => {
    const farm = new Farm();
    farm.id = 1;
    farm.name = 'Granja Los Álamos';
    
    // Establecer fechas
    const now = new Date();
    farm.created_at = now;
    farm.updated_at = now;
    
    expect(farm.created_at).toEqual(now);
    expect(farm.updated_at).toEqual(now);
  });
  
  it('debería crear una granja usando el método estático create', () => {
    // Crear instancias de tipo de granja y tipo de producción
    const farmType = FarmType.create({
      id: 1,
      name: 'Agrícola'
    });
    
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Cereales';
    
    // Crear una granja usando el método estático
    const farm = Farm.create({
      id: 1,
      name: 'Granja El Rancho',
      farm_type: farmType,
      production_type: productionType,
      image_path: '/imagenes/rancho.jpg'
    });
    
    expect(farm).toBeInstanceOf(Farm);
    expect(farm.id).toBe(1);
    expect(farm.name).toBe('Granja El Rancho');
    expect(farm.farm_type).toBe(farmType);
    expect(farm.production_type).toBe(productionType);
    expect(farm.image_path).toBe('/imagenes/rancho.jpg');
  });
  
  it('debería crear una granja con valores opcionales nulos usando el método estático create', () => {
    // Crear una granja con valores opcionales no especificados
    const farm = Farm.create({
      name: 'Granja Mínima'
    });
    
    expect(farm).toBeInstanceOf(Farm);
    expect(farm.name).toBe('Granja Mínima');
    expect(farm.farm_type).toBeUndefined();
    expect(farm.production_type).toBeUndefined();
    expect(farm.image_path).toBeNull();
  });
}); 