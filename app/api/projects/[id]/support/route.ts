import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, backings, wallets, transactions, supportPackages } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

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

    const { packageId, amount, message } = await request.json();
    const projectId = parseInt(params.id);

    // Get user
    const [user] = await db
      .select()
      .from(require('@/lib/db/schema').users)
      .where(eq(require('@/lib/db/schema').users.email, session.user.email))
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

    // Get package if specified
    let supportPackage = null;
    if (packageId) {
      [supportPackage] = await db
        .select()
        .from(supportPackages)
        .where(
          and(
            eq(supportPackages.id, packageId),
            eq(supportPackages.projectId, projectId)
          )
        )
        .limit(1);

      if (!supportPackage) {
        return NextResponse.json(
          { error: 'الباقة غير موجودة' },
          { status: 404 }
        );
      }

      // Check if package is full
      if (supportPackage.maxBackers && supportPackage.currentBackers >= supportPackage.maxBackers) {
        return NextResponse.json(
          { error: 'عذراً، هذه الباقة ممتلئة' },
          { status: 400 }
        );
      }
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
    const supportAmount = packageId ? parseFloat(supportPackage.amount.toString()) : amount;

    if (walletBalance < supportAmount) {
      return NextResponse.json(
        { error: 'رصيد المحفظة غير كافٍ' },
        { status: 400 }
      );
    }

    // Create transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        type: 'backing',
        amount: supportAmount.toString(),
        currency: 'SAR',
        status: 'completed',
        description: `دعم مشروع: ${project.title}`,
        metadata: {
          projectId: project.id,
          packageId: packageId || null,
          packageName: supportPackage?.name || null,
        },
      })
      .returning();

    // Create backing
    const [backing] = await db
      .insert(backings)
      .values({
        projectId: project.id,
        userId: user.id,
        transactionId: transaction.id,
        amount: supportAmount.toString(),
        currency: 'SAR',
        packageId: packageId ? packageId.toString() : null,
        packageDetails: supportPackage ? {
          name: supportPackage.name,
          description: supportPackage.description,
          features: supportPackage.features,
        } : null,
        message: message || null,
        status: 'confirmed',
      })
      .returning();

    // Update wallet balance
    await db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${supportAmount}`,
        totalWithdrawals: sql`${wallets.totalWithdrawals} + ${supportAmount}`,
        totalTransactions: sql`${wallets.totalTransactions} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, user.id));

    // Update project funding
    await db
      .update(projects)
      .set({
        currentFunding: sql`${projects.currentFunding} + ${supportAmount}`,
        backersCount: sql`${projects.backersCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId));

    // Update package backers count if applicable
    if (packageId && supportPackage) {
      await db
        .update(supportPackages)
        .set({
          currentBackers: sql`${supportPackages.currentBackers} + 1`,
        })
        .where(eq(supportPackages.id, packageId));
    }

    return NextResponse.json({
      success: true,
      message: 'تم الدعم بنجاح',
      backing,
      transaction,
      newBalance: walletBalance - supportAmount,
    });

  } catch (error) {
    console.error('Support error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء عملية الدعم' },
      { status: 500 }
    );
  }
}

