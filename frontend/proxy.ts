import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

// Convert secret string to Uint8Array for jose
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

// Next.js 16 requires the function to be named 'proxy' (previously 'middleware')
export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const pathname = req.nextUrl.pathname;

  const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? '';
  const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? '';

  let decoded = accessToken ? await verifyToken(accessToken, ACCESS_SECRET) : null;

  // Try refresh if access token is expired / missing
  if (!decoded && refreshToken) {
    const refreshDecoded = await verifyToken(refreshToken, REFRESH_SECRET);
    if (refreshDecoded) {
      // Issue new access token inline
      const newAccess = await new SignJWT({ sub: refreshDecoded.sub, role: refreshDecoded.role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('15m')
        .sign(getSecret(ACCESS_SECRET));

      // Admin guard
      if (pathname.startsWith('/admin') && refreshDecoded.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

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

  // Not authenticated — redirect to login
  if (!decoded) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && (decoded as any).role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
