import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { projects, investments, wallets, transactions, users } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);
    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { amount, packageId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'المبلغ غير صحيح' },
        { status: 400 }
      );
    }

    // Get project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'المشروع غير متاح للاستثمار حالياً' },
        { status: 400 }
      );
    }

    // Check if user is trying to invest in their own project
    if (project.creatorId === userId) {
      return NextResponse.json(
        { error: 'لا يمكنك الاستثمار في مشروعك الخاص' },
        { status: 400 }
      );
    }

    // Get user wallet
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, userId),
    });

    if (!wallet) {
      return NextResponse.json(
        { error: 'المحفظة غير موجودة' },
        { status: 404 }
      );
    }

    const walletBalance = parseFloat(wallet.balance);
    const investmentAmount = parseFloat(amount);

    if (walletBalance < investmentAmount) {
      return NextResponse.json(
        { error: 'رصيد المحفظة غير كافٍ' },
        { status: 400 }
      );
    }

    // Create investment
    const [newInvestment] = await db.insert(investments).values({
      projectId,
      investorId: userId,
      amount: amount.toString(),
      packageId: packageId || null,
      status: 'active',
    }).returning();

    // Update project funding
    await db
      .update(projects)
      .set({
        currentFunding: sql`${projects.currentFunding} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    // Update wallet balance
    await db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId));

    // Create transaction record
    await db.insert(transactions).values({
      userId,
      type: 'investment',
      amount: amount.toString(),
      status: 'completed',
      description: `استثمار في مشروع ${project.title}`,
      relatedId: newInvestment.id,
    });

    // Award points to investor
    await db
      .update(users)
      .set({
        points: sql`${users.points} + ${Math.floor(investmentAmount / 10)}`,
        experience: sql`${users.experience} + ${Math.floor(investmentAmount / 10)}`,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      investment: newInvestment,
      message: 'تم الاستثمار بنجاح',
    }, { status: 201 });
  } catch (error) {
    console.error('Investment error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الاستثمار' },
      { status: 500 }
    );
  }
}

