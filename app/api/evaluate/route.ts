import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ideaEvaluations } from '@/lib/db/schema';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaTitle, ideaDescription, category, targetMarket, userId } = body;

    if (!ideaTitle || !ideaDescription) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create prompt for OpenAI
    const prompt = `قم بتقييم الفكرة التالية بشكل شامل ومهني:

العنوان: ${ideaTitle}
الوصف: ${ideaDescription}
${category ? `الفئة: ${category}` : ''}
${targetMarket ? `السوق المستهدف: ${targetMarket}` : ''}

قدم تقييماً شاملاً يتضمن:
1. نقاط القوة (3-5 نقاط)
2. نقاط الضعف (3-5 نقاط)
3. الفرص المتاحة (3-5 نقاط)
4. المخاطر المحتملة (3-5 نقاط)
5. التوصيات (5-7 توصيات عملية)
6. تحليل السوق (فقرة شاملة)
7. التوقعات المالية (فقرة شاملة)
8. درجة التقييم الإجمالية من 100

قدم الإجابة بصيغة JSON بالشكل التالي:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "opportunities": string[],
  "risks": string[],
  "recommendations": string[],
  "marketAnalysis": string,
  "financialProjection": string,
  "analysis": string
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تقييم الأفكار والمشاريع الريادية. قدم تقييمات دقيقة ومهنية باللغة العربية.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Save evaluation to database
    const [evaluation] = await db
      .insert(ideaEvaluations)
      .values({
        userId: userId || null,
        ideaTitle,
        ideaDescription,
        category: category || null,
        targetMarket: targetMarket || null,
        aiScore: result.score?.toString() || '0',
        aiAnalysis: result,
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        opportunities: result.opportunities || [],
        risks: result.risks || [],
        recommendations: result.recommendations || [],
        marketAnalysis: result.marketAnalysis || '',
        financialProjection: result.financialProjection || '',
        status: 'completed',
      })
      .returning();

    return NextResponse.json({
      success: true,
      evaluation: {
        id: evaluation.id,
        score: parseFloat(result.score || '0'),
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        opportunities: result.opportunities || [],
        risks: result.risks || [],
        recommendations: result.recommendations || [],
        marketAnalysis: result.marketAnalysis || '',
        financialProjection: result.financialProjection || '',
        analysis: result.analysis || '',
      },
    });
  } catch (error: any) {
    console.error('Error evaluating idea:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to evaluate idea' },
      { status: 500 }
    );
  }
}

