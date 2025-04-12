# Configuración del Entorno

Este documento describe la configuración necesaria para ejecutar el backend de MiniFarm en tu ordenador.

## Instalación Rápida

1. Clona el repositorio
2. Navega al directorio del backend: `cd backend`
3. Instala las dependencias: `npm install`
4. Crea un archivo `.env` en la raíz del proyecto
5. Ejecuta el servidor: `npm run dev`

## Variables de Entorno

El backend requiere un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Puerto del servidor
PORT=4000

# Cadena de conexión a PostgreSQL (será proporcionada por correo)
CONNECTION_STRING=***************

# Secreto para JWT 
JWT_SECRET=***************

# Entorno (development o production)
NODE_ENV=development
```

**IMPORTANTE:** Para la prueba técnica, recibirás por correo electrónico el archivo `.env` con las credenciales correctas para la base de datos.

## Base de Datos

- **Tipo:** PostgreSQL
- **Proveedor:** Neon (base de datos en la nube)
- **Configuración:** Ya proporcionada mediante la cadena de conexión
- **Acciones requeridas:** Ninguna, la base de datos ya está configurada para la prueba técnica

TypeORM se encarga de sincronizar automáticamente los modelos con la base de datos cuando ejecutas la aplicación en modo desarrollo (`synchronize: true`).

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm run build` | Compila el código TypeScript a JavaScript en la carpeta `dist` |
| `npm start` | Inicia el servidor utilizando la versión compilada |
| `npm run seed` | Ejecuta el script de semilla para poblar la base de datos |
| `npm test` | Ejecuta las pruebas unitarias e integración |
| `npm run test:watch` | Ejecuta las pruebas en modo observador (durante desarrollo) |
| `npm run test:coverage` | Genera un informe de cobertura de las pruebas |

## Pruebas

Las pruebas están implementadas con Jest y Supertest:

```
/src/tests
  /unit           # Pruebas unitarias de controladores
  /integration    # Pruebas de integración de API
  setup.ts        # Configuración global para pruebas
  teardown.ts     # Limpieza después de pruebas
```

Para ejecutar todas las pruebas: `npm test`

## Requisitos del Sistema

- Node.js (v14 o superior)
- npm (v6 o superior)
- Conexión a Internet (para acceder a la base de datos remota)

## Estructura del Proyecto

```
/backend
  /.env                  # Variables de entorno (no incluido en el repositorio)
  /package.json          # Dependencias y scripts
  /tsconfig.json         # Configuración de TypeScript
  /src
    /config              # Configuración de la aplicación
      dataSource.ts      # Configuración de TypeORM
    /controllers         # Controladores de la API
    /middlewares         # Middleware personalizado
    /models              # Definición de entidades/modelos
    /routes              # Rutas de la API
    /types               # Tipos e interfaces TypeScript
    /tests               # Tests unitarios e integración
    index.ts             # Punto de entrada principal
    seed.ts              # Script para inicializar datos
  /uploads               # Directorio para almacenar archivos subidos
  /dist                  # Código compilado (generado con npm run build)
```

## Inicialización de Datos

Si necesitas inicializar la base de datos con datos de ejemplo, ejecuta:

```bash
npm run seed
```

Este comando crea registros iniciales de usuarios, tipos de granja, tipos de producción y otros datos necesarios para empezar a usar la aplicación. 