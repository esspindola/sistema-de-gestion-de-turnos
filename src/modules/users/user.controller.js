import * as userService from './user.service.js';
import { successResponse } from '../../utils/response.util.js';

export async function getAll(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    successResponse(res, users);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    successResponse(res, user);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await userService.deleteUser(req.params.id);
    successResponse(res, { message: 'Usuario eliminado' });
  } catch (err) {
    next(err);
  }
}
