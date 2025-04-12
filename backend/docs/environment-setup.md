# Configuración del Entorno

Este documento describe la configuración del entorno necesaria para ejecutar el backend de MiniFarm.

## Variables de Entorno

El backend utiliza un archivo `.env` para configurar diferentes aspectos del entorno. A continuación se muestra un ejemplo del contenido de este archivo:

```
# Puerto del servidor
PORT=4000

# Configuración de la Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=minifarm

# Secreto para JWT (debe ser una cadena segura en producción)
JWT_SECRET=minifarm_secret_key

# Entorno (development, production, test)
NODE_ENV=development
```

## Configuración de la Base de Datos

El sistema utiliza PostgreSQL como base de datos. Asegúrate de tener instalado PostgreSQL y crear una base de datos con el nombre especificado en las variables de entorno.

### Estructura de la Base de Datos

La estructura de la base de datos se crea automáticamente gracias a TypeORM, que sincroniza las entidades definidas en `src/models/` con la base de datos cuando la aplicación se inicia en modo de desarrollo (`synchronize: true`).

**Nota:** En entornos de producción, se recomienda desactivar la sincronización automática (`synchronize: false`) y usar migraciones para gestionar los cambios en la estructura de la base de datos.

## Inicialización de la Base de Datos

Para inicializar la base de datos con datos de ejemplo, puedes ejecutar el script de semilla:

```bash
npm run seed
```

Este comando ejecuta el archivo `src/seed.ts`, que crea registros iniciales de usuarios, tipos de granja, tipos de producción, etc.

## Comandos de Ejecución

El proyecto incluye varios scripts npm para facilitar su desarrollo y despliegue:

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática al detectar cambios |
| `npm run build` | Compila el código TypeScript a JavaScript en la carpeta `dist` |
| `npm start` | Inicia el servidor utilizando la versión compilada (para producción) |
| `npm run seed` | Ejecuta el script de semilla para poblar la base de datos |

## Estructura de Directorios

```
/backend
  /.env                  # Variables de entorno (no comprometer en control de versiones)
  /package.json          # Dependencias y scripts
  /tsconfig.json         # Configuración de TypeScript
  /src
    /config              # Configuración de la aplicación
      dataSource.ts      # Configuración de TypeORM
    /controllers         # Controladores de la API
    /middlewares         # Middleware personalizado
    /migrations          # Migraciones de base de datos
    /models              # Definición de entidades/modelos
    /routes              # Rutas de la API
    /types               # Tipos e interfaces TypeScript
    index.ts             # Punto de entrada principal
    seed.ts              # Script para inicializar datos
  /uploads               # Directorio para almacenar archivos subidos
  /dist                  # Código compilado (generado con npm run build)
```

## Requisitos del Sistema

- Node.js (v14 o superior)
- npm (v6 o superior)
- PostgreSQL (v12 o superior)

## Instalación

1. Clona el repositorio
2. Navega al directorio del backend: `cd backend`
3. Instala las dependencias: `npm install`
4. Crea un archivo `.env` basado en la sección de Variables de Entorno
5. Asegúrate de tener PostgreSQL instalado y funcionando
6. Crea una base de datos vacía para el proyecto
7. Ejecuta el servidor en modo desarrollo: `npm run dev`

Si todo está configurado correctamente, deberías ver mensajes confirmando la conexión a la base de datos y que el servidor está escuchando en el puerto especificado. 