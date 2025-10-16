import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platformPackages } from '@/lib/db/platform-packages-schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// GET /api/platform-packages - Get all platform packages
export async function GET(request: NextRequest) {
  try {
    const packages = await db.query.platformPackages.findMany({
      where: eq(platformPackages.isActive, true),
      orderBy: (packages, { asc }) => [asc(packages.commissionPercentage)],
    });

    // If no packages exist, create default ones
    if (packages.length === 0) {
      const defaultPackages = [
        {
          id: nanoid(),
          name: 'Basic',
          type: 'basic' as const,
          commissionPercentage: '6.5',
          equityPercentage: null,
          features: JSON.stringify([
            'نشر المشروع على المنصة',
            'دعم فني قياسي',
            'إحصائيات أساسية',
            'نظام الدفع الآمن',
            'صفحة مشروع احترافية',
          ]),
          marketingSupport: false,
          consultingServices: false,
          freeAiEvaluations: 1,
          priorityListing: false,
          advancedSupport: false,
          detailedReports: false,
          dedicatedAccountManager: false,
          color: '#3B82F6',
          icon: '📦',
          badge: 'Basic',
        },
        {
          id: nanoid(),
          name: 'Bithrah Plus',
          type: 'bithrah_plus' as const,
          commissionPercentage: '3.0',
          equityPercentage: '2.0',
          features: JSON.stringify([
            'عمولة مخفضة 3% فقط',
            'شراكة 2% للمنصة في المشروع',
            'دعم تسويقي متقدم',
            'استشارات مجانية',
            'تقييم AI غير محدود',
            'أولوية في العرض',
            'دعم فني متقدم 24/7',
            'تقارير تفصيلية',
            'مدير حساب مخصص',
            'ترويج على وسائل التواصل',
          ]),
          marketingSupport: true,
          consultingServices: true,
          freeAiEvaluations: 0, // unlimited
          priorityListing: true,
          advancedSupport: true,
          detailedReports: true,
          dedicatedAccountManager: true,
          color: '#8B5CF6',
          icon: '💎',
          badge: 'Bithrah Plus',
        },
      ];

      await db.insert(platformPackages).values(defaultPackages);
      
      return NextResponse.json({
        success: true,
        packages: defaultPackages,
      });
    }

    return NextResponse.json({
      success: true,
      packages,
    });
  } catch (error) {
    console.error('Error fetching platform packages:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب باقات المنصة' },
      { status: 500 }
    );
  }
}

