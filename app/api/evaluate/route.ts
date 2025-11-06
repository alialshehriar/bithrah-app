import { NextRequest, NextResponse } from 'next/server';
import { evaluateIdea, IdeaEvaluationInput } from '@/lib/ai/ideaEvaluator';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Map old format to new format for backward compatibility
    const input: IdeaEvaluationInput = {
      title: data.title,
      description: data.description || `${data.problem}\n\n${data.solution}`,
      category: data.category,
      targetMarket: data.targetMarket || 'السوق السعودي',
      fundingGoal: parseFloat(data.fundingNeeded) || 500000,
      timeline: data.timeline || '12 شهر',
      teamSize: data.teamSize,
      existingTraction: data.existingTraction,
    };

    // Validate input
    if (!input.title || !input.description || !input.category) {
      return NextResponse.json(
        { error: 'يرجى تقديم جميع المعلومات المطلوبة' },
        { status: 400 }
      );
    }

    // Evaluate idea
    const evaluation = await evaluateIdea(input);

    // Transform new structure to old structure for frontend compatibility
    const transformedEvaluation = {
      overallScore: evaluation.overallScore,
      marketPotential: evaluation.marketOpportunity.marketSize,
      feasibility: evaluation.executionReadiness.timelineRealism,
      innovation: evaluation.strategicAnalyst.score,
      scalability: evaluation.marketOpportunity.growthPotential,
      financialViability: evaluation.financialViability.revenueModel,
      competitiveAdvantage: evaluation.marketOpportunity.competitiveAdvantage,
      
      // Combine strengths from all perspectives
      strengths: [
        ...evaluation.strategicAnalyst.strengths,
        ...evaluation.marketingExpert.strengths.slice(0, 2),
        ...evaluation.financialExpert.strengths.slice(0, 1),
      ],
      
      // Combine weaknesses from all perspectives
      weaknesses: [
        ...evaluation.strategicAnalyst.weaknesses,
        ...evaluation.operationsManager.weaknesses.slice(0, 2),
        ...evaluation.riskAnalyst.weaknesses.slice(0, 1),
      ],
      
      // Map opportunities (from strengths of market expert and marketing expert)
      opportunities: [
        ...evaluation.technicalAdvisor.strengths,
        ...evaluation.operationsManager.strengths.slice(0, 2),
      ],
      
      // Map threats (from weaknesses of risk analyst and financial expert)
      threats: [
        ...evaluation.riskAnalyst.weaknesses,
        ...evaluation.financialExpert.weaknesses.slice(0, 2),
      ],
      
      // Combine recommendations from all perspectives
      recommendations: [
        ...evaluation.immediateActions.slice(0, 3),
        ...evaluation.shortTermSteps.slice(0, 2),
      ],
      
      summary: `تقييم شامل للفكرة من 6 منظورات مختلفة. ${evaluation.strategicAnalyst.keyInsight}`,
      
      estimatedFunding: {
        min: Math.round(evaluation.estimatedFunding * 0.7),
        max: Math.round(evaluation.estimatedFunding * 1.3),
      },
      
      timeToMarket: input.timeline || '12 شهر',
      targetAudience: evaluation.targetAudience,
      keySuccessFactors: evaluation.keySuccessFactors,
    };

    return NextResponse.json({
      success: true,
      evaluation: transformedEvaluation
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التقييم' },
      { status: 500 }
    );
  }
}

