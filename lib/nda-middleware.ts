import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Pages that don't require NDA
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/nda-agreement',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/pdfs',
];

// Check if path is public
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

// Check if user has signed NDA
export async function checkNDAStatus(userId: number): Promise<boolean> {
  try {
    // Import here to avoid circular dependencies
    const { db } = await import('@/lib/db');
    const { ndaAgreements } = await import('@/lib/db/schema');
    const { eq, and } = await import('drizzle-orm');

    const agreement = await db
      .select()
      .from(ndaAgreements)
      .where(
        and(
          eq(ndaAgreements.userId, userId),
          eq(ndaAgreements.status, 'active'),
          eq(ndaAgreements.isValid, true),
          eq(ndaAgreements.otpVerified, true)
        )
      )
      .limit(1);

    return agreement.length > 0;
  } catch (error) {
    console.error('Error checking NDA status:', error);
    return false;
  }
}

// Middleware function for NDA check
export async function ndaMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Get session
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to login
  if (!session?.user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check NDA status
  const userId = (session.user as any).id;
  const hasSignedNDA = await checkNDAStatus(userId);

  // If NDA not signed, redirect to NDA agreement page
  if (!hasSignedNDA) {
    const ndaUrl = new URL('/nda-agreement', request.url);
    return NextResponse.redirect(ndaUrl);
  }

  return NextResponse.next();
}

