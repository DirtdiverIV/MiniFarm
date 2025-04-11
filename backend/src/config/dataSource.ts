import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { Animal } from '../models/Animal';
import { FarmType } from '../models/FarmType';
import { ProductionType } from '../models/ProductionType';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.CONNECTION_STRING,
  entities: [User, Farm, Animal, FarmType, ProductionType],
  synchronize: true, 
  logging: false
});
