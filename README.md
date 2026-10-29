# Titanes — Escuela de Baloncesto (frontend)

Sitio de la escuela de baloncesto **Titanes** (Entrega 3 de Desarrollo de Aplicaciones Web, UdM). Es el mismo sitio de la Entrega 1, con el mismo contenido e identidad visual, migrado a Next.js y conectado a una API con PostgreSQL y JWT.

- **Sitio:** https://titanes-web.vercel.app
- **API:** https://titanes-api.onrender.com/api
- **Repositorio del backend:** https://github.com/Juan-Manuel3132007/titanes-api

> La API está en el plan gratis de Render: si estuvo inactiva, la primera carga puede tardar ~50 s.

## Tecnologías

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4

## Organización por features

```
app/                          → rutas (page.tsx): solo componen
src/features/
├── common/                   → config.ts, http.ts, useRecurso, Button, Input, Pagination, Navbar, Footer…
├── auth/                     → domain · services · hooks (useAuth) · components (LoginForm, RegisterForm, RutaProtegida)
├── grupos/                   → catálogo: domain · services · hooks · components (CatalogoGrupos, Filtros, AdminGrupos…)
├── entrenadores/             → domain · services · hooks · components
├── inscripciones/            → domain · services · hooks · components (InscripcionForm, MisInscripciones, AdminInscripciones)
└── inicio/                   → secciones institucionales del inicio
```

Ningún componente llama a `fetch`: todo pasa por `services/`, que usan el cliente `common/http.ts`, y los componentes usan `hooks/`.

## Rutas

| Ruta | Acceso |
|---|---|
| `/`, `/programas`, `/entrenadores` | Público (catálogo y entrenadores vienen de la API) |
| `/login`, `/registro` | Solo sin sesión (con sesión redirigen al inicio) |
| `/inscripcion`, `/mis-inscripciones` | Requieren sesión (sin sesión → `/login`) |
| `/admin` | Solo rol ADMIN (un user es redirigido al inicio) |
| cualquier otra | Página 404 propia |

`/programas` usa la URL para la paginación y los filtros combinados: `?page=2&categoria=elite&q=&precioMin=&precioMax=`.

## Correr en local

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_HOST=http://localhost:4000
npm run dev                  # http://localhost:3000
```

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_API_HOST` | URL base de la API, sin `/api` |

## Credenciales de prueba (solo para el ambiente de la entrega)

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@titanes.com` | `Admin12345` |
| User | `usuario@titanes.com` | `Usuario12345` |

## Decisiones técnicas

**Flujo completo de un login.** `LoginForm` valida los campos y llama a `login()` del hook `useAuth`, que llama a `authService.login`, que hace `POST /auth/login` con `http.ts`. Si la API responde 401, el error "Credenciales inválidas" se muestra en el formulario. Si responde 200, el hook guarda el token, deja el usuario en el contexto y el navbar cambia a "Nombre · Salir". Cuando entro a `/mis-inscripciones`, `RutaProtegida` ve que hay sesión, `useMisInscripciones` llama al servicio y `http.ts` agrega `Authorization: Bearer <token>`. En la API, el middleware `autenticar` verifica el token y el controlador devuelve solo las inscripciones del usuario del token. Al refrescar la página, `AuthProvider` lee el token guardado y llama a `/auth/me` para recuperar la sesión.

**Dónde guardo el token y qué riesgo tiene.** En `localStorage`. Es simple y sobrevive al refrescar, pero cualquier JavaScript que corra en la página puede leerlo: si el sitio tuviera una vulnerabilidad XSS, alguien podría robar el token y usarlo hasta que expire. Lo mitigo con la expiración del JWT (1 día) y porque React escapa el contenido que muestra. La alternativa más segura sería una cookie `httpOnly`, que JavaScript no puede leer.

**401 vs 403 en mi proyecto.** Si el token venció o es inválido, la API responde 401 y `http.ts` borra el token y me lleva a `/login?expirada=1`. Si inicio sesión como `usuario@titanes.com` y envío `DELETE /api/grupos/1`, el token es válido pero no soy admin, así que la API responde 403. Ocultar el botón "Administración" no es protección: `/admin` redirige en el frontend, pero la protección real está en la API.

**Errores junto al campo.** La API responde los errores como `details: [{ campo, mensaje }]` y `ApiError.erroresPorCampo()` los convierte para mostrarlos debajo de cada input. Por ejemplo, el 409 de email repetido sale debajo del campo Email.

**Bonificaciones.** Filtros combinados en el catálogo (texto, categoría y rango de precio) y confirmación antes de eliminar en `/admin`.

**Uso de IA.** Usé IA como apoyo para organizar las features y escribir los componentes. Tuve que corregir y entender: la configuración de Next.js 16 (las páginas que leen la URL van dentro de `Suspense`), el alias `@/*` apuntando a `src/`, que `.gitignore` subiera `.env.example` pero no `.env.local`, y el CORS entre Vercel y Render.

## Captura de Network

![Petición protegida con Authorization](docs/network.png)