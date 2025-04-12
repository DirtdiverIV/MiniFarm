import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Farm } from './Farm';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  animal_type!: string;

  @Column({ type: 'varchar' })
  identification_number!: string;

  @Column({ type: 'float', nullable: true })
  weight!: number | null;

  @Column({ type: 'float', nullable: true })
  estimated_production!: number | null;

  @Column({ type: 'varchar' })
  sanitary_register!: string;

  @Column({ type: 'int', nullable: true })
  age!: number | null;

  @Column({ type: 'text', nullable: true })
  incidents!: string | null;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm!: Farm;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  
  /**
   * Crea una nueva instancia de Animal con los valores proporcionados
   */
  static create(params: {
    id?: number;
    animal_type: string;
    identification_number: string;
    sanitary_register: string;
    weight?: number | null;
    estimated_production?: number | null;
    age?: number | null;
    incidents?: string | null;
    farm?: Farm;
  }): Animal {
    const animal = new Animal();
    
    if (params.id) animal.id = params.id;
    animal.animal_type = params.animal_type;
    animal.identification_number = params.identification_number;
    animal.sanitary_register = params.sanitary_register;
    
    animal.weight = params.weight ?? null;
    animal.estimated_production = params.estimated_production ?? null;
    animal.age = params.age ?? null;
    animal.incidents = params.incidents ?? null;
    
    if (params.farm) animal.farm = params.farm;
    
    return animal;
  }
}
