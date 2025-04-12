import { AppDataSource } from '../config/dataSource';

// Función de limpieza global que se ejecuta después de todas las pruebas
export default async function() {
  // Cerrar la conexión a la base de datos si está inicializada
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Test database connection closed');
  }
} 