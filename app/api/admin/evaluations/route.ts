import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ideaEvaluations, users } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Fetch all evaluations with user info
    const evaluations = await db
      .select({
        id: ideaEvaluations.id,
        ideaTitle: ideaEvaluations.ideaTitle,
        ideaDescription: ideaEvaluations.ideaDescription,
        aiScore: ideaEvaluations.aiScore,
        strengths: ideaEvaluations.strengths,
        weaknesses: ideaEvaluations.weaknesses,
        opportunities: ideaEvaluations.opportunities,
        risks: ideaEvaluations.risks,
        recommendations: ideaEvaluations.recommendations,
        marketAnalysis: ideaEvaluations.marketAnalysis,
        financialProjection: ideaEvaluations.financialProjection,
        createdAt: ideaEvaluations.createdAt,
        userId: ideaEvaluations.userId,
        userName: users.name,
        status: ideaEvaluations.status,
      })
      .from(ideaEvaluations)
      .leftJoin(users, eq(ideaEvaluations.userId, users.id))
      .orderBy(desc(ideaEvaluations.createdAt));

    // Transform evaluations to match expected format
    const transformedEvaluations = evaluations.map(e => ({
      id: e.id.toString(),
      ideaTitle: e.ideaTitle,
      ideaDescription: e.ideaDescription,
      overallScore: parseFloat(e.aiScore || '0'),
      feasibilityScore: parseFloat(e.aiScore || '0'), // Using same score for now
      marketScore: parseFloat(e.aiScore || '0'),
      executionScore: parseFloat(e.aiScore || '0'),
      innovationScore: parseFloat(e.aiScore || '0'),
      riskScore: 100 - parseFloat(e.aiScore || '0'), // Inverse of score
      analysis: e.marketAnalysis || '',
      recommendations: e.recommendations?.join('\n') || '',
      createdAt: e.createdAt?.toISOString() || new Date().toISOString(),
      userId: e.userId?.toString() || '',
      userName: e.userName || 'مستخدم',
    }));

    return NextResponse.json({
      success: true,
      evaluations: transformedEvaluations,
    });
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluations' },
      { status: 500 }
    );
  }
}

