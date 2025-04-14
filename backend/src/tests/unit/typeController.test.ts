// sonarignore:start
import { Request, Response } from "express";

const mockFarmTypeRepository = {
  find: jest.fn(),
};

const mockProductionTypeRepository = {
  find: jest.fn(),
};

jest.mock("../../config/dataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === "string" ? entity : entity.name;
      if (entityName === "FarmType") {
        return mockFarmTypeRepository;
      }
      if (entityName === "ProductionType") {
        return mockProductionTypeRepository;
      }
      return {};
    }),
  },
}));

jest.mock("../../models/FarmType", () => ({
  FarmType: { name: "FarmType" },
}));

jest.mock("../../models/ProductionType", () => ({
  ProductionType: { name: "ProductionType" },
}));

import * as typeController from "../../controllers/typeController";

describe("Type Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockRequest = {};

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

  describe("getAllFarmTypes", () => {
    test("debería obtener todos los tipos de granja", async () => {
      const mockFarmTypes = [
        { id: 1, name: "Ganadería" },
        { id: 2, name: "Avícola" },
      ];

      mockFarmTypeRepository.find.mockResolvedValue(mockFarmTypes);

      await typeController.getAllFarmTypes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockFarmTypes);
      expect(mockFarmTypeRepository.find).toHaveBeenCalled();
    });

    test("debería manejar errores al obtener tipos de granja", async () => {
      mockFarmTypeRepository.find.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await typeController.getAllFarmTypes(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error al obtener tipos de granja",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("getAllProductionTypes", () => {
    test("debería obtener todos los tipos de producción", async () => {
      const mockProductionTypes = [
        { id: 1, name: "Cárnica" },
        { id: 2, name: "Láctea" },
      ];

      mockProductionTypeRepository.find.mockResolvedValue(mockProductionTypes);

      await typeController.getAllProductionTypes(
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

      await typeController.getAllProductionTypes(
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
});
// sonarignore:end
