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

  @Column({ type: 'varchar', nullable: true })
  provincia!: string | null;

  @Column({ type: 'varchar', nullable: true })
  municipio!: string | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
  
  static create(params: {
    id?: number;
    name: string;
    farm_type?: FarmType;
    production_type?: ProductionType;
    image_path?: string | null;
    provincia?: string | null;
    municipio?: string | null;
  }): Farm {
    const farm = new Farm();
    
    if (params.id) farm.id = params.id;
    farm.name = params.name;
    
    if (params.farm_type) farm.farm_type = params.farm_type;
    if (params.production_type) farm.production_type = params.production_type;
    farm.image_path = params.image_path ?? null;
    farm.provincia = params.provincia ?? null;
    farm.municipio = params.municipio ?? null;
    
    return farm;
  }
}
