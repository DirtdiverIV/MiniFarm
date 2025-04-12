import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../config/dataSource';

// Cargar variables de entorno
dotenv.config();

// Función de configuración global que se ejecuta antes de todas las pruebas
export default async function() {
  // Si estamos en ambiente de prueba, configuramos la base de datos de prueba
  if (process.env.NODE_ENV === 'test') {
    try {
      // Asegúrate de que la conexión esté cerrada antes de inicializarla nuevamente
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
      
      // Inicializar la conexión a la base de datos
      await AppDataSource.initialize();
      console.log('Test database connection established');
      
      // Aquí puedes agregar lógica para preparar la base de datos para las pruebas
      // Por ejemplo, limpiar datos existentes o crear datos de prueba
    } catch (error) {
      console.error('Error during test setup:', error);
      throw error;
    }
  }
} 