// sonarignore:start
import { Request, Response } from 'express';


const mockFarmTypeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn()
};


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


jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));


import * as farmTypeController from '../../controllers/farmTypeController';

describe('Farm Type Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    
    mockRequest = {
      params: {},
      body: {}
    };
    
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    
    jest.clearAllMocks();
  });

  afterEach(() => {
    
    consoleErrorSpy.mockRestore();
  });

  describe('createFarmType', () => {
    test('debería crear un tipo de granja exitosamente', async () => {
      
      mockRequest.body = { name: 'Ganadería' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      
      mockFarmTypeRepository.create.mockReturnValue(mockFarmType);
      mockFarmTypeRepository.save.mockResolvedValue(mockFarmType);

      
      await farmTypeController.createFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja creado',
        farmType: mockFarmType
      });
      expect(mockFarmTypeRepository.create).toHaveBeenCalledWith({ name: 'Ganadería' });
      expect(mockFarmTypeRepository.save).toHaveBeenCalled();
    });

    test('debería manejar error cuando falta el nombre', async () => {
      
      mockRequest.body = {};

      
      await farmTypeController.createFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'El nombre es obligatorio'
      });
    });
  });

  describe('getAllFarmTypes', () => {
    test('debería obtener todos los tipos de granja', async () => {
      
      const mockFarmTypes = [
        { id: 1, name: 'Ganadería' },
        { id: 2, name: 'Avícola' }
      ];

      
      mockFarmTypeRepository.find.mockResolvedValue(mockFarmTypes);

      
      await farmTypeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmTypes);
      expect(mockFarmTypeRepository.find).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de granja', async () => {
      
      mockFarmTypeRepository.find.mockRejectedValue(new Error('Error de base de datos'));

      
      await farmTypeController.getAllFarmTypes(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error al obtener tipos de granja'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getFarmTypeById', () => {
    test('debería obtener un tipo de granja por ID', async () => {
      
      mockRequest.params = { id: '1' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);

      
      await farmTypeController.getFarmTypeById(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmType);
      expect(mockFarmTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      
      mockRequest.params = { id: '999' };

      
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      
      await farmTypeController.getFarmTypeById(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });

  describe('updateFarmType', () => {
    test('debería actualizar un tipo de granja correctamente', async () => {
      
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

      
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);
      mockFarmTypeRepository.save.mockResolvedValue(mockUpdatedFarmType);

      
      await farmTypeController.updateFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja actualizado',
        farmType: mockUpdatedFarmType
      });
      expect(mockFarmTypeRepository.save).toHaveBeenCalled();
    });

    test('debería devolver 404 si el tipo de granja a actualizar no existe', async () => {
      
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Ganadería Actualizada' };

      
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      
      await farmTypeController.updateFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });

  describe('deleteFarmType', () => {
    test('debería eliminar un tipo de granja correctamente', async () => {
      
      mockRequest.params = { id: '1' };
      const mockFarmType = { id: 1, name: 'Ganadería' };

      
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);

      
      await farmTypeController.deleteFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Tipo de granja eliminado'
      });
      expect(mockFarmTypeRepository.remove).toHaveBeenCalledWith(mockFarmType);
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      
      mockRequest.params = { id: '999' };

      
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      
      await farmTypeController.deleteFarmType(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Tipo de granja no encontrado'
      });
    });
  });
});
// sonarignore:end
