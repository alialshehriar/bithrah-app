import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const evaluationId = parseInt(params.id);

    const [evaluation] = await db
      .select()
      .from(evaluations)
      .where(
        and(
          eq(evaluations.id, evaluationId),
          eq(evaluations.userId, parseInt(session.user.id))
        )
      );

    if (!evaluation) {
      return NextResponse.json(
        { error: 'التقييم غير موجود' },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const parsedEvaluation = {
      ...evaluation,
      strengths: JSON.parse(evaluation.strengths || '[]'),
      weaknesses: JSON.parse(evaluation.weaknesses || '[]'),
      opportunities: JSON.parse(evaluation.opportunities || '[]'),
      risks: JSON.parse(evaluation.risks || '[]'),
      recommendations: JSON.parse(evaluation.recommendations || '[]'),
    };

    return NextResponse.json({
      success: true,
      evaluation: parsedEvaluation,
    });

  } catch (error) {
    console.error('Get evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluation' },
      { status: 500 }
    );
  }
}
