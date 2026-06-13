import * as userRepository from './user.repository.js';
import { hashPassword } from '../../utils/hash.util.js';

export async function getAllUsers() {
  return userRepository.findAllUsers();
}

export async function getUserById(id) {
  const user = await userRepository.findUserById(id);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

export async function updateUser(id, data) {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  const user = await userRepository.updateUser(id, data);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return user;
}

export async function deleteUser(id) {
  const user = await userRepository.deleteUser(id);
  if (!user) {
    const error = new Error('Usuario no encontrado');
    error.statusCode = 404;
    throw error;
  }
}
