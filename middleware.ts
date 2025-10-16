import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

// Routes that require authentication
const protectedRoutes = [
  '/home',
  '/dashboard',
  '/projects/create',
  '/communities/create',
  '/events/create',
  '/wallet',
  '/profile',
  '/settings',
  '/messages',
  '/achievements',
  '/investments',
  '/negotiations',
  '/admin',
];

// Routes that are only for guests (not logged in)
const guestOnlyRoutes = [
  '/auth/signin',
  '/auth/register',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie
  const token = request.cookies.get('bithrah-token')?.value;

  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch (error) {
      // Token is invalid or expired - delete it
      const response = NextResponse.next();
      response.cookies.delete('bithrah-token');
      isAuthenticated = false;
    }
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is guest only
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to signin if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to home if trying to access guest-only route while authenticated
  if (isGuestOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

