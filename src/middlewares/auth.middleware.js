import { verifyToken } from '../utils/jwt.util.js';

export function authenticate(req, res, next) {
  const cookieToken = req.cookies?.token;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  const token = cookieToken || headerToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requerido' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
}
