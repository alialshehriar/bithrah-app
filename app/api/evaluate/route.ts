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

    console.log('Evaluation completed!');
    console.log('Evaluation keys:', Object.keys(evaluation || {}));
    
    // Return full evaluation data with all expert perspectives
    return NextResponse.json({
      success: true,
      evaluation,
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
