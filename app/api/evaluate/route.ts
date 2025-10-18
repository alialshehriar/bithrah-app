import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
);

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      userId = verified.payload.userId as number;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ideaTitle, ideaDescription, category, targetMarket } = body;

    if (!ideaTitle || !ideaDescription) {
      return NextResponse.json(
        { success: false, error: 'يرجى تقديم عنوان ووصف الفكرة' },
        { status: 400 }
      );
    }

    // Call OpenAI for evaluation
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { success: false, error: 'خدمة التقييم غير متوفرة حالياً' },
        { status: 500 }
      );
    }

    const prompt = `أنت مستشار أعمال خبير متخصص في تقييم الأفكار التجارية في السوق السعودي. قم بتقييم الفكرة التالية بدقة واحترافية:

**عنوان الفكرة:** ${ideaTitle}
**وصف الفكرة:** ${ideaDescription}
**الفئة:** ${category || 'غير محدد'}
**السوق المستهدف:** ${targetMarket || 'غير محدد'}

قم بتحليل الفكرة من خلال:

1. **التقييم العام** (من 10): قدم درجة دقيقة وواقعية
2. **نقاط القوة** (3-5 نقاط محددة)
3. **نقاط الضعف** (3-5 نقاط محددة)
4. **الفرص** (3-5 فرص في السوق)
5. **المخاطر** (3-5 مخاطر محتملة)
6. **التوصيات** (5-7 توصيات عملية)
7. **تحليل السوق** (فقرة شاملة عن السوق السعودي)
8. **التوقعات المالية** (تقدير أولي للإيرادات والتكاليف)

**مهم:** كن دقيقاً وواقعياً في التقييم. لا تبالغ في الإيجابية أو السلبية. ركز على السوق السعودي والثقافة المحلية.

قدم الإجابة بصيغة JSON التالية:
{
  "score": 7.5,
  "strengths": ["نقطة 1", "نقطة 2", ...],
  "weaknesses": ["نقطة 1", "نقطة 2", ...],
  "opportunities": ["فرصة 1", "فرصة 2", ...],
  "risks": ["مخاطرة 1", "مخاطرة 2", ...],
  "recommendations": ["توصية 1", "توصية 2", ...],
  "marketAnalysis": "تحليل شامل للسوق...",
  "financialProjection": "توقعات مالية أولية..."
}`;

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت مستشار أعمال خبير متخصص في تقييم الأفكار التجارية في السوق السعودي. تقدم تقييمات دقيقة وواقعية ومفصلة.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', await openaiResponse.text());
      return NextResponse.json(
        { success: false, error: 'فشل في تقييم الفكرة' },
        { status: 500 }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponseText = openaiData.choices[0].message.content;

    // Parse AI response
    let aiAnalysis;
    try {
      // Try to extract JSON from response
      const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return NextResponse.json(
        { success: false, error: 'فشل في معالجة نتيجة التقييم' },
        { status: 500 }
      );
    }

    // Save to database
    const { db } = await import('@/lib/db');
    const { ideaEvaluations } = await import('@/lib/db/schema');

    const [evaluation] = await db.insert(ideaEvaluations).values({
      userId,
      ideaTitle,
      ideaDescription,
      category: category || null,
      targetMarket: targetMarket || null,
      aiScore: aiAnalysis.score?.toString() || null,
      aiAnalysis: aiAnalysis,
      strengths: aiAnalysis.strengths || [],
      weaknesses: aiAnalysis.weaknesses || [],
      opportunities: aiAnalysis.opportunities || [],
      risks: aiAnalysis.risks || [],
      recommendations: aiAnalysis.recommendations || [],
      marketAnalysis: aiAnalysis.marketAnalysis || null,
      financialProjection: aiAnalysis.financialProjection || null,
      status: 'completed',
    } as any).returning();

    return NextResponse.json({
      success: true,
      evaluation: {
        id: evaluation.id,
        uuid: evaluation.uuid,
        score: aiAnalysis.score,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        opportunities: aiAnalysis.opportunities,
        risks: aiAnalysis.risks,
        recommendations: aiAnalysis.recommendations,
        marketAnalysis: aiAnalysis.marketAnalysis,
        financialProjection: aiAnalysis.financialProjection,
      }
    });

  } catch (error) {
    console.error('Evaluation API error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء التقييم' },
      { status: 500 }
    );
  }
}

// GET - Get user's evaluations
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول' },
        { status: 401 }
      );
    }

    let userId: number;
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      userId = verified.payload.userId as number;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    const { db } = await import('@/lib/db');
    const { ideaEvaluations } = await import('@/lib/db/schema');
    const { eq, desc } = await import('drizzle-orm');

    const evaluations = await db
      .select()
      .from(ideaEvaluations)
      .where(eq(ideaEvaluations.userId, userId))
      .orderBy(desc(ideaEvaluations.createdAt))
      .limit(20);

    return NextResponse.json({
      success: true,
      evaluations: evaluations.map(e => ({
        id: e.id,
        uuid: e.uuid,
        ideaTitle: e.ideaTitle,
        ideaDescription: e.ideaDescription,
        category: e.category,
        targetMarket: e.targetMarket,
        aiScore: e.aiScore,
        status: e.status,
        createdAt: e.createdAt,
      }))
    });

  } catch (error) {
    console.error('Get evaluations error:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب التقييمات' },
      { status: 500 }
    );
  }
}

