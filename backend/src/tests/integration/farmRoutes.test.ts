// sonarignore:start
import request from 'supertest';
import express from 'express';


const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockRemove = jest.fn();
const mockDelete = jest.fn();
const mockFarmTypeFind = jest.fn();
const mockProductionTypeFind = jest.fn();


jest.mock('../../middlewares/uploadMiddleware', () => ({
  uploadFarmImage: (req: any, res: any, next: any) => {
    
    if (req.body.mockFile) {
      req.file = { 
        filename: 'test-image.jpg',
        path: '/tmp/test-image.jpg'
      };
      delete req.body.mockFile;
    }
    next();
  },
  handleMulterError: (err: any, req: any, res: any, next: any) => next()
}));


jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
  existsSync: jest.fn().mockImplementation(() => true)
}));


jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === 'object' ? entity.name : entity;
      if (entityName === 'Farm') {
        return {
          create: mockCreate,
          save: mockSave,
          find: mockFind,
          findOne: mockFindOne,
          remove: mockRemove
        };
      }
      if (entityName === 'FarmType') {
        return {
          findOne: mockFarmTypeFind
        };
      }
      if (entityName === 'ProductionType') {
        return {
          findOne: mockProductionTypeFind
        };
      }
      if (entityName === 'Animal') {
        return {
          delete: mockDelete
        };
      }
      return {};
    })
  }
}));


jest.mock('../../models/Farm', () => ({
  Farm: { name: 'Farm' }
}));

jest.mock('../../models/FarmType', () => ({
  FarmType: { name: 'FarmType' }
}));

jest.mock('../../models/ProductionType', () => ({
  ProductionType: { name: 'ProductionType' }
}));

jest.mock('../../models/Animal', () => ({
  Animal: { name: 'Animal' }
}));


jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    
    req.userId = 1;
    next();
  }
}));


const farmRouter = require('../../routes/farmRoutes').farmRouter;

describe('Farm Routes', () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    
    app = express();
    app.use(express.json());
    app.use('/api/farms', farmRouter);
  });

  beforeEach(() => {
    
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    
    consoleErrorSpy.mockRestore();
  });

  describe('GET /api/farms', () => {
    test('debería obtener todas las granjas', async () => {
      const mockFarms = [
        { id: 1, name: 'Granja 1' },
        { id: 2, name: 'Granja 2' }
      ];

      mockFind.mockResolvedValue(mockFarms);

      const response = await request(app)
        .get('/api/farms');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarms);
      expect(mockFind).toHaveBeenCalledWith({
        relations: ['farm_type', 'production_type']
      });
    });

    test('debería manejar errores al obtener granjas', async () => {
      mockFind.mockRejectedValue(new Error('Error de base de datos'));

      const response = await request(app)
        .get('/api/farms');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Error al obtener granjas');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('GET /api/farms/:id', () => {
    test('debería obtener una granja por su ID', async () => {
      const mockFarm = {
        id: 1,
        name: 'Granja Test',
        farm_type: { id: 1, name: 'Tipo Test' },
        production_type: { id: 1, name: 'Producción Test' }
      };

      mockFindOne.mockResolvedValue(mockFarm);

      const response = await request(app)
        .get('/api/farms/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockFarm);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['farm_type', 'production_type']
      });
    });

    test('debería devolver 404 si la granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/farms/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Granja no encontrada');
    });
  });

  describe('POST /api/farms', () => {
    test('debería crear una granja correctamente', async () => {
      const mockFarmType = { id: 1, name: 'Tipo Test' };
      const mockProductionType = { id: 1, name: 'Producción Test' };
      const mockFarm = {
        id: 1,
        name: 'Granja Test',
        farm_type: mockFarmType,
        production_type: mockProductionType,
        provincia: 'Sevilla',
        municipio: 'Écija'
      };

      mockFarmTypeFind.mockResolvedValue(mockFarmType);
      mockProductionTypeFind.mockResolvedValue(mockProductionType);
      mockCreate.mockReturnValue(mockFarm);
      mockSave.mockResolvedValue(mockFarm);

      const response = await request(app)
        .post('/api/farms')
        .send({
          name: 'Granja Test',
          farm_type_id: 1,
          production_type_id: 1,
          provincia: 'Sevilla',
          municipio: 'Écija'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Granja creada');
      expect(response.body).toHaveProperty('farm', mockFarm);
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Granja Test',
          provincia: 'Sevilla',
          municipio: 'Écija'
        })
      );
    });

    test('debería manejar la carga de imágenes', async () => {
      const mockFarmType = { id: 1, name: 'Tipo Test' };
      const mockProductionType = { id: 1, name: 'Producción Test' };
      const mockFarm = {
        id: 1,
        name: 'Granja Test',
        farm_type: mockFarmType,
        production_type: mockProductionType,
        image_path: '/uploads/farms/test-image.jpg'
      };

      mockFarmTypeFind.mockResolvedValue(mockFarmType);
      mockProductionTypeFind.mockResolvedValue(mockProductionType);
      mockCreate.mockReturnValue(mockFarm);
      mockSave.mockResolvedValue(mockFarm);

      const response = await request(app)
        .post('/api/farms')
        .send({
          name: 'Granja Test',
          farm_type_id: 1,
          production_type_id: 1,
          mockFile: true 
        });

      expect(response.status).toBe(201);
      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        image_path: expect.stringContaining('test-image.jpg')
      }));
    });

    test('debería devolver 400 si faltan campos obligatorios', async () => {
      const response = await request(app)
        .post('/api/farms')
        .send({
          name: 'Granja Test'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Faltan campos obligatorios');
    });
  });

  describe('PUT /api/farms/:id', () => {
    test('debería actualizar una granja correctamente', async () => {
      const mockFarmType = { id: 2, name: 'Tipo Actualizado' };
      const mockProductionType = { id: 2, name: 'Producción Actualizada' };
      
      const existingFarm = {
        id: 1,
        name: 'Granja Original',
        farm_type: { id: 1, name: 'Tipo Original' },
        production_type: { id: 1, name: 'Producción Original' },
        provincia: 'Córdoba',
        municipio: 'Montilla'
      };
      
      const updatedFarm = {
        ...existingFarm,
        name: 'Granja Actualizada',
        farm_type: mockFarmType,
        production_type: mockProductionType,
        provincia: 'Jaén',
        municipio: 'Úbeda'
      };

      mockFindOne.mockResolvedValue(existingFarm);
      mockFarmTypeFind.mockResolvedValue(mockFarmType);
      mockProductionTypeFind.mockResolvedValue(mockProductionType);
      mockSave.mockResolvedValue(updatedFarm);

      const response = await request(app)
        .put('/api/farms/1')
        .send({
          name: 'Granja Actualizada',
          farm_type_id: 2,
          production_type_id: 2,
          provincia: 'Jaén',
          municipio: 'Úbeda'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Granja actualizada');
      expect(response.body).toHaveProperty('farm', updatedFarm);
      expect(mockSave).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Granja Actualizada',
          provincia: 'Jaén',
          municipio: 'Úbeda'
        })
      );
    });

    test('debería devolver 404 si la granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/farms/999')
        .send({
          name: 'Granja Actualizada'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Granja no encontrada');
    });
  });

  describe('DELETE /api/farms/:id', () => {
    test('debería eliminar una granja correctamente', async () => {
      const mockFarm = {
        id: 1,
        name: 'Granja Test'
      };

      mockFindOne.mockResolvedValue(mockFarm);

      const response = await request(app)
        .delete('/api/farms/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Granja y sus animales asociados eliminados');
      expect(mockDelete).toHaveBeenCalledWith({ farm: { id: 1 } });
      expect(mockRemove).toHaveBeenCalledWith(mockFarm);
    });

    test('debería devolver 404 si la granja no existe', async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/farms/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Granja no encontrada');
    });
  });
});
// sonarignore:end
