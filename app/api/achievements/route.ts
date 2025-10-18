import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { achievements, userAchievements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('bithrah-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    
    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }
    
    const allAchievements = await db.select().from(achievements);
    const userAchievementsData = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, payload.userId));
    
    const achievementsWithStatus = allAchievements.map(achievement => ({
      ...achievement,
      unlocked: userAchievementsData.some(ua => ua.achievementId === achievement.id),
    }));
    
    return NextResponse.json({ achievements: achievementsWithStatus });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'خطأ في جلب الإنجازات' }, { status: 500 });
  }
}
