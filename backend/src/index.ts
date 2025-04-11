// src/index.ts
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './config/dataSource';
import { userRouter } from './routes/userRoutes';
import { farmRouter } from './routes/farmRoutes';
import { animalRouter } from './routes/animalRoutes';
import { typeRouter } from './routes/typeRoutes';
import dashboardRouter from './routes/dashboardRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/farms', farmRouter);
app.use('/api/animals', animalRouter);
app.use('/api/types', typeRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('API MiniFarm con TypeORM funcionando correctamente!');
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log('BD Conectada con TypeORM!');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la conexión:', error);
  });
