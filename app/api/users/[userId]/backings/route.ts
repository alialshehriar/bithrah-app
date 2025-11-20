import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, backings, projects } from '@/lib/db/schema';
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

    // Get user's backings with project details
    const userBackings = await db
      .select({
        backing: backings,
        project: projects,
      })
      .from(backings)
      .leftJoin(projects, eq(backings.projectId, projects.id))
      .where(eq(backings.userId, user.id))
      .orderBy(desc(backings.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      backings: userBackings.map(b => ({
        ...b.backing,
        project: b.project,
      })),
    });
  } catch (error) {
    console.error('Error fetching user backings:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
