// sonarignore:start
import { Request, Response } from "express";

const mockProductionTypeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

jest.mock("../../config/dataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === "string" ? entity : entity.name;
      if (entityName === "ProductionType") {
        return mockProductionTypeRepository;
      }
      return {};
    }),
  },
}));

jest.mock("../../models/ProductionType", () => ({
  ProductionType: { name: "ProductionType" },
}));

import * as productionTypeController from "../../controllers/productionTypeController";

describe("Production Type Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {
      params: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("createProductionType", () => {
    test("debería crear un tipo de producción exitosamente", async () => {
      mockRequest.body = { name: "Cárnica" };
      const mockProductionType = { id: 1, name: "Cárnica" };

      mockProductionTypeRepository.create.mockReturnValue(mockProductionType);
      mockProductionTypeRepository.save.mockResolvedValue(mockProductionType);

      await productionTypeController.createProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo de producción creado",
        productionType: mockProductionType,
      });
      expect(mockProductionTypeRepository.create).toHaveBeenCalledWith({
        name: "Cárnica",
      });
      expect(mockProductionTypeRepository.save).toHaveBeenCalled();
    });

    test("debería manejar error cuando falta el nombre", async () => {
      mockRequest.body = {};

      await productionTypeController.createProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "El nombre es obligatorio",
      });
    });
  });

  describe("getAllProductionTypes", () => {
    test("debería obtener todos los tipos de producción", async () => {
      const mockProductionTypes = [
        { id: 1, name: "Cárnica" },
        { id: 2, name: "Láctea" },
      ];

      mockProductionTypeRepository.find.mockResolvedValue(mockProductionTypes);

      await productionTypeController.getAllProductionTypes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockProductionTypes);
      expect(mockProductionTypeRepository.find).toHaveBeenCalled();
    });

    test("debería manejar errores al obtener tipos de producción", async () => {
      mockProductionTypeRepository.find.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await productionTypeController.getAllProductionTypes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error al obtener tipos de producción",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("getProductionTypeById", () => {
    test("debería obtener un tipo de producción por ID", async () => {
      mockRequest.params = { id: "1" };
      const mockProductionType = { id: 1, name: "Cárnica" };

      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );

      await productionTypeController.getProductionTypeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockProductionType);
      expect(mockProductionTypeRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    test("debería devolver 404 si el tipo de producción no existe", async () => {
      mockRequest.params = { id: "999" };

      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      await productionTypeController.getProductionTypeById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de producción no encontrado",
      });
    });
  });

  describe("updateProductionType", () => {
    test("debería actualizar un tipo de producción correctamente", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Cárnica Actualizada" };

      const mockProductionType = {
        id: 1,
        name: "Cárnica",
      };

      const mockUpdatedProductionType = {
        ...mockProductionType,
        name: "Cárnica Actualizada",
      };

      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );
      mockProductionTypeRepository.save.mockResolvedValue(
        mockUpdatedProductionType
      );

      await productionTypeController.updateProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo de producción actualizado",
        productionType: mockUpdatedProductionType,
      });
      expect(mockProductionTypeRepository.save).toHaveBeenCalled();
    });

    test("debería devolver 404 si el tipo de producción a actualizar no existe", async () => {
      mockRequest.params = { id: "999" };
      mockRequest.body = { name: "Cárnica Actualizada" };

      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      await productionTypeController.updateProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de producción no encontrado",
      });
    });
  });

  describe("deleteProductionType", () => {
    test("debería eliminar un tipo de producción correctamente", async () => {
      mockRequest.params = { id: "1" };
      const mockProductionType = { id: 1, name: "Cárnica" };

      mockProductionTypeRepository.findOne.mockResolvedValue(
        mockProductionType
      );

      await productionTypeController.deleteProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo de producción eliminado",
      });
      expect(mockProductionTypeRepository.remove).toHaveBeenCalledWith(
        mockProductionType
      );
    });

    test("debería devolver 404 si el tipo de producción no existe", async () => {
      mockRequest.params = { id: "999" };

      mockProductionTypeRepository.findOne.mockResolvedValue(null);

      await productionTypeController.deleteProductionType(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Tipo de producción no encontrado",
      });
    });
  });
});
// sonarignore:end
