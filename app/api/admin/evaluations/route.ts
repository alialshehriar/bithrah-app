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
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    // Get all evaluations with user info
    const evaluations = await query(
      `SELECT 
        pe.*,
        u.name as user_name,
        u.email as user_email
      FROM project_evaluations pe
      LEFT JOIN users u ON pe.user_id = u.id
      ORDER BY pe.${sortBy} ${order}
      LIMIT $1`,
      [limit]
    );

    // Get statistics
    const stats = await query(
      `SELECT 
        COUNT(*) as total_evaluations,
        AVG(overall_score) as avg_score,
        MAX(overall_score) as max_score,
        MIN(overall_score) as min_score,
        COUNT(DISTINCT user_id) as unique_users
      FROM project_evaluations`
    );

    // Get top evaluations
    const topEvaluations = await query(
      `SELECT 
        pe.*,
        u.name as user_name,
        u.email as user_email
      FROM project_evaluations pe
      LEFT JOIN users u ON pe.user_id = u.id
      ORDER BY pe.overall_score DESC
      LIMIT 10`
    );

    // Get evaluations by category
    const byCategory = await query(
      `SELECT 
        category,
        COUNT(*) as count,
        AVG(overall_score) as avg_score
      FROM project_evaluations
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC`
    );

    return NextResponse.json({
      success: true,
      data: {
        evaluations: evaluations,
        stats: stats[0],
        topEvaluations: topEvaluations,
        byCategory: byCategory,
      },
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}

