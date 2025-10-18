import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ success: true, projects: [] });
    }

    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    const { db } = await import('@/lib/db');
    const { projects } = await import('@/lib/db/schema');
    const { eq, desc } = await import('drizzle-orm');

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.creatorId, userId))
      .orderBy(desc(projects.createdAt));

    return NextResponse.json({
      success: true,
      projects: userProjects,
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ success: true, projects: [] });
  }
}
