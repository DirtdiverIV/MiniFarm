import { Request, Response } from 'express';

// Mocks de los repositorios
const mockFarmTypeRepository = {
  find: jest.fn()
};

const mockProductionTypeRepository = {
  find: jest.fn()
};

// Mock de las dependencias
jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'string' ? entity : entity.name;
      if (entityName === 'FarmType') {
        return mockFarmTypeRepository;
      }
      if (entityName === 'ProductionType') {
        return mockProductionTypeRepository;
      }
      return {};
    })
  }
}));

// Mock de los modelos
jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));

jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));

// Importar el controlador después de todos los mocks
import * as typeController from '../../controllers/typeController';

describe('Type Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Configurar mocks para Request y Response
    mockRequest = {};
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    // Silenciar errores de consola
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restaurar console.error después de cada prueba
    consoleErrorSpy.mockRestore();
  });

  describe('getAllFarmTypes', () => {
    test('debería obtener todos los tipos de granja', async () => {
      // Preparar datos de prueba
      const mockFarmTypes = [
        { id: 1, name: 'Ganadería' },
        { id: 2, name: 'Avícola' }
      ];

      // Configurar mock
      mockFarmTypeRepository.find.mockResolvedValue(mockFarmTypes);

      // Ejecutar el controlador
      await typeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmTypes);
      expect(mockFarmTypeRepository.find).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de granja', async () => {
      // Configurar mock para simular error
      mockFarmTypeRepository.find.mockRejectedValue(new Error('Error de base de datos'));

      // Ejecutar el controlador
      await typeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener tipos de granja'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getAllProductionTypes', () => {
    test('debería obtener todos los tipos de producción', async () => {
      // Preparar datos de prueba
      const mockProductionTypes = [
        { id: 1, name: 'Cárnica' },
        { id: 2, name: 'Láctea' }
      ];

      // Configurar mock
      mockProductionTypeRepository.find.mockResolvedValue(mockProductionTypes);

      // Ejecutar el controlador
      await typeController.getAllProductionTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockProductionTypes);
      expect(mockProductionTypeRepository.find).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de producción', async () => {
      // Configurar mock para simular error
      mockProductionTypeRepository.find.mockRejectedValue(new Error('Error de base de datos'));

      // Ejecutar el controlador
      await typeController.getAllProductionTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener tipos de producción'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
}); 