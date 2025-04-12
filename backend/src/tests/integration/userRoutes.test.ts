import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/dataSource';
import { User } from '../../models/User';
import { userRouter } from '../../routes/userRoutes';

// Mock de las dependencias
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      remove: jest.fn()
    })
  }
}));

// Mock del middleware de autenticación
jest.mock('../../middlewares/authMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    // Simula que el usuario está autenticado
    req.userId = 1;
    next();
  }
}));

describe('User Routes', () => {
  let app: express.Application;
  
  beforeAll(() => {
    // Configurar la aplicación Express
    app = express();
    app.use(express.json());
    app.use('/api/users', userRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    test('debería registrar un usuario correctamente', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        password_hash: 'hashedpassword'
      };

      const userRepository = AppDataSource.getRepository(User);
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockReturnValue(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Usuario registrado');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
    });

    test('debería devolver 400 si el email ya existe', async () => {
      const userRepository = AppDataSource.getRepository(User);
      (userRepository.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'existing@example.com'
      });

      const response = await request(app)
        .post('/api/users/register')
        .send({
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'El email ya está registrado');
    });
  });

  describe('POST /api/users/login', () => {
    test('debería iniciar sesión correctamente', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        password_hash: 'hashedpassword'
      };

      const userRepository = AppDataSource.getRepository(User);
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login exitoso');
      expect(response.body).toHaveProperty('token', 'mock-token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 1);
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    test('debería devolver 401 si el usuario no existe', async () => {
      const userRepository = AppDataSource.getRepository(User);
      (userRepository.findOne as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciales inválidas (usuario no existe)');
    });
  });

  describe('GET /api/users', () => {
    test('debería obtener todos los usuarios', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', role: 'admin' },
        { id: 2, email: 'user2@example.com', role: 'user' }
      ];

      const userRepository = AppDataSource.getRepository(User);
      (userRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id', 1);
      expect(response.body[1]).toHaveProperty('id', 2);
    });
  });
}); 