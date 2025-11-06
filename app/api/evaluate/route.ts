import { NextRequest, NextResponse } from 'next/server';
import { evaluateIdea } from '@/lib/ai/ideaEvaluator';

export async function POST(request: NextRequest) {
  try {
    console.log('=== AI Evaluation API Called ===');
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body).substring(0, 200));
    
    const {
      title,
      category,
      description,
      problem,
      solution,
      targetMarket,
      competitiveAdvantage,
      businessModel,
      funding,
      timeline,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Calling evaluateIdea with params...');
    // Combine all details into description for IdeaEvaluationInput
    const fullDescription = `${description}\n\nالمشكلة: ${problem || ''}\nالحل: ${solution || ''}\nالسوق المستهدف: ${targetMarket || ''}\nالميزة التنافسية: ${competitiveAdvantage || ''}\nنموذج العمل: ${businessModel || ''}`;
    
    const evaluation = await evaluateIdea({
      title,
      category,
      description: fullDescription,
      targetMarket,
      fundingGoal: funding ? parseInt(funding.replace(/[^0-9]/g, '')) : undefined,
      timeline,
    });

    console.log('Evaluation completed, transforming data...');
    console.log('Evaluation keys:', Object.keys(evaluation || {}));
    
    // Transform new structure to old structure for frontend compatibility
    const transformedEvaluation = {
      overallScore: evaluation.overallScore || 75,
      marketPotential: evaluation.strategicAnalyst?.score || 70,
      feasibility: evaluation.operationsManager?.score || 70,
      innovation: evaluation.saudiMarketExpert?.score || 70,
      scalability: evaluation.marketingExpert?.score || 70,
      financialViability: evaluation.financialExpert?.score || 70,
      competitiveAdvantage: evaluation.riskAnalyst?.score || 70,
      
      // Combine strengths from all perspectives
      strengths: [
        ...(evaluation.strategicAnalyst?.strengths || []),
        ...(evaluation.marketingExpert?.strengths?.slice(0, 2) || []),
        ...(evaluation.financialExpert?.strengths?.slice(0, 1) || []),
      ],
      
      // Combine weaknesses from all perspectives
      weaknesses: [
        ...(evaluation.strategicAnalyst?.weaknesses || []),
        ...(evaluation.operationsManager?.weaknesses?.slice(0, 2) || []),
        ...(evaluation.riskAnalyst?.weaknesses?.slice(0, 1) || []),
      ],
      
      // Map opportunities (from strengths of saudi market and operations)
      opportunities: [
        ...(evaluation.saudiMarketExpert?.strengths || []),
        ...(evaluation.operationsManager?.strengths?.slice(0, 2) || []),
      ],
      
      // Map threats (from weaknesses of risk and financial)
      threats: [
        ...(evaluation.riskAnalyst?.weaknesses || []),
        ...(evaluation.financialExpert?.weaknesses?.slice(0, 2) || []),
      ],
      
      // Combine recommendations from all perspectives
      recommendations: [
        ...(evaluation.immediateActions?.slice(0, 3) || []),
        ...(evaluation.shortTermSteps?.slice(0, 2) || []),
      ],
      
      summary: `تقييم شامل للفكرة من 6 منظورات مختلفة. ${evaluation.strategicAnalyst?.keyInsight || ''}`,
      
      estimatedFunding: {
        min: Math.round((evaluation.estimatedFunding || 500000) * 0.7),
        max: Math.round((evaluation.estimatedFunding || 500000) * 1.3),
      },
      
      timeToMarket: timeline || '12 شهر',
      
      keySuccessFactors: evaluation.keySuccessFactors || [
        'التركيز على احتياجات السوق',
        'بناء فريق قوي',
        'التنفيذ السريع',
      ],
      
      risks: evaluation.risks || [
        'المنافسة الشديدة',
        'التحديات التنظيمية',
        'صعوبة التمويل',
      ],
    };

    return NextResponse.json({
      success: true,
      evaluation: transformedEvaluation,
    });
  } catch (error: any) {
    console.error('=== AI Evaluation API Error ===');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to evaluate idea',
        details: error?.message || 'Unknown error',
        errorType: error?.constructor?.name || 'Unknown'
      },
      { status: 500 }
    );
  }
}
