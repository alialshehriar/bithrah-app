import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations } from '@/lib/db/schema';
import { getSession } from '@/lib/auth';
import { getUserAccessLevel } from '@/lib/access-control';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { projectId } = body;
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }
    
    // Get project
    const project = await db.query.projects.findFirst({
      where: (projects, { eq }) => eq(projects.id, projectId),
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }
    
    // Check if negotiation is enabled
    if (!project.negotiationEnabled) {
      return NextResponse.json(
        { error: 'التفاوض غير متاح لهذا المشروع' },
        { status: 400 }
      );
    }
    
    // Check if user is the project creator
    if (project.creatorId === session.user.id) {
      return NextResponse.json(
        { error: 'لا يمكنك فتح تفاوض على مشروعك الخاص' },
        { status: 400 }
      );
    }
    
    // Check user's access level
    const accessLevel = await getUserAccessLevel(session.user.id, projectId, db);
    
    if (accessLevel !== 'registered') {
      return NextResponse.json(
        { error: 'يجب توقيع اتفاقية عدم الإفشاء أولاً' },
        { status: 403 }
      );
    }
    
    // Check if user already has an active negotiation
    const existingNegotiation = await db.query.negotiations.findFirst({
      where: (neg, { and, eq, or }) =>
        and(
          eq(neg.projectId, projectId),
          eq(neg.investorId, session.user.id),
          or(
            eq(neg.status, 'active'),
            eq(neg.status, 'pending')
          )
        ),
    });
    
    if (existingNegotiation) {
      return NextResponse.json(
        { error: 'لديك بالفعل تفاوض نشط على هذا المشروع' },
        { status: 400 }
      );
    }
    
    // Get deposit amount
    const depositAmount = project.negotiationDeposit || 1000; // Default 1000 SAR
    
    // Calculate negotiation end date (3 days from now)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);
    
    // Create negotiation request
    const [negotiation] = await db.insert(negotiations).values({
      projectId,
      investorId: session.user.id,
      depositAmount,
      depositStatus: 'pending', // Will be 'held' after payment
      status: 'pending', // Will be 'active' after deposit payment
      startDate,
      endDate,
      hasFullAccess: false, // Will be true after deposit payment
    }).returning();
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء طلب التفاوض بنجاح',
      negotiation,
      depositAmount,
      paymentRequired: true,
      expiresIn: '3 أيام',
    });
    
  } catch (error: any) {
    console.error('Error opening negotiation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء فتح بوابة التفاوض', details: error.message },
      { status: 500 }
    );
  }
}

// Confirm deposit payment and activate negotiation
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { negotiationId, paymentConfirmed } = body;
    
    if (!negotiationId || !paymentConfirmed) {
      return NextResponse.json(
        { error: 'معرف التفاوض وتأكيد الدفع مطلوبان' },
        { status: 400 }
      );
    }
    
    // Get negotiation
    const negotiation = await db.query.negotiations.findFirst({
      where: (neg, { eq }) => eq(neg.id, negotiationId),
    });
    
    if (!negotiation) {
      return NextResponse.json(
        { error: 'التفاوض غير موجود' },
        { status: 404 }
      );
    }
    
    if (negotiation.investorId !== session.user.id) {
      return NextResponse.json(
        { error: 'غير مصرح لك بهذا الإجراء' },
        { status: 403 }
      );
    }
    
    // Update negotiation status
    await db.update(negotiations)
      .set({
        status: 'active',
        depositStatus: 'held',
        hasFullAccess: true,
        updatedAt: new Date(),
      })
      .where((neg, { eq }) => eq(neg.id, negotiationId));
    
    return NextResponse.json({
      success: true,
      message: 'تم تفعيل التفاوض بنجاح. يمكنك الآن الوصول إلى جميع التفاصيل السرية',
      hasFullAccess: true,
    });
    
  } catch (error: any) {
    console.error('Error confirming negotiation payment:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تأكيد الدفع', details: error.message },
      { status: 500 }
    );
  }
}

