import { Appointment } from './appointment.model.js';

export async function createAppointment(data) {
  return Appointment.create(data);
}

export async function findAppointmentById(id) {
  return Appointment.findById(id)
    .populate('patient', 'name email')
    .populate('professional', 'name specialty');
}

export async function findAppointmentsByPatient(patientId) {
  return Appointment.find({ patient: patientId })
    .populate('professional', 'name specialty')
    .sort({ date: -1 });
}

export async function findAllAppointments(filters = {}) {
  return Appointment.find(filters)
    .populate('patient', 'name email')
    .populate('professional', 'name specialty')
    .sort({ date: -1 });
}

export async function updateAppointmentStatus(id, status) {
  return Appointment.findByIdAndUpdate(id, { status }, { new: true });
}

export async function updateAppointment(id, data) {
  return Appointment.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteAppointment(id) {
  return Appointment.findByIdAndDelete(id);
}

export async function checkConflict(professionalId, date, time) {
  return Appointment.findOne({
    professional: professionalId,
    date,
    time,
    status: { $ne: 'cancelado' },
  });
}
