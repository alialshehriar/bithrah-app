import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Check if userId is a number (ID) or string (username)
    const isNumericId = /^\d+$/.test(userId);
    
    let user;
    if (isNumericId) {
      user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(userId))
      });
    } else {
      user = await db.query.users.findFirst({
        where: eq(users.username, userId)
      });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get user's projects
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.creatorId, user.id),
      orderBy: [desc(projects.createdAt)],
      limit: 50,
    });

    return NextResponse.json({
      success: true,
      projects: userProjects,
    });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
