import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, description, fundingGoal, targetMarket, competitiveAdvantage } = body;

    // Validate required fields
    if (!title || !category || !description || !fundingGoal) {
      return NextResponse.json(
        { error: 'الرجاء ملء جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Call OpenAI API for evaluation
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'خدمة التقييم غير متوفرة حالياً' },
        { status: 500 }
      );
    }

    const prompt = `قيّم المشروع التالي بشكل شامل ومفصل:

العنوان: ${title}
التصنيف: ${category}
الوصف: ${description}
هدف التمويل: ${fundingGoal} ريال سعودي
السوق المستهدف: ${targetMarket || 'غير محدد'}
الميزة التنافسية: ${competitiveAdvantage || 'غير محددة'}

قدم تقييماً شاملاً يتضمن:
1. تقييم الابتكار (من 10): مدى ابتكار الفكرة وتميزها
2. جدوى السوق (من 10): حجم السوق والطلب المتوقع
3. الجدوى المالية (من 10): واقعية هدف التمويل والعائد المتوقع
4. قابلية التنفيذ (من 10): سهولة تنفيذ المشروع والموارد المطلوبة

قدم التقييم بصيغة JSON بالشكل التالي:
{
  "innovation": { "score": 0, "analysis": "..." },
  "marketFeasibility": { "score": 0, "analysis": "..." },
  "financialFeasibility": { "score": 0, "analysis": "..." },
  "executability": { "score": 0, "analysis": "..." },
  "overallScore": 0,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "recommendations": ["..."],
  "summary": "..."
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'أنت خبير في تقييم المشاريع الريادية والشركات الناشئة. قدم تقييمات دقيقة وموضوعية ومفيدة باللغة العربية.'
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

    if (!response.ok) {
      console.error('OpenAI API error:', await response.text());
      return NextResponse.json(
        { error: 'حدث خطأ أثناء التقييم' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const evaluationText = data.choices[0].message.content;

    // Parse JSON from response
    let evaluation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = evaluationText.match(/```json\n([\s\S]*?)\n```/) || 
                       evaluationText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, evaluationText];
      evaluation = JSON.parse(jsonMatch[1] || evaluationText);
    } catch (parseError) {
      console.error('Failed to parse evaluation:', parseError);
      return NextResponse.json(
        { error: 'حدث خطأ في معالجة التقييم' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      evaluation,
      project: {
        title,
        category,
        description,
        fundingGoal,
        targetMarket,
        competitiveAdvantage,
      },
    });

  } catch (error) {
    console.error('AI Evaluation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التقييم' },
      { status: 500 }
    );
  }
}

