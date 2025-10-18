import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, payload.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
    
    const unreadCount = userNotifications.filter(n => !n.read).length;
    
    return NextResponse.json({ 
      notifications: userNotifications,
      unreadCount 
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'خطأ في جلب الإشعارات' }, { status: 500 });
  }
}
