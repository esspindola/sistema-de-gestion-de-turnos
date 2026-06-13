import { Router } from 'express';
import { body } from 'express-validator';
import {
  create,
  getMyAppointments,
  getAll,
  getById,
  updateStatus,
  cancel,
  remove,
} from './appointment.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Gestión de turnos médicos
 */

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crear turno (paciente)
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [professionalId, date, time]
 *             properties:
 *               professionalId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *                 example: "10:00"
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Turno creado
 *       409:
 *         description: Conflicto de horario
 */
router.post(
  '/',
  authenticate,
  authorize('paciente', 'admin'),
  [
    body('professionalId').notEmpty().withMessage('El profesional es requerido'),
    body('date').isISO8601().withMessage('Fecha inválida'),
    body('time').matches(/^\d{2}:\d{2}$/).withMessage('Hora inválida, usar formato HH:MM'),
  ],
  validate,
  create
);

/**
 * @swagger
 * /appointments/me:
 *   get:
 *     summary: Ver historial de turnos del paciente autenticado
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de turnos del paciente
 */
router.get('/me', authenticate, authorize('paciente'), getMyAppointments);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar todos los turnos (admin) con filtros opcionales
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *       - in: query
 *         name: professional
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendiente, confirmado, cancelado]
 *     responses:
 *       200:
 *         description: Lista de turnos
 */
router.get('/', authenticate, authorize('admin'), getAll);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Obtener turno por ID (admin)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno encontrado
 */
router.get('/:id', authenticate, authorize('admin'), getById);

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Cambiar estado del turno (admin)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, confirmado, cancelado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['pendiente', 'confirmado', 'cancelado'])],
  validate,
  updateStatus
);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancelar propio turno (paciente)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno cancelado
 */
router.patch('/:id/cancel', authenticate, authorize('paciente'), cancel);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Eliminar turno (admin)
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Turno eliminado
 */
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
