// sonarignore:start
import { Request, Response } from 'express';


const mockRepositories = {
  animalRepository: {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  },
  farmRepository: {
    findOne: jest.fn(),
  }
};


jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn((entity) => {
      if (entity.name === 'Animal') {
        return mockRepositories.animalRepository;
      }
      if (entity.name === 'Farm') {
        return mockRepositories.farmRepository;
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


const animalController = require('../../controllers/animalController');

describe('Animal Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });
  
  describe('createAnimal', () => {
    test('debería validar campos requeridos', async () => {
      mockRequest = {
        body: {
          identification_number: 'V001'
        }
      };
      
      await animalController.createAnimal(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'farm_id y animal_type son obligatorios' 
      });
    });

    test('debería verificar si la granja existe', async () => {
      mockRequest = {
        body: {
          farm_id: 1,
          animal_type: 'Vaca',
          identification_number: 'V001'
        }
      };

      mockRepositories.farmRepository.findOne.mockResolvedValue(null);
      
      await animalController.createAnimal(mockRequest, mockResponse);
      
      expect(mockRepositories.farmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'La granja especificada no existe' 
      });
    });

    test('debería crear un animal correctamente', async () => {
      const mockFarm = { id: 1, name: 'Granja Test' };
      const mockAnimal = {
        id: 1,
        animal_type: 'Vaca',
        identification_number: 'V001',
        farm: mockFarm
      };

      mockRequest = {
        body: {
          farm_id: 1,
          animal_type: 'Vaca',
          identification_number: 'V001'
        }
      };

      mockRepositories.farmRepository.findOne.mockResolvedValue(mockFarm);
      mockRepositories.animalRepository.create.mockReturnValue(mockAnimal);
      mockRepositories.animalRepository.save.mockResolvedValue(mockAnimal);
      
      await animalController.createAnimal(mockRequest, mockResponse);
      
      expect(mockRepositories.farmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepositories.animalRepository.create).toHaveBeenCalled();
      expect(mockRepositories.animalRepository.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Animal creado',
        animal: mockAnimal
      });
    });
  });
  
  describe('getAnimalsByFarm', () => {
    test('debería obtener todos los animales de una granja', async () => {
      const mockAnimals = [
        { id: 1, animal_type: 'Vaca', identification_number: 'V001' },
        { id: 2, animal_type: 'Vaca', identification_number: 'V002' }
      ];
      
      mockRequest = {
        params: {
          farmId: '1'
        }
      };

      mockRepositories.animalRepository.find.mockResolvedValue(mockAnimals);
      
      await animalController.getAnimalsByFarm(mockRequest, mockResponse);
      
      expect(mockRepositories.animalRepository.find).toHaveBeenCalledWith({ where: { farm: { id: 1 } } });
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimals);
    });
  });
  
  describe('getAnimalById', () => {
    test('debería obtener un animal por su ID', async () => {
      const mockAnimal = {
        id: 1,
        animal_type: 'Vaca',
        identification_number: 'V001',
        farm: { id: 1, name: 'Granja Test' }
      };
      
      mockRequest = {
        params: {
          id: '1'
        }
      };

      mockRepositories.animalRepository.findOne.mockResolvedValue(mockAnimal);
      
      await animalController.getAnimalById(mockRequest, mockResponse);
      
      expect(mockRepositories.animalRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['farm']
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockAnimal);
    });

    test('debería devolver 404 si el animal no existe', async () => {
      mockRequest = {
        params: {
          id: '999'
        }
      };

      mockRepositories.animalRepository.findOne.mockResolvedValue(null);
      
      await animalController.getAnimalById(mockRequest, mockResponse);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Animal no encontrado' });
    });
  });
}); 
// sonarignore:end