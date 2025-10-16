import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1';

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
  // Middleware disabled - allow all routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

