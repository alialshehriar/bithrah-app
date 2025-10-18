import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wallets, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch all wallets with user info
    const allWallets = await db
      .select({
        id: wallets.id,
        userId: wallets.userId,
        balance: wallets.balance,
        totalDeposits: wallets.totalDeposits,
        totalWithdrawals: wallets.totalWithdrawals,
        status: wallets.status,
      })
      .from(wallets);

    // Get user info
    const userIds = allWallets.map(w => w.userId);
    const usersData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(sql`${users.id} = ANY(${userIds})`);

    const userMap = new Map(usersData.map(u => [u.id, { name: u.name || 'مستخدم', email: u.email }]));

    // Calculate stats
    const stats = {
      total: allWallets.length,
      totalBalance: allWallets.reduce((sum, w) => sum + parseFloat(w.balance || '0'), 0).toFixed(2),
      totalDeposits: allWallets.reduce((sum, w) => sum + parseFloat(w.totalDeposits || '0'), 0).toFixed(2),
      totalWithdrawals: allWallets.reduce((sum, w) => sum + parseFloat(w.totalWithdrawals || '0'), 0).toFixed(2),
    };

    // Format wallets data
    const formattedWallets = allWallets.map(wallet => {
      const user = userMap.get(wallet.userId);
      return {
        id: wallet.id.toString(),
        userName: user?.name || 'مستخدم',
        userEmail: user?.email || '',
        balance: wallet.balance || '0',
        totalDeposits: wallet.totalDeposits || '0',
        totalWithdrawals: wallet.totalWithdrawals || '0',
        status: wallet.status || 'active',
      };
    });

    return NextResponse.json({
      success: true,
      wallets: formattedWallets,
      stats,
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المحافظ' },
      { status: 500 }
    );
  }
}

