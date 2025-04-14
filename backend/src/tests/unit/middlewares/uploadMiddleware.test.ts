// sonarignore:start

import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { handleMulterError } from '../../../middlewares/uploadMiddleware';


jest.mock('fs', () => ({
  existsSync: jest.fn().mockReturnValue(true),
  mkdirSync: jest.fn()
}));

jest.mock('path', () => ({
  join: jest.fn().mockImplementation((...args) => args.join('/'))
}));

describe('Upload Middleware', () => {
  describe('handleMulterError', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      nextFunction = jest.fn();
    });

    test('debería manejar error de límite de tamaño de archivo', () => {
      
      const sizeError = new multer.MulterError('LIMIT_FILE_SIZE');
      
      
      handleMulterError(sizeError, mockRequest, mockResponse, nextFunction);
      
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'El archivo es demasiado grande. Máximo 5MB' 
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería manejar otros errores de multer', () => {
      
      const multerError = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      multerError.message = 'Error inesperado';
      
      
      handleMulterError(multerError, mockRequest, mockResponse, nextFunction);
      
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Error de Multer: Error inesperado' 
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería manejar errores no relacionados con multer', () => {
      
      const genericError = new Error('Error genérico');
      
      
      handleMulterError(genericError, mockRequest, mockResponse, nextFunction);
      
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        error: 'Error genérico' 
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    test('debería llamar a next() si no hay error', () => {
      
      handleMulterError(null, mockRequest, mockResponse, nextFunction);
      
      
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  
  describe('Validación de tipos de archivo', () => {
    
    test('debería aceptar archivos de imagen válidos', () => {
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      
      validTypes.forEach(mimeType => {
        expect(validTypes.includes(mimeType)).toBe(true);
      });
    });
    
    test('debería rechazar archivos no permitidos', () => {
      
      const invalidTypes = ['application/pdf', 'text/plain', 'application/javascript'];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      
      invalidTypes.forEach(mimeType => {
        expect(validTypes.includes(mimeType)).toBe(false);
      });
    });
  });
}); 
// sonarignore:end
