import { Request, Response } from 'express';
import { AppDataSource } from '../config/dataSource';
import { ProductionType } from '../models/ProductionType';

const productionTypeRepository = AppDataSource.getRepository(ProductionType);

export const createProductionType = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const newProductionType = productionTypeRepository.create({ name });
    const savedProductionType = await productionTypeRepository.save(newProductionType);
    return res.status(201).json({ message: 'Tipo de producción creado', productionType: savedProductionType });
  } catch (error) {
    console.error('Error creando tipo de producción:', error);
    return res.status(500).json({ error: 'Error creando tipo de producción' });
  }
};

export const getAllProductionTypes = async (req: Request, res: Response) => {
  try {
    const productionTypes = await productionTypeRepository.find();
    return res.json(productionTypes);
  } catch (error) {
    console.error('Error obteniendo tipos de producción:', error);
    return res.status(500).json({ error: 'Error al obtener tipos de producción' });
  }
};

export const getProductionTypeById = async (req: Request, res: Response) => {
  try {
    const productionTypeId = parseInt(req.params.id, 10);
    const productionType = await productionTypeRepository.findOne({ where: { id: productionTypeId } });
    if (!productionType) {
      return res.status(404).json({ error: 'Tipo de producción no encontrado' });
    }
    return res.json(productionType);
  } catch (error) {
    console.error('Error obteniendo tipo de producción:', error);
    return res.status(500).json({ error: 'Error al obtener tipo de producción' });
  }
};

export const updateProductionType = async (req: Request, res: Response) => {
  try {
    const productionTypeId = parseInt(req.params.id, 10);
    const { name } = req.body;

    const productionType = await productionTypeRepository.findOne({ where: { id: productionTypeId } });
    if (!productionType) {
      return res.status(404).json({ error: 'Tipo de producción no encontrado' });
    }

    productionType.name = name ?? productionType.name;
    const updatedProductionType = await productionTypeRepository.save(productionType);
    return res.json({ message: 'Tipo de producción actualizado', productionType: updatedProductionType });
  } catch (error) {
    console.error('Error actualizando tipo de producción:', error);
    return res.status(500).json({ error: 'Error al actualizar tipo de producción' });
  }
};

export const deleteProductionType = async (req: Request, res: Response) => {
  try {
    const productionTypeId = parseInt(req.params.id, 10);
    const productionType = await productionTypeRepository.findOne({ where: { id: productionTypeId } });
    if (!productionType) {
      return res.status(404).json({ error: 'Tipo de producción no encontrado' });
    }
    await productionTypeRepository.remove(productionType);
    return res.json({ message: 'Tipo de producción eliminado' });
  } catch (error) {
    console.error('Error eliminando tipo de producción:', error);
    return res.status(500).json({ error: 'Error al eliminar tipo de producción' });
  }
}; 