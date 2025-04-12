import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('farm_types')
export class FarmType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  
  /**
   * Crea una nueva instancia de FarmType con los valores proporcionados
   */
  static create(params: { id?: number; name: string }): FarmType {
    const farmType = new FarmType();
    
    if (params.id) farmType.id = params.id;
    farmType.name = params.name;
    
    return farmType;
  }
} 