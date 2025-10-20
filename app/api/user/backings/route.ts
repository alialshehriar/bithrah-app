import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ success: true, backings: [] });
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const { db } = await import('@/lib/db');
    const { backings, projects } = await import('@/lib/db/schema');
    const { eq, desc } = await import('drizzle-orm');

    const userBackings = await db
      .select({
        id: backings.id,
        amount: backings.amount,
        createdAt: backings.createdAt,
        projectId: backings.projectId,
        projectTitle: projects.title,
        projectImage: projects.image,
      })
      .from(backings)
      .leftJoin(projects, eq(backings.projectId, projects.id))
      .where(eq(backings.userId, userId))
      .orderBy(desc(backings.createdAt));

    return NextResponse.json({
      success: true,
      backings: userBackings,
    });
  } catch (error) {
    console.error('Error fetching user backings:', error);
    return NextResponse.json({ success: true, backings: [] });
  }
}
