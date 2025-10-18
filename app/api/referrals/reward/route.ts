import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { neon } from '@neondatabase/serverless';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referredUserId, backingAmount } = body;

    if (!referredUserId || !backingAmount) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم ومبلغ الدعم مطلوبان' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Get referral record
    const referrals = await sql`
      SELECT 
        r.id, r.referrer_id, r.referred_id, r.status,
        u.subscription_tier
      FROM referrals r
      JOIN users u ON r.referrer_id = u.id
      WHERE r.referred_id = ${referredUserId}
    `;

    if (referrals.length === 0) {
      return NextResponse.json(
        { success: false, error: 'لا توجد إحالة لهذا المستخدم' },
        { status: 404 }
      );
    }

    const referral = referrals[0];

    // Calculate commission based on subscription tier
    // Plus tier: 5% commission on referral's first backing
    // Other tiers: 2% commission
    const commissionRate = referral.subscription_tier === 'bithrah_plus' ? 5.0 : 2.0;
    const commissionAmount = (parseFloat(backingAmount) * commissionRate) / 100;

    // Create commission record
    const commissionResult = await sql`
      INSERT INTO commissions (
        user_id, type, source_type, source_id,
        amount, rate, base_amount, status,
        created_at
      ) VALUES (
        ${referral.referrer_id},
        'referral',
        'backing',
        ${referredUserId},
        ${commissionAmount},
        ${commissionRate},
        ${backingAmount},
        'approved',
        NOW()
      )
      RETURNING id
    `;

    // Update referral status and commission
    await sql`
      UPDATE referrals
      SET 
        status = 'completed',
        commission_earned = commission_earned + ${commissionAmount},
        first_purchase_at = NOW(),
        rewarded_at = NOW(),
        updated_at = NOW()
      WHERE id = ${referral.id}
    `;

    // Update referrer's earnings
    await sql`
      UPDATE users
      SET 
        referral_earnings = referral_earnings + ${commissionAmount},
        updated_at = NOW()
      WHERE id = ${referral.referrer_id}
    `;

    // Get referrer's wallet
    const wallets = await sql`
      SELECT id FROM wallets WHERE user_id = ${referral.referrer_id}
    `;

    if (wallets.length > 0) {
      // Add commission to wallet balance
      await sql`
        UPDATE wallets
        SET 
          balance = balance + ${commissionAmount},
          total_earned = total_earned + ${commissionAmount},
          updated_at = NOW()
        WHERE id = ${wallets[0].id}
      `;

      // Create wallet transaction
      await sql`
        INSERT INTO wallet_transactions (
          wallet_id, type, category, amount, status,
          description, created_at
        ) VALUES (
          ${wallets[0].id},
          'credit',
          'referral',
          ${commissionAmount},
          'completed',
          'عمولة إحالة من دعم مستخدم جديد',
          NOW()
        )
      `;

      // Update commission with wallet_id
      await sql`
        UPDATE commissions
        SET wallet_id = ${wallets[0].id}
        WHERE id = ${commissionResult[0].id}
      `;
    }

    // Create notification for referrer
    try {
      await sql`
        INSERT INTO notifications (
          user_id, type, title, message, created_at
        ) VALUES (
          ${referral.referrer_id},
          'referral_reward',
          'مكافأة إحالة جديدة',
          ${`تم إضافة ${commissionAmount.toFixed(2)} ر.س إلى محفظتك كمكافأة إحالة`},
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'تم منح مكافأة الإحالة بنجاح',
      commission: {
        amount: commissionAmount.toFixed(2),
        rate: commissionRate,
        baseAmount: backingAmount
      }
    });
  } catch (error) {
    console.error('Error rewarding referral:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

