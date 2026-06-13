import * as appointmentRepository from './appointment.repository.js';
import { findProfessionalById } from '../professionals/professional.repository.js';

export async function createAppointment(data, patientId) {
  const appointmentDate = new Date(data.date);

  if (appointmentDate < new Date()) {
    const error = new Error('No se pueden agendar turnos en fechas pasadas');
    error.statusCode = 400;
    throw error;
  }

  if (appointmentDate.getDay() === 0) {
    const error = new Error('No se pueden agendar turnos los domingos');
    error.statusCode = 400;
    throw error;
  }

  const professional = await findProfessionalById(data.professionalId);
  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const conflict = await appointmentRepository.checkConflict(
    data.professionalId,
    appointmentDate,
    data.time
  );
  if (conflict) {
    const error = new Error('El profesional ya tiene un turno en ese horario');
    error.statusCode = 409;
    throw error;
  }

  return appointmentRepository.createAppointment({
    patient: patientId,
    professional: data.professionalId,
    specialty: professional.specialty,
    date: appointmentDate,
    time: data.time,
    notes: data.notes,
  });
}

export async function getMyAppointments(patientId) {
  return appointmentRepository.findAppointmentsByPatient(patientId);
}

export async function getAllAppointments(filters) {
  const query = {};
  if (filters.specialty) query.specialty = new RegExp(filters.specialty, 'i');
  if (filters.professional) query.professional = filters.professional;
  if (filters.status) query.status = filters.status;
  return appointmentRepository.findAllAppointments(query);
}

export async function getAppointmentById(id) {
  const appointment = await appointmentRepository.findAppointmentById(id);
  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return appointment;
}

export async function updateAppointmentStatus(id, status) {
  const appointment = await appointmentRepository.updateAppointmentStatus(id, status);
  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return appointment;
}

export async function cancelAppointment(id, patientId) {
  const appointment = await appointmentRepository.findAppointmentById(id);
  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  if (appointment.patient._id.toString() !== patientId) {
    const error = new Error('No tenés permiso para cancelar este turno');
    error.statusCode = 403;
    throw error;
  }
  return appointmentRepository.updateAppointmentStatus(id, 'cancelado');
}

export async function deleteAppointment(id) {
  const appointment = await appointmentRepository.deleteAppointment(id);
  if (!appointment) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
}
