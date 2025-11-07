import { NextRequest, NextResponse } from 'next/server';
import { expandQuickIdea, QuickIdeaInput } from '@/lib/ai/quickIdeaExpander';

// Increase timeout for AI evaluation (max 60s for Pro plan)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.idea || !body.problem || !body.targetAudience) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const quickInput: QuickIdeaInput = {
      idea: body.idea,
      problem: body.problem,
      targetAudience: body.targetAudience,
      category: body.category,
    };

    // Call AI to expand the idea
    const expandedDetails = await expandQuickIdea(quickInput);

    return NextResponse.json({
      success: true,
      expandedDetails,
    });

  } catch (error) {
    console.error('Quick evaluation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحليل الفكرة' },
      { status: 500 }
    );
  }
}
