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

    const client = await pool.connect();
    try {
      // Get wallet info
      const walletResult = await client.query(
        `SELECT 
          w.id,
          w.uuid,
          w.balance,
          w.pending_balance,
          w.total_earned,
          w.total_withdrawn,
          w.currency,
          w.status,
          w.is_sandbox,
          w.created_at,
          w.updated_at
        FROM wallets w
        WHERE w.user_id = $1`,
        [userId]
      );

      if (walletResult.rows.length === 0) {
        // Create wallet if doesn't exist
        const createResult = await client.query(
          `INSERT INTO wallets (user_id, balance, currency, status)
           VALUES ($1, 0.00, 'SAR', 'active')
           RETURNING *`,
          [userId]
        );
        
        return NextResponse.json({
          success: true,
          wallet: createResult.rows[0],
        });
      }

      const wallet = walletResult.rows[0];

      // Get recent transactions
      const transactionsResult = await client.query(
        `SELECT 
          id,
          uuid,
          type,
          amount,
          balance_before,
          balance_after,
          status,
          description,
          reference_type,
          reference_id,
          created_at
        FROM transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 10`,
        [userId]
      );

      // Get pending commissions
      const commissionsResult = await client.query(
        `SELECT 
          COUNT(*) as count,
          COALESCE(SUM(amount), 0) as total
        FROM commissions
        WHERE user_id = $1 AND status = 'pending'`,
        [userId]
      );

      // Get referral stats
      const referralStatsResult = await client.query(
        `SELECT 
          COUNT(*) as total_referrals,
          COALESCE(SUM(commission_amount), 0) as total_commissions
        FROM referrals
        WHERE referrer_id = $1`,
        [userId]
      );

      return NextResponse.json({
        success: true,
        wallet,
        recentTransactions: transactionsResult.rows,
        pendingCommissions: commissionsResult.rows[0],
        referralStats: referralStatsResult.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Wallet API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات المحفظة' },
      { status: 500 }
    );
  }
}

