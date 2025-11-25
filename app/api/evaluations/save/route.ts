import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/db/schema';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      projectName,
      idea,
      problem,
      solution,
      targetAudience,
      competitors,
      category,
      score,
      strengths,
      weaknesses,
      opportunities,
      risks,
      recommendations,
      marketAnalysis,
      financialProjection,
    } = await request.json();

    if (!idea || !problem || !targetAudience) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const [newEvaluation] = await db
      .insert(evaluations)
      .values({
        userId: parseInt(session.user.id),
        projectName: projectName || null,
        idea,
        problem,
        solution: solution || null,
        targetAudience,
        competitors: competitors || null,
        category: category || null,
        score,
        strengths: JSON.stringify(strengths),
        weaknesses: JSON.stringify(weaknesses),
        opportunities: JSON.stringify(opportunities),
        risks: JSON.stringify(risks),
        recommendations: JSON.stringify(recommendations),
        marketAnalysis,
        financialProjection,
        createdAt: new Date(),
      } as any)
      .returning();

    return NextResponse.json({
      success: true,
      evaluation: newEvaluation,
    });

  } catch (error) {
    console.error('Save evaluation error:', error);
    return NextResponse.json(
      { error: 'فشل حفظ التقييم' },
      { status: 500 }
    );
  }
}
