# Módulo Auth

Maneja el registro, login y verificación de identidad del usuario.

---

## Responsabilidades

- Registrar nuevos usuarios con contraseña hasheada
- Autenticar usuarios y emitir JWT
- Exponer el endpoint `/me` para que el cliente verifique su sesión activa

---

## Archivos

### `auth.service.js`

Contiene la lógica de negocio de autenticación.

| Función | Parámetros | Retorna | Descripción |
|---|---|---|---|
| `registerUser(data)` | `{ name, email, password, role }` | `{ token, user }` | Verifica que el email no exista, hashea la contraseña, crea el usuario y emite un JWT |
| `loginUser(email, password)` | `email: string`, `password: string` | `{ token, user }` | Busca el usuario por email, compara la contraseña con bcrypt y emite un JWT |

**Errores que lanza:**
- `409` — email ya registrado
- `401` — credenciales inválidas (mismo mensaje para email y password — evita enumeration attack)

---

### `auth.controller.js`

Recibe los requests HTTP, delega al service y responde.

| Handler | Método + Ruta | Descripción |
|---|---|---|
| `register` | `POST /api/auth/register` | Registra un nuevo usuario |
| `login` | `POST /api/auth/login` | Inicia sesión y retorna JWT |
| `me` | `GET /api/auth/me` | Retorna el payload del JWT del usuario actual |

---

### `auth.routes.js`

Monta las validaciones con `express-validator` antes de los controllers.

| Ruta | Método | Auth | Validaciones |
|---|---|---|---|
| `/register` | POST | No | name requerido, email válido, password ≥6 chars |
| `/login` | POST | No | email válido, password requerido |
| `/me` | GET | Sí (JWT) | — |

---

## Flujo de registro

```
Client → POST /api/auth/register
  → validate middleware (express-validator)
  → auth.controller.register
    → auth.service.registerUser
      → user.repository.findUserByEmail (verifica duplicado)
      → hash.util.hashPassword
      → user.repository.createUser
      → jwt.util.signToken
  ← { token, user }
```

## Flujo de login

```
Client → POST /api/auth/login
  → validate middleware
  → auth.controller.login
    → auth.service.loginUser
      → user.repository.findUserByEmail
      → hash.util.comparePassword
      → jwt.util.signToken
  ← { token, user }
```

---

## Estructura del JWT payload

```json
{
  "id": "ObjectId del usuario",
  "role": "admin | paciente",
  "iat": 1234567890,
  "exp": 1234567890
}
```

---

## Seguridad

- Las contraseñas nunca se almacenan en texto plano — se hashean con bcrypt (salt rounds: 12)
- El error de login es idéntico para email no encontrado y contraseña incorrecta (evita enumeration)
- El JWT se firma con `JWT_SECRET` y expira en `JWT_EXPIRES_IN` (configurados en `.env`)
- El token se pasa en el header `Authorization: Bearer <token>`
