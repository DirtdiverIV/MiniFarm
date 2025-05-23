// sonarignore:start
import { Request, Response } from "express";
import fs from "fs";

const mockFarmRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockFarmTypeRepository = {
  findOne: jest.fn(),
};

const mockProductionTypeRepository = {
  findOne: jest.fn(),
};

const mockAnimalRepository = {
  delete: jest.fn(),
};

jest.mock("../../config/dataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === "string" ? entity : entity.name;
      if (entityName === "Farm") {
        return mockFarmRepository;
      }
      if (entityName === "FarmType") {
        return mockFarmTypeRepository;
      }
      if (entityName === "ProductionType") {
        return mockProductionTypeRepository;
      }
      if (entityName === "Animal") {
        return mockAnimalRepository;
      }
      return {};
    }),
  },
}));

jest.mock("../../models/Farm", () => ({
  Farm: { name: "Farm" },
}));

jest.mock("../../models/FarmType", () => ({
  FarmType: { name: "FarmType" },
}));

jest.mock("../../models/ProductionType", () => ({
  ProductionType: { name: "ProductionType" },
}));

jest.mock("../../models/Animal", () => ({
  Animal: { name: "Animal" },
}));

jest.mock("fs", () => ({
  unlinkSync: jest.fn(),
  existsSync: jest.fn().mockImplementation(() => true),
}));

jest.mock("path", () => ({
  join: jest.fn().mockImplementation((...args) => args.join("/")),
}));

import * as farmController from "../../controllers/farmController";

describe("Farm Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
      file: undefined,
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe("createFarm", () => {
    test("debería crear una granja exitosamente", async () => {
      mockRequest.body = {
        name: "Granja Test",
        farm_type_id: 1,
        production_type_id: 1,
        provincia: "Málaga",
        municipio: "Antequera",
      };

      const mockFarmType = { id: 1, name: "Tipo Test" };
      const mockProductionType = { id: 1, name: "Producción Test" };
      const mockFarm = {
        id: 1,
        name: "Granja Test",
        farm_type: mockFarmType,
        production_type: mockProductionType,
        provincia: "Málaga",
        municipio: "Antequera",
      };

      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);
      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );
      mockFarmRepository.create.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue(mockFarm);

      await farmController.createFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Granja creada",
        farm: mockFarm,
      });
      expect(mockFarmRepository.create).toHaveBeenCalled();
      expect(mockFarmRepository.save).toHaveBeenCalled();
    });

    test("debería manejar error cuando faltan campos obligatorios", async () => {
      mockRequest.body = { name: "Granja Test" };

      await farmController.createFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Faltan campos obligatorios",
      });
    });

    test("debería eliminar archivo si se carga pero hay error", async () => {
      mockRequest.body = { name: "Granja Test" };
      mockRequest.file = {
        path: "/tmp/test.jpg",
        filename: "test.jpg",
      } as Express.Multer.File;

      await farmController.createFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(fs.unlinkSync).toHaveBeenCalledWith(mockRequest.file.path);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getAllFarms", () => {
    test("debería obtener todas las granjas", async () => {
      const mockFarms = [
        { id: 1, name: "Granja 1" },
        { id: 2, name: "Granja 2" },
      ];

      mockFarmRepository.find.mockResolvedValue(mockFarms);

      await farmController.getAllFarms(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockFarms);
      expect(mockFarmRepository.find).toHaveBeenCalledWith({
        relations: ["farm_type", "production_type"],
      });
    });

    test("debería manejar error al obtener granjas", async () => {
      mockFarmRepository.find.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await farmController.getAllFarms(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error al obtener granjas",
      });
    });
  });

  describe("getFarmById", () => {
    test("debería obtener una granja por ID", async () => {
      mockRequest.params = { id: "1" };
      const mockFarm = { id: 1, name: "Granja Test" };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);

      await farmController.getFarmById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockFarm);
      expect(mockFarmRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["farm_type", "production_type"],
      });
    });

    test("debería devolver 404 si la granja no existe", async () => {
      mockRequest.params = { id: "999" };

      mockFarmRepository.findOne.mockResolvedValue(null);

      await farmController.getFarmById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Granja no encontrada",
      });
    });
  });

  describe("updateFarm", () => {
    test("debería actualizar una granja exitosamente", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "Granja Actualizada",
        farm_type_id: 2,
        production_type_id: 2,
        provincia: "Cádiz",
        municipio: "Jerez",
      };

      const mockFarmType = { id: 2, name: "Tipo Actualizado" };
      const mockProductionType = { id: 2, name: "Producción Actualizada" };

      const existingFarm = {
        id: 1,
        name: "Granja Test",
        farm_type: { id: 1, name: "Tipo Original" },
        production_type: { id: 1, name: "Producción Original" },
        provincia: "Málaga",
        municipio: "Antequera",
      };

      const updatedFarm = {
        ...existingFarm,
        name: "Granja Actualizada",
        farm_type: mockFarmType,
        production_type: mockProductionType,
        provincia: "Cádiz",
        municipio: "Jerez",
      };

      mockFarmRepository.findOne.mockResolvedValue(existingFarm);
      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);
      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );
      mockFarmRepository.save.mockResolvedValue(updatedFarm);

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Granja actualizada",
        farm: updatedFarm,
      });

      expect(mockFarmRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          provincia: "Cádiz",
          municipio: "Jerez",
        })
      );
    });

    test("debería devolver 404 si la granja a actualizar no existe", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Granja Actualizada" };

      mockFarmRepository.findOne.mockResolvedValue(null);

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Granja no encontrada",
      });
    });
  });

  describe("deleteFarm", () => {
    test("debería eliminar una granja y sus animales asociados", async () => {
      mockRequest.params = { id: "1" };
      const mockFarm = { id: 1, name: "Granja Test" };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      (fs.existsSync as jest.Mock).mockImplementation(() => false);

      await farmController.deleteFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Granja y sus animales asociados eliminados",
      });
      expect(mockAnimalRepository.delete).toHaveBeenCalledWith({
        farm: { id: 1 },
      });
      expect(mockFarmRepository.remove).toHaveBeenCalledWith(mockFarm);
    });

    test("debería eliminar la imagen si existe", async () => {
      mockRequest.params = { id: "1" };
      const mockFarm = {
        id: 1,
        name: "Granja Test",
        image_path: "/uploads/farms/image.jpg",
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      (fs.existsSync as jest.Mock).mockImplementation(() => true);

      await farmController.deleteFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
    });

    test("debería devolver 404 si la granja no existe", async () => {
      mockRequest.params = { id: "999" };

      mockFarmRepository.findOne.mockResolvedValue(null);

      await farmController.deleteFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Granja no encontrada",
      });
    });
  });

  describe("Pruebas adicionales para mejorar cobertura", () => {
    test("debería eliminar la imagen antigua al actualizar una granja con nueva imagen", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Granja Actualizada" };
      mockRequest.file = {
        path: "/tmp/nueva-imagen.jpg",
        filename: "nueva-imagen.jpg",
      } as Express.Multer.File;

      const mockFarm = {
        id: 1,
        name: "Granja Original",
        image_path: "/uploads/farms/imagen-vieja.jpg",
        farm_type: { id: 1 },
        production_type: { id: 1 },
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.save.mockResolvedValue({
        ...mockFarm,
        name: "Granja Actualizada",
        image_path: "/uploads/farms/nueva-imagen.jpg",
      });

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalledWith(
        expect.stringContaining("imagen-vieja.jpg")
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Granja actualizada",
        })
      );
    });

    test("debería manejar error cuando el tipo de granja no es válido", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Granja Actualizada", farm_type_id: 999 };

      const mockFarm = {
        id: 1,
        name: "Granja Original",
        farm_type: { id: 1 },
        production_type: { id: 1 },
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de granja no válido",
      });
    });

    test("debería manejar error cuando el tipo de producción no es válido", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        name: "Granja Actualizada",
        production_type_id: 999,
      };

      const mockFarm = {
        id: 1,
        name: "Granja Original",
        farm_type: { id: 1 },
        production_type: { id: 1 },
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de producción no válido",
      });
    });

    test("debería manejar error al crear una granja con tipo inválido", async () => {
      mockRequest.body = {
        name: "Granja Test",
        farm_type_id: 1,
        production_type_id: 1,
      };

      mockFarmTypeRepository.findOne.mockResolvedValue(null);

      await farmController.createFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de granja o producción no válido",
      });
    });

    test("debería manejar error al actualizar una granja", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Granja Actualizada" };

      const mockFarm = {
        id: 1,
        name: "Granja Original",
        farm_type: { id: 1 },
        production_type: { id: 1 },
      };

      mockFarmRepository.findOne.mockResolvedValue(mockFarm);
      mockFarmRepository.save.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await farmController.updateFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error al actualizar granja",
      });
    });

    test("debería manejar error al crear una granja", async () => {
      mockRequest.body = {
        name: "Granja Test",
        farm_type_id: 1,
        production_type_id: 1,
      };

      const mockFarmType = { id: 1, name: "Tipo Test" };
      const mockProductionType = { id: 1, name: "Producción Test" };
      const mockFarm = {
        id: 1,
        name: "Granja Test",
        farm_type: mockFarmType,
        production_type: mockProductionType,
      };

      mockFarmTypeRepository.findOne.mockResolvedValue(mockFarmType);
      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );
      mockFarmRepository.create.mockReturnValue(mockFarm);
      mockFarmRepository.save.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await farmController.createFarm(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error creando granja",
      });
    });
  });
});
// sonarignore:end