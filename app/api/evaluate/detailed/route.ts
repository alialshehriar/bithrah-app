import { NextRequest, NextResponse } from 'next/server';
import { evaluateDetailedIdea } from '@/lib/ai/evaluator';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.projectName || !body.idea || !body.problem || !body.solution || !body.targetAudience || !body.competitors) {
      return NextResponse.json(
        { error: 'الرجاء تعبئة جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const result = await evaluateDetailedIdea(body);

    return NextResponse.json({ success: true, result });

  } catch (error: any) {
    console.error('Detailed evaluation error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء تقييم المشروع' },
      { status: 500 }
    );
  }
}
