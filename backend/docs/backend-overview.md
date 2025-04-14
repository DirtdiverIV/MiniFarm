# Documentación del Backend MiniFarm

## Arquitectura General

El backend de MiniFarm está construido con Node.js y Express, utilizando TypeScript para proporcionar tipado estático y mejorar la mantenibilidad del código. La aplicación sigue una arquitectura de capas que separa claramente las responsabilidades:

- **Modelos**: Definen la estructura de datos utilizando TypeORM para el mapeo objeto-relacional
- **Controladores**: Contienen la lógica de negocio y manejan las peticiones HTTP
- **Rutas**: Definen los endpoints de la API REST
- **Middlewares**: Implementan funcionalidades transversales como autenticación y validación
- **Servicios**: Contienen lógica de negocio reutilizable
- **Dashboard**: Proporciona estadísticas y métricas del sistema

## Estructura del Proyecto

```
/backend
  /src
    /config         # Configuración de base de datos y entorno
    /controllers    # Controladores para cada entidad
    /middlewares    # Middleware para autenticación, validación, etc.
    /models         # Entidades/modelos de datos
    /routes         # Definición de rutas API
    /services       # Servicios reutilizables
    /tests          # Tests unitarios e integración
    index.ts        # Punto de entrada de la aplicación
    seed.ts         # Script para poblar la base de datos
  /uploads         # Directorio para almacenar archivos subidos
  /docs            # Documentación del proyecto
  package.json     # Dependencias y scripts
```

## Base de Datos

El backend utiliza PostgreSQL como sistema de gestión de base de datos relacional, alojado en Neon.tech. La conexión y el mapeo objeto-relacional se manejan mediante TypeORM, que proporciona una capa de abstracción para interactuar con la base de datos.

TypeORM está configurado para conectarse a la base de datos PostgreSQL en la nube usando la cadena de conexión proporcionada en las variables de entorno.

## Autenticación y Seguridad

El sistema implementa autenticación basada en JSON Web Tokens (JWT) para proteger las rutas sensibles. Las contraseñas se almacenan de forma segura utilizando bcrypt para el hash. Se implementan roles de usuario (admin/user) para control de acceso.

## Dashboard y Estadísticas

El sistema incluye un dashboard que proporciona:
- Estadísticas generales de granjas y animales
- Métricas de producción por tipo
- Distribución geográfica de las granjas
- Alertas y notificaciones de incidencias 