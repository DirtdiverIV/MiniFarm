# Modelos de Datos

El backend de MiniFarm utiliza TypeORM como ORM (Object-Relational Mapper) para definir y gestionar los modelos de datos. Cada modelo corresponde a una tabla en la base de datos PostgreSQL.

## User

El modelo `User` representa a los usuarios del sistema.

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ type: 'varchar', unique: true })
  email!: string;
  
  @Column({ type: 'varchar' })
  password_hash!: string;
  
  @Column({ type: 'varchar', default: 'user' })
  role!: string;
  
  @CreateDateColumn()
  created_at!: Date;
  
  @UpdateDateColumn()
  updated_at!: Date;
}
```

## Farm

El modelo `Farm` representa una granja en el sistema.

```typescript
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
}
```

## Animal

El modelo `Animal` representa a los animales de las granjas.

```typescript
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
}
```

## FarmType

El modelo `FarmType` define los diferentes tipos de granjas.

```typescript
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
}
```

## ProductionType

El modelo `ProductionType` define los tipos de producción de los animales.

```typescript
@Entity('production_types')
export class ProductionType {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column({ type: 'varchar', unique: true })
  name!: string;
  
  @CreateDateColumn()
  created_at!: Date;
  
  @UpdateDateColumn()
  updated_at!: Date;
}
```

## Relaciones entre Modelos

- Un **Usuario** puede tener múltiples **Granjas**
- Una **Granja** tiene un **Tipo de Granja** y un **Tipo de Producción**
- Un **Animal** pertenece a una **Granja**
- Los **Tipos de Granja** y **Tipos de Producción** son entidades independientes 