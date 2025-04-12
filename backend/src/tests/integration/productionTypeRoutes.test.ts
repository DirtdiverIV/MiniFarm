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
      if (entityName === 'ProductionType') {
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
jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
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
const productionTypeRouter = require('../../routes/productionTypeRoutes').productionTypeRouter;

describe('Production Type Routes', () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    // Configurar la aplicación Express
    app = express();
    app.use(express.json());
    app.use('/api/production-types', productionTypeRouter);
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

  describe('GET /api/production-types', () => {
    test('debería obtener todos los tipos de producción', async () => {
      const mockProductionTypes = [
        { id: 1, name: 'Cárnica' },
        { id: 2, name: 'Láctea' }
      ];

      mockFind.mockResolvedValue(mockProductionTypes);

      const response = await request(app)
        .get('/api/production-types');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProductionTypes);
      expect(mockFind).toHaveBeenCalled();
    });

    test('debería manejar errores al obtener tipos de producción', async () => {
      mockFind.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/production-types');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener tipos de producción');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('GET /api/production-types/:id', () => {
    test('debería obtener un tipo de producción por su ID', async () => {
      const mockProductionType = { id: 1, name: 'Cárnica' };

      mockFindOne.mockResolvedValue(mockProductionType);

      const response = await request(app)
        .get('/api/production-types/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProductionType);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    test('debería devolver 404 si el tipo de producción no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/production-types/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de producción no encontrado');
    });
  });

  describe('POST /api/production-types', () => {
    test('debería crear un tipo de producción correctamente', async () => {
      const mockProductionType = { id: 1, name: 'Cárnica' };

      mockCreate.mockReturnValue(mockProductionType);
      mockSave.mockResolvedValue(mockProductionType);

      const response = await request(app)
        .post('/api/production-types')
        .send({
          name: 'Cárnica'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Tipo de producción creado');
      expect(response.body).toHaveProperty('productionType');
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Cárnica' });
      expect(mockSave).toHaveBeenCalled();
    });

    test('debería devolver 400 si falta el nombre', async () => {
      const response = await request(app)
        .post('/api/production-types')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'El nombre es obligatorio');
    });
  });

  describe('PUT /api/production-types/:id', () => {
    test('debería actualizar un tipo de producción correctamente', async () => {
      const mockProductionType = { id: 1, name: 'Cárnica' };
      const mockUpdatedProductionType = { id: 1, name: 'Cárnica Actualizada' };

      mockFindOne.mockResolvedValue(mockProductionType);
      mockSave.mockResolvedValue(mockUpdatedProductionType);

      const response = await request(app)
        .put('/api/production-types/1')
        .send({
          name: 'Cárnica Actualizada'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tipo de producción actualizado');
      expect(response.body).toHaveProperty('productionType');
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(mockSave).toHaveBeenCalled();
    });

    test('debería devolver 404 si el tipo de producción no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/production-types/999')
        .send({
          name: 'Cárnica Actualizada'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de producción no encontrado');
    });
  });

  describe('DELETE /api/production-types/:id', () => {
    test('debería eliminar un tipo de producción correctamente', async () => {
      const mockProductionType = { id: 1, name: 'Cárnica' };

      mockFindOne.mockResolvedValue(mockProductionType);

      const response = await request(app)
        .delete('/api/production-types/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Tipo de producción eliminado');
      expect(mockRemove).toHaveBeenCalledWith(mockProductionType);
    });

    test('debería devolver 404 si el tipo de producción no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/production-types/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Tipo de producción no encontrado');
    });
  });
}); 