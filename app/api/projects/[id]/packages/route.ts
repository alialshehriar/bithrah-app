import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportPackages } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';

// Hardcoded demo packages for exhibition
const DEMO_PACKAGES: Record<number, any[]> = {
  23: [
    {
      id: 1001,
      projectId: 23,
      name: 'الداعم المبكر',
      description: 'كن من أوائل الداعمين واحصل على شكر خاص',
      amount: 200,
      features: ['شكر خاص في المنصة', 'تحديثات حصرية عن المشروع'],
      maxBackers: 100,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 1002,
      projectId: 23,
      name: 'الداعم البرونزي',
      description: 'دعم أساسي مع مزايا إضافية',
      amount: 1000,
      features: ['جميع مزايا الداعم المبكر', 'وصول مبكر للمنتج', 'خصم 10% على الخدمات'],
      maxBackers: 50,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 1003,
      projectId: 23,
      name: 'الداعم الفضي',
      description: 'دعم متوسط مع مزايا حصرية',
      amount: 2500,
      features: ['جميع مزايا الداعم البرونزي', 'استشارة مجانية', 'خصم 15% على الخدمات'],
      maxBackers: 30,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 1004,
      projectId: 23,
      name: 'الداعم الذهبي',
      description: 'دعم كبير مع مزايا مميزة',
      amount: 7500,
      features: ['جميع مزايا الداعم الفضي', '3 استشارات مجانية', 'خصم 20% على الخدمات', 'ذكر في الشركاء'],
      maxBackers: 15,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  24: [
    {
      id: 2001,
      projectId: 24,
      name: 'الداعم المبكر',
      description: 'كن من أوائل الداعمين',
      amount: 200,
      features: ['شكر خاص', 'تحديثات حصرية'],
      maxBackers: 100,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2002,
      projectId: 24,
      name: 'الداعم البرونزي',
      description: 'دعم أساسي',
      amount: 1000,
      features: ['وصول مبكر', 'خصم 10%'],
      maxBackers: 50,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2003,
      projectId: 24,
      name: 'الداعم الفضي',
      description: 'دعم متوسط',
      amount: 2500,
      features: ['استشارة مجانية', 'خصم 15%'],
      maxBackers: 30,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2004,
      projectId: 24,
      name: 'الداعم الذهبي',
      description: 'دعم كبير',
      amount: 7500,
      features: ['3 استشارات', 'خصم 20%'],
      maxBackers: 15,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2005,
      projectId: 24,
      name: 'الشريك الاستراتيجي',
      description: 'شراكة استراتيجية',
      amount: 75000,
      features: ['شراكة كاملة', 'حصة في الأرباح'],
      maxBackers: 3,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  25: [
    {
      id: 3001,
      projectId: 25,
      name: 'الداعم المبكر',
      description: 'كن من أوائل الداعمين',
      amount: 200,
      features: ['شكر خاص', 'تحديثات حصرية'],
      maxBackers: 100,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3002,
      projectId: 25,
      name: 'الداعم البرونزي',
      description: 'دعم أساسي',
      amount: 1000,
      features: ['وصول مبكر', 'خصم 10%'],
      maxBackers: 50,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3003,
      projectId: 25,
      name: 'الداعم الفضي',
      description: 'دعم متوسط',
      amount: 2500,
      features: ['استشارة مجانية', 'خصم 15%'],
      maxBackers: 30,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3004,
      projectId: 25,
      name: 'الداعم الذهبي',
      description: 'دعم كبير',
      amount: 7500,
      features: ['3 استشارات', 'خصم 20%'],
      maxBackers: 15,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  26: [
    {
      id: 4001,
      projectId: 26,
      name: 'الداعم المبكر',
      description: 'كن من أوائل الداعمين',
      amount: 200,
      features: ['شكر خاص', 'تحديثات حصرية'],
      maxBackers: 100,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4002,
      projectId: 26,
      name: 'الداعم البرونزي',
      description: 'دعم أساسي',
      amount: 1000,
      features: ['وصول مبكر', 'خصم 10%'],
      maxBackers: 50,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4003,
      projectId: 26,
      name: 'الداعم الفضي',
      description: 'دعم متوسط',
      amount: 2500,
      features: ['استشارة مجانية', 'خصم 15%'],
      maxBackers: 30,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4004,
      projectId: 26,
      name: 'الداعم الذهبي',
      description: 'دعم كبير',
      amount: 7500,
      features: ['3 استشارات', 'خصم 20%'],
      maxBackers: 15,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4005,
      projectId: 26,
      name: 'الداعم البلاتيني',
      description: 'دعم متميز',
      amount: 15000,
      features: ['10 استشارات', 'خصم 30%'],
      maxBackers: 10,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4006,
      projectId: 26,
      name: 'الشريك الاستراتيجي',
      description: 'شراكة استراتيجية',
      amount: 75000,
      features: ['شراكة كاملة', 'حصة في الأرباح'],
      maxBackers: 3,
      currentBackers: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    // Try to get packages from database first
    let packages = await db
      .select()
      .from(supportPackages)
      .where(eq(supportPackages.projectId, projectId))
      .orderBy(asc(supportPackages.amount));

    // If no packages found in database, use hardcoded demo packages
    if (packages.length === 0 && DEMO_PACKAGES[projectId]) {
      packages = DEMO_PACKAGES[projectId];
    }

    return NextResponse.json({
      success: true,
      packages,
    });

  } catch (error) {
    console.error('Get packages error:', error);
    
    // On error, still try to return demo packages
    const projectId = parseInt(params.id);
    if (DEMO_PACKAGES[projectId]) {
      return NextResponse.json({
        success: true,
        packages: DEMO_PACKAGES[projectId],
      });
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الباقات' },
      { status: 500 }
    );
  }
}
