import request from 'supertest';
import express from 'express';

// Mock de las funciones individuales
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockRemove = jest.fn();

// Mock de las dependencias
jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'object' ? entity.name : entity;
      if (entityName === 'FarmType') {
        return {
          create: mockCreate,
          save: mockSave,
          find: mockFind,
          findOne: mockFindOne,
          remove: mockRemove
        };
      }
      return {};
    })
  }
}));

// Mock de los modelos para evitar referencias circulares
jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));

// Mock del middleware de autenticación
jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    // Simula que el usuario está autenticado
    req.userId = 1;
    next();
  }
}));

// Importar las rutas después de los mocks
const farmTypeRouter = require('../../routes/farmTypeRoutes').farmTypeRouter;

describe('Farm Type Routes', () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    // Configurar la aplicación Express
    app = express();
    app.use(express.json());
    app.use('/api/farm-types', farmTypeRouter);
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

  describe('GET /api/farm-types', () => {
    test('debería obtener todos los tipos de granja', async () => {
      const mockFarmTypes = [
        { id: 1, name: 'Ganadería' },
        { id: 2, name: 'Avícola' }
      ];

      mockFind.mockResolvedValue(mockFarmTypes);

      const response = await request(app)
        .get('/api/farm-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarmTypes);
      expect(mockFind).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de granja', async () => {
      mockFind.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/farm-types');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener tipos de granja');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('GET /api/farm-types/:id', () => {
    test('debería obtener un tipo de granja por su ID', async () => {
      const mockFarmType = { id: 1, name: 'Ganadería' };

      mockFindOne.mockResolvedValue(mockFarmType);

      const response = await request(app)
        .get('/api/farm-types/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarmType);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/farm-types/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de granja no encontrado');
    });
  });

  describe('POST /api/farm-types', () => {
    test('debería crear un tipo de granja correctamente', async () => {
      const mockFarmType = { id: 1, name: 'Ganadería' };

      mockCreate.mockReturnValue(mockFarmType);
      mockSave.mockResolvedValue(mockFarmType);

      const response = await request(app)
        .post('/api/farm-types')
        .send({
          name: 'Ganadería'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Tipo de granja creado');
      expect(response.body).toHaveProperty('farmType');
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Ganadería' });
      expect(mockSave).toHaveBeenCalled();
    });

    test('debería devolver 400 si falta el nombre', async () => {
      const response = await request(app)
        .post('/api/farm-types')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'El nombre es obligatorio');
    });
  });

  describe('PUT /api/farm-types/:id', () => {
    test('debería actualizar un tipo de granja correctamente', async () => {
      const mockFarmType = { id: 1, name: 'Ganadería' };
      const mockUpdatedFarmType = { id: 1, name: 'Ganadería Actualizada' };

      mockFindOne.mockResolvedValue(mockFarmType);
      mockSave.mockResolvedValue(mockUpdatedFarmType);

      const response = await request(app)
        .put('/api/farm-types/1')
        .send({
          name: 'Ganadería Actualizada'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tipo de granja actualizado');
      expect(response.body).toHaveProperty('farmType');
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockSave).toHaveBeenCalled();
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/farm-types/999')
        .send({
          name: 'Ganadería Actualizada'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de granja no encontrado');
    });
  });

  describe('DELETE /api/farm-types/:id', () => {
    test('debería eliminar un tipo de granja correctamente', async () => {
      const mockFarmType = { id: 1, name: 'Ganadería' };

      mockFindOne.mockResolvedValue(mockFarmType);

      const response = await request(app)
        .delete('/api/farm-types/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tipo de granja eliminado');
      expect(mockRemove).toHaveBeenCalledWith(mockFarmType);
    });

    test('debería devolver 404 si el tipo de granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/farm-types/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de granja no encontrado');
    });
  });
}); 