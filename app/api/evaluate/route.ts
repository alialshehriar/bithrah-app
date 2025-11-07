import { NextRequest, NextResponse } from 'next/server';
import { evaluateIdea, SmartEvaluationInput } from '@/lib/ai/smartEvaluator';

export async function POST(request: NextRequest) {
  try {
    const body: SmartEvaluationInput = await request.json();

    // Validate required fields
    if (!body.idea || !body.problem || !body.targetAudience) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    console.log('[API] Starting evaluation for:', {
      hasProjectName: !!body.projectName,
      ideaLength: body.idea.length,
      hasSolution: !!body.solution,
      hasCompetitors: !!body.competitors,
    });

    const result = await evaluateIdea(body);

    console.log('[API] Evaluation completed successfully');

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error('[API] Evaluation error:', error);
    console.error('[API] Error name:', error.name);
    console.error('[API] Error message:', error.message);
    console.error('[API] Error stack:', error.stack);

    return NextResponse.json(
      { 
        error: error.message || 'حدث خطأ أثناء تقييم الفكرة',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
