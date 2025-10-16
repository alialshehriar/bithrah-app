import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { platformEquityShares } from '@/lib/db/platform-packages-schema';
import { nanoid } from 'nanoid';

// POST /api/projects/create-with-package - Create project with platform package selection
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const {
      // Project details
      title,
      description,
      category,
      fundingGoal,
      duration,
      coverImage,
      // Platform package selection
      platformPackageId,
      platformPackageType,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !fundingGoal || !duration || !platformPackageId) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // Get platform package details
    const platformPackage = await db.query.platformPackages.findFirst({
      where: (packages, { eq }) => eq(packages.id, platformPackageId),
    });

    if (!platformPackage) {
      return NextResponse.json(
        { error: 'الباقة المختارة غير موجودة' },
        { status: 404 }
      );
    }

    // Calculate commission
    const commission = (parseFloat(fundingGoal) * parseFloat(platformPackage.commissionPercentage)) / 100;

    // Create project
    const projectId = nanoid();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(duration));

    const [project] = await db
      .insert(projects)
      .values({
        id: projectId,
        ownerId: session.user.id,
        title,
        description,
        category,
        fundingGoal: fundingGoal.toString(),
        currentFunding: '0',
        duration: parseInt(duration),
        endDate,
        coverImage: coverImage || '/default-project.jpg',
        status: 'pending', // Needs approval
        platformCommission: commission.toString(),
        platformPackageType: platformPackage.type,
      })
      .returning();

    // If Bithrah Plus, create equity share record
    if (platformPackage.type === 'bithrah_plus') {
      const equityId = nanoid();
      await db.insert(platformEquityShares).values({
        id: equityId,
        projectId,
        platformPackageId,
        equityPercentage: platformPackage.equityPercentage || '2.0',
        profitSharingTerms: 'حصة 2% من أرباح المشروع للمنصة مقابل الخدمات المتقدمة',
        reportingFrequency: 'quarterly',
        status: 'active',
      });
    }

    return NextResponse.json({
      success: true,
      project,
      message: platformPackage.type === 'bithrah_plus'
        ? 'تم إنشاء المشروع بنجاح! ستستفيد من عمولة 3% فقط + خدمات بذرة بلس المتقدمة 🎉'
        : 'تم إنشاء المشروع بنجاح! عمولة المنصة 6.5% 📦',
      packageInfo: {
        name: platformPackage.name,
        commission: `${platformPackage.commissionPercentage}%`,
        equity: platformPackage.equityPercentage ? `${platformPackage.equityPercentage}%` : null,
        features: JSON.parse(platformPackage.features),
      },
    });
  } catch (error) {
    console.error('Error creating project with package:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء المشروع' },
      { status: 500 }
    );
  }
}

