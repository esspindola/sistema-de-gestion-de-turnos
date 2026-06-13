# Módulo Users

Gestión CRUD de usuarios del sistema. Solo accesible por `admin`.

---

## Modelo — `User`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | String | Sí | Nombre completo del usuario |
| `email` | String | Sí | Email único, se almacena en lowercase |
| `password` | String | Sí | Hash bcrypt — nunca se expone en respuestas |
| `role` | String | No | `admin` o `paciente`. Default: `paciente` |
| `createdAt` | Date | Auto | Timestamp de creación (Mongoose) |
| `updatedAt` | Date | Auto | Timestamp de última modificación (Mongoose) |

---

## Archivos

### `user.model.js`

Define el schema de Mongoose. El campo `password` nunca se retorna en las respuestas (el repository usa `.select('-password')`).

---

### `user.repository.js`

Capa de acceso a datos. Todas las queries viven acá.

| Función | Parámetros | Retorna | Descripción |
|---|---|---|---|
| `findUserByEmail(email)` | `email: string` | `User \| null` | Busca usuario por email (incluye password — para auth) |
| `findUserById(id)` | `id: string` | `User \| null` | Busca por ID, excluye password |
| `createUser(data)` | `data: object` | `User` | Crea un nuevo usuario |
| `findAllUsers()` | — | `User[]` | Lista todos, sin passwords |
| `updateUser(id, data)` | `id: string`, `data: object` | `User \| null` | Actualiza y retorna el documento nuevo |
| `deleteUser(id)` | `id: string` | `User \| null` | Elimina por ID |

---

### `user.service.js`

Lógica de negocio. Valida existencia antes de operar.

| Función | Descripción |
|---|---|
| `getAllUsers()` | Retorna lista completa de usuarios |
| `getUserById(id)` | Lanza `404` si no existe |
| `updateUser(id, data)` | Si viene `password`, lo hashea antes de guardar. Lanza `404` si no existe |
| `deleteUser(id)` | Lanza `404` si no existe |

---

### `user.controller.js`

| Handler | Método + Ruta | Rol |
|---|---|---|
| `getAll` | `GET /api/users` | admin |
| `getById` | `GET /api/users/:id` | admin |
| `update` | `PUT /api/users/:id` | admin |
| `remove` | `DELETE /api/users/:id` | admin |

---

### `user.routes.js`

Todas las rutas requieren `authenticate` + `authorize('admin')`.

| Ruta | Método | Validaciones |
|---|---|---|
| `/` | GET | — |
| `/:id` | GET | — |
| `/:id` | PUT | email válido (opcional), name no vacío (opcional) |
| `/:id` | DELETE | — |

---

## Flujo típico — actualizar usuario

```
Admin → PUT /api/users/:id { name, email }
  → authenticate (verifica JWT)
  → authorize('admin') (verifica rol)
  → validate (express-validator)
  → user.controller.update
    → user.service.updateUser
      → hashPassword si viene password
      → user.repository.updateUser
  ← { success: true, data: updatedUser }
```
