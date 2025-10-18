import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_BASE = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, category, fundingGoal, targetMarket, competitiveAdvantage } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال عنوان ووصف المشروع' },
        { status: 400 }
      );
    }

    const prompt = `أنت خبير تقييم المشاريع والأفكار الريادية في السوق السعودي. قم بتقييم المشروع التالي بدقة واحترافية عالية:

**عنوان المشروع:** ${title}
**الوصف:** ${description}
**التصنيف:** ${category || 'غير محدد'}
**هدف التمويل:** ${fundingGoal || 'غير محدد'} ريال سعودي
**السوق المستهدف:** ${targetMarket || 'غير محدد'}
**الميزة التنافسية:** ${competitiveAdvantage || 'غير محددة'}

قم بتقييم المشروع من خلال "قبعات التفكير الست" لإدوارد دي بونو:
1. **القبعة البيضاء** (الحقائق والمعلومات): ما هي الحقائق والبيانات المتوفرة؟
2. **القبعة الحمراء** (المشاعر والحدس): ما هو الانطباع الأولي والمشاعر تجاه الفكرة؟
3. **القبعة السوداء** (التفكير الناقد): ما هي المخاطر والتحديات المحتملة؟
4. **القبعة الصفراء** (التفكير الإيجابي): ما هي الفوائد والفرص؟
5. **القبعة الخضراء** (الإبداع): ما هي الأفكار الإبداعية لتطوير المشروع؟
6. **القبعة الزرقاء** (التنظيم): ما هي الخطوات العملية التالية؟

قدم التقييم بصيغة JSON بالشكل التالي:
{
  "overallScore": رقم من 1 إلى 10,
  "innovationScore": رقم من 1 إلى 10,
  "marketViabilityScore": رقم من 1 إلى 10,
  "financialViabilityScore": رقم من 1 إلى 10,
  "executionFeasibilityScore": رقم من 1 إلى 10,
  "strengths": [قائمة بنقاط القوة],
  "weaknesses": [قائمة بنقاط الضعف],
  "opportunities": [قائمة بالفرص],
  "threats": [قائمة بالتهديدات],
  "recommendations": [قائمة بالتوصيات المفصلة],
  "nextSteps": [قائمة بالخطوات التالية]
}

تأكد من أن التقييم دقيق وواقعي ومبني على السوق السعودي.`;

    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير تقييم مشاريع ريادية متخصص في السوق السعودي. تقدم تقييمات دقيقة وواقعية ومفصلة باستخدام منهجية قبعات التفكير الست.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('فشل الاتصال بخدمة الذكاء الاصطناعي');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('فشل في استخراج التقييم');
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error: any) {
    console.error('AI Evaluation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ في التقييم' },
      { status: 500 }
    );
  }
}
