# MiniFarm
Technical test, development of a FullStack application for farm management

## 🚀 Instalación y Ejecución

1. **Clonar el proyecto**
```bash
git clone [https://github.com/DirtdiverIV/MiniFarm.git]
cd MiniFarm
```

2. **Backend**
```bash
cd backend
npm install
npm run dev
```

3. **Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Ejecución de Tests

### Backend
```bash
cd backend
# Ejecutar todos los tests
npm test


```

### Frontend
```bash
cd frontend

# Ejecutar todos los tests
npm test

```

## 🎯 Objetivos Cumplidos

### Requisitos Básicos
- ✅ Aplicación Fullstack con React + TypeScript (front) y Node.js/Express + TypeScript (back)
- ✅ Gestión de granjas y animales con operaciones CRUD
- ✅ Base de datos PostgreSQL en la nube
- ✅ Validación de formularios
- ✅ Documentación en README

### Características Adicionales Implementadas
- 🔐 Sistema de autenticación completo
- 📊 Dashboard con estadísticas
- 🏷️ Sistema de tipos de granja y producción
- 🖼️ Manejo de imágenes para granjas
- 🧪 Tests unitarios
- 📝 Documentación detallada
- 🎨 UI moderna con Material-UI
- 🔄 Manejo de estado global con Context API
- 🛡️ Middleware de autenticación

## 📚 Tecnologías Utilizadas

### Backend
- **Express**: Framework web para Node.js
  - *Razón*: Ligero, flexible y ampliamente utilizado para APIs REST
- **TypeORM**: ORM para TypeScript
  - *Razón*: Permite trabajar con la base de datos de forma tipada y segura
- **PostgreSQL**: Base de datos relacional
  - *Razón*: Robusta, escalable y con buen soporte para relaciones
- **Jest**: Framework de testing
  - *Razón*: Ampliamente utilizado, buena integración con TypeScript
- **bcrypt**: Encriptación de contraseñas
  - *Razón*: Seguridad en el almacenamiento de credenciales
- **jsonwebtoken**: Manejo de tokens JWT
  - *Razón*: Autenticación segura y stateless

### Frontend
- **React**: Biblioteca para UI
  - *Razón*: Componentización, virtual DOM, gran ecosistema
- **TypeScript**: Superset de JavaScript
  - *Razón*: Tipado estático, mejor mantenibilidad
- **Material-UI**: Framework de componentes UI
  - *Razón*: Diseño moderno, componentes preconstruidos, temas personalizables
- **@emotion/react/styled**: Manejo de estilos
  - *Razón*: Estilos CSS-in-JS, integración con Material-UI
- **React Router**: Enrutamiento
  - *Razón*: Manejo declarativo de rutas
- **Axios**: Cliente HTTP
  - *Razón*: Promesas, interceptores, cancelación de requests
- **Formik**: Manejo de formularios
  - *Razón*: Validación, manejo de estado, integración con Yup
- **Yup**: Validación de esquemas
  - *Razón*: Validación de datos, integración con Formik
- **Vite**: Bundler y servidor de desarrollo
  - *Razón*: Rápido, moderno, buena experiencia de desarrollo
- **Vitest**: Framework de testing
  - *Razón*: Testing unitario, integración con Vite

## 🏗️ Estructura del Proyecto

### Backend
```
backend/
├── src/
│   ├── config/         # Configuraciones (DB, middleware)
│   ├── controllers/    # Lógica de negocio
│   ├── models/         # Entidades de la base de datos
│   ├── routes/         # Definición de rutas
│   ├── middlewares/    # Middleware personalizados
│   ├── services/       # Servicios reutilizables
│   └── tests/          # Tests unitarios
```

### Frontend
```
frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── hooks/          # Custom hooks
│   ├── services/       # Servicios API
│   ├── context/        # Estado global
│   ├── types/          # Definiciones de tipos
│   ├── validations/    # Reglas de validación con Yup
│   ├── assets/         # Recursos estáticos
│   ├── theme/          # Configuración de temas Material-UI
│   └── styles/         # Estilos globales y utilidades
```

## 📊 Esquema de Base de Datos

### Tablas Principales

#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Farms
```sql
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    farm_type VARCHAR(100) NOT NULL,
    production_type VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Animals
```sql
CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(20),
    weight DECIMAL(10,2),
    farm_id INTEGER REFERENCES farms(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### FarmTypes
```sql
CREATE TABLE farm_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ProductionTypes
```sql
CREATE TABLE production_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Relaciones
- Un `User` puede tener múltiples `Farms` (relación uno a muchos)
- Una `Farm` pertenece a un `User` (relación muchos a uno)
- Una `Farm` puede tener múltiples `Animals` (relación uno a muchos)
- Un `Animal` pertenece a una `Farm` (relación muchos a uno)
- Una `Farm` tiene un `FarmType` (relación muchos a uno)
- Una `Farm` tiene un `ProductionType` (relación muchos a uno)

### Índices
```sql
-- Índices para búsquedas frecuentes
CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_animals_farm_id ON animals(farm_id);
CREATE INDEX idx_farms_farm_type ON farms(farm_type);
CREATE INDEX idx_farms_production_type ON farms(production_type);

-- Índices para búsquedas por nombre
CREATE INDEX idx_farms_name ON farms(name);
CREATE INDEX idx_animals_name ON animals(name);
```

### Restricciones
- `email` en `users` debe ser único
- `farm_type` y `production_type` deben existir en sus respectivas tablas
- `user_id` en `farms` debe existir en la tabla `users`
- `farm_id` en `animals` debe existir en la tabla `farms`

## 🔄 Flujo de Datos

### Backend
1. **Rutas** (`routes/`): Define los endpoints de la API
2. **Middleware** (`middlewares/`): Procesa las peticiones (auth, validación)
3. **Controladores** (`controllers/`): Maneja la lógica de negocio
4. **Servicios** (`services/`): Lógica reutilizable
5. **Modelos** (`models/`): Interacción con la base de datos

### Frontend
1. **Servicios** (`services/`): Llamadas a la API con Axios
2. **Hooks** (`hooks/`): Lógica reutilizable y estado
3. **Context** (`context/`): Estado global
4. **Formularios** (`components/`): Manejo con Formik y validación con Yup
5. **UI** (`components/`): Componentes Material-UI con temas personalizados
6. **Páginas** (`pages/`): Vistas principales

## 🛠️ Características Técnicas

### Backend
- **Arquitectura RESTful**
  - API RESTful siguiendo las mejores prácticas
  - Endpoints organizados por recursos
  - Uso correcto de métodos HTTP (GET, POST, PUT, DELETE)
  - Respuestas HTTP estandarizadas

- **Validación de datos**
  - Validación de entrada en cada endpoint
  - Sanitización de datos para prevenir inyecciones
  - Validación de tipos y formatos
  - Mensajes de error descriptivos

- **Manejo de errores centralizado**
  - Middleware global de manejo de errores
  - Clasificación de errores (validación, autenticación, servidor)
  - Logging estructurado de errores
  - Respuestas de error consistentes

- **Autenticación JWT**
  - Implementación de JWT para autenticación stateless
  - Refresh tokens para renovación segura
  - Protección de rutas con middleware de autenticación
  - Manejo de sesiones expiradas

- **CORS configurado**
  - Configuración segura de CORS
  - Whitelist de dominios permitidos
  - Manejo de métodos HTTP permitidos
  - Configuración de headers de seguridad

- **Tests unitarios**
  - Cobertura de tests para controladores y servicios
  - Tests de integración para rutas
  - Mocking de servicios externos
  - Pruebas de casos de error

- **Seed de datos inicial**
  - Scripts para población inicial de la base de datos
  - Datos de prueba para desarrollo
  - Configuración de ambientes (dev, test, prod)

### Frontend
- **Componentes funcionales con React**
  - Uso de hooks para manejo de estado y efectos
  - Componentes reutilizables y modulares
  - Props tipadas con TypeScript
  - Memoización para optimización de rendimiento

- **Hooks personalizados**
  - Custom hooks para lógica reutilizable
  - Hooks para manejo de formularios
  - Hooks para llamadas a API
  - Hooks para gestión de estado local

- **Manejo de estado con Context API**
  - Contextos para estado global
  - Reducers para lógica compleja
  - Optimización de re-renders
  - Persistencia de estado

- **Formularios con Formik y validación con Yup**
  - Manejo de estado de formularios
  - Validación en tiempo real
  - Mensajes de error personalizados
  - Integración con Material-UI

- **UI con Material-UI y temas personalizados**
  - Componentes Material-UI personalizados
  - Sistema de temas centralizado
  - Paleta de colores consistente
  - Diseño responsive con breakpoints

- **Estilos con Emotion**
  - CSS-in-JS para estilos scoped
  - Temas dinámicos
  - Mixins y utilidades reutilizables
  - Optimización de rendimiento

- **Diseño responsive**
  - Adaptación a diferentes tamaños de pantalla
  - Grid system de Material-UI
  - Media queries para breakpoints
  - Mobile-first approach

- **Optimización de rendimiento con Vite**
  - Bundling optimizado
  - Hot Module Replacement
  - Code splitting
  - Optimización de assets

## 📈 Posibles Mejoras
- Implementar WebSocket para actualizaciones en tiempo real
- Añadir sistema de notificaciones
- Implementar caché en el backend
- Añadir más tests (integración, e2e)
- Implementar sistema de roles más granular
- Añadir internacionalización
- Implementar sistema de reportes
- Añadir sistema de backup automático
