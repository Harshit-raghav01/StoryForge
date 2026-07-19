import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('JWT token secrets (JWT_ACCESS_SECRET and JWT_REFRESH_SECRET) must be set in environment variables');
}

export function signAccessToken(payload: object): string {
  return jwt.sign(payload, ACCESS_SECRET!, { expiresIn: '15m' });
}

export function signRefreshToken(payload: object): string {
  return jwt.sign(payload, REFRESH_SECRET!, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): any {
  try {
    return jwt.verify(token, ACCESS_SECRET!);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): any {
  try {
    return jwt.verify(token, REFRESH_SECRET!);
  } catch (error) {
    return null;
  }
}
