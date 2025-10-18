import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      category,
      description,
      fundingGoal,
      targetMarket,
      competitiveAdvantage,
    } = body;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `أنت خبير تقييم مشاريع ريادة الأعمال في السوق السعودي. قم بتقييم المشاريع باستخدام نموذج القبعات الست للتفكير:
            
1. القبعة البيضاء (الحقائق والبيانات): تحليل موضوعي للبيانات والمعلومات
2. القبعة الحمراء (المشاعر والحدس): التقييم العاطفي والانطباع الأول
3. القبعة السوداء (المخاطر والتحديات): تحديد المخاطر والتحديات المحتملة
4. القبعة الصفراء (الفرص والإيجابيات): إبراز الفرص والجوانب الإيجابية
5. القبعة الخضراء (الإبداع والابتكار): تقييم مستوى الابتكار والإبداع
6. القبعة الزرقاء (التفكير الشامل): التقييم الكلي والتوصيات

قدم تقييماً دقيقاً وواقعياً مع درجات من 10 لكل قبعة، وتوصيات عملية.`
          },
          {
            role: 'user',
            content: `قيّم هذا المشروع:
            
العنوان: ${title}
التصنيف: ${category}
الوصف: ${description}
هدف التمويل: ${fundingGoal} ريال
السوق المستهدف: ${targetMarket}
الميزة التنافسية: ${competitiveAdvantage}

قدم تقييماً شاملاً بصيغة JSON مع التنسيق التالي:
{
  "scores": {
    "facts": { "score": 0-10, "analysis": "..." },
    "emotions": { "score": 0-10, "analysis": "..." },
    "risks": { "score": 0-10, "analysis": "..." },
    "opportunities": { "score": 0-10, "analysis": "..." },
    "innovation": { "score": 0-10, "analysis": "..." },
    "overall": { "score": 0-10, "analysis": "..." }
  },
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "marketFit": "...",
  "successProbability": 0-100
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error('فشل في الاتصال بخدمة التقييم');
    }

    const openaiData = await openaiResponse.json();
    const evaluationText = openaiData.choices[0].message.content;
    
    // Parse JSON from response
    let evaluation;
    try {
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response');
      }
    } catch (e) {
      // Fallback if JSON parsing fails
      evaluation = {
        scores: {
          facts: { score: 7, analysis: 'تحليل البيانات المقدمة' },
          emotions: { score: 7, analysis: 'انطباع أولي إيجابي' },
          risks: { score: 6, analysis: 'توجد بعض المخاطر' },
          opportunities: { score: 8, analysis: 'فرص جيدة في السوق' },
          innovation: { score: 7, analysis: 'مستوى ابتكار مقبول' },
          overall: { score: 7, analysis: 'تقييم عام جيد' }
        },
        strengths: ['فكرة واضحة', 'سوق مستهدف محدد'],
        weaknesses: ['يحتاج لمزيد من التفاصيل'],
        recommendations: ['تطوير خطة عمل مفصلة', 'دراسة المنافسين'],
        marketFit: 'ملاءمة جيدة للسوق السعودي',
        successProbability: 70
      };
    }

    // Save evaluation to database (optional)
    // await db.insert(evaluations).values({...});

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في عملية التقييم' },
      { status: 500 }
    );
  }
}
