import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

function getSecret(secret: string) {
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret(secret));
    return payload;
  } catch {
    return null;
  }
}

// Routes that require the user to be logged OUT
const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

// Routes that require the user to be logged IN
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const pathname = req.nextUrl.pathname;

  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? '';
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '';

  let decoded = accessToken ? await verifyToken(accessToken, ACCESS_SECRET) : null;

  // Try refresh token if access token is expired / missing
  if (!decoded && refreshToken) {
    const refreshDecoded = await verifyToken(refreshToken, REFRESH_SECRET);
    if (refreshDecoded) {
      decoded = refreshDecoded;
    }
  }

  const isLoggedIn = !!decoded;
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'));
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // ── Logged-in user trying to access auth pages → redirect to dashboard
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // ── Not logged in trying to access protected pages → redirect to login
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Logged in on a protected route — silently refresh access token if needed
  if (isLoggedIn && isProtectedRoute && !decoded) {
    const refreshDecoded = await verifyToken(refreshToken ?? '', REFRESH_SECRET);
    if (refreshDecoded) {
      const newAccess = await new SignJWT({ sub: refreshDecoded.sub, role: refreshDecoded.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(getSecret(ACCESS_SECRET));

      const res = NextResponse.next();
      res.cookies.set('accessToken', newAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      });
      return res;
    }
  }

  // ── Admin route — block non-admin users
  if (isLoggedIn && pathname.startsWith('/admin') && (decoded as any)?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all auth pages AND protected pages
  matcher: [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
