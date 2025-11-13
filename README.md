# Sistema de Tickets – Frontend (React + Vite)

Aplicación web para gestionar tickets de soporte técnico con roles de usuario, técnico y administrador. Incluye autenticación, gestión de usuarios, creación y seguimiento de tickets, filtros, notificaciones tipo toast y flujo de asignación.

## Índice
- Descripción
- Características
- Tecnologías
- Estructura del proyecto
- Configuración y ejecución
- Scripts disponibles
- API y servicios
- Notificaciones (Contexto y Hook)
- Buenas prácticas y notas
- Docker (build y despliegue)
- Contribución

## Descripción
Este frontend consume un API REST proveniente del Backend Python construido en flask ofrece una interfaz sencilla para:
- Usuarios: crear y ver sus tickets.
- Técnicos: ver tickets asignados y actualizar su estado.
- Administradores: gestionar usuarios y asignar tickets.

La app está construida con React y Vite, usando TypeScript para tipado y Axios para llamadas HTTP.

## Características
- Autenticación con token (persistencia en `localStorage`).
- Gestión de usuarios (listado, creación, actualización, eliminación y técnicos).
- Gestión de tickets (creación, edición, asignación y borrado).
- Filtros por estado, prioridad y búsqueda de texto.
- Notificaciones tipo toast con acciones y cierre automático.
- Interceptor de Axios para incluir el token en cada petición.

## Tecnologías
- `React` + `TypeScript` + `Vite`.
- `Axios` para HTTP.
- `ESLint` para linting.
- CSS con archivos `App.css`, `index.css` y `Toast.css`.
- (Opcional) Paquetes de Tailwind instalados para futura adopción.

## Estructura del proyecto

```
frontend-tickets/
├── components/
│   ├── LoginModal.tsx
│   ├── Navbar.tsx
│   ├── Notification.tsx
│   ├── NotificationContext.tsx
│   ├── RegisterModal.tsx
│   ├── TicketCard.tsx
│   ├── TicketForm.tsx
│   ├── TicketList.tsx
│   ├── Toast.tsx
│   └── UserManagement.tsx
├── services/
│   ├── api.ts
│   └── useNotification.ts
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── Toast.css
│   ├── assets/
│   ├── index.css
│   └── main.tsx
├── types/
│   └── index.ts
├── Dockerfile
├── nginx.conf
├── eslint.config.js
├── package.json
├── vite.config.ts
└── README.md
```

### Puntos clave
- `src/App.tsx`: Composición principal de la UI y flujo por rol.
- `components/NotificationContext.tsx`: Proveedor de notificaciones y render de toasts.
- `services/useNotification.ts`: Hook para consumir el contexto de notificaciones.
- `services/api.ts`: Cliente Axios y funciones para `auth`, `users` y `tickets`.
- `types/index.ts`: Tipos de `User`, `Ticket`, `AuthResponse`, etc.

## Configuración y ejecución

### Requisitos
- Node.js 18+ recomendado.

### Instalar dependencias
```
npm install
```

### Desarrollo
```
npm run dev
```
Vite se inicia normalmente en `http://localhost:5173/`.

### Build de producción
```
npm run build
```
Genera el bundle en `dist/`.

### Vista previa del build
```
npm run preview
```
Sirve `dist/` en un servidor local para probar el build.

## Scripts disponibles
- `npm run dev`: arranca el servidor de desarrollo de Vite.
- `npm run build`: compila TypeScript y genera el bundle de producción.
- `npm run preview`: sirve el bundle de producción localmente.
- `npm run lint`: ejecuta ESLint.

## API y servicios
El cliente Axios se configura en `services/api.ts`:

- Base URL por defecto: `http://localhost:8000/api` o la API del backend que se encuentra en este mismo perfil de GitHub.
- Interceptor de petición que añade `Authorization: Bearer <token>` si existe.

### Endpoints usados
- Autenticación
  - `POST /auth/login`
  - `POST /auth/register`
- Usuarios
  - `GET /users`
  - `GET /users/:id`
  - `POST /users`
  - `PUT /users/:id`
  - `DELETE /users/:id`
  - `GET /users/technicians`
- Tickets
  - `GET /tickets`
  - `GET /tickets/user/:userId`
  - `GET /tickets/technician/:technicianId`
  - `POST /tickets`
  - `PUT /tickets/:id`
  - `PUT /tickets/:id/assign`
  - `DELETE /tickets/:id`

### Notas de configuración
- Si necesitas apuntar a otra API, edita `API_BASE_URL` en `services/api.ts`.
- Alternativa recomendada: usar una variable de entorno de Vite (`VITE_API_BASE_URL`) y leerla desde `import.meta.env.VITE_API_BASE_URL`.

## Notificaciones (Contexto y Hook)
El contexto y el hook de notificaciones están separados para mantener el Fast Refresh limpio:

- Proveedor: `components/NotificationContext.tsx`.
- Hook: `services/useNotification.ts`.

### Uso rápido
Envuelve tu app con el `NotificationProvider` (ya configurado en `src/App.tsx`):

```tsx
// src/App.tsx
<NotificationProvider>
  <AppContent />
</NotificationProvider>
```

Dentro de cualquier componente, usa el hook:

```tsx
import { useNotification } from '../services/useNotification';

function MiComponente() {
  const { showNotification } = useNotification();

  const guardar = () => {
    // ... lógica de guardado
    showNotification('Guardado correctamente', 'success');
  };

  return <button onClick={guardar}>Guardar</button>;
}
```

## Buenas prácticas y notas
- Fast Refresh: para evitar advertencias, los hooks y utilidades se exportan desde archivos separados (p. ej., `useNotification` en `services/useNotification.ts`).
- Seguridad: los tokens se guardan en `localStorage`. Considera rotación, expiración y limpieza en logout (ya implementado en `App.tsx`).
- Tipado: usa los tipos de `types/index.ts` al interactuar con el API.

## Docker (build y despliegue)
Este repo incluye `Dockerfile` y `nginx.conf` para servir el build estático con Nginx.

### Construir imagen
```
docker build -t tickets-frontend .
```

### Ejecutar contenedor
```
docker run -p 8080:80 --name tickets-frontend tickets-frontend
```
La app quedará accesible en `http://localhost:8080/`. 

## Contribución
- Ejecuta `npm run lint` antes de abrir un PR.
- Mantén el estilo y la organización existentes.
- Describe claramente cambios y pruebas realizadas.