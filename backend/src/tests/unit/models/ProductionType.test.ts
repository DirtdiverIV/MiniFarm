// sonarignore:start
import { ProductionType } from '../../../models/ProductionType';

describe('ProductionType Model', () => {
  it('debería crear una instancia de ProductionType correctamente', () => {
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Láctea';

    expect(productionType).toBeInstanceOf(ProductionType);
    expect(productionType.id).toBe(1);
    expect(productionType.name).toBe('Láctea');
  });

  it('debería tener fechas de creación y actualización', () => {
    const productionType = new ProductionType();
    productionType.id = 1;
    productionType.name = 'Cárnica';

    const now = new Date();
    productionType.created_at = now;
    productionType.updated_at = now;
    
    expect(productionType.created_at).toEqual(now);
    expect(productionType.updated_at).toEqual(now);
  });
}); 
// sonarignore:end