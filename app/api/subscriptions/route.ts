import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { subscriptionPlans, userSubscriptions } from '@/lib/db/packages-schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// GET /api/subscriptions - Get all subscription plans
export async function GET(request: NextRequest) {
  try {
    const plans = await db.query.subscriptionPlans.findMany({
      where: eq(subscriptionPlans.isActive, true),
      orderBy: (plans, { asc }) => [asc(plans.monthlyPrice)],
    });

    // If no plans exist, create default ones
    if (plans.length === 0) {
      const defaultPlans = [
        {
          id: nanoid(),
          name: 'مجاني',
          tier: 'free' as const,
          monthlyPrice: '0',
          yearlyPrice: '0',
          maxProjects: 1,
          maxCommunities: 1,
          maxEvents: 1,
          canCreateBithrahPlus: false,
          canNegotiate: false,
          prioritySupport: false,
          aiEvaluations: 3,
          color: '#3B82F6',
          icon: '🆓',
          badge: 'مجاني',
        },
        {
          id: nanoid(),
          name: 'فضي',
          tier: 'silver' as const,
          monthlyPrice: '99',
          yearlyPrice: '999',
          maxProjects: 5,
          maxCommunities: 3,
          maxEvents: 5,
          canCreateBithrahPlus: false,
          canNegotiate: true,
          prioritySupport: false,
          aiEvaluations: 10,
          color: '#9CA3AF',
          icon: '🥈',
          badge: 'فضي',
        },
        {
          id: nanoid(),
          name: 'ذهبي',
          tier: 'gold' as const,
          monthlyPrice: '299',
          yearlyPrice: '2999',
          maxProjects: 15,
          maxCommunities: 10,
          maxEvents: 15,
          canCreateBithrahPlus: true,
          canNegotiate: true,
          prioritySupport: true,
          aiEvaluations: 50,
          color: '#F59E0B',
          icon: '🥇',
          badge: 'ذهبي',
        },
        {
          id: nanoid(),
          name: 'بلاتيني',
          tier: 'platinum' as const,
          monthlyPrice: '999',
          yearlyPrice: '9999',
          maxProjects: 0, // unlimited
          maxCommunities: 0, // unlimited
          maxEvents: 0, // unlimited
          canCreateBithrahPlus: true,
          canNegotiate: true,
          prioritySupport: true,
          aiEvaluations: 0, // unlimited
          color: '#8B5CF6',
          icon: '💎',
          badge: 'بلاتيني',
        },
      ];

      await db.insert(subscriptionPlans).values(defaultPlans);
      
      return NextResponse.json({
        success: true,
        plans: defaultPlans,
      });
    }

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب خطط الاشتراك' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Subscribe to a plan
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, billingCycle } = body;

    if (!planId || !billingCycle) {
      return NextResponse.json(
        { error: 'معرف الخطة ودورة الفوترة مطلوبة' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    });

    if (!plan) {
      return NextResponse.json({ error: 'الخطة غير موجودة' }, { status: 404 });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    const nextBillingDate = new Date();

    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }

    const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

    // Create subscription
    const subscriptionId = nanoid();
    const [subscription] = await db
      .insert(userSubscriptions)
      .values({
        id: subscriptionId,
        userId: session.user.id,
        planId,
        status: 'active',
        billingCycle,
        startDate,
        endDate,
        nextBillingDate,
        amount,
        paymentMethod: 'wallet', // You can add payment gateway later
      })
      .returning();

    return NextResponse.json({
      success: true,
      subscription,
      message: `تم الاشتراك في خطة ${plan.name} بنجاح! 🎉`,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء الاشتراك' },
      { status: 500 }
    );
  }
}

