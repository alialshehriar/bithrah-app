import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { packages, packageBackers } from '@/lib/db/packages-schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// GET /api/packages - Get packages for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'معرف المشروع مطلوب' }, { status: 400 });
    }

    const projectPackages = await db.query.packages.findMany({
      where: eq(packages.projectId, projectId),
      orderBy: (packages, { asc }) => [asc(packages.price)],
    });

    return NextResponse.json({
      success: true,
      packages: projectPackages,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الباقات' },
      { status: 500 }
    );
  }
}

// POST /api/packages - Create a new package
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const {
      projectId,
      type,
      title,
      description,
      price,
      rewardItems,
      deliveryDate,
      limitedQuantity,
      equityPercentage,
      contractTerms,
      profitSharingTerms,
      reportingFrequency,
      minimumInvestment,
    } = body;

    // Validate required fields
    if (!projectId || !type || !title || !description || !price) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // Validate package type
    if (type !== 'reward' && type !== 'bithrah_plus') {
      return NextResponse.json(
        { error: 'نوع الباقة غير صحيح' },
        { status: 400 }
      );
    }

    // For Bithrah Plus, validate equity percentage
    if (type === 'bithrah_plus') {
      if (!equityPercentage || parseFloat(equityPercentage) !== 2.0) {
        return NextResponse.json(
          { error: 'باقة بذرة بلس يجب أن تكون 2% بالضبط' },
          { status: 400 }
        );
      }
    }

    const packageId = nanoid();

    const [newPackage] = await db
      .insert(packages)
      .values({
        id: packageId,
        projectId,
        type,
        title,
        description,
        price: price.toString(),
        rewardItems: type === 'reward' ? JSON.stringify(rewardItems || []) : null,
        deliveryDate: type === 'reward' ? deliveryDate : null,
        limitedQuantity: type === 'reward' ? limitedQuantity : null,
        availableQuantity: type === 'reward' ? limitedQuantity : null,
        equityPercentage: type === 'bithrah_plus' ? '2.00' : null,
        contractTerms: type === 'bithrah_plus' ? contractTerms : null,
        profitSharingTerms: type === 'bithrah_plus' ? profitSharingTerms : null,
        reportingFrequency: type === 'bithrah_plus' ? reportingFrequency : null,
        minimumInvestment: type === 'bithrah_plus' ? minimumInvestment?.toString() : null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      package: newPackage,
      message: 'تم إنشاء الباقة بنجاح',
    });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الباقة' },
      { status: 500 }
    );
  }
}

