import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { packages, packageBackers } from '@/lib/db/packages-schema';
import { projects, wallets, transactions } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// POST /api/packages/[id]/back - Back a package
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const packageId = params.id;
    const body = await request.json();
    const { amount, paymentMethod } = body;

    // Get package details
    const packageData = await db.query.packages.findFirst({
      where: eq(packages.id, packageId),
    });

    if (!packageData) {
      return NextResponse.json({ error: 'الباقة غير موجودة' }, { status: 404 });
    }

    // Check if package is active
    if (!packageData.isActive) {
      return NextResponse.json({ error: 'الباقة غير متاحة' }, { status: 400 });
    }

    // Check quantity for reward packages
    if (packageData.type === 'reward' && packageData.limitedQuantity) {
      if ((packageData.availableQuantity || 0) <= 0) {
        return NextResponse.json({ error: 'الباقة نفذت' }, { status: 400 });
      }
    }

    // Check minimum investment for Bithrah Plus
    if (packageData.type === 'bithrah_plus' && packageData.minimumInvestment) {
      if (parseFloat(amount) < parseFloat(packageData.minimumInvestment)) {
        return NextResponse.json(
          { error: `الحد الأدنى للاستثمار هو ${packageData.minimumInvestment} ريال` },
          { status: 400 }
        );
      }
    }

    // Get user wallet
    const userWallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, session.user.id),
    });

    if (!userWallet) {
      return NextResponse.json({ error: 'المحفظة غير موجودة' }, { status: 404 });
    }

    // Check balance
    if (parseFloat(userWallet.balance) < parseFloat(amount)) {
      return NextResponse.json({ error: 'رصيد غير كافٍ' }, { status: 400 });
    }

    // Create transaction
    const transactionId = nanoid();
    await db.insert(transactions).values({
      id: transactionId,
      walletId: userWallet.id,
      type: 'withdrawal',
      amount: amount.toString(),
      description: `دعم باقة: ${packageData.title}`,
      status: 'completed',
    });

    // Update wallet balance
    await db
      .update(wallets)
      .set({
        balance: sql`${wallets.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, userWallet.id));

    // Create package backer
    const backerId = nanoid();
    const [backer] = await db
      .insert(packageBackers)
      .values({
        id: backerId,
        packageId,
        userId: session.user.id,
        projectId: packageData.projectId,
        amount: amount.toString(),
        paymentStatus: 'completed',
        equityOwned: packageData.type === 'bithrah_plus' ? packageData.equityPercentage : null,
      })
      .returning();

    // Update package stats
    await db
      .update(packages)
      .set({
        backerCount: sql`${packages.backerCount} + 1`,
        totalRaised: sql`${packages.totalRaised} + ${amount}`,
        availableQuantity:
          packageData.type === 'reward' && packageData.limitedQuantity
            ? sql`${packages.availableQuantity} - 1`
            : packageData.availableQuantity,
        updatedAt: new Date(),
      })
      .where(eq(packages.id, packageId));

    // Update project funding
    await db
      .update(projects)
      .set({
        currentFunding: sql`${projects.currentFunding} + ${amount}`,
        backerCount: sql`${projects.backerCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, packageData.projectId));

    return NextResponse.json({
      success: true,
      backer,
      message: packageData.type === 'bithrah_plus'
        ? 'تهانينا! أنت الآن شريك بنسبة 2% في المشروع 🎉'
        : 'شكراً لدعمك! 🎉',
    });
  } catch (error) {
    console.error('Error backing package:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء دعم الباقة' },
      { status: 500 }
    );
  }
}

