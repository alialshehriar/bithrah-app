import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { wallets, transactions } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const userId = parseInt(session.user.id);

    // Get wallet
    let wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    // Create wallet if doesn't exist
    if (!wallet) {
      [wallet] = await db.insert(wallets).values({
        userId,
        balance: '0',
      }).returning();
    }

    // Get recent transactions
    const recentTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: [desc(transactions.createdAt)],
      limit: 20,
    });

    return NextResponse.json({
      success: true,
      wallet,
      transactions: recentTransactions,
    });
  } catch (error) {
    console.error('Wallet fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المحفظة' },
      { status: 500 }
    );
  }
}

