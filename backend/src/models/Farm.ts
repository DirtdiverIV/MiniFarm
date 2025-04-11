import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { FarmType } from './FarmType';
import { ProductionType } from './ProductionType';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @ManyToOne(() => FarmType)
  @JoinColumn({ name: 'farm_type_id' })
  farm_type!: FarmType;

  @ManyToOne(() => ProductionType)
  @JoinColumn({ name: 'production_type_id' })
  production_type!: ProductionType;

  @Column({ type: 'varchar', nullable: true })
  image_path!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
