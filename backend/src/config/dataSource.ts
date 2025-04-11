import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { Animal } from '../models/Animal';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.CONNECTION_STRING,
  entities: [User, Farm, Animal],
  synchronize: true, 
  logging: false
});
