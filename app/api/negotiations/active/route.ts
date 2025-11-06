import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    
    // TODO: Get current user ID from session
    const currentUserId = 1;

    if (!projectId) {
      return NextResponse.json(
        { error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }

    const projectIdNum = parseInt(projectId);
    if (isNaN(projectIdNum)) {
      return NextResponse.json(
        { error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    // Find active negotiation for this project and user
    const activeNegotiation = await db.query.negotiations.findFirst({
      where: and(
        eq(negotiations.projectId, projectIdNum),
        eq(negotiations.investorId, currentUserId),
        eq(negotiations.status, 'active')
      )
    });

    if (!activeNegotiation) {
      return NextResponse.json({
        negotiation: null
      });
    }

    return NextResponse.json({
      negotiation: activeNegotiation
    });

  } catch (error) {
    console.error('Error checking active negotiation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التحقق من التفاوض' },
      { status: 500 }
    );
  }
}
