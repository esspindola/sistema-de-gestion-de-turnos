# Módulo Appointments (Turnos)

Núcleo del sistema. Maneja la creación, consulta, modificación de estado y cancelación de turnos médicos.

---

## Modelo — `Appointment`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `patient` | ObjectId → User | Sí | Referencia al paciente |
| `professional` | ObjectId → Professional | Sí | Referencia al profesional |
| `specialty` | String | Sí | Especialidad (copiada del profesional al crear) |
| `date` | Date | Sí | Fecha del turno |
| `time` | String | Sí | Hora en formato HH:MM |
| `status` | String | No | `pendiente`, `confirmado`, `cancelado`. Default: `pendiente` |
| `notes` | String | No | Observaciones del paciente |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

---

## Archivos

### `appointment.repository.js`

| Función | Parámetros | Descripción |
|---|---|---|
| `createAppointment(data)` | `data: object` | Crea el turno |
| `findAppointmentById(id)` | `id: string` | Busca por ID con populate de patient y professional |
| `findAppointmentsByPatient(patientId)` | `patientId: string` | Historial del paciente, ordenado por fecha desc |
| `findAllAppointments(filters)` | `filters?: object` | Lista todos con filtros de Mongoose, populate, orden desc |
| `updateAppointmentStatus(id, status)` | `id: string`, `status: string` | Cambia solo el campo status |
| `updateAppointment(id, data)` | `id: string`, `data: object` | Actualización general |
| `deleteAppointment(id)` | `id: string` | Elimina por ID |
| `checkConflict(professionalId, date, time)` | — | Busca turnos no cancelados del profesional en esa fecha y hora |

---

### `appointment.service.js`

| Función | Rol | Descripción |
|---|---|---|
| `createAppointment(data, patientId)` | paciente/admin | Verifica que exista el profesional, detecta conflictos de horario, crea el turno |
| `getMyAppointments(patientId)` | paciente | Historial personal del paciente autenticado |
| `getAllAppointments(filters)` | admin | Lista total con filtros por specialty, professional ID, status |
| `getAppointmentById(id)` | admin | Lanza `404` si no existe |
| `updateAppointmentStatus(id, status)` | admin | Cambia el estado. Lanza `404` si no existe |
| `cancelAppointment(id, patientId)` | paciente | Verifica que el turno pertenezca al paciente antes de cancelar. Lanza `403` si no es dueño |
| `deleteAppointment(id)` | admin | Elimina físicamente el turno |

---

### `appointment.controller.js`

| Handler | Método + Ruta | Rol |
|---|---|---|
| `create` | `POST /api/appointments` | paciente, admin |
| `getMyAppointments` | `GET /api/appointments/me` | paciente |
| `getAll` | `GET /api/appointments` | admin |
| `getById` | `GET /api/appointments/:id` | admin |
| `updateStatus` | `PATCH /api/appointments/:id/status` | admin |
| `cancel` | `PATCH /api/appointments/:id/cancel` | paciente |
| `remove` | `DELETE /api/appointments/:id` | admin |

---

### `appointment.routes.js`

| Ruta | Método | Auth | Rol | Body / Query |
|---|---|---|---|---|
| `/` | POST | Sí | paciente, admin | `professionalId`, `date` (ISO), `time` (HH:MM), `notes?` |
| `/me` | GET | Sí | paciente | — |
| `/` | GET | Sí | admin | `?specialty=`, `?professional=`, `?status=` |
| `/:id` | GET | Sí | admin | — |
| `/:id/status` | PATCH | Sí | admin | `{ status: pendiente|confirmado|cancelado }` |
| `/:id/cancel` | PATCH | Sí | paciente | — |
| `/:id` | DELETE | Sí | admin | — |

---

## Lógica de control de agenda

### Detección de conflictos

Antes de crear un turno, `checkConflict` busca si ya existe un turno para el mismo profesional, fecha y hora con status distinto de `cancelado`.

```
professionalId + date + time → debe ser único (excluyendo cancelados)
```

### Flujo completo — crear turno (paciente)

```
Paciente → POST /api/appointments { professionalId, date, time, notes }
  → authenticate → authorize('paciente', 'admin')
  → validate (professionalId requerido, date ISO8601, time HH:MM)
  → appointment.controller.create
    → appointment.service.createAppointment(body, req.user.id)
      → professional.repository.findProfessionalById (verifica existencia)
      → appointment.repository.checkConflict (verifica disponibilidad)
      → appointment.repository.createAppointment
  ← 201 { turno creado con populate }
```

### Flujo — cancelar turno (paciente)

```
Paciente → PATCH /api/appointments/:id/cancel
  → authenticate → authorize('paciente')
  → appointment.controller.cancel
    → appointment.service.cancelAppointment(id, req.user.id)
      → findAppointmentById (verifica existencia)
      → verifica patient._id === req.user.id (403 si no coincide)
      → updateAppointmentStatus(id, 'cancelado')
  ← 200 { turno con status: cancelado }
```

---

## Filtros disponibles para admin

```
GET /api/appointments?specialty=Cardiología
GET /api/appointments?professional=<ObjectId>
GET /api/appointments?status=pendiente
GET /api/appointments?specialty=Pediatría&status=confirmado
```

Los filtros se combinan — se puede filtrar por múltiples campos simultáneamente.
