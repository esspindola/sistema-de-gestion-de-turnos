import * as professionalRepository from './professional.repository.js';

export async function getAllProfessionals(specialty) {
  if (specialty) return professionalRepository.findProfessionalsBySpecialty(specialty);
  return professionalRepository.findAllProfessionals();
}

export async function getProfessionalById(id) {
  const professional = await professionalRepository.findProfessionalById(id);
  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return professional;
}

export async function createProfessional(data) {
  return professionalRepository.createProfessional(data);
}

export async function updateProfessional(id, data) {
  const professional = await professionalRepository.updateProfessional(id, data);
  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return professional;
}

export async function deleteProfessional(id) {
  const professional = await professionalRepository.deleteProfessional(id);
  if (!professional) {
    const error = new Error('Profesional no encontrado');
    error.statusCode = 404;
    throw error;
  }
}
