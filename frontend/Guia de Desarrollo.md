# MiniFarm Frontend Development Checklist

Este archivo contiene la lista de pasos (tareas) para el desarrollo de la aplicación MiniFarm Frontend. Cada tarea se puede marcar como completada conforme se vaya implementando cada funcionalidad.

---

## 1. Configuración Inicial y Estructura del Proyecto

- [x] **Verificar Estructura del Proyecto**
  - [x] Confirmar que la estructura de carpetas es la siguiente:
    - `/src` (código fuente principal)
    - `/assets` (recursos estáticos)
    - `/components` (componentes reutilizables)
    - `/context` (contextos de React)
    - `/hooks` (hooks personalizados)
    - `/layout` (componentes de diseño)
    - `/pages` (páginas principales)
    - `/routes` (configuración de rutas)
    - `/services` (servicios API)
    - `/types` (definiciones de tipos TypeScript)
    - `/public` (archivos estáticos)
- [x] **Verificar Librerías y Herramientas Instaladas**
  - [x] React (React 19, react-dom)
  - [x] React Router (react-router-dom v7)
  - [x] Material UI (@mui/material, @emotion/react, @emotion/styled)
  - [x] Formularios: formik y yup
  - [x] HTTP: axios
  - [x] Bundler: Vite 6
  - [x] TypeScript y ESLint

---

## 2. Configuración de Rutas y Navegación

- [x] **Configurar React Router**
  - [x] Crear rutas públicas para *Login* y *Registro*.
  - [x] Crear rutas privadas para *Dashboard* y *Detalles de Granja*.
  - [x] Implementar redirección tras iniciar sesión.
- [x] **Crear Archivo de Rutas**
  - [x] Implementar archivo en `/src/routes` que centralice las rutas de la aplicación.

---

## 3. Autenticación (Login / Registro)

- [x] **Pantalla de Login**
  - [x] Crear el componente de Login en `/src/pages` con formulario de email y password.
  - [x] Validar el formulario utilizando Formik y Yup.
  - [x] Conectar la petición al endpoint `/api/users/login` usando axios.
  - [x] Manejar respuestas de éxito y error (mostrar mensajes, spinners, etc.).
- [x] **Pantalla de Registro**
  - [x] Crear el componente de Registro similar al Login.
  - [x] Validar el formulario y conectarlo al endpoint `/api/users/register`.
  - [x] Mostrar retroalimentación al usuario (mensajes de error/success).

---

## 4. Layout Global y Componentes Globales

- [x] **Crear Componente de Layout Global**
  - [x] Definir un layout en `/src/layout` que envuelva las páginas privadas.
  - [x] Incluir estilos globales (fuente, colores, etc.).
- [x] **Implementar Header Global**
  - [x] Incluir en el header:
    - [x] Un logo pequeño.
    - [x] Texto a la derecha del logo.
    - [x] Botón de *Login* (o información del usuario si ya inició sesión).
  - [x] Utilizar componentes de Material UI (AppBar, Toolbar, etc.).
- [x] **Componentes Globales de UI**
  - [x] Crear un componente global de *Loading* para indicar cargas en peticiones.
  - [x] Crear componentes globales para *Alertas* y *Diálogos de Confirmación*.
  - [x] Configurar estos componentes para ser reutilizados en toda la aplicación.

---

## 5. Página Dashboard

- [x] **Diseño e Implementación del Dashboard**
  - [x] Crear el componente *Dashboard* en `/src/pages`.
  - [x] **Cards de Estadísticas Pequeñas**
    - [x] Obtener datos del endpoint `/api/dashboard/stats` y mostrarlos en cards.
  - [x] **Cards de Granjas**
    - [x] Mostrar tarjetas grandes para cada granja con:
      - [x] Imagen.
      - [x] Tipo de granja.
      - [x] Tipo de producción.
    - [x] Incluir un botón para "Añadir Nueva Granja".
  - [x] **DataTable de Animales con Incidencias**
    - [x] Incluir dentro del dashboard (no como componente aparte) un DataTable que liste animales.
    - [x] Mostrar búsqueda, ordenamiento y paginación.
    - [x] Cada fila tendrá acciones para editar o borrar el animal, mostrando diálogos de confirmación al eliminar.
    - [x] Resaltar en rojo los animales que tengan incidencias.
  - [x] **Indicadores y Estados de Carga**
    - [x] Utilizar el componente global de Loading mientras se cargan los datos.
    - [x] Mostrar mensajes de error o alerta utilizando los componentes globales.

---

## 6. Página de Detalles de Granja

- [x] **Implementación de la Página de Detalles**
  - [x] Dirigir a la página de detalles al pulsar una card de granja en el dashboard.
  - [x] Mostrar el listado de animales de esa granja
    - [x] Resaltar en rojo aquellos animales que tengan incidencias.
  - [x] Mostrar cards con estadísticas derivadas de los datos de los animales.
  - [x] Incluir opciones para:
    - [x] **Editar Granjas**: Formularios para actualizar la información de la granja.
    - [x] **Añadir/Editar/Borrar Animales**: Formularios para la creación y edición de animales.
  - [x] Reutilizar el DataTable (o similar) utilizado en el dashboard, adaptándolo para mostrar únicamente los animales de la granja.

---

## 7. Formularios Avanzados (Edición y Creación)

- [ ] **Formulario de Creación de Nueva Granja**
  - [ ] Crear el formulario en `/src/pages` o dentro de un modal.
  - [ ] Incluir campos:
    - Nombre.
    - File uploader para la imagen.
    - Dropdown para seleccionar el tipo de granja (datos desde `/api/farm-types`).
    - Dropdown para seleccionar el tipo de producción (datos desde `/api/production-types`).
  - [ ] Validar el formulario usando Formik y Yup.
  - [ ] Conectar con el endpoint `/api/farms` utilizando FormData.
  - [ ] Mostrar mensajes de éxito o error.
- [ ] **Formulario de Edición de Granjas**
  - [ ] Crear un formulario similar al de creación, precargado con los datos actuales.
  - [ ] Permitir actualizar la imagen, tipos y demás campos.
  - [ ] Conectar con el endpoint de actualización de granjas (`/api/farms/:id`).
- [ ] **Formularios de Creación y Edición de Animales**
  - [ ] Crear formularios para:
    - Crear un nuevo animal.
    - Editar los datos de un animal existente.
  - [ ] Incluir campos como:
    - Tipo de animal.
    - Número de identificación.
    - Peso.
    - Producción estimada.
    - Registro sanitario.
    - Edad.
    - Incidencias (si existen).
  - [ ] Validar los formularios con Formik y Yup.
  - [ ] Conectar con los endpoints correspondientes para crear o actualizar animales.
  - [ ] Mostrar mensajes de éxito o error mediante los componentes globales.

---

## 8. Servicios API e Integración

- [x] **Crear Servicios API**
  - [x] Implementar funciones en `/src/services` para llamadas a los endpoints usando axios.
  - [x] Configurar cabeceras de autorización (Bearer token) para rutas protegidas.
  - [x] Manejar globalmente errores de las peticiones.
- [x] **Integración con Endpoints Documentados**
  - [x] Usuarios: `/api/users/login`, `/api/users/register`, etc.
  - [x] Granjas: `/api/farms` (GET, POST, PUT, DELETE).
  - [x] Animales: `/api/animals` (según endpoints disponibles).
  - [x] Tipos: `/api/farm-types` y `/api/production-types`.
  - [x] Dashboard: `/api/dashboard/stats`.

---

## 9. Optimización, Pruebas y Despliegue

- [ ] **Pruebas Funcionales**
  - [ ] Probar cada página y funcionalidad:
    - Login y Registro.
    - Dashboard con integración de DataTable y cards.
    - Detalles de Granja y operaciones CRUD sobre granjas y animales.
- [x] **Correcciones y Linting**
  - [x] Ejecutar ESLint y resolver warnings y errores.
- [x] **Optimización para Producción**
  - [x] Configurar Vite para generar build optimizado.
  - [x] Configurar variables de entorno (API base URL, etc.).
- [ ] **Despliegue**
  - [ ] Realizar pruebas finales de integración.
  - [ ] Preparar el despliegue en el entorno de producción.

---

## Notas Adicionales

- Asegúrate de que todos los componentes tengan estilos consistentes y cumplan con las normas de UX/UI.
- Los indicadores de carga, alertas y diálogos de confirmación deben ser componentes globales reutilizables.
- Revisa la documentación de la API para mayor claridad sobre los endpoints y sus respuestas.
- Garantizar responsividad y buena experiencia de usuario en todas las pantallas.

---

Utiliza esta lista de tareas para ir marcando cada elemento conforme avances en el desarrollo. ¡Mucho éxito con tu proyecto MiniFarm Frontend!
