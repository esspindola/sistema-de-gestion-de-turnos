import { findUserByEmail, createUser } from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.util.js';
import { signToken } from '../../utils/jwt.util.js';

export async function registerUser(data) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 409;
    throw error;
  }

  const hashed = await hashPassword(data.password);
  const user = await createUser({ ...data, password: hashed });

  const token = signToken({ id: user._id, role: user.role });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: user._id, role: user.role });
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } };
}
