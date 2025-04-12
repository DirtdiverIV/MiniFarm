# API MiniFarm - Documentación de Endpoints

Esta documentación contiene todos los endpoints disponibles en la API de MiniFarm, incluyendo sus métodos HTTP, parámetros, cuerpos de solicitud y respuestas.

## Índice
1. [Usuarios](#1-endpoints-de-usuarios)
2. [Granjas](#2-endpoints-de-granjas)
3. [Animales](#3-endpoints-de-animales)
4. [Tipos de Granja](#4-endpoints-de-tipos-de-granja)
5. [Tipos de Producción](#5-endpoints-de-tipos-de-producción)
6. [Dashboard](#6-endpoint-de-dashboard)

---

## 1. Endpoints de Usuarios

### 1.1. Registrar Usuario
- **Método**: POST
- **URL**: `/api/users/register`
- **Body de solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "role": "user" // Opcional, por defecto es "user"
}
```
- **Respuesta exitosa** (201):
```json
{
  "message": "Usuario registrado",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```
- **Respuesta de error** (400):
```json
{
  "error": "El email ya está registrado"
}
```

### 1.2. Login de Usuario
- **Método**: POST
- **URL**: `/api/users/login`
- **Body de solicitud**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```
- **Respuesta exitosa** (200):
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "role": "user"
  }
}
```
- **Respuesta de error** (401):
```json
{
  "error": "Credenciales inválidas (usuario no existe)"
}
```

### 1.3. Obtener Todos los Usuarios
- **Método**: GET
- **URL**: `/api/users`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
[
  {
    "id": 1,
    "email": "usuario1@ejemplo.com",
    "role": "user"
  },
  {
    "id": 2,
    "email": "usuario2@ejemplo.com",
    "role": "admin"
  }
]
```

### 1.4. Actualizar Usuario
- **Método**: PUT
- **URL**: `/api/users/:id`
- **Headers**: `Authorization: Bearer token`
- **Body de solicitud**:
```json
{
  "email": "nuevo@email.com",
  "role": "admin"
}
```
- **Respuesta exitosa** (200):
```json
{
  "message": "Usuario actualizado",
  "user": {
    "id": 1,
    "email": "nuevo@email.com",
    "role": "admin"
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Usuario no encontrado"
}
```

### 1.5. Eliminar Usuario
- **Método**: DELETE
- **URL**: `/api/users/:id`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
{
  "message": "Usuario eliminado"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Usuario no encontrado"
}
```

---

## 2. Endpoints de Granjas

### 2.1. Obtener Todas las Granjas
- **Método**: GET
- **URL**: `/api/farms`
- **Respuesta exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Granja Ejemplo",
    "farm_type": {
      "id": 1,
      "name": "Tipo de Granja"
    },
    "production_type": {
      "id": 1,
      "name": "Tipo de Producción"
    },
    "image_path": "/uploads/farms/imagen-granja.jpg"
  }
]
```

### 2.2. Obtener Granja por ID
- **Método**: GET
- **URL**: `/api/farms/:id`
- **Respuesta exitosa** (200):
```json
{
  "id": 1,
  "name": "Granja Ejemplo",
  "farm_type": {
    "id": 1,
    "name": "Tipo de Granja"
  },
  "production_type": {
    "id": 1,
    "name": "Tipo de Producción"
  },
  "image_path": "/uploads/farms/imagen-granja.jpg"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Granja no encontrada"
}
```

### 2.3. Crear Granja
- **Método**: POST
- **URL**: `/api/farms`
- **Headers**: `Authorization: Bearer token`
- **Body de solicitud** (FormData):
  - `name`: "Granja Ejemplo" (Texto)
  - `farm_type_id`: 1 (Número)
  - `production_type_id`: 1 (Número)
  - `image`: [archivo] (Opcional)
- **Respuesta exitosa** (201):
```json
{
  "message": "Granja creada",
  "farm": {
    "id": 1,
    "name": "Granja Ejemplo",
    "farm_type": {
      "id": 1,
      "name": "Tipo de Granja"
    },
    "production_type": {
      "id": 1,
      "name": "Tipo de Producción"
    },
    "image_path": "/uploads/farms/imagen-granja.jpg"
  }
}
```
- **Respuesta de error** (400):
```json
{
  "error": "Faltan campos obligatorios"
}
```

### 2.4. Actualizar Granja
- **Método**: PUT
- **URL**: `/api/farms/:id`
- **Headers**: `Authorization: Bearer token`
- **Body de solicitud** (FormData):
  - `name`: "Granja Actualizada" (Texto, opcional)
  - `farm_type_id`: 2 (Número, opcional)
  - `production_type_id`: 2 (Número, opcional)
  - `image`: [archivo] (Opcional)
- **Respuesta exitosa** (200):
```json
{
  "message": "Granja actualizada",
  "farm": {
    "id": 1,
    "name": "Granja Actualizada",
    "farm_type": {
      "id": 2,
      "name": "Tipo de Granja"
    },
    "production_type": {
      "id": 2,
      "name": "Tipo de Producción"
    },
    "image_path": "/uploads/farms/nueva-imagen.jpg"
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Granja no encontrada"
}
```

### 2.5. Eliminar Granja
- **Método**: DELETE
- **URL**: `/api/farms/:id`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
{
  "message": "Granja y sus animales asociados eliminados"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Granja no encontrada"
}
```

> **Nota**: Al eliminar una granja, también se eliminan todos sus animales asociados y su imagen almacenada en el servidor.

---

## 3. Endpoints de Animales

### 3.1. Obtener Animales por Granja
- **Método**: GET
- **URL**: `/api/animals/farm/:farmId`
- **Respuesta exitosa** (200):
```json
[
  {
    "id": 1,
    "animal_type": "Vaca",
    "identification_number": "V001",
    "weight": 450,
    "estimated_production": 25,
    "sanitary_register": "SR12345",
    "age": 3,
    "incidents": "Ninguno"
  }
]
```

### 3.2. Obtener Animal por ID
- **Método**: GET
- **URL**: `/api/animals/:id`
- **Respuesta exitosa** (200):
```json
{
  "id": 1,
  "animal_type": "Vaca",
  "identification_number": "V001",
  "weight": 450,
  "estimated_production": 25,
  "sanitary_register": "SR12345",
  "age": 3,
  "incidents": "Ninguno",
  "farm": {
    "id": 1,
    "name": "Granja Ejemplo"
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Animal no encontrado"
}
```

### 3.3. Crear Animal
- **Método**: POST
- **URL**: `/api/animals`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "farm_id": 1,
  "animal_type": "Vaca",
  "identification_number": "V001",
  "weight": 450,
  "estimated_production": 25,
  "sanitary_register": "SR12345",
  "age": 3,
  "incidents": "Ninguno"
}
```
- **Respuesta exitosa** (201):
```json
{
  "message": "Animal creado",
  "animal": {
    "id": 1,
    "animal_type": "Vaca",
    "identification_number": "V001",
    "weight": 450,
    "estimated_production": 25,
    "sanitary_register": "SR12345",
    "age": 3,
    "incidents": "Ninguno",
    "farm": {
      "id": 1,
      "name": "Granja Ejemplo"
    }
  }
}
```
- **Respuesta de error** (400):
```json
{
  "error": "farm_id y animal_type son obligatorios"
}
```

### 3.4. Actualizar Animal
- **Método**: PUT
- **URL**: `/api/animals/:id`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "farm_id": 1,
  "animal_type": "Vaca",
  "identification_number": "V001-Updated",
  "weight": 475,
  "estimated_production": 30,
  "sanitary_register": "SR12345",
  "age": 4,
  "incidents": "Revisión veterinaria el 15/05/2023"
}
```
- **Respuesta exitosa** (200):
```json
{
  "message": "Animal actualizado",
  "animal": {
    "id": 1,
    "animal_type": "Vaca",
    "identification_number": "V001-Updated",
    "weight": 475,
    "estimated_production": 30,
    "sanitary_register": "SR12345",
    "age": 4,
    "incidents": "Revisión veterinaria el 15/05/2023",
    "farm": {
      "id": 1,
      "name": "Granja Ejemplo"
    }
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Animal no encontrado"
}
```

### 3.5. Eliminar Animal
- **Método**: DELETE
- **URL**: `/api/animals/:id`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
{
  "message": "Animal eliminado"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Animal no encontrado"
}
```

---

## 4. Endpoints de Tipos de Granja

### 4.1. Obtener Todos los Tipos de Granja
- **Método**: GET
- **URL**: `/api/farm-types`
- **Respuesta exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Granja Avícola"
  },
  {
    "id": 2,
    "name": "Granja Lechera"
  }
]
```

### 4.2. Obtener Tipo de Granja por ID
- **Método**: GET
- **URL**: `/api/farm-types/:id`
- **Respuesta exitosa** (200):
```json
{
  "id": 1,
  "name": "Granja Avícola"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de granja no encontrado"
}
```

### 4.3. Crear Tipo de Granja
- **Método**: POST
- **URL**: `/api/farm-types`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "name": "Granja Porcina"
}
```
- **Respuesta exitosa** (201):
```json
{
  "message": "Tipo de granja creado",
  "farmType": {
    "id": 3,
    "name": "Granja Porcina"
  }
}
```
- **Respuesta de error** (400):
```json
{
  "error": "El nombre es obligatorio"
}
```

### 4.4. Actualizar Tipo de Granja
- **Método**: PUT
- **URL**: `/api/farm-types/:id`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "name": "Granja Porcina Actualizada"
}
```
- **Respuesta exitosa** (200):
```json
{
  "message": "Tipo de granja actualizado",
  "farmType": {
    "id": 3,
    "name": "Granja Porcina Actualizada"
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de granja no encontrado"
}
```

### 4.5. Eliminar Tipo de Granja
- **Método**: DELETE
- **URL**: `/api/farm-types/:id`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
{
  "message": "Tipo de granja eliminado"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de granja no encontrado"
}
```

---

## 5. Endpoints de Tipos de Producción

### 5.1. Obtener Todos los Tipos de Producción
- **Método**: GET
- **URL**: `/api/production-types`
- **Respuesta exitosa** (200):
```json
[
  {
    "id": 1,
    "name": "Cárnica"
  },
  {
    "id": 2,
    "name": "Láctea"
  }
]
```

### 5.2. Obtener Tipo de Producción por ID
- **Método**: GET
- **URL**: `/api/production-types/:id`
- **Respuesta exitosa** (200):
```json
{
  "id": 1,
  "name": "Cárnica"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de producción no encontrado"
}
```

### 5.3. Crear Tipo de Producción
- **Método**: POST
- **URL**: `/api/production-types`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "name": "Avícola"
}
```
- **Respuesta exitosa** (201):
```json
{
  "message": "Tipo de producción creado",
  "productionType": {
    "id": 3,
    "name": "Avícola"
  }
}
```
- **Respuesta de error** (400):
```json
{
  "error": "El nombre es obligatorio"
}
```

### 5.4. Actualizar Tipo de Producción
- **Método**: PUT
- **URL**: `/api/production-types/:id`
- **Headers**: 
  - `Authorization: Bearer token`
  - `Content-Type: application/json`
- **Body de solicitud**:
```json
{
  "name": "Avícola Actualizada"
}
```
- **Respuesta exitosa** (200):
```json
{
  "message": "Tipo de producción actualizado",
  "productionType": {
    "id": 3,
    "name": "Avícola Actualizada"
  }
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de producción no encontrado"
}
```

### 5.5. Eliminar Tipo de Producción
- **Método**: DELETE
- **URL**: `/api/production-types/:id`
- **Headers**: `Authorization: Bearer token`
- **Respuesta exitosa** (200):
```json
{
  "message": "Tipo de producción eliminado"
}
```
- **Respuesta de error** (404):
```json
{
  "error": "Tipo de producción no encontrado"
}
```

---

## 6. Endpoint de Dashboard

### 6.1. Obtener Estadísticas del Dashboard
- **Método**: GET
- **URL**: `/api/dashboard/stats`
- **Respuesta exitosa** (200):
```json
{
  "total_animals": 150,
  "total_carne_production": 2500,
  "total_leche_production": 3800,
  "animals_with_incidents": [
    {
      "id": 1,
      "animal_type": "Vaca",
      "identification_number": "V001",
      "incidents": "Fiebre el 10/05/2023",
      "farm_name": "Granja Ejemplo"
    }
  ]
}
```
- **Respuesta de error** (500):
```json
{
  "error": "Error al obtener estadísticas del dashboard"
}
``` 