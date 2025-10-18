import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { backings, projects, transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    const user = await verifySession(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const params = await context.params;
    const projectId = parseInt(params.id);
    const { packageId, message } = await request.json();

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

    // Create transaction with proper typing
    const transactionData = {
      userId: user.id,
      type: 'payment' as const,
      category: 'backing',
      amount: selectedPackage.price.toString(),
      currency: 'SAR',
      status: 'pending' as const,
      relatedId: projectId,
      relatedType: 'project',
      description: `دعم مشروع: ${project.title}`,
    };

    const [transaction] = await db
      .insert(transactions)
      .values(transactionData as any)
      .returning();

    // Create backing
    const backingData = {
      projectId,
      userId: user.id,
      transactionId: transaction.id,
      amount: selectedPackage.price.toString(),
      currency: 'SAR',
      packageId,
      packageDetails: selectedPackage,
      message,
      status: 'pending' as const,
    };

    const [backing] = await db
      .insert(backings)
      .values(backingData as any)
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

