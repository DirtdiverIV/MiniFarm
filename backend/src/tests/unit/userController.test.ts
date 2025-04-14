// sonarignore:start
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const mockRepositories = {
  userRepository: {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
  }
};


jest.mock('bcrypt');
jest.mock('jsonwebtoken');

jest.mock('../../config/dataSource', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockRepositories.userRepository)
  }
}));


const userController = require('../../controllers/userController');

describe('User Controller', () => {
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

  describe('registerUser', () => {
    test('debería registrar un usuario correctamente', async () => {
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        password_hash: 'hashedpassword'
      };
      
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue(null);
      mockRepositories.userRepository.create.mockReturnValue(mockUser);
      mockRepositories.userRepository.save.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');

      
      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuario registrado',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        }
      });
      expect(mockRepositories.userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockRepositories.userRepository.create).toHaveBeenCalled();
      expect(mockRepositories.userRepository.save).toHaveBeenCalled();
    });

    test('debería devolver error si el email ya existe', async () => {
      mockRequest = {
        body: {
          email: 'existing@example.com',
          password: 'password123'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue({ id: 1, email: 'existing@example.com' });

      await userController.registerUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'El email ya está registrado' });
    });
  });

  describe('loginUser', () => {
    test('debería iniciar sesión correctamente y devolver token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'user',
        password_hash: 'hashedpassword'
      };
      
      mockRequest = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mock-token');

      await userController.loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login exitoso',
        token: 'mock-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        }
      });
      expect(mockRepositories.userRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalled();
    });

    test('debería devolver error si el usuario no existe', async () => {
      mockRequest = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue(null);

      await userController.loginUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Credenciales inválidas (usuario no existe)' });
    });
  });

  describe('getAllUsers', () => {
    test('debería obtener todos los usuarios correctamente', async () => {
      const mockUsers = [
        { id: 1, email: 'user1@example.com', password_hash: 'hash1', role: 'admin' },
        { id: 2, email: 'user2@example.com', password_hash: 'hash2', role: 'user' }
      ];

      mockRepositories.userRepository.find.mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith([
        { id: 1, email: 'user1@example.com', role: 'admin' },
        { id: 2, email: 'user2@example.com', role: 'user' }
      ]);
      expect(mockRepositories.userRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    test('debería actualizar un usuario correctamente', async () => {
      const mockUser = {
        id: 1,
        email: 'oldmail@example.com',
        role: 'user'
      };

      const updatedUser = {
        ...mockUser,
        email: 'newmail@example.com',
        role: 'admin'
      };

      mockRequest = {
        params: {
          id: '1'
        },
        body: {
          email: 'newmail@example.com',
          role: 'admin'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue(mockUser);
      mockRepositories.userRepository.save.mockResolvedValue(updatedUser);

      await userController.updateUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Usuario actualizado',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
      expect(mockRepositories.userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepositories.userRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    test('debería eliminar un usuario correctamente', async () => {
      const mockUser = {
        id: 1,
        email: 'delete@example.com',
        role: 'user'
      };

      mockRequest = {
        params: {
          id: '1'
        }
      };

      mockRepositories.userRepository.findOne.mockResolvedValue(mockUser);

      await userController.deleteUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario eliminado' });
      expect(mockRepositories.userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepositories.userRepository.remove).toHaveBeenCalledWith(mockUser);
    });
  });
});
// sonarignore:end
