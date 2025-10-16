import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifySession(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const userId = searchParams.get('userId');
    const activityType = searchParams.get('activityType');

    let queryText = `
      SELECT 
        ua.*,
        u.name as user_name,
        u.email as user_email
      FROM user_activities ua
      LEFT JOIN users u ON ua.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (userId) {
      queryText += ` AND ua.user_id = $${paramIndex}`;
      params.push(parseInt(userId));
      paramIndex++;
    }

    if (activityType) {
      queryText += ` AND ua.activity_type = $${paramIndex}`;
      params.push(activityType);
      paramIndex++;
    }

    queryText += ` ORDER BY ua.created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const activities = await query(queryText, params);

    // Get activity statistics
    const stats = await query(
      `SELECT 
        activity_type,
        COUNT(*) as count,
        COUNT(DISTINCT user_id) as unique_users
      FROM user_activities
      GROUP BY activity_type
      ORDER BY count DESC`
    );

    // Get hourly activity distribution
    const hourlyStats = await query(
      `SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM user_activities
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY hour
      ORDER BY hour`
    );

    return NextResponse.json({
      success: true,
      data: {
        activities: activities,
        stats: stats,
        hourlyStats: hourlyStats,
      },
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}

