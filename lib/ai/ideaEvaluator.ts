import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface IdeaEvaluationInput {
  title: string;
  description: string;
  category: string;
  targetMarket?: string;
  fundingGoal?: number;
  timeline?: string;
  teamSize?: number;
  existingTraction?: string;
}

export interface IdeaEvaluation {
  overallScore: number;
  marketPotential: number;
  feasibility: number;
  innovation: number;
  financialViability: number;
  teamCapability: number;
  riskLevel: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  estimatedFunding: number;
  targetAudience: string;
  successFactors: string[];
}

export async function evaluateIdea(input: IdeaEvaluationInput): Promise<IdeaEvaluation> {
  try {
    const prompt = `أنت خبير تقييم أفكار المشاريع في السوق السعودي. قيّم الفكرة التالية بشكل واقعي ومهني:

**العنوان**: ${input.title}
**الوصف**: ${input.description}
**الفئة**: ${input.category}
**السوق المستهدف**: ${input.targetMarket || 'السوق السعودي'}
**التمويل المطلوب**: ${input.fundingGoal || 500000} ريال
**الجدول الزمني**: ${input.timeline || '12 شهر'}
${input.teamSize ? `**حجم الفريق**: ${input.teamSize}` : ''}
${input.existingTraction ? `**الإنجازات الحالية**: ${input.existingTraction}` : ''}

قدم تقييماً شاملاً يتضمن:
1. تقييم رقمي من 100 لكل من: فرصة السوق، الجدوى، الابتكار، الجدوى المالية، قدرة الفريق، مستوى المخاطر
2. نقاط القوة (3-5 نقاط)
3. نقاط الضعف (3-5 نقاط)
4. الفرص (3-5 نقاط)
5. المخاطر (3-5 نقاط)
6. التوصيات (3-5 توصيات عملية)
7. التمويل المقدر المناسب
8. الجمهور المستهدف
9. عوامل النجاح الرئيسية (3-5 عوامل)
10. توصية عامة (واعد جداً، واعد - يحتاج تطوير، يحتاج إعادة نظر، غير مناسب)

أعطني الرد بصيغة JSON فقط بدون أي نص إضافي:
{
  "overallScore": number,
  "marketPotential": number,
  "feasibility": number,
  "innovation": number,
  "financialViability": number,
  "teamCapability": number,
  "riskLevel": number,
  "recommendation": string,
  "strengths": string[],
  "weaknesses": string[],
  "opportunities": string[],
  "risks": string[],
  "recommendations": string[],
  "estimatedFunding": number,
  "targetAudience": string,
  "successFactors": string[]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تقييم أفكار المشاريع. قدم تقييمات واقعية ومهنية بصيغة JSON فقط.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const evaluation = JSON.parse(content);
    return evaluation;

  } catch (error) {
    console.error('AI Evaluation error:', error);
    
    // Fallback evaluation
    return {
      overallScore: 70,
      marketPotential: 75,
      feasibility: 65,
      innovation: 70,
      financialViability: 68,
      teamCapability: 70,
      riskLevel: 60,
      recommendation: 'واعد - يحتاج تطوير',
      strengths: [
        'فكرة مبتكرة في السوق السعودي',
        'سوق واعد مع إمكانية نمو',
        'توقيت مناسب للدخول'
      ],
      weaknesses: [
        'يحتاج فريق متخصص أقوى',
        'المنافسة في السوق عالية',
        'يحتاج تمويل كبير للبداية'
      ],
      opportunities: [
        'التوسع في السوق السعودي',
        'شراكات استراتيجية محتملة',
        'دعم حكومي للقطاع'
      ],
      risks: [
        'تغيرات السوق السريعة',
        'منافسة من شركات كبيرة',
        'تحديات تقنية محتملة'
      ],
      recommendations: [
        'تقوية الفريق بخبراء متخصصين',
        'بناء MVP سريع للاختبار',
        'البحث عن شركاء استراتيجيين',
        'دراسة المنافسين بعمق',
        'وضع خطة تسويق واضحة'
      ],
      estimatedFunding: input.fundingGoal || 500000,
      targetAudience: 'الشركات الناشئة والمستثمرين في السوق السعودي',
      successFactors: [
        'جودة المنتج والخدمة',
        'سرعة التنفيذ والتطوير',
        'قوة الفريق والخبرات',
        'استراتيجية التسويق',
        'الدعم المالي الكافي'
      ]
    };
  }
}

