import { NextRequest, NextResponse } from 'next/server';
import { demoConfig } from '@/lib/demo-config';
import type { DemoWallet, DemoTransaction } from '@/types/demo-wallet';

// In-memory storage for demo wallets (in production, this would be in database)
const demoWallets = new Map<string, DemoWallet>();

/**
 * GET - Get user's demo wallet
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-1';
    
    // Get or create wallet
    let wallet = demoWallets.get(userId);
    
    if (!wallet) {
      // Create new wallet with initial credit
      const initialTransaction: DemoTransaction = {
        id: `txn_${Date.now()}_1`,
        userId,
        type: 'initial_credit',
        amount: demoConfig.wallet.initialCredit,
        balance: demoConfig.wallet.initialCredit,
        status: 'completed',
        description: 'رصيد تجريبي مبدئي',
        createdAt: new Date(),
      };
      
      wallet = {
        userId,
        balance: demoConfig.wallet.initialCredit,
        totalEarned: demoConfig.wallet.initialCredit,
        totalSpent: 0,
        transactions: [initialTransaction],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      demoWallets.set(userId, wallet);
    }
    
    return NextResponse.json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Error getting demo wallet:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المحفظة' },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a transaction (debit/credit)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-1', type, amount, description, metadata } = body;
    
    // Get wallet
    let wallet = demoWallets.get(userId);
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'المحفظة غير موجودة' },
        { status: 404 }
      );
    }
    
    // Check if sufficient balance for debit transactions
    if (amount < 0 && wallet.balance + amount < 0) {
      return NextResponse.json(
        { success: false, error: 'رصيد غير كافٍ' },
        { status: 400 }
      );
    }
    
    // Create transaction
    const transaction: DemoTransaction = {
      id: `txn_${Date.now()}_${wallet.transactions.length + 1}`,
      userId,
      type,
      amount,
      balance: wallet.balance + amount,
      status: 'completed',
      description,
      metadata,
      createdAt: new Date(),
    };
    
    // Update wallet
    wallet.balance += amount;
    wallet.transactions.unshift(transaction); // Add to beginning
    wallet.updatedAt = new Date();
    
    if (amount > 0) {
      wallet.totalEarned += amount;
    } else {
      wallet.totalSpent += Math.abs(amount);
    }
    
    demoWallets.set(userId, wallet);
    
    return NextResponse.json({
      success: true,
      transaction,
      wallet,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إنشاء المعاملة' },
      { status: 500 }
    );
  }
}

/**
 * PUT - Refund a transaction
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user-1', transactionId } = body;
    
    // Get wallet
    let wallet = demoWallets.get(userId);
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'المحفظة غير موجودة' },
        { status: 404 }
      );
    }
    
    // Find original transaction
    const originalTxn = wallet.transactions.find(t => t.id === transactionId);
    if (!originalTxn) {
      return NextResponse.json(
        { success: false, error: 'المعاملة غير موجودة' },
        { status: 404 }
      );
    }
    
    if (originalTxn.status === 'refunded') {
      return NextResponse.json(
        { success: false, error: 'المعاملة مستردة مسبقاً' },
        { status: 400 }
      );
    }
    
    // Create refund transaction
    const refundTransaction: DemoTransaction = {
      id: `txn_${Date.now()}_${wallet.transactions.length + 1}`,
      userId,
      type: 'refund',
      amount: -originalTxn.amount, // Reverse the amount
      balance: wallet.balance - originalTxn.amount,
      status: 'completed',
      description: `استرداد: ${originalTxn.description}`,
      metadata: {
        originalTransactionId: transactionId,
      },
      createdAt: new Date(),
    };
    
    // Update wallet
    wallet.balance -= originalTxn.amount;
    wallet.transactions.unshift(refundTransaction);
    wallet.updatedAt = new Date();
    
    // Mark original transaction as refunded
    originalTxn.status = 'refunded';
    originalTxn.refundedAt = new Date();
    
    demoWallets.set(userId, wallet);
    
    return NextResponse.json({
      success: true,
      refundTransaction,
      wallet,
    });
  } catch (error) {
    console.error('Error refunding transaction:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في استرداد المعاملة' },
      { status: 500 }
    );
  }
}

