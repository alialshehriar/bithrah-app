import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ndaAgreements } from '@/lib/db/schema';
import { getNDAText } from '@/lib/access-control';
import { getSession } from '@/lib/auth';

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
    const { agreementType = 'platform', projectId } = body;
    
    // Check if already signed
    const existing = await db.query.ndaAgreements.findFirst({
      where: (nda, { and, eq }) =>
        and(
          eq(nda.userId, session.user.id),
          eq(nda.agreementType, agreementType),
          eq(nda.status, 'active'),
          projectId ? eq(nda.projectId, projectId) : undefined
        ),
    });
    
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'لقد وقعت بالفعل على اتفاقية عدم الإفشاء',
        agreement: existing,
      });
    }
    
    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Create NDA agreement
    const agreementText = getNDAText(agreementType);
    const agreementVersion = '1.0';
    
    const [agreement] = await db.insert(ndaAgreements).values({
      userId: session.user.id,
      projectId: projectId || null,
      agreementType,
      agreementVersion,
      agreementText,
      ipAddress,
      userAgent,
      signatureData: {
        timestamp: new Date().toISOString(),
        method: 'digital_acceptance',
      },
      status: 'active',
      signedAt: new Date(),
    }).returning();
    
    return NextResponse.json({
      success: true,
      message: 'تم توقيع اتفاقية عدم الإفشاء بنجاح',
      agreement,
    });
    
  } catch (error: any) {
    console.error('Error signing NDA:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء توقيع الاتفاقية', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }
    
    // Get user's NDA agreements
    const agreements = await db.query.ndaAgreements.findMany({
      where: (nda, { eq }) => eq(nda.userId, session.user.id),
      orderBy: (nda, { desc }) => [desc(nda.signedAt)],
    });
    
    return NextResponse.json({
      success: true,
      agreements,
    });
    
  } catch (error: any) {
    console.error('Error fetching NDAs:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الاتفاقيات', details: error.message },
      { status: 500 }
    );
  }
}

