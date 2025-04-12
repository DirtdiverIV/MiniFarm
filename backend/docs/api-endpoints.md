# API Endpoints

El backend de MiniFarm expone los siguientes endpoints RESTful:

## Usuarios

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| POST | `/api/users/register` | Registra un nuevo usuario | No |
| POST | `/api/users/login` | Inicia sesión y retorna un token JWT | No |
| GET | `/api/users/profile` | Obtiene el perfil del usuario actual | Sí |
| PUT | `/api/users/profile` | Actualiza el perfil del usuario actual | Sí |

### Ejemplo de Registro

```
POST /api/users/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Ejemplo de Login

```
POST /api/users/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

## Granjas

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/farms` | Obtiene todas las granjas del usuario | Sí |
| GET | `/api/farms/:id` | Obtiene una granja por ID | Sí |
| POST | `/api/farms` | Crea una nueva granja | Sí |
| PUT | `/api/farms/:id` | Actualiza una granja existente | Sí |
| DELETE | `/api/farms/:id` | Elimina una granja | Sí |

### Ejemplo de Creación de Granja (JSON)

```
POST /api/farms
Content-Type: application/json
Authorization: Bearer <token_jwt>

{
  "name": "Mi Granja",
  "description": "Una descripción de mi granja",
  "location": "Ubicación",
  "farm_type_id": 1
}
```

### Ejemplo de Creación de Granja con Imagen (FormData)

```
POST /api/farms
Content-Type: multipart/form-data
Authorization: Bearer <token_jwt>

Form data:
  name: Mi Granja
  description: Una descripción de mi granja
  location: Ubicación
  farm_type_id: 1
  image: [archivo de imagen]
```

### Ejemplo de Actualización de Granja con Imagen

```
PUT /api/farms/:id
Content-Type: multipart/form-data
Authorization: Bearer <token_jwt>

Form data:
  name: Mi Granja Actualizada
  description: Una nueva descripción
  location: Nueva Ubicación
  farm_type_id: 2
  image: [archivo de imagen]
```

## Animales

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/animals` | Obtiene todos los animales | Sí |
| GET | `/api/animals/:id` | Obtiene un animal por ID | Sí |
| POST | `/api/animals` | Registra un nuevo animal | Sí |
| PUT | `/api/animals/:id` | Actualiza un animal existente | Sí |
| DELETE | `/api/animals/:id` | Elimina un animal | Sí |

### Ejemplo de Registro de Animal (JSON)

```
POST /api/animals
Content-Type: application/json
Authorization: Bearer <token_jwt>

{
  "name": "Nombre del Animal",
  "birth_date": "2023-01-01",
  "breed": "Raza",
  "farm_id": 1,
  "production_type_id": 2
}
```

### Ejemplo de Actualización de Animal

```
PUT /api/animals/:id
Content-Type: application/json
Authorization: Bearer <token_jwt>

{
  "name": "Nuevo Nombre del Animal",
  "birth_date": "2023-01-01",
  "breed": "Nueva Raza"
}
```

## Tipos de Granja

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/types/farm` | Obtiene todos los tipos de granja | Sí |
| GET | `/api/types/farm/:id` | Obtiene un tipo de granja por ID | Sí |
| POST | `/api/types/farm` | Crea un nuevo tipo de granja | Sí (Admin) |
| PUT | `/api/types/farm/:id` | Actualiza un tipo de granja | Sí (Admin) |
| DELETE | `/api/types/farm/:id` | Elimina un tipo de granja | Sí (Admin) |

## Tipos de Producción

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/types/production` | Obtiene todos los tipos de producción | Sí |
| GET | `/api/types/production/:id` | Obtiene un tipo de producción por ID | Sí |
| POST | `/api/types/production` | Crea un nuevo tipo de producción | Sí (Admin) |
| PUT | `/api/types/production/:id` | Actualiza un tipo de producción | Sí (Admin) |
| DELETE | `/api/types/production/:id` | Elimina un tipo de producción | Sí (Admin) |

## Dashboard

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/dashboard/stats` | Obtiene estadísticas generales del usuario | Sí |

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