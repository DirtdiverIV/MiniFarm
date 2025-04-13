import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET === undefined ? 'default_secret' : process.env.JWT_SECRET;

/**
 * Verifica el token JWT en los headers Authorization: Bearer <token>.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']; 
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no provisto' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Formato de token inválido' });
  }

  try {
    // Verificar token
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    // guardar info en req para usarla en siguientes middlewares/controladores
    (req as any).userId = payload.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Token inválido' });
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: 'Token expirado' });
    }
    return res.status(500).json({ error: 'Error en la autenticación' });
  }
}
