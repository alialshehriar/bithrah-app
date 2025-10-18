import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { achievements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    
    // Get all achievements for the current user
    const userAchievements = await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, session.id));
    
    return NextResponse.json({ achievements: userAchievements });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'خطأ في جلب الإنجازات' }, { status: 500 });
  }
}

