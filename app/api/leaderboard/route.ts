import { NextRequest, NextResponse } from 'next/server';

const sandboxLeaderboard = [
  {
    id: '1',
    name: 'أحمد محمد العلي',
    username: 'ahmed_ali',
    points: 15847,
    level: 12,
    rank: 1,
    avatar: '/avatars/user1.jpg',
    badge: 'نجم ذهبي',
  },
  {
    id: '2',
    name: 'فاطمة سعيد',
    username: 'fatima_said',
    points: 14523,
    level: 11,
    rank: 2,
    avatar: '/avatars/user2.jpg',
    badge: 'نجم فضي',
  },
  {
    id: '3',
    name: 'محمد خالد',
    username: 'mohammed_k',
    points: 13891,
    level: 11,
    rank: 3,
    avatar: '/avatars/user3.jpg',
    badge: 'نجم برونزي',
  },
  {
    id: '4',
    name: 'نورة أحمد',
    username: 'noura_a',
    points: 12456,
    level: 10,
    rank: 4,
    avatar: '/avatars/user4.jpg',
    badge: 'خبير',
  },
  {
    id: '5',
    name: 'عبدالله سالم',
    username: 'abdullah_s',
    points: 11234,
    level: 10,
    rank: 5,
    avatar: '/avatars/user5.jpg',
    badge: 'خبير',
  },
];

export async function GET(request: NextRequest) {
  try {
    const sandboxMode = request.cookies.get('sandbox-mode')?.value === 'true';
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (sandboxMode) {
      return NextResponse.json({
        success: true,
        users: sandboxLeaderboard.slice(0, limit),
        total: sandboxLeaderboard.length,
      });
    }

    // Real data from database
    const { db } = await import('@/lib/db');
    const { users } = await import('@/lib/db/schema');
    const { desc } = await import('drizzle-orm');

    const result = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        points: users.points,
        level: users.level,
        avatar: users.avatar,
      })
      .from(users)
      .orderBy(desc(users.points))
      .limit(limit);

    return NextResponse.json({
      success: true,
      users: result.map((user, index) => ({
        id: user.id.toString(),
        name: user.name || 'مستخدم',
        username: user.username || `user${user.id}`,
        points: user.points || 0,
        level: user.level || 1,
        rank: index + 1,
        avatar: user.avatar || '/avatars/default.jpg',
        badge: index === 0 ? 'نجم ذهبي' : index === 1 ? 'نجم فضي' : index === 2 ? 'نجم برونزي' : 'عضو',
      })),
      total: result.length,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب لوحة الصدارة' },
      { status: 500 }
    );
  }
}
