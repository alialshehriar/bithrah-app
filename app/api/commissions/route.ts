import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const userId = payload.userId;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    const client = await pool.connect();
    try {
      let query = `
        SELECT 
          c.id,
          c.uuid,
          c.type,
          c.source_type,
          c.source_id,
          c.amount,
          c.rate,
          c.base_amount,
          c.status,
          c.approved_at,
          c.paid_at,
          c.notes,
          c.created_at,
          CASE 
            WHEN c.source_type = 'backing' THEN (
              SELECT json_build_object(
                'project_title', p.title,
                'project_id', p.id
              )
              FROM backings b
              JOIN projects p ON b.project_id = p.id
              WHERE b.id = c.source_id
            )
            WHEN c.source_type = 'project' THEN (
              SELECT json_build_object(
                'project_title', p.title,
                'project_id', p.id
              )
              FROM projects p
              WHERE p.id = c.source_id
            )
          END as source_details
        FROM commissions c
        WHERE c.user_id = $1
      `;

      const params: any[] = [userId];

      if (status !== 'all') {
        query += ` AND c.status = $2`;
        params.push(status);
      }

      query += ` ORDER BY c.created_at DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const commissionsResult = await client.query(query, params);

      // Get summary stats
      const statsResult = await client.query(
        `SELECT 
          COUNT(*) as total_count,
          COALESCE(SUM(amount), 0) as total_amount,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_amount,
          COALESCE(SUM(CASE WHEN status = 'approved' THEN amount ELSE 0 END), 0) as approved_amount,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_amount
        FROM commissions
        WHERE user_id = $1`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        commissions: commissionsResult.rows,
        stats: statsResult.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Commissions API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات العمولات' },
      { status: 500 }
    );
  }
}

