import { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';

export interface AuthPayload {
  sub: string;   // User ID
  role: string;  // 'USER' | 'ADMIN'
}

/**
 * Extracts and verifies the JWT access token from the request cookie.
 * Returns the decoded payload, or null if missing/invalid.
 */
export function getAuthPayload(req: NextRequest): AuthPayload | null {
  const token = req.cookies.get('accessToken')?.value;
  if (!token) return null;
  const decoded = verifyAccessToken(token);
  if (!decoded || !decoded.sub) return null;
  return { sub: decoded.sub, role: decoded.role };
}

/**
 * Returns a standardised 401 Unauthorized response body.
 */
export function unauthorizedResponse(message = 'Unauthorized: Please log in') {
  return { error: message };
}

/**
 * Returns a standardised 403 Forbidden response body.
 */
export function forbiddenResponse(message = 'Forbidden') {
  return { error: message };
}
