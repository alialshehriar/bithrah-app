import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { backings, projects, transactions, wallets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const projectId = parseInt(params.id);
    const { packageId, amount, message } = await request.json();

    // Get project details
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Get package details from project.packages
    const packages = project.packages as any[] || [];
    const selectedPackage = packages.find((pkg: any) => pkg.id === packageId);

    if (!selectedPackage) {
      return NextResponse.json(
        { success: false, error: 'الباقة غير موجودة' },
        { status: 404 }
      );
    }

    // Create transaction
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: user.id,
        type: 'payment',
        category: 'backing',
        amount: selectedPackage.price.toString(),
        currency: 'SAR',
        status: 'pending',
        relatedId: projectId,
        relatedType: 'project',
        description: `دعم مشروع: ${project.title}`,
      })
      .returning();

    // Create backing
    const [backing] = await db
      .insert(backings)
      .values({
        projectId,
        userId: user.id,
        transactionId: transaction.id,
        amount: selectedPackage.price.toString(),
        currency: 'SAR',
        packageId,
        packageDetails: selectedPackage,
        message,
        status: 'pending',
      })
      .returning();

    return NextResponse.json({
      success: true,
      backing,
      message: 'تم إنشاء طلب الدعم بنجاح. سيتم توجيهك لصفحة الدفع.',
      paymentUrl: `/payment/${transaction.id}`,
    });
  } catch (error) {
    console.error('Error creating backing:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}
