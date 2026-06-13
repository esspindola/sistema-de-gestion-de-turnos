import * as professionalService from './professional.service.js';
import { successResponse } from '../../utils/response.util.js';

export async function getAll(req, res, next) {
  try {
    const professionals = await professionalService.getAllProfessionals(req.query.specialty);
    successResponse(res, professionals);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const professional = await professionalService.getProfessionalById(req.params.id);
    successResponse(res, professional);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const professional = await professionalService.createProfessional(req.body);
    successResponse(res, professional, 201);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const professional = await professionalService.updateProfessional(req.params.id, req.body);
    successResponse(res, professional);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await professionalService.deleteProfessional(req.params.id);
    successResponse(res, { message: 'Profesional eliminado' });
  } catch (err) {
    next(err);
  }
}
