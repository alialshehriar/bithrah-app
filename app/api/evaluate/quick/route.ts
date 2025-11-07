import { NextRequest, NextResponse } from 'next/server';
import { evaluateQuickIdea } from '@/lib/ai/evaluator';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.idea || !body.problem || !body.targetAudience) {
      return NextResponse.json(
        { error: 'الرجاء تعبئة جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    const result = await evaluateQuickIdea(body);

    return NextResponse.json({ success: true, result });

  } catch (error: any) {
    console.error('Quick evaluation error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: `${error.name}: ${error.message}` || 'حدث خطأ أثناء تقييم الفكرة' },
      { status: 500 }
    );
  }
}
