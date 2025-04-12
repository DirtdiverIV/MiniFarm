import { Request, Response } from 'express';

// Mocks de los repositorios
const mockFarmTypeRepository = {
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
      if (entityName === 'FarmType') {
        return mockFarmTypeRepository;
      }
      return {};
    })
  }
}));

// Mock de los modelos
jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));

// Importar el controlador después de todos los mocks
import * as farmTypeController from '../../controllers/farmTypeController';

describe('Farm Type Controller', () => {
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

  describe('createFarmType', () => {
    test('debería crear un tipo de granja exitosamente', async () => {
      // Preparar datos de prueba
      mockRequest.body = { name: 'Ganadería' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      // Configurar mocks
      mockFarmTypeRepository.create.mockReturnValue(mockFarmType);
      mockFarmTypeRepository.save.mockResolvedValue(mockFarmType);

      // Ejecutar el controlador
      await farmTypeController.createFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja creado',
        farmType: mockFarmType
      });
      expect(mockFarmTypeRepository.create).toHaveBeenCalledWith({ name: 'Ganadería' });
      expect(mockFarmTypeRepository.save).toHaveBeenCalled();
    });

    test('debería manejar error cuando falta el nombre', async () => {
      // Preparar datos de prueba incompletos
      mockRequest.body = {};

      // Ejecutar el controlador
      await farmTypeController.createFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'El nombre es obligatorio'
      });
    });
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
      await farmTypeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmTypes);
      expect(mockFarmTypeRepository.find).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de granja', async () => {
      // Configurar mock para simular error
      mockFarmTypeRepository.find.mockRejectedValue(new Error('Error de base de datos'));

      // Ejecutar el controlador
      await farmTypeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener tipos de granja'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getFarmTypeById', () => {
    test('debería obtener un tipo de granja por ID', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      // Configurar mock
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);

      // Ejecutar el controlador
      await farmTypeController.getFarmTypeById(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmType);
      expect(mockFarmTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };

      // Configurar mock
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await farmTypeController.getFarmTypeById(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });

  describe('updateFarmType', () => {
    test('debería actualizar un tipo de granja correctamente', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Ganadería Actualizada' };
      
      const mockFarmType = {
        id: 1,
        name: 'Ganadería'
      };

      const mockUpdatedFarmType = {
        ...mockFarmType,
        name: 'Ganadería Actualizada'
      };

      // Configurar mocks
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);
      mockFarmTypeRepository.save.mockResolvedValue(mockUpdatedFarmType);

      // Ejecutar el controlador
      await farmTypeController.updateFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja actualizado',
        farmType: mockUpdatedFarmType
      });
      expect(mockFarmTypeRepository.save).toHaveBeenCalled();
    });

    test('debería devolver 404 si el tipo de granja a actualizar no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Ganadería Actualizada' };

      // Configurar mock
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await farmTypeController.updateFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });

  describe('deleteFarmType', () => {
    test('debería eliminar un tipo de granja correctamente', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '1' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      // Configurar mocks
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);

      // Ejecutar el controlador
      await farmTypeController.deleteFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja eliminado'
      });
      expect(mockFarmTypeRepository.remove).toHaveBeenCalledWith(mockFarmType);
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      // Preparar datos de prueba
      mockRequest.params = { id: '999' };

      // Configurar mock
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      // Ejecutar el controlador
      await farmTypeController.deleteFarmType(mockRequest as Request, mockResponse as Response);

      // Verificar resultados
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });
}); 