import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userEvaluations = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.userId, parseInt(session.user.id)))
      .orderBy(desc(evaluations.createdAt));

    // Parse JSON fields
    const parsedEvaluations = userEvaluations.map(evaluation => ({
      ...evaluation,
      strengths: JSON.parse(evaluation.strengths || '[]'),
      weaknesses: JSON.parse(evaluation.weaknesses || '[]'),
      opportunities: JSON.parse(evaluation.opportunities || '[]'),
      risks: JSON.parse(evaluation.risks || '[]'),
      recommendations: JSON.parse(evaluation.recommendations || '[]'),
    }));

    return NextResponse.json({
      success: true,
      evaluations: parsedEvaluations,
    });

  } catch (error) {
    console.error('Get evaluations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
}
