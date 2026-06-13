# Módulo Professionals

Gestión de los profesionales médicos del sistema. Los admins los crean y editan; los pacientes pueden consultarlos para sacar turnos.

---

## Modelo — `Professional`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `name` | String | Sí | Nombre completo del profesional |
| `specialty` | String | Sí | Especialidad médica (ej: Cardiología, Pediatría) |
| `email` | String | Sí | Email único del profesional |
| `phone` | String | No | Teléfono de contacto |
| `availableDays` | String[] | No | Días disponibles: lunes, martes, miércoles, jueves, viernes, sábado |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

---

## Archivos

### `professional.repository.js`

| Función | Parámetros | Descripción |
|---|---|---|
| `findAllProfessionals(filters)` | `filters?: object` | Lista todos con filtros opcionales de Mongoose |
| `findProfessionalById(id)` | `id: string` | Busca por ID |
| `findProfessionalsBySpecialty(specialty)` | `specialty: string` | Búsqueda case-insensitive con regex |
| `createProfessional(data)` | `data: object` | Crea un nuevo profesional |
| `updateProfessional(id, data)` | `id: string`, `data: object` | Actualiza y retorna documento nuevo |
| `deleteProfessional(id)` | `id: string` | Elimina por ID |

---

### `professional.service.js`

| Función | Descripción |
|---|---|
| `getAllProfessionals(specialty?)` | Si recibe `specialty`, filtra por regex. Sin parámetro, lista todos |
| `getProfessionalById(id)` | Lanza `404` si no existe |
| `createProfessional(data)` | Delega al repository |
| `updateProfessional(id, data)` | Lanza `404` si no existe |
| `deleteProfessional(id)` | Lanza `404` si no existe |

---

### `professional.controller.js`

| Handler | Método + Ruta | Rol requerido |
|---|---|---|
| `getAll` | `GET /api/professionals` | Cualquier autenticado |
| `getById` | `GET /api/professionals/:id` | Cualquier autenticado |
| `create` | `POST /api/professionals` | admin |
| `update` | `PUT /api/professionals/:id` | admin |
| `remove` | `DELETE /api/professionals/:id` | admin |

---

### `professional.routes.js`

| Ruta | Método | Auth | Rol | Query params |
|---|---|---|---|---|
| `/` | GET | Sí | cualquiera | `?specialty=` (opcional) |
| `/:id` | GET | Sí | cualquiera | — |
| `/` | POST | Sí | admin | — |
| `/:id` | PUT | Sí | admin | — |
| `/:id` | DELETE | Sí | admin | — |

---

## Filtrado por especialidad

El endpoint `GET /api/professionals?specialty=cardio` hace una búsqueda regex case-insensitive, por lo que "cardio", "Cardiología", "CARDIO" todas devuelven resultados. Útil para que el paciente busque especialistas sin saber el nombre exacto.

---

## Relación con Appointments

El modelo `Appointment` referencia a `Professional` por ObjectId. Al crear un turno, el service de appointments:
1. Verifica que el profesional exista
2. Copia la especialidad del profesional al turno (para facilitar filtros sin join)
3. Chequea conflictos de horario para ese profesional
