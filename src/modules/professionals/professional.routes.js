import { Router } from 'express';
import { body } from 'express-validator';
import { getAll, getById, create, update, remove } from './professional.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Professionals
 *   description: Gestión de profesionales médicos
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Listar profesionales (filtrar por ?specialty=)
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de profesionales
 */
router.get('/', authenticate, getAll);

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Obtener profesional por ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesional encontrado
 */
router.get('/:id', authenticate, getById);

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Crear profesional (admin)
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, specialty, email]
 *             properties:
 *               name:
 *                 type: string
 *               specialty:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               availableDays:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Profesional creado
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty(),
    body('specialty').notEmpty(),
    body('email').isEmail(),
  ],
  validate,
  create
);

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Actualizar profesional (admin)
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesional actualizado
 */
router.put('/:id', authenticate, authorize('admin'), validate, update);

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Eliminar profesional (admin)
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profesional eliminado
 */
router.delete('/:id', authenticate, authorize('admin'), remove);

export default router;
