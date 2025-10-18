import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const sql = neon(process.env.DATABASE_URL!);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || '';
    const read = searchParams.get('read');
    const offset = (page - 1) * limit;

    // Build WHERE clause
    let whereClause = `user_id = ${userId}`;
    
    if (type) {
      whereClause += ` AND type = '${type}'`;
    }

    if (read === 'true') {
      whereClause += ` AND read = true`;
    } else if (read === 'false') {
      whereClause += ` AND read = false`;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM notifications
      WHERE ${whereClause}
    `;
    const countResult = await sql(countQuery);
    const totalNotifications = parseInt(countResult[0].total);

    // Get notifications
    const notificationsQuery = `
      SELECT 
        id, user_id, type, title, message, link,
        read, created_at, read_at
      FROM notifications
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const notifications = await sql(notificationsQuery);

    // Get unread count
    const unreadResult = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId} AND read = false
    `;
    const unreadCount = parseInt(unreadResult[0].count);

    return NextResponse.json({
      success: true,
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        read: n.read,
        createdAt: n.created_at,
        readAt: n.read_at
      })),
      pagination: {
        page,
        limit,
        total: totalNotifications,
        totalPages: Math.ceil(totalNotifications / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const body = await request.json();
    const { notificationId, markAsRead, markAllAsRead } = body;

    const sql = neon(process.env.DATABASE_URL!);

    if (markAllAsRead) {
      // Mark all notifications as read
      await sql`
        UPDATE notifications
        SET read = true, read_at = NOW()
        WHERE user_id = ${userId} AND read = false
      `;

      return NextResponse.json({
        success: true,
        message: 'تم تحديد جميع التنبيهات كمقروءة'
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'معرف التنبيه مطلوب' },
        { status: 400 }
      );
    }

    // Mark single notification as read/unread
    await sql`
      UPDATE notifications
      SET 
        read = ${markAsRead !== false},
        read_at = ${markAsRead !== false ? sql`NOW()` : sql`NULL`}
      WHERE id = ${notificationId} AND user_id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: markAsRead !== false ? 'تم تحديد التنبيه كمقروء' : 'تم تحديد التنبيه كغير مقروء'
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');
    const deleteAll = searchParams.get('deleteAll') === 'true';

    const sql = neon(process.env.DATABASE_URL!);

    if (deleteAll) {
      // Delete all read notifications
      await sql`
        DELETE FROM notifications
        WHERE user_id = ${userId} AND read = true
      `;

      return NextResponse.json({
        success: true,
        message: 'تم حذف جميع التنبيهات المقروءة'
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'معرف التنبيه مطلوب' },
        { status: 400 }
      );
    }

    // Delete single notification
    await sql`
      DELETE FROM notifications
      WHERE id = ${notificationId} AND user_id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'تم حذف التنبيه بنجاح'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

