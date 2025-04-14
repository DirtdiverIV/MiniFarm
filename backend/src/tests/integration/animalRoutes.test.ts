// sonarignore:start
import request from "supertest";
import express from "express";

const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFind = jest.fn();
const mockFindOne = jest.fn();
const mockRemove = jest.fn();
const mockFarmFindOne = jest.fn();

jest.mock("../../config/dataSource", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockImplementation((entity) => {
      const entityName = typeof entity === "object" ? entity.name : entity;
      if (entityName === "Animal") {
        return {
          create: mockCreate,
          save: mockSave,
          find: mockFind,
          findOne: mockFindOne,
          remove: mockRemove,
        };
      }
      if (entityName === "Farm") {
        return {
          findOne: mockFarmFindOne,
        };
      }
      return {};
    }),
  },
}));

jest.mock("../../models/Animal", () => ({
  Animal: { name: "Animal" },
}));

jest.mock("../../models/Farm", () => ({
  Farm: { name: "Farm" },
}));

jest.mock("../../middlewares/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.userId = 1;
    next();
  },
}));

const animalRouter = require("../../routes/animalRoutes").animalRouter;

describe("Animal Routes", () => {
  let app: express.Application;
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/api/animals", animalRouter);
  });

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("GET /api/animals/farm/:farmId", () => {
    test("debería obtener animales por granja", async () => {
      const mockAnimals = [
        { id: 1, animal_type: "Vaca", identification_number: "V001" },
        { id: 2, animal_type: "Vaca", identification_number: "V002" },
      ];

      mockFind.mockResolvedValue(mockAnimals);

      const response = await request(app).get("/api/animals/farm/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnimals);
      expect(mockFind).toHaveBeenCalledWith({ where: { farm: { id: 1 } } });
    });

    test("debería manejar errores al obtener animales", async () => {
      mockFind.mockRejectedValue(new Error("Error de base de datos"));

      const response = await request(app).get("/api/animals/farm/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error al obtener animales"
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("GET /api/animals/:id", () => {
    test("debería obtener un animal por su ID", async () => {
      const mockAnimal = {
        id: 1,
        animal_type: "Vaca",
        identification_number: "V001",
        farm: { id: 1, name: "Granja Test" },
      };

      mockFindOne.mockResolvedValue(mockAnimal);

      const response = await request(app).get("/api/animals/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAnimal);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ["farm"],
      });
    });

    test("debería devolver 404 si el animal no existe", async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app).get("/api/animals/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Animal no encontrado");
    });
  });

  describe("POST /api/animals", () => {
    test("debería crear un animal correctamente", async () => {
      const mockFarm = { id: 1, name: "Granja Test" };
      const mockAnimal = {
        id: 1,
        animal_type: "Vaca",
        identification_number: "V001",
        farm: mockFarm,
      };

      mockFarmFindOne.mockResolvedValue(mockFarm);
      mockCreate.mockReturnValue(mockAnimal);
      mockSave.mockResolvedValue(mockAnimal);

      const response = await request(app).post("/api/animals").send({
        farm_id: 1,
        animal_type: "Vaca",
        identification_number: "V001",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", "Animal creado");
      expect(response.body).toHaveProperty("animal");
      expect(mockFarmFindOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();
    });

    test("debería devolver 400 si faltan campos obligatorios", async () => {
      const response = await request(app).post("/api/animals").send({
        identification_number: "V001",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "farm_id y animal_type son obligatorios"
      );
    });

    test("debería devolver 404 si la granja no existe", async () => {
      mockFarmFindOne.mockResolvedValue(null);

      const response = await request(app).post("/api/animals").send({
        farm_id: 999,
        animal_type: "Vaca",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "La granja especificada no existe"
      );
    });
  });

  describe("PUT /api/animals/:id", () => {
    test("debería actualizar un animal correctamente", async () => {
      const mockAnimal = {
        id: 1,
        animal_type: "Vaca",
        identification_number: "V001",
        farm: { id: 1 },
      };

      const mockUpdatedAnimal = {
        ...mockAnimal,
        animal_type: "Vaca Actualizada",
      };

      mockFindOne.mockResolvedValue(mockAnimal);
      mockSave.mockResolvedValue(mockUpdatedAnimal);

      const response = await request(app).put("/api/animals/1").send({
        animal_type: "Vaca Actualizada",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Animal actualizado");
      expect(response.body).toHaveProperty("animal");
      expect(mockSave).toHaveBeenCalled();
    });

    test("debería devolver 404 si el animal no existe", async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app).put("/api/animals/999").send({
        animal_type: "Vaca Actualizada",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Animal no encontrado");
    });
  });

  describe("DELETE /api/animals/:id", () => {
    test("debería eliminar un animal correctamente", async () => {
      const mockAnimal = {
        id: 1,
        animal_type: "Vaca",
      };

      mockFindOne.mockResolvedValue(mockAnimal);

      const response = await request(app).delete("/api/animals/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Animal eliminado");
      expect(mockRemove).toHaveBeenCalledWith(mockAnimal);
    });

    test("debería devolver 404 si el animal no existe", async () => {
      mockFindOne.mockResolvedValue(null);

      const response = await request(app).delete("/api/animals/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Animal no encontrado");
    });
  });
});
// sonarignore:end