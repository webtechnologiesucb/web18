# Web18 - Portal Web Ballet UCB (Frontend Angular)

Frontend del portal web del **Ballet de la Universidad Católica Boliviana "San Pablo"** desarrollado con **Angular (standalone, v21 scaffold)**, basado en los diseños y la identidad visual de la carpeta `../web09`, e integrado con la API REST documentada en Swagger: `http://localhost:3000/api-docs`.

## 1. Objetivo del proyecto

Construir una SPA (Single Page Application) en Angular que traslade el diseño del sitio estático `web09` a un frontend moderno, consumiendo los endpoints reales de la API Ballet UCB para mostrar y gestionar información de:

- **Obras y funciones** (repertorio, cartelera, detalle de obra y sus funciones).
- **Noticias** (listado y detalle por slug).
- **Elenco** (integrantes filtrables por rol).
- **Convocatorias y postulaciones** (listado público y envío de postulación).
- **Reservas** (creación de reserva de entradas y consulta pública por código).
- **Suscripción** al boletín de noticias.
- **Autenticación** (registro, login y perfil del usuario autenticado con JWT).

## 2. Stack tecnológico

- **Angular** (aplicación standalone, componentes con `standalone: true`, señales `signal()` para estado de auth, enrutamiento con `provideRouter` y *lazy loading* de páginas vía `loadComponent`).
- **Angular Router** para navegación SPA, rutas parametrizadas (`/noticias/:slug`, `/obras/:id`) y guardia de autenticación (`canActivate`).
- **HttpClient** (`provideHttpClient`) con **interceptor funcional** para adjuntar JWT y manejar respuestas 401.
- **RxJS** (`Observable`, `tap`, `catchError`) para flujos de datos HTTP.
- **FormsModule** (template-driven forms) para formularios de suscripción, filtros, postulación, reservas y autenticación.
- **CSS del diseño web09** reutilizado directamente e importado en `src/styles.css` (`variables.css`, `base.css`, `layout.css`, `components.css`, `animations.css`, `landing.css`) para mantener la estética teatral (paleta borgoña/oro, tipografías Cinzel + Plus Jakarta Sans, componentes glassmorphism, hero, carrusel, tablas, formularios).
- **Carrusel JS vanilla** heredado de `web09/js/carousel.js` (`window.BalletCarousel`), servido desde `public/` e inicializado desde la página Home.

## 3. Estructura del proyecto

```text
web18/
├─ angular.json                # Configuración Angular (build/serve) + proxyConfig
├─ proxy.conf.json             # Proxy de desarrollo: /api -> http://localhost:3000
├─ package.json
├─ public/
│  ├─ assets copiados de web09 (images/, audio/, video/, eventos.json, etc.)
│  └─ carousel.js              # Script del carrusel (BalletCarousel) de web09
└─ src/
   ├─ index.html               # Entry HTML, fuentes, remixicon y carga de carousel.js
   ├─ main.ts                  # Bootstrap de la aplicación
   ├─ styles.css               # Importa estilos globales del diseño web09
   ├─ assets/css/              # Hojas de estilo del diseño web09
   └─ app/
      ├─ app.ts / app.html / app.css / app.config.ts / app.routes.ts
      ├─ components/
      │  ├─ header/            # Cabecera, navegación responsive y toggle de tema
      │  └─ footer/            # Pie de página
      ├─ guards/
      │  └─ auth.guard.ts      # Guardia para rutas protegidas (perfil)
      ├─ interceptors/
      │  └─ auth.interceptor.ts# Inyección de Bearer token y limpieza en 401
      ├─ services/
      │  ├─ api.ts             # ApiService (HttpClient), baseURL /api y helpers
      │  └─ auth.ts            # AuthService (sesión, login/register/perfil/logout)
      └─ pages/
         ├─ home/              # Landing: hero, stats, about, carrusel, obras, noticias, suscripción
         ├─ noticias/          # Listado de noticias (GET /api/noticias)
         ├─ noticia-detalle/   # Detalle por slug (GET /api/noticias/:slug)
         ├─ funciones/         # Funciones con filtro por estado y obras (GET /api/funciones, /api/obras)
         ├─ obra-detalle/      # Detalle de obra y sus funciones (GET /api/obras/:id)
         ├─ elenco/            # Elenco filtrable por rol (GET /api/elenco)
         ├─ convocatorias/     # Convocatorias y formulario de postulación (GET/POST)
         ├─ reservas/          # Crear reserva y consultar por código (POST/GET)
         ├─ login/             # Inicio de sesión (POST /api/auth/login)
         ├─ register/          # Registro de usuario (POST /api/auth/register)
         └─ perfil/            # Perfil autenticado (GET /api/auth/perfil, ruta protegida)
```

## 4. Integración con la API (Swagger)

La API base es `http://localhost:3000` (según `servers` del OpenAPI). En desarrollo, las peticiones se hacen a `/api/*` y `proxy.conf.json` las redirige al backend, evitando problemas de CORS.

Endpoints consumidos:

| Módulo | Método y ruta | Uso en el frontend |
|---|---|---|
| Auth | `POST /api/auth/register` | Registro (espectador/postulante) |
| Auth | `POST /api/auth/login` | Login y obtención de JWT |
| Auth | `GET /api/auth/perfil` | Perfil del usuario autenticado |
| Noticias | `GET /api/noticias` | Listado y últimas en Home |
| Noticias | `GET /api/noticias/:slug` | Detalle de noticia |
| Obras | `GET /api/obras` | Repertorio en Home y Funciones |
| Obras | `GET /api/obras/:id` | Detalle de obra y sus funciones |
| Funciones | `GET /api/funciones` | Cartelera/tabla con filtro por estado |
| Elenco | `GET /api/elenco` | Listado con filtro por rol |
| Convocatorias | `GET /api/convocatorias` | Listado de convocatorias |
| Convocatorias | `POST /api/convocatorias/:id/postulaciones` | Envío de postulación pública |
| Reservas | `POST /api/reservas` | Registro de reserva (genera código BUCB-XXXX) |
| Reservas | `GET /api/reservas/codigo/:codigo` | Consulta pública por código |
| Suscriptores | `POST /api/suscriptores` | Suscripción al boletín |

### Notas de integración
- **Autenticación:** el token JWT se guarda en `localStorage` y se adjunta automáticamente como `Authorization: Bearer <token>` mediante `authInterceptor`. Si la API responde 401, se limpia la sesión local (`AuthService.logout()`).
- **Normalización de respuestas:** las respuestas pueden venir envueltas como `{ data: [...] }`, `{ obras: [...] }`, `{ items: [...] }`, etc. Se usa `normalizeList` y accesos defensivos (`data?.data || data?.noticia || data`, IDs como `id || id_funcion/id_obra`) para tolerar variantes del backend.
- **Proxy de desarrollo:** configurado en `proxy.conf.json` y referenciado en `angular.json` (`serve.options.proxyConfig`). `ApiService` usa `baseUrl = '/api'`.
- **Manejo de errores y carga:** las páginas gestionan estados de carga, vacío y error, mostrando mensajes amigables con `getErrorMessage` (prioriza `error.error.message`).

## 5. Relación con el diseño de `web09`

- Se copiaron los **assets** (imágenes, audio, video) a `public/` y las **hojas CSS** a `src/assets/css/` para preservar la misma identidad visual: hero con overlay, tipografía y paleta teatral, tarjetas, tablas responsivas, formularios, carrusel de producciones, stats banner y widgets.
- La **Home** replica las secciones principales del `index.html` de `web09` (hero, estadísticas, sobre nosotros, galería/carrusel, repertorio, noticias y suscripción), conectando repertorio/noticias a la API.
- El **toggle de tema claro/oscuro** y el **menú responsive** se implementaron en el componente `Header` manteniendo las clases/atributos esperados por el CSS original (`data-theme="light"`, `.is-open`, `.nav-toggle`, etc.).
- Se reutilizó el **carrusel** (`BalletCarousel`) como script global para conservar su comportamiento; la página Home lo inicializa en `ngOnInit` y lo destruye en `ngOnDestroy`.

## 6. Rutas de la aplicación

- `/` — Inicio (landing).
- `/noticias` — Listado de noticias.
- `/noticias/:slug` — Detalle de noticia.
- `/funciones` — Funciones programadas y obras.
- `/obras/:id` — Detalle de obra.
- `/elenco` — Integrantes del elenco.
- `/convocatorias` — Convocatorias y postulación.
- `/reservas` — Crear y consultar reservas.
- `/login` — Inicio de sesión.
- `/registro` — Registro de cuenta.
- `/perfil` — Perfil (ruta protegida por `authGuard`; redirige a login con `redirect`).

## 7. Instalación y ejecución

### Requisitos previos
- Node.js (compatible con la versión de Angular del proyecto; el scaffold se generó con Angular CLI 21) y npm.
- API Ballet UCB en ejecución en `http://localhost:3000` (con Swagger en `/api-docs`).

### Pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo (con proxy /api -> http://localhost:3000)
npm start
# o: ng serve

# 3. Build de producción
npm run build
# o: ng build
```

> La aplicación de desarrollo se sirve por defecto en `http://localhost:4200`. Si la API corre en otro host/puerto, ajusta `proxy.conf.json` (y, para producción, la `baseUrl` en `src/app/services/api.ts` o un mecanismo de configuración de entorno).

## 8. Comentarios de desarrollo y decisiones

- **Standalone + lazy loading:** se usaron componentes standalone y carga diferida de páginas (`loadComponent` en rutas) para una estructura modular sin `NgModule` innecesarios.
- **Estado de autenticación con signals:** `AuthService` expone `user` y `token` como `signal`, lo que simplifica la reactividad en plantillas (Header, Perfil, guardia).
- **Capa de acceso HTTP centralizada:** `ApiService` encapsula `HttpClient` y parámetros comunes; helpers (`normalizeList`, `getErrorMessage`) reducen duplicación y aumentan tolerancia a variaciones del payload.
- **Seguridad/ruteo:** `authGuard` protege `/perfil` y `authInterceptor` gestiona el token y el caso 401 para evitar estados de sesión inconsistentes.
- **Reutilización del diseño:** se priorizó conservar el CSS y la estructura visual de `web09` para cumplir la consigna, incorporando datos dinámicos desde la API donde corresponde.
- **Extensibilidad:** la separación por `pages/`, `components/`, `services/`, `guards/` e `interceptors/` facilita agregar módulos administrativos (CRUD/gestión) sobre endpoints `[AUTH]` documentados (noticias, obras, funciones, elenco, convocatorias, reservas, suscriptores, reporte de ocupación).

## 9. Posibles mejoras futuras

- Componentizar el carrusel como componente Angular nativo.
- Añadir paginación/filtrado avanzado usando parámetros/metadatos de la API.
- Migrar formularios a Reactive Forms con validaciones más ricas y feedback por campo.
- Incorporar manejo de estado/caché de datos (p.ej. señales + servicios o librerías especializadas).
- Vistas administrativas para roles `admin`/`director` (gestión de contenido, evaluación de postulaciones, reporte de ocupación).
- Internacionalización, accesibilidad adicional y pruebas unitarias/E2E.
