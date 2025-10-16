import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { projectTitle, description, category, fundingGoal } = await request.json();

    if (!projectTitle || !description) {
      return NextResponse.json(
        { success: false, error: 'Project title and description are required' },
        { status: 400 }
      );
    }

    // تقييم المشروع باستخدام GPT-4
    const prompt = `أنت خبير في تقييم المشاريع الناشئة والأفكار الريادية. قم بتقييم المشروع التالي بشكل شامل ودقيق:

**عنوان المشروع:** ${projectTitle}
**الوصف:** ${description}
**التصنيف:** ${category || 'غير محدد'}
**هدف التمويل:** ${fundingGoal ? fundingGoal + ' ريال' : 'غير محدد'}

قم بتقييم المشروع على المعايير التالية (من 0 إلى 10):
1. الابتكار والتميز
2. جدوى السوق
3. الجدوى المالية
4. قابلية التنفيذ
5. الفريق والخبرة
6. التأثير الاجتماعي
7. قابلية التوسع
8. المخاطر والتحديات
9. الميزة التنافسية
10. الاستدامة

قدم النتيجة بصيغة JSON التالية بالضبط:
{
  "overallScore": [الدرجة الإجمالية من 100],
  "criteria": [
    {"name": "الابتكار والتميز", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "جدوى السوق", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "الجدوى المالية", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "قابلية التنفيذ", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "الفريق والخبرة", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "التأثير الاجتماعي", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "قابلية التوسع", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "المخاطر والتحديات", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "الميزة التنافسية", "score": [الدرجة], "feedback": "[تعليق مختصر]"},
    {"name": "الاستدامة", "score": [الدرجة], "feedback": "[تعليق مختصر]"}
  ],
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"],
  "recommendations": ["توصية 1", "توصية 2", "توصية 3"],
  "summary": "ملخص شامل للتقييم في 2-3 جمل"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تقييم المشاريع الناشئة. قدم تقييمات دقيقة وموضوعية بصيغة JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // استخراج JSON من الرد
    let evaluation;
    try {
      // محاولة استخراج JSON من الرد
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        evaluation = JSON.parse(aiResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Failed to parse AI evaluation');
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('Error in AI evaluation:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to evaluate project',
      },
      { status: 500 }
    );
  }
}

