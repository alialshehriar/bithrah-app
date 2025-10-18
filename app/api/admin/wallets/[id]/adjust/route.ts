import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wallets, transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const walletId = parseInt(id);
    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || !reason) {
      return NextResponse.json(
        { success: false, error: 'Amount and reason are required' },
        { status: 400 }
      );
    }

    // Get current wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, walletId))
      .limit(1);

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Calculate new balance
    const newBalance = wallet.balance + amount;

    if (newBalance < 0) {
      return NextResponse.json(
        { success: false, error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Update wallet balance
    const [updatedWallet] = await db
      .update(wallets)
      .set({
        balance: newBalance,
        totalEarned: amount > 0 ? wallet.totalEarned + amount : wallet.totalEarned,
        totalSpent: amount < 0 ? wallet.totalSpent + Math.abs(amount) : wallet.totalSpent,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, walletId))
      .returning();

    // Create transaction record
    await db.insert(transactions).values({
      userId: wallet.userId,
      type: amount > 0 ? 'credit' : 'debit',
      amount: Math.abs(amount),
      status: 'completed',
      description: `تعديل يدوي من الإدارة: ${reason}`,
      metadata: {
        adminAdjustment: true,
        reason,
        previousBalance: wallet.balance,
        newBalance,
      },
    });

    return NextResponse.json({
      success: true,
      wallet: updatedWallet,
      message: 'Balance adjusted successfully',
    });
  } catch (error) {
    console.error('Error adjusting wallet balance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to adjust balance' },
      { status: 500 }
    );
  }
}

