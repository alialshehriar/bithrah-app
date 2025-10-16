import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { db } from '@/lib/db';
import { negotiations, negotiationGates, projects, users } from '@/lib/db/schema';
import { eq, and, or, desc, sql as drizzleSql } from 'drizzle-orm';

// GET - Get negotiation gate and negotiations for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    // Get negotiation gate
    const gateData = await db.select().from(negotiationGates)
      .where(eq(negotiationGates.projectId, projectId))
      .limit(1);

    if (gateData.length === 0) {
      return NextResponse.json({
        success: true,
        gate: null,
        negotiations: [],
      });
    }

    const gate = gateData[0];

    // Get negotiations for this project
    const negotiationsData = await db.select({
      id: negotiations.id,
      uuid: negotiations.uuid,
      status: negotiations.status,
      depositAmount: negotiations.depositAmount,
      depositStatus: negotiations.depositStatus,
      agreementReached: negotiations.agreementReached,
      agreedAmount: negotiations.agreedAmount,
      startDate: negotiations.startDate,
      endDate: negotiations.endDate,
      hasFullAccess: negotiations.hasFullAccess,
      createdAt: negotiations.createdAt,
      updatedAt: negotiations.updatedAt,
      investorName: users.username,
      investorEmail: users.email,
    })
      .from(negotiations)
      .leftJoin(users, eq(negotiations.investorId, users.id))
      .where(eq(negotiations.projectId, projectId))
      .orderBy(desc(negotiations.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      gate,
      negotiations: negotiationsData,
    });
  } catch (error) {
    console.error('Get negotiations error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في جلب بيانات التفاوض' },
      { status: 500 }
    );
  }
}

// POST - Create new negotiation request
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const session = await verifySession(request);
    const userId = session.id;
    const { id } = await params;
    const projectId = parseInt(id);

    const body = await request.json();
    const { depositAmount, message } = body;

    if (!depositAmount || depositAmount <= 0) {
      return NextResponse.json(
        { error: 'مبلغ الإيداع غير صحيح' },
        { status: 400 }
      );
    }

    // Check if negotiation gate exists and is open
    const gateData = await db.select().from(negotiationGates)
      .where(eq(negotiationGates.projectId, projectId))
      .limit(1);

    if (gateData.length === 0) {
      return NextResponse.json(
        { error: 'بوابة التفاوض غير موجودة' },
        { status: 404 }
      );
    }

    const gate = gateData[0];

    if (!gate.isOpen) {
      return NextResponse.json(
        { error: 'بوابة التفاوض مغلقة حالياً' },
        { status: 400 }
      );
    }

    // Check if user already has an active negotiation
    const existing = await db.select().from(negotiations)
      .where(
        and(
          eq(negotiations.projectId, projectId),
          eq(negotiations.investorId, userId),
          or(
            eq(negotiations.status, 'pending'),
            eq(negotiations.status, 'active')
          )
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'لديك طلب تفاوض نشط بالفعل' },
        { status: 400 }
      );
    }

    // Check max negotiators limit
    if (gate.maxNegotiators && gate.currentNegotiators >= gate.maxNegotiators) {
      return NextResponse.json(
        { error: 'تم الوصول للحد الأقصى من المفاوضين' },
        { status: 400 }
      );
    }

    // Create negotiation
    const newNegotiation = await db.insert(negotiations).values({
      projectId,
      investorId: userId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      depositAmount: (gate.depositAmount || depositAmount).toString(),
    }).returning();

    return NextResponse.json({
      success: true,
      negotiation: newNegotiation[0],
      message: 'تم إرسال طلب التفاوض بنجاح',
    });
  } catch (error) {
    console.error('Create negotiation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء طلب التفاوض' },
      { status: 500 }
    );
  }
}

