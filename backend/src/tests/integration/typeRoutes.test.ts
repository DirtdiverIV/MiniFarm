// sonarignore:start

import request from 'supertest';
import express from 'express';


const mockFarmTypeFind = jest.fn();
const mockProductionTypeFind = jest.fn();


jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'object' ? entity.name : entity;
      if (entityName === 'FarmType') {
        return {
          find: mockFarmTypeFind
        };
      }
      if (entityName === 'ProductionType') {
        return {
          find: mockProductionTypeFind
        };
      }
      return {};
    })
  }
}));


jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));

jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));


const typeRouter = require('../../routes/typeRoutes').typeRouter;

describe('Type Routes', () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    
    app = express();
    app.use(express.json());
    app.use('/api/types', typeRouter);
  });

  beforeEach(() => {
    
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    
    consoleErrorSpy.mockRestore();
  });

  describe('GET /api/types/farm-types', () => {
    test('debería obtener todos los tipos de granja', async () => {
      const mockFarmTypes = [
        { id: 1, name: 'Ganadería' },
        { id: 2, name: 'Avícola' }
      ];

      mockFarmTypeFind.mockResolvedValue(mockFarmTypes);

      const response = await request(app)
        .get('/api/types/farm-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarmTypes);
      expect(mockFarmTypeFind).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de granja', async () => {
      mockFarmTypeFind.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/types/farm-types');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener tipos de granja');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('GET /api/types/production-types', () => {
    test('debería obtener todos los tipos de producción', async () => {
      const mockProductionTypes = [
        { id: 1, name: 'Cárnica' },
        { id: 2, name: 'Láctea' }
      ];

      mockProductionTypeFind.mockResolvedValue(mockProductionTypes);

      const response = await request(app)
        .get('/api/types/production-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProductionTypes);
      expect(mockProductionTypeFind).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de producción', async () => {
      mockProductionTypeFind.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/types/production-types');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener tipos de producción');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
}); 
// sonarignore:end
