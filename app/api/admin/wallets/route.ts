import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wallets, users } from '@/lib/db/schema';
import { eq, like, or, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db
      .select({
        id: wallets.id,
        userId: wallets.userId,
        balance: wallets.balance,
        totalEarned: wallets.totalEarned,
        totalSpent: wallets.totalSpent,
        pendingAmount: wallets.pendingAmount,
        createdAt: wallets.createdAt,
        updatedAt: wallets.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(wallets)
      .leftJoin(users, eq(wallets.userId, users.id));

    // Apply search filter
    if (search) {
      query = query.where(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      ) as any;
    }

    query = query.orderBy(desc(wallets.balance)).limit(limit) as any;

    const allWallets = await query;

    // Calculate total balance
    const [totalBalanceResult] = await db
      .select({
        total: sql<number>`COALESCE(SUM(CAST(${wallets.balance} AS NUMERIC)), 0)`,
      })
      .from(wallets);

    return NextResponse.json({
      success: true,
      wallets: allWallets,
      total: allWallets.length,
      totalBalance: Math.round(Number(totalBalanceResult.total) || 0),
    });
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch wallets',
        wallets: [],
        totalBalance: 0,
      },
      { status: 500 }
    );
  }
}

