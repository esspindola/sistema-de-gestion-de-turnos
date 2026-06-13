import * as appointmentService from './appointment.service.js';
import { successResponse } from '../../utils/response.util.js';

export async function create(req, res, next) {
  try {
    const appointment = await appointmentService.createAppointment(req.body, req.user.id);
    successResponse(res, appointment, 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyAppointments(req, res, next) {
  try {
    const appointments = await appointmentService.getMyAppointments(req.user.id);
    successResponse(res, appointments);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const appointments = await appointmentService.getAllAppointments(req.query);
    successResponse(res, appointments);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    successResponse(res, appointment);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body.status);
    successResponse(res, appointment);
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const appointment = await appointmentService.cancelAppointment(req.params.id, req.user.id);
    successResponse(res, appointment);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    successResponse(res, { message: 'Turno eliminado' });
  } catch (err) {
    next(err);
  }
}
