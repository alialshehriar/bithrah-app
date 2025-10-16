import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// GET - Get user's referral codes and stats
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const userId = payload.userId;

    const client = await pool.connect();
    try {
      // Get user's referral codes
      const codesResult = await client.query(
        `SELECT 
          rc.id,
          rc.uuid,
          rc.code,
          rc.type,
          rc.project_id,
          rc.commission_rate,
          rc.uses_count,
          rc.max_uses,
          rc.total_earned,
          rc.status,
          rc.expires_at,
          rc.created_at,
          p.title as project_title
        FROM referral_codes rc
        LEFT JOIN projects p ON rc.project_id = p.id
        WHERE rc.user_id = $1
        ORDER BY rc.created_at DESC`,
        [userId]
      );

      // Get referral history
      const referralsResult = await client.query(
        `SELECT 
          r.id,
          r.uuid,
          r.amount,
          r.commission_amount,
          r.commission_rate,
          r.status,
          r.paid_at,
          r.created_at,
          u.username as referred_username,
          u.email as referred_email,
          p.title as project_title,
          rc.code as referral_code
        FROM referrals r
        LEFT JOIN users u ON r.referred_user_id = u.id
        LEFT JOIN projects p ON r.project_id = p.id
        LEFT JOIN referral_codes rc ON r.referral_code_id = rc.id
        WHERE r.referrer_id = $1
        ORDER BY r.created_at DESC
        LIMIT 50`,
        [userId]
      );

      // Get summary stats
      const statsResult = await client.query(
        `SELECT 
          COUNT(DISTINCT r.id) as total_referrals,
          COUNT(DISTINCT r.referred_user_id) as unique_users,
          COALESCE(SUM(r.amount), 0) as total_amount,
          COALESCE(SUM(r.commission_amount), 0) as total_commissions,
          COALESCE(SUM(CASE WHEN r.status = 'paid' THEN r.commission_amount ELSE 0 END), 0) as paid_commissions,
          COALESCE(SUM(CASE WHEN r.status = 'pending' THEN r.commission_amount ELSE 0 END), 0) as pending_commissions
        FROM referrals r
        WHERE r.referrer_id = $1`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        codes: codesResult.rows,
        referrals: referralsResult.rows,
        stats: statsResult.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Referrals API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات الإحالات' },
      { status: 500 }
    );
  }
}

// POST - Generate new referral code
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const userId = payload.userId;

    const body = await request.json();
    const { type = 'general', projectId = null, commissionRate = 5.0 } = body;

    const client = await pool.connect();
    try {
      // Generate unique code
      const code = await generateUniqueCode(client);

      // Create referral code
      const result = await client.query(
        `INSERT INTO referral_codes (
          user_id,
          code,
          type,
          project_id,
          commission_rate,
          status
        ) VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *`,
        [userId, code, type, projectId, commissionRate]
      );

      return NextResponse.json({
        success: true,
        code: result.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create referral code error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء كود الإحالة' },
      { status: 500 }
    );
  }
}

async function generateUniqueCode(client: any): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    // Generate random 8-character code
    code = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Check if exists
    const result = await client.query(
      'SELECT COUNT(*) as count FROM referral_codes WHERE code = $1',
      [code]
    );

    exists = parseInt(result.rows[0].count) > 0;
  }

  return code!;
}

