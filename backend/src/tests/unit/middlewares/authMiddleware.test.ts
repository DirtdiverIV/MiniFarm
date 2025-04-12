import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../../../middlewares/authMiddleware';

// Mock de jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('debería llamar a next() cuando se proporciona un token válido', () => {
    // Preparar
    mockRequest.headers = {
      'authorization': 'Bearer valid_token'
    };

    const mockPayload = { userId: 1 };
    (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

    // Ejecutar
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar
    expect(jwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
    expect((mockRequest as any).userId).toBe(1);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  test('debería devolver 401 cuando no se proporciona el header de autorización', () => {
    // Preparar
    mockRequest.headers = {}; // Sin header de autorización

    // Ejecutar
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token no provisto' });
  });

  test('debería devolver 401 cuando el formato del token es inválido', () => {
    // Preparar
    mockRequest.headers = {
      'authorization': 'InvalidFormat'
    };

    // Ejecutar
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Formato de token inválido' });
  });

  test('debería devolver 403 cuando el token es inválido o ha expirado', () => {
    // Preparar
    mockRequest.headers = {
      'authorization': 'Bearer invalid_token'
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido o expirado');
    });

    // Ejecutar
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    // Verificar
    expect(jwt.verify).toHaveBeenCalledWith('invalid_token', expect.any(String));
    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
  });
}); 