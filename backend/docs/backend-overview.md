# Documentación del Backend MiniFarm

## Arquitectura General

El backend de MiniFarm está construido con Node.js y Express, utilizando TypeScript para proporcionar tipado estático y mejorar la mantenibilidad del código. La aplicación sigue una arquitectura de capas que separa claramente las responsabilidades:

- **Modelos**: Definen la estructura de datos utilizando TypeORM para el mapeo objeto-relacional
- **Controladores**: Contienen la lógica de negocio y manejan las peticiones HTTP
- **Rutas**: Definen los endpoints de la API REST
- **Middlewares**: Implementan funcionalidades transversales como autenticación y validación

## Estructura del Proyecto

```
/backend
  /src
    /config         # Configuración de base de datos y entorno
    /controllers    # Controladores para cada entidad
    /middlewares    # Middleware para autenticación, validación, etc.
    /migrations     # Migraciones de la base de datos
    /models         # Entidades/modelos de datos
    /routes         # Definición de rutas API
    /types          # Tipos personalizados y definiciones de interfaces
    index.ts        # Punto de entrada de la aplicación
    seed.ts         # Script para poblar la base de datos
  /uploads         # Directorio para almacenar archivos subidos
  /docs            # Documentación del proyecto
  package.json     # Dependencias y scripts
```

## Base de Datos

El backend utiliza PostgreSQL como sistema de gestión de base de datos relacional. La conexión y el mapeo objeto-relacional se manejan mediante TypeORM, que proporciona una capa de abstracción para interactuar con la base de datos.

## Autenticación y Seguridad

El sistema implementa autenticación basada en JSON Web Tokens (JWT) para proteger las rutas sensibles. Las contraseñas se almacenan de forma segura utilizando bcrypt para el hash. 