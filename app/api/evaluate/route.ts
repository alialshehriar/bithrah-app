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

    return NextResponse.json({
      success: true,
      evaluation
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التقييم' },
      { status: 500 }
    );
  }
}

