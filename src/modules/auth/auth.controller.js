import { registerUser, loginUser } from './auth.service.js';
import { successResponse } from '../../utils/response.util.js';

const COOKIE_NAME = 'token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
};

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS);
    successResponse(res, { token: result.token, user: result.user }, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS);
    successResponse(res, { token: result.token, user: result.user });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'strict' });
  successResponse(res, { message: 'Sesión cerrada' });
}

export async function me(req, res) {
  successResponse(res, req.user);
}
