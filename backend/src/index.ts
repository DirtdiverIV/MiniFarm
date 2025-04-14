
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import { AppDataSource } from './config/dataSource';
import { userRouter } from './routes/userRoutes';
import { farmRouter } from './routes/farmRoutes';
import { animalRouter } from './routes/animalRoutes';
import { typeRouter } from './routes/typeRoutes';
import dashboardRouter from './routes/dashboardRoutes';
import { farmTypeRouter } from './routes/farmTypeRoutes';
import { productionTypeRouter } from './routes/productionTypeRoutes';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/users', userRouter);
app.use('/api/farms', farmRouter);
app.use('/api/animals', animalRouter);
app.use('/api/types', typeRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/farm-types', farmTypeRouter);
app.use('/api/production-types', productionTypeRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('API MiniFarm con TypeORM funcionando correctamente!');
});
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT === undefined ? 4000 : process.env.PORT;

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
