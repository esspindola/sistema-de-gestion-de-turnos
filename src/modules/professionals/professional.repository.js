import { Professional } from './professional.model.js';

export async function findAllProfessionals(filters = {}) {
  return Professional.find(filters);
}

export async function findProfessionalById(id) {
  return Professional.findById(id);
}

export async function findProfessionalsBySpecialty(specialty) {
  return Professional.find({ specialty }).collation({ locale: 'es', strength: 1 });
}

export async function createProfessional(data) {
  return Professional.create(data);
}

export async function updateProfessional(id, data) {
  return Professional.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteProfessional(id) {
  return Professional.findByIdAndDelete(id);
}
