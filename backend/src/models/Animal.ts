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

  @Column({ type: 'varchar', nullable: true })
  identification_number!: string | null;

  @Column({ type: 'float', nullable: true })
  weight!: number | null;

  @Column({ type: 'float', nullable: true })
  estimated_production!: number | null;

  @Column({ type: 'varchar', nullable: true })
  sanitary_register!: string | null;

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
}
