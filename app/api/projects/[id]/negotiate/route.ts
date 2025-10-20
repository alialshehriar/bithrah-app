import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, negotiations, wallets, transactions, users } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth/next';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const { proposedAmount } = await request.json();
    const projectId = parseInt(params.id);

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get project
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Check if negotiation is enabled
    if (!project.negotiationEnabled) {
      return NextResponse.json(
        { error: 'التفاوض غير متاح لهذا المشروع' },
        { status: 400 }
      );
    }

    // Check if user is project owner
    if (project.creatorId === user.id) {
      return NextResponse.json(
        { error: 'لا يمكنك التفاوض على مشروعك الخاص' },
        { status: 400 }
      );
    }

    // Check if user already has active negotiation
    const [existingNegotiation] = await db
      .select()
      .from(negotiations)
      .where(
        and(
          eq(negotiations.projectId, projectId),
          eq(negotiations.investorId, user.id),
          eq(negotiations.status, 'active')
        )
      )
      .limit(1);

    if (existingNegotiation) {
      return NextResponse.json(
        { error: 'لديك تفاوض نشط بالفعل على هذا المشروع' },
        { status: 400 }
      );
    }

    const depositAmount = parseFloat(project.negotiationDeposit?.toString() || '0');
    const amount = parseFloat(proposedAmount);

    // Validate proposed amount
    if (amount < depositAmount) {
      return NextResponse.json(
        { error: `المبلغ المقترح يجب أن يكون ${depositAmount} ${project.currency} على الأقل` },
        { status: 400 }
      );
    }

    // Get user wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, user.id))
      .limit(1);

    if (!wallet) {
      return NextResponse.json(
        { error: 'المحفظة غير موجودة' },
        { status: 404 }
      );
    }

    // Check balance
    const walletBalance = parseFloat(wallet.balance.toString());
    if (walletBalance < depositAmount) {
      return NextResponse.json(
        { error: 'رصيد المحفظة غير كافٍ لدفع مبلغ التأمين' },
        { status: 400 }
      );
    }

    // Create transaction for deposit
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        type: 'negotiation_deposit',
        amount: depositAmount.toString(),
        currency: project.currency,
        status: 'completed',
        description: `مبلغ تأمين للتفاوض على مشروع: ${project.title}`,
        metadata: {
          projectId: project.id,
          proposedAmount: amount,
        },
      })
      .returning();

    // Calculate negotiation period (5 days)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);

    // Create negotiation
    const [negotiation] = await db
      .insert(negotiations)
      .values({
        projectId: project.id,
        investorId: user.id,
        status: 'active',
        startDate,
        endDate,
        amount: amount.toString(),
        depositAmount: depositAmount.toString(),
        depositStatus: 'held',
        paymentStatus: 'pending',
        agreementReached: false,
        hasFullAccess: true,
        metadata: {
          proposedAmount: amount,
          depositTransactionId: transaction.id,
        },
      })
      .returning();

    // Update wallet - hold deposit
    await db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${depositAmount}`,
        pendingBalance: sql`${wallets.pendingBalance} + ${depositAmount}`,
        totalWithdrawals: sql`${wallets.totalWithdrawals} + ${depositAmount}`,
        totalTransactions: sql`${wallets.totalTransactions} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, user.id));

    return NextResponse.json({
      success: true,
      message: 'تم بدء التفاوض بنجاح',
      negotiation: {
        id: negotiation.id,
        uuid: negotiation.uuid,
        status: negotiation.status,
        startDate: negotiation.startDate,
        endDate: negotiation.endDate,
        amount: negotiation.amount,
        depositAmount: negotiation.depositAmount,
        hasFullAccess: negotiation.hasFullAccess,
      },
      transaction,
      newBalance: walletBalance - depositAmount,
    });

  } catch (error) {
    console.error('Negotiation start error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء بدء التفاوض' },
      { status: 500 }
    );
  }
}

// GET - Get user's negotiation for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get active negotiation
    const [negotiation] = await db
      .select()
      .from(negotiations)
      .where(
        and(
          eq(negotiations.projectId, projectId),
          eq(negotiations.investorId, user.id),
          eq(negotiations.status, 'active')
        )
      )
      .limit(1);

    return NextResponse.json({
      success: true,
      negotiation: negotiation || null,
    });

  } catch (error) {
    console.error('Get negotiation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات التفاوض' },
      { status: 500 }
    );
  }
}

