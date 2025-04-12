# MiniFarm Backend

API backend para la gestión de granjas, animales y producción, desarrollado con Express, TypeScript y PostgreSQL.

## Requisitos

- Node.js (v14+)
- PostgreSQL

## Instalación

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno en archivo `.env`
4. Compilar el código: `npm run build`
5. Iniciar servidor: `npm start`

## Desarrollo

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

## Pruebas

El proyecto utiliza Jest para pruebas unitarias e integración. Los tipos de pruebas implementados son:

- **Pruebas unitarias**: Ubicadas en `src/tests/unit/`, verifican el funcionamiento de componentes individuales como controladores.
- **Pruebas de integración**: Ubicadas en `src/tests/integration/`, prueban la interacción entre componentes, como rutas y controladores.

Para ejecutar las pruebas:

```bash
# Ejecutar todas las pruebas
npm test

# Ver cobertura de pruebas
npm run test:coverage
```

### Estructura de pruebas

```
src/
├── tests/
│   ├── unit/               # Pruebas unitarias
│   │   ├── userController.test.ts
│   │   └── animalController.test.ts
│   ├── integration/        # Pruebas de integración
│   │   └── userRoutes.test.ts
│   ├── setup.ts            # Configuración inicial para pruebas
│   └── teardown.ts         # Limpieza después de pruebas
```

## API Endpoints

Los endpoints disponibles en la API incluyen:

- `/api/users` - Gestión de usuarios
- `/api/farms` - Gestión de granjas
- `/api/animals` - Gestión de animales
- `/api/types` - Gestión de tipos
- `/api/dashboard` - Datos para dashboard 