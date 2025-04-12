import request from 'supertest';
import express from 'express';
import { Not, IsNull } from 'typeorm';

// Mock de las funciones individuales
const mockAnimalCount = jest.fn();
const mockAnimalFind = jest.fn();
const mockFarmFind = jest.fn();
const mockProductionTypeFind = jest.fn();

// Mock de typeorm
jest.mock('typeorm', () => {
  const originalTypeorm = jest.requireActual('typeorm');
  return {
    ...originalTypeorm,
    Not: jest.fn(),
    IsNull: jest.fn()
  };
});

// Mock de las dependencias
jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'object' ? entity.name : entity;
      if (entityName === 'Animal') {
        return {
          count: mockAnimalCount,
          find: mockAnimalFind
        };
      }
      if (entityName === 'Farm') {
        return {
          find: mockFarmFind
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

// Mock de los modelos para evitar referencias circulares
jest.mock('../../models/Animal', () => ({
  Animal: { name: 'Animal' }
}));

jest.mock('../../models/Farm', () => ({
  Farm: { name: 'Farm' }
}));

jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));

// Importar las rutas después de los mocks
const dashboardRouter = require('../../routes/dashboardRoutes').default;

describe('Dashboard Routes', () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    // Configurar la aplicación Express
    app = express();
    app.use(express.json());
    app.use('/api/dashboard', dashboardRouter);
  });

  beforeEach(() => {
    // Silenciar errores de consola
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe('GET /api/dashboard/stats', () => {
    test('debería obtener las estadísticas del dashboard', async () => {
      // Configurar datos de prueba
      const mockTotalAnimals = 10;
      
      const mockProductionTypes = [
        { id: 1, name: 'Cárnica' },
        { id: 2, name: 'Láctea' }
      ];
      
      const mockFarms = [
        { id: 1, name: 'Granja 1', production_type: { id: 1, name: 'Cárnica' } },
        { id: 2, name: 'Granja 2', production_type: { id: 2, name: 'Láctea' } }
      ];
      
      const mockCarneAnimals = [
        { id: 1, estimated_production: 100 },
        { id: 2, estimated_production: 150 }
      ];
      
      const mockLecheAnimals = [
        { id: 3, estimated_production: 200 },
        { id: 4, estimated_production: 250 }
      ];
      
      const mockAnimalsWithIncidents = [
        { 
          id: 5, 
          animal_type: 'Vaca', 
          identification_number: 'V001', 
          incidents: 'Fiebre', 
          farm: { id: 1, name: 'Granja 1' } 
        }
      ];

      // Configurar comportamiento de los mocks
      mockAnimalCount.mockResolvedValue(mockTotalAnimals);
      mockProductionTypeFind.mockResolvedValue(mockProductionTypes);
      mockFarmFind.mockResolvedValue(mockFarms);

      // Configurar Not e IsNull de typeorm
      (Not as jest.Mock).mockImplementation(value => ({ value, _type: 'not' }));
      (IsNull as jest.Mock).mockImplementation(() => ({ _type: 'isnull' }));
      
      // Configurar mock para find con diferentes parámetros
      mockAnimalFind.mockImplementation((params: any) => {
        const hasValidWhereClause = params?.where && Array.isArray(params.where) && params.where.length > 0;
        if (hasValidWhereClause) {
          const farmId = params.where[0]?.farm?.id;
          if (farmId === 1) {
            return Promise.resolve(mockCarneAnimals);
          } else if (farmId === 2) {
            return Promise.resolve(mockLecheAnimals);
          }
        } else if (params?.where?.incidents) {
          return Promise.resolve(mockAnimalsWithIncidents);
        }
        return Promise.resolve([]);
      });

      // Realizar la petición
      const response = await request(app)
        .get('/api/dashboard/stats');

      // Verificar la respuesta
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        total_animals: mockTotalAnimals,
        total_carne_production: 250, // 100 + 150
        total_leche_production: 450, // 200 + 250
        animals_with_incidents: [
          {
            id: 5,
            animal_type: 'Vaca',
            identification_number: 'V001',
            incidents: 'Fiebre',
            farm_name: 'Granja 1'
          }
        ]
      });

      // Verificar que se llamen los métodos esperados
      expect(mockAnimalCount).toHaveBeenCalled();
      expect(mockFarmFind).toHaveBeenCalledWith({
        relations: ['production_type']
      });
      expect(mockProductionTypeFind).toHaveBeenCalled();
      expect(mockAnimalFind).toHaveBeenCalledTimes(3); // 2 veces para producción, 1 para incidentes
    });

    test('debería manejar errores al obtener estadísticas', async () => {
      // Simular un error
      mockAnimalCount.mockRejectedValue(new Error('Error de base de datos'));

      // Realizar la petición
      const response = await request(app)
        .get('/api/dashboard/stats');

      // Verificar la respuesta
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener estadísticas del dashboard');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
}); 