# Librerías Utilizadas

El backend de MiniFarm utiliza diversas librerías de Node.js para proporcionar funcionalidades clave. A continuación se detallan las principales:

## Dependencias Principales

| Librería | Versión | Descripción |
|----------|---------|-------------|
| `express` | ^4.18.2 | Framework web para Node.js que proporciona un conjunto sólido de características para aplicaciones web |
| `typeorm` | ^0.3.22 | ORM (Object-Relational Mapping) para TypeScript y JavaScript que soporta múltiples bases de datos |
| `pg` | ^8.11.3 | Cliente PostgreSQL para Node.js |
| `jsonwebtoken` | ^9.0.2 | Implementación de JSON Web Tokens para la autenticación |
| `bcrypt` | ^5.1.1 | Librería para el hash seguro de contraseñas |
| `multer` | ^1.4.5-lts.2 | Middleware para manejar datos multipart/form-data, principalmente para subir archivos |
| `cors` | ^2.8.5 | Middleware para habilitar CORS (Cross-Origin Resource Sharing) |
| `dotenv` | ^16.4.1 | Carga variables de entorno desde un archivo .env |
| `reflect-metadata` | ^0.2.2 | Soporte para decoradores y metadatos, necesario para TypeORM |
| `class-validator` | ^0.14.1 | Validación de clases y objetos |
| `class-transformer` | ^0.5.1 | Transformación de objetos y clases |

## Dependencias de Desarrollo

| Librería | Versión | Descripción |
|----------|---------|-------------|
| `typescript` | ^5.3.3 | Lenguaje de programación tipado que compila a JavaScript |
| `ts-node-dev` | ^2.0.0 | Utilidad para ejecutar TypeScript y reiniciar automáticamente en cambios de archivo |
| `@types/express` | ^4.17.21 | Definiciones de tipos TypeScript para Express |
| `@types/bcrypt` | ^5.0.2 | Definiciones de tipos para bcrypt |
| `@types/jsonwebtoken` | ^9.0.5 | Definiciones de tipos para jsonwebtoken |
| `@types/cors` | ^2.8.17 | Definiciones de tipos para cors |
| `@types/node` | ^20.11.16 | Definiciones de tipos para Node.js |
| `@types/pg` | ^8.11.0 | Definiciones de tipos para pg |
| `@types/multer` | ^1.4.11 | Definiciones de tipos para multer |
| `jest` | ^29.7.0 | Framework de testing |
| `ts-jest` | ^29.1.2 | Plugin de Jest para TypeScript |
| `supertest` | ^6.3.4 | Librería para testing de APIs HTTP |
| `@types/jest` | ^29.5.12 | Definiciones de tipos para Jest |
| `@types/supertest` | ^6.0.2 | Definiciones de tipos para Supertest |

## Configuración

### Express

Express se configura en `src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
```

### TypeORM

TypeORM se configura en `src/config/dataSource.ts` para la conexión con PostgreSQL:

```typescript
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { Animal } from '../models/Animal';
import { FarmType } from '../models/FarmType';
import { ProductionType } from '../models/ProductionType';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.CONNECTION_STRING,
  entities: [User, Farm, Animal, FarmType, ProductionType],
  synchronize: true,
  logging: false
});
```

### JWT

JSON Web Tokens se utiliza para la autenticación:

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'secret',
  { expiresIn: '7d' }
);
```

### Multer

Multer se configura para la subida de imágenes:

```typescript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/farms/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'farm-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Formato de archivo no válido. Solo se permiten imágenes.'));
  } 
});
``` 