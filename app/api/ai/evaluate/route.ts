import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, fundingGoal, targetMarket, competitiveAdvantage } = body;

    if (!title || !description || !fundingGoal) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Create comprehensive prompt for AI evaluation
    const prompt = `أنت خبير في تقييم المشاريع الريادية والاستثمارية في السوق السعودي. قيّم المشروع التالي بدقة واحترافية:

**عنوان المشروع:** ${title}
**الوصف:** ${description}
**التصنيف:** ${category}
**هدف التمويل:** ${fundingGoal} ريال سعودي
**السوق المستهدف:** ${targetMarket || 'غير محدد'}
**الميزة التنافسية:** ${competitiveAdvantage || 'غير محددة'}

قدم تقييماً شاملاً ومفصلاً يتضمن:

1. **التقييم الإجمالي** (من 10): رقم دقيق يعكس جودة المشروع
2. **نقاط القوة** (3-5 نقاط): أهم نقاط القوة في المشروع
3. **نقاط الضعف** (3-5 نقاط): التحديات والمخاطر المحتملة
4. **التوصيات** (3-5 توصيات): نصائح عملية لتحسين المشروع
5. **تقييم تفصيلي** لكل من:
   - **الابتكار** (من 10): مدى ابتكارية الفكرة
   - **جدوى السوق** (من 10): حجم السوق والطلب
   - **الجدوى المالية** (من 10): واقعية التمويل والعوائد
   - **قابلية التنفيذ** (من 10): سهولة تنفيذ المشروع
   - **الميزة التنافسية** (من 10): قوة المشروع مقارنة بالمنافسين

**مهم جداً:**
- كن دقيقاً وواقعياً في التقييم
- راعِ خصوصية السوق السعودي
- قدم تقييماً متوازناً (ليس متفائلاً جداً ولا متشائماً جداً)
- استخدم أرقام دقيقة (مثل 7.5، 8.2) وليس أرقام تقريبية فقط

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي:
{
  "overallScore": رقم من 10,
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", ...],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", ...],
  "recommendations": ["توصية 1", "توصية 2", ...],
  "detailedScores": {
    "innovation": رقم من 10,
    "marketViability": رقم من 10,
    "financialViability": رقم من 10,
    "feasibility": رقم من 10,
    "competitiveAdvantage": رقم من 10
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تقييم المشاريع الريادية والاستثمارية في السوق السعودي. تقدم تقييمات دقيقة ومفصلة وواقعية.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const evaluationText = completion.choices[0].message.content;
    if (!evaluationText) {
      throw new Error('No evaluation received from AI');
    }

    const evaluation = JSON.parse(evaluationText);

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في التقييم. الرجاء المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

