# Sistema de Turnos Médicos

**Materia:** Programación 2  
**Alumno:** Espindola Francisco  
**Institución:** Instituto Superior Santo Domingo

---

## Descripción

API REST para la gestión de turnos médicos desarrollada con Node.js, Express y MongoDB. Permite a los pacientes registrarse, autenticarse y reservar turnos con profesionales de la salud. Los administradores tienen control total sobre usuarios, profesionales y turnos.

La autenticación se implementa con JWT almacenado en cookie httpOnly. El acceso a cada endpoint está controlado por un sistema de roles (`admin` / `paciente`).

---

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución |
| Express | Framework HTTP |
| MongoDB + Mongoose | Base de datos y ODM |
| jsonwebtoken | Autenticación JWT |
| bcryptjs | Hashing de contraseñas |
| express-validator | Validación de datos de entrada |
| swagger-jsdoc + swagger-ui-express | Documentación interactiva |
| helmet + cors | Seguridad HTTP |
| Jest + Supertest | Tests de integración |

---

## Instalación y puesta en marcha

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repo>
cd sistema-turnos-medicos
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar el archivo `.env` con los valores correspondientes:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/turnos-medicos
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=7d
```

> Todas las variables son requeridas. Si alguna falta, el servidor no arranca.

### 3. Correr el servidor

```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

### 4. Correr los tests

```bash
npm test
```

---

## Documentación interactiva

Con el servidor corriendo, la documentación Swagger está disponible en:

```
http://localhost:3000/api/docs
```

Desde ahí se pueden probar todos los endpoints directamente en el navegador.

---

## Arquitectura

El proyecto usa **Clean Architecture por módulos**. Cada módulo es completamente autocontenido con sus propias capas.

```
src/
├── config/
│   ├── env.js              # Validación y exportación de variables de entorno
│   ├── db.js               # Conexión a MongoDB
│   └── swagger.js          # Configuración de Swagger
│
├── utils/
│   ├── jwt.util.js         # signToken / verifyToken
│   ├── hash.util.js        # hashPassword / comparePassword
│   └── response.util.js    # Formato estándar de respuestas
│
├── middlewares/
│   ├── auth.middleware.js  # Verificación de JWT (cookie o header)
│   ├── role.middleware.js  # Control de acceso por rol
│   ├── validate.middleware.js  # Manejo de errores de express-validator
│   └── error.middleware.js # Manejador global de errores
│
└── modules/
    ├── auth/               # Registro, login, logout, /me
    ├── users/              # CRUD de usuarios
    ├── professionals/      # CRUD de profesionales
    └── appointments/       # Gestión de turnos
```

**Flujo por capa:** `Routes → Controller → Service → Repository → Model`

Cada módulo contiene:

```
*.model.js        → Esquema Mongoose
*.repository.js   → Consultas a la base de datos
*.service.js      → Lógica de negocio
*.controller.js   → Manejo de request/response
*.routes.js       → Definición de rutas y middlewares
```

---

## Roles y permisos

| Rol | Permisos |
|---|---|
| `admin` | CRUD completo de usuarios, profesionales y turnos. Puede cambiar el estado de cualquier turno. |
| `paciente` | Puede registrarse, crear turnos, ver su propio historial y cancelar sus propios turnos. |

---

## Endpoints

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | No | Registrar nuevo usuario |
| POST | `/api/auth/login` | No | Iniciar sesión, devuelve JWT |
| POST | `/api/auth/logout` | No | Cerrar sesión, limpia la cookie |
| GET | `/api/auth/me` | Sí | Obtener datos del usuario autenticado |

### Usuarios

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/api/users` | admin | Listar todos los usuarios |
| GET | `/api/users/:id` | admin | Obtener usuario por ID |
| PUT | `/api/users/:id` | admin | Actualizar usuario |
| DELETE | `/api/users/:id` | admin | Eliminar usuario |

### Profesionales

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/api/professionals` | cualquiera | Listar profesionales (filtrar con `?specialty=`) |
| GET | `/api/professionals/:id` | cualquiera | Obtener profesional por ID |
| POST | `/api/professionals` | admin | Crear profesional |
| PUT | `/api/professionals/:id` | admin | Actualizar profesional |
| DELETE | `/api/professionals/:id` | admin | Eliminar profesional |

### Turnos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/api/appointments` | paciente, admin | Crear turno |
| GET | `/api/appointments/me` | paciente | Ver historial propio |
| GET | `/api/appointments` | admin | Listar todos los turnos (`?specialty=`, `?professional=`, `?status=`) |
| GET | `/api/appointments/:id` | admin | Obtener turno por ID |
| PATCH | `/api/appointments/:id/status` | admin | Cambiar estado (pendiente / confirmado / cancelado) |
| PATCH | `/api/appointments/:id/cancel` | paciente | Cancelar propio turno |
| DELETE | `/api/appointments/:id` | admin | Eliminar turno |

---

## Autenticación con Postman

1. Hacer `POST /api/auth/register` o `POST /api/auth/login` con email y password
2. Copiar el campo `token` de la respuesta
3. En las siguientes requests agregar el header:
   ```
   Authorization: Bearer <token>
   ```

---

## Formato de respuestas

Todas las respuestas siguen el mismo formato:

```json
// Éxito
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Descripción del error" }

// Error de validación (422)
{ "success": false, "errors": [ { "msg": "...", "path": "campo" } ] }
```

---

## Tests

Los tests son de integración y usan **Jest** + **Supertest**. Se ejecutan contra la base de datos real configurada en `.env`.

```bash
npm test
```

| Archivo | Qué prueba |
|---|---|
| `tests/auth.test.js` | Registro, login, email duplicado, credenciales inválidas, `/me` |
| `tests/professionals.test.js` | CRUD de profesionales, control de roles, filtros |
| `tests/appointments.test.js` | Creación de turnos, detección de conflictos de horario, historial, cambio de estado, filtros |
