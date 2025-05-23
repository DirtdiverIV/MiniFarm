// sonarignore:start
import { Request, Response } from 'express';


const mockAnimalRepository = {
  count: jest.fn(),
  find: jest.fn()
};

const mockFarmRepository = {
  find: jest.fn()
};

const mockProductionTypeRepository = {
  find: jest.fn()
};


jest.mock('typeorm', () => ({
  Not: jest.fn().mockImplementation(value => ({ value, _type: 'not' })),
  IsNull: jest.fn().mockImplementation(() => ({ _type: 'isnull' }))
}));


jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'string' ? entity : entity.name;
      if (entityName === 'Animal') {
        return mockAnimalRepository;
      }
      if (entityName === 'Farm') {
        return mockFarmRepository;
      }
      if (entityName === 'ProductionType') {
        return mockProductionTypeRepository;
      }
      return {};
    })
  }
}));


jest.mock('../../models/Animal', () => ({
  Animal: { name: 'Animal' }
}));

jest.mock('../../models/Farm', () => ({
  Farm: { name: 'Farm' }
}));

jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));


import * as dashboardController from '../../controllers/dashboardController';

describe('Dashboard Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    test('debería obtener estadísticas correctamente', async () => {
      
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

      
      mockAnimalRepository.count.mockResolvedValue(mockTotalAnimals);
      mockProductionTypeRepository.find.mockResolvedValue(mockProductionTypes);
      mockFarmRepository.find.mockResolvedValue(mockFarms);
      
      
      mockAnimalRepository.find.mockImplementation((params: any) => {
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

      
      await dashboardController.getDashboardStats(mockRequest as unknown as Request, mockResponse as unknown as Response);

      
      expect(mockAnimalRepository.count).toHaveBeenCalled();
      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ['production_type']
      });
      expect(mockProductionTypeRepository.find).toHaveBeenCalled();
      
      
      expect(mockResponse.json).toHaveBeenCalledWith({
        total_animals: mockTotalAnimals,
        total_carne_production: 250, 
        total_leche_production: 450, 
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
    });

    test('debería manejar errores correctamente', async () => {
      mockAnimalRepository.count.mockRejectedValue(new Error('Error de base de datos'));
      await dashboardController.getDashboardStats(mockRequest as unknown as Request, mockResponse as unknown as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener estadísticas del dashboard'
      });
    });
  });
}); 
// sonarignore:end