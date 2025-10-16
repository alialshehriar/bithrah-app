import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { userLevels, rewards, referralCodes } from '@/lib/db/rewards-schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id);

    // Get user basic info
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get user level
    const [level] = await db
      .select()
      .from(userLevels)
      .where(eq(userLevels.userId, userId))
      .limit(1);

    // Get referral code
    const [refCode] = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, userId))
      .limit(1);

    // Get recent rewards
    const userRewards = await db
      .select()
      .from(rewards)
      .where(eq(rewards.userId, userId))
      .orderBy(desc(rewards.createdAt))
      .limit(10);

    // Get recent activities (from existing user_activities table)
    const activities = await db.execute(`
      SELECT * FROM user_activities 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        role: user.role,
      },
      level: level || {
        level: 1,
        totalPoints: 0,
        rank: 'مبتدئ',
        badges: [],
        achievements: [],
      },
      referralCode: refCode?.code || null,
      rewards: userRewards,
      activities: activities || [],
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}

