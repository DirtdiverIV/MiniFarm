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
  
  @Column({ type: 'text', nullable: true })
  description?: string;
  
  @Column({ type: 'varchar', nullable: true })
  location?: string;
  
  @Column({ type: 'varchar', nullable: true })
  image?: string;
  
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
  
  @ManyToOne(() => FarmType)
  @JoinColumn({ name: 'farm_type_id' })
  farm_type!: FarmType;
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
  name!: string;
  
  @Column({ type: 'date' })
  birth_date!: Date;
  
  @Column({ type: 'varchar', nullable: true })
  breed?: string;
  
  @Column({ type: 'varchar', nullable: true })
  image?: string;
  
  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farm_id' })
  farm!: Farm;
  
  @ManyToOne(() => ProductionType)
  @JoinColumn({ name: 'production_type_id' })
  production_type!: ProductionType;
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
  
  @Column({ type: 'text', nullable: true })
  description?: string;
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
  
  @Column({ type: 'text', nullable: true })
  description?: string;
}
```

## Relaciones entre Modelos

- Un **Usuario** puede tener múltiples **Granjas**
- Una **Granja** pertenece a un **Usuario** y tiene un **Tipo de Granja**
- Un **Animal** pertenece a una **Granja** y tiene un **Tipo de Producción** 