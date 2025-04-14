import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "../config/dataSource";

dotenv.config();

export default async function () {
  if (process.env.NODE_ENV === "test") {
    try {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }

      await AppDataSource.initialize();
      console.log("Test database connection established");
    } catch (error) {
      console.error("Error during test setup:", error);
      throw error;
    }
  }
}
