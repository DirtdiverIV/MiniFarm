import { AppDataSource } from '../config/dataSource';


export default async function() {
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('Test database connection closed');
  }
} 