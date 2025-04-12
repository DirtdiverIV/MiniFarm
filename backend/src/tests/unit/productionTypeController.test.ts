import { Request, Response } from 'express';

// Mocks de los repositorios
const mockProductionTypeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn()
};

// Mock de las dependencias
jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'string' ? entity : entity.name;
      if (entityName === 'ProductionType') {
        return mockProductionTypeRepository;
      }
      return {};
    })
  }
}));

// Mock de los modelos
jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));

// Importar el controlador después de todos los mocks
import * as productionTypeController from '../../controllers/productionTypeController';

describe('Production Type Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Configurar mocks para Request y Response
    mockRequest = {
      params: {},
      body: {}
    };
    
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

  describe('createProductionType', () => {
    test('debería crear un tipo de producción exitosamente', async () => {
      // Preparar datos de prueba
      mockRequest.body = { name: 'Cárnica' };
      const mockProductionType = { id: 1, name: 'Cárnica' };

      // Configurar mocks
      mockProductionTypeRepository.create.mockReturnValue(mockProductionType);
      mockProductionTypeRepository.save.mockResolvedValue(mockProductionType);

      // Ejecutar el controlador
      await productionTypeController.createProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de producción creado',
        productionType: mockProductionType
      });
      expect(mockProductionTypeRepository.create).toHaveBeenCalledWith({ name: 'Cárnica' });
      expect(mockProductionTypeRepository.save).toHaveBeenCalled();
    });

    test('debería manejar error cuando falta el nombre', async () => {
      // Preparar datos de prueba incompletos
      mockRequest.body = {};

      // Ejecutar el controlador
      await productionTypeController.createProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'El nombre es obligatorio'
      });
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
      await productionTypeController.getAllProductionTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockProductionTypes);
      expect(mockProductionTypeRepository.find).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de producción', async () => {
      // Configurar mock para simular error
      mockProductionTypeRepository.find.mockRejectedValue(new Error('Error de base de datos'));

      // Ejecutar el controlador
      await productionTypeController.getAllProductionTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener tipos de producción'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getProductionTypeById', () => {
    test('debería obtener un tipo de producción por ID', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      const mockProductionType = { id: 1, name: 'Cárnica' };

      // Configurar mock
      mockProductionTypeRepository.findOne.mockResolvedValue(mockProductionType);

      // Ejecutar el controlador
      await productionTypeController.getProductionTypeById(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockProductionType);
      expect(mockProductionTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería devolver 404 si el tipo de producción no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };

      // Configurar mock
      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await productionTypeController.getProductionTypeById(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de producción no encontrado'
      });
    });
  });

  describe('updateProductionType', () => {
    test('debería actualizar un tipo de producción correctamente', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Cárnica Actualizada' };
      
      const mockProductionType = {
        id: 1,
        name: 'Cárnica'
      };

      const mockUpdatedProductionType = {
        ...mockProductionType,
        name: 'Cárnica Actualizada'
      };

      // Configurar mocks
      mockProductionTypeRepository.findOne.mockResolvedValue(mockProductionType);
      mockProductionTypeRepository.save.mockResolvedValue(mockUpdatedProductionType);

      // Ejecutar el controlador
      await productionTypeController.updateProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de producción actualizado',
        productionType: mockUpdatedProductionType
      });
      expect(mockProductionTypeRepository.save).toHaveBeenCalled();
    });

    test('debería devolver 404 si el tipo de producción a actualizar no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Cárnica Actualizada' };

      // Configurar mock
      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await productionTypeController.updateProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de producción no encontrado'
      });
    });
  });

  describe('deleteProductionType', () => {
    test('debería eliminar un tipo de producción correctamente', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      const mockProductionType = { id: 1, name: 'Cárnica' };

      // Configurar mocks
      mockProductionTypeRepository.findOne.mockResolvedValue(mockProductionType);

      // Ejecutar el controlador
      await productionTypeController.deleteProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de producción eliminado'
      });
      expect(mockProductionTypeRepository.remove).toHaveBeenCalledWith(mockProductionType);
    });

    test('debería devolver 404 si el tipo de producción no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };

      // Configurar mock
      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await productionTypeController.deleteProductionType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de producción no encontrado'
      });
    });
  });
}); 