import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const {
      title,
      category,
      description,
      problem,
      solution,
      targetMarket,
      competitiveAdvantage,
      businessModel,
      fundingNeeded,
      timeline,
    } = data;

    // Create comprehensive prompt for GPT-4
    const prompt = `أنت خبير استثماري سعودي متخصص في تقييم الأفكار الاستثمارية. قم بتحليل الفكرة التالية بشكل شامل ودقيق:

**عنوان الفكرة:** ${title}
**التصنيف:** ${category}
**الوصف:** ${description}
**المشكلة:** ${problem}
**الحل:** ${solution}
**السوق المستهدف:** ${targetMarket}
**الميزة التنافسية:** ${competitiveAdvantage}
**نموذج العمل:** ${businessModel}
${fundingNeeded ? `**التمويل المطلوب:** ${fundingNeeded}` : ''}
${timeline ? `**الإطار الزمني:** ${timeline}` : ''}

قم بتقديم تقييم شامل يتضمن:

1. **التقييمات الرقمية** (من 0 إلى 100):
   - إمكانات السوق (Market Potential)
   - الجدوى (Feasibility)
   - الابتكار (Innovation)
   - قابلية التوسع (Scalability)
   - الجدوى المالية (Financial Viability)
   - الميزة التنافسية (Competitive Advantage)

2. **تحليل SWOT**:
   - نقاط القوة (3-5 نقاط)
   - نقاط الضعف (3-5 نقاط)
   - الفرص (3-5 نقاط)
   - التهديدات (3-5 نقاط)

3. **معلومات إضافية**:
   - ملخص تقييمي (جملة واحدة)
   - نطاق التمويل المقترح (حد أدنى وأعلى بالريال السعودي)
   - الوقت المتوقع للوصول للسوق
   - وصف دقيق للجمهور المستهدف
   - 5-7 توصيات عملية
   - 4-6 عوامل نجاح رئيسية

**مهم جداً:**
- كن دقيقاً وواقعياً في التقييم
- راعِ السوق السعودي والخليجي
- قدم تقييمات متوازنة (ليست كلها عالية أو منخفضة)
- التقييم الإجمالي يجب أن يكون متوسط التقييمات الستة
- استخدم اللغة العربية الفصحى

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي:

{
  "overallScore": number,
  "marketPotential": number,
  "feasibility": number,
  "innovation": number,
  "scalability": number,
  "financialViability": number,
  "competitiveAdvantage": number,
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", ...],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", ...],
  "opportunities": ["فرصة 1", "فرصة 2", ...],
  "threats": ["تهديد 1", "تهديد 2", ...],
  "recommendations": ["توصية 1", "توصية 2", ...],
  "summary": "ملخص تقييمي",
  "estimatedFunding": {
    "min": number,
    "max": number
  },
  "timeToMarket": "6-12 شهر",
  "targetAudience": "وصف الجمهور",
  "keySuccessFactors": ["عامل 1", "عامل 2", ...]
}`;

    // Call OpenAI API
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير استثماري سعودي متخصص في تقييم الأفكار الاستثمارية. تقدم تقييمات دقيقة وواقعية ومتوازنة. تستخدم اللغة العربية الفصحى وتراعي السوق السعودي والخليجي.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    const evaluationText = completion.choices[0].message.content;
    const evaluation = JSON.parse(evaluationText || '{}');

    // Save evaluation to database (optional - can be implemented later)
    // await db.insert(ideaEvaluations).values({
    //   title,
    //   category,
    //   description,
    //   evaluation: JSON.stringify(evaluation),
    //   createdAt: new Date(),
    // });

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error('Error evaluating idea:', error);
    
    // Return fallback evaluation if API fails
    const fallbackEvaluation = {
      overallScore: 70,
      marketPotential: 75,
      feasibility: 68,
      innovation: 72,
      scalability: 70,
      financialViability: 65,
      competitiveAdvantage: 70,
      strengths: [
        'فكرة مبتكرة تلبي حاجة حقيقية في السوق',
        'نموذج عمل واضح وقابل للتطبيق',
        'إمكانية توسع جيدة في المستقبل',
      ],
      weaknesses: [
        'قد تحتاج إلى تمويل كبير في المراحل الأولى',
        'المنافسة في السوق قد تكون شديدة',
        'يحتاج إلى فريق تقني متخصص',
      ],
      opportunities: [
        'السوق السعودي في نمو مستمر',
        'دعم حكومي للمشاريع التقنية',
        'إمكانية التوسع للأسواق الخليجية',
      ],
      threats: [
        'دخول منافسين كبار للسوق',
        'تغيرات في اللوائح والأنظمة',
        'صعوبة جذب المواهب المتخصصة',
      ],
      recommendations: [
        'ابدأ بنموذج أولي (MVP) لاختبار السوق',
        'ركز على بناء فريق قوي ومتخصص',
        'ابحث عن شراكات استراتيجية',
        'طور خطة تسويقية واضحة',
        'احرص على حماية الملكية الفكرية',
      ],
      summary: 'فكرة واعدة بإمكانات جيدة تحتاج إلى تخطيط دقيق وتنفيذ محكم',
      estimatedFunding: {
        min: 300000,
        max: 800000,
      },
      timeToMarket: '8-14 شهر',
      targetAudience: 'الشباب السعودي والمهتمين بالتقنية والابتكار',
      keySuccessFactors: [
        'جودة المنتج أو الخدمة',
        'فريق عمل متميز',
        'استراتيجية تسويق فعالة',
        'دعم مالي كافٍ',
        'شراكات استراتيجية',
      ],
    };

    return NextResponse.json({
      success: true,
      evaluation: fallbackEvaluation,
      note: 'تم استخدام تقييم افتراضي بسبب خطأ مؤقت',
    });
  }
}

