# API Endpoints

El backend de MiniFarm expone los siguientes endpoints RESTful:

## Autenticación

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/users/register` | Registra un nuevo usuario | No |
| POST | `/api/users/login` | Inicia sesión y retorna un token JWT | No |

## Usuarios

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/users` | Obtiene todos los usuarios | Sí (Admin) |
| GET | `/api/users/:id` | Obtiene un usuario por ID | Sí (Admin) |
| PUT | `/api/users/:id` | Actualiza un usuario | Sí (Admin) |
| DELETE | `/api/users/:id` | Elimina un usuario | Sí (Admin) |

## Granjas

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/farms` | Obtiene todas las granjas | Sí |
| GET | `/api/farms/:id` | Obtiene una granja por ID | Sí |
| POST | `/api/farms` | Crea una nueva granja | Sí |
| PUT | `/api/farms/:id` | Actualiza una granja existente | Sí |
| DELETE | `/api/farms/:id` | Elimina una granja | Sí |

### Ejemplo de Creación de Granja (JSON)

```json
{
  "name": "Finca Vacuna La Campiña",
  "farm_type_id": 1,
  "production_type_id": 1,
  "provincia": "Sevilla",
  "municipio": "Dos Hermanas"
}
```

## Animales

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/animals` | Obtiene todos los animales | Sí |
| GET | `/api/animals/farm/:farmId` | Obtiene animales por granja | Sí |
| GET | `/api/animals/:id` | Obtiene un animal por ID | Sí |
| POST | `/api/animals` | Registra un nuevo animal | Sí |
| PUT | `/api/animals/:id` | Actualiza un animal existente | Sí |
| DELETE | `/api/animals/:id` | Elimina un animal | Sí |

### Ejemplo de Registro de Animal

```json
{
  "animal_type": "Vaca",
  "identification_number": "VAC001",
  "weight": 500,
  "sanitary_register": "SR001",
  "age": 3,
  "farm_id": 1
}
```

## Tipos de Granja

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/farm-types` | Obtiene todos los tipos de granja | Sí |
| GET | `/api/farm-types/:id` | Obtiene un tipo de granja por ID | Sí |
| POST | `/api/farm-types` | Crea un nuevo tipo de granja | Sí (Admin) |
| PUT | `/api/farm-types/:id` | Actualiza un tipo de granja | Sí (Admin) |
| DELETE | `/api/farm-types/:id` | Elimina un tipo de granja | Sí (Admin) |

## Tipos de Producción

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/production-types` | Obtiene todos los tipos de producción | Sí |
| GET | `/api/production-types/:id` | Obtiene un tipo de producción por ID | Sí |
| POST | `/api/production-types` | Crea un nuevo tipo de producción | Sí (Admin) |
| PUT | `/api/production-types/:id` | Actualiza un tipo de producción | Sí (Admin) |
| DELETE | `/api/production-types/:id` | Elimina un tipo de producción | Sí (Admin) |

## Dashboard

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/dashboard/stats` | Obtiene estadísticas generales | Sí |
| GET | `/api/dashboard/farms` | Obtiene estadísticas de granjas | Sí |
| GET | `/api/dashboard/animals` | Obtiene estadísticas de animales | Sí |
| GET | `/api/dashboard/production` | Obtiene estadísticas de producción | Sí |

## Acceso a Imágenes

Todas las imágenes subidas están disponibles a través de las siguientes rutas:

| Recurso | URL |
|---------|-----|
| Imágenes de Granjas | `/uploads/farms/{nombre_archivo}` |

## Notas sobre la Carga de Imágenes

- Solo se aceptan formatos de imagen: JPEG, PNG, GIF y WEBP
- El tamaño máximo de archivo es de 5MB
- Al subir una nueva imagen para una granja existente, la imagen anterior se elimina automáticamente
- Las imágenes se almacenan con nombres únicos generados basados en la fecha y hora de subida
- Al eliminar una granja, también se elimina su imagen asociada 