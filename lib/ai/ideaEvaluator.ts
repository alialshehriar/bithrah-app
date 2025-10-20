import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

export interface IdeaEvaluationInput {
  title: string;
  description: string;
  category: string;
  targetMarket: string;
  fundingGoal: number;
  timeline: string;
  teamSize?: number;
  existingTraction?: string;
}

export interface PerspectiveAnalysis {
  perspective: string;
  icon: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyInsights: string;
}

export interface IdeaEvaluationResult {
  overallScore: number;
  overallGrade: string;
  summary: string;
  perspectives: PerspectiveAnalysis[];
  marketOpportunity: {
    score: number;
    saudiMarketFit: number;
    competitiveAdvantage: string;
    marketSize: string;
    growthPotential: string;
  };
  financialViability: {
    score: number;
    fundingRealism: string;
    revenueModel: string;
    breakEvenEstimate: string;
    riskLevel: string;
  };
  executionReadiness: {
    score: number;
    teamStrength: string;
    timelineRealism: string;
    resourceRequirements: string;
    criticalRisks: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  successProbability: number;
  investmentRecommendation: string;
}

const PERSPECTIVES = [
  {
    name: 'المحلل الاستراتيجي',
    icon: '🎯',
    role: 'تحليل الاستراتيجية العامة وفرص السوق',
    focus: 'الرؤية الاستراتيجية، التموضع في السوق، الميزة التنافسية',
  },
  {
    name: 'الخبير المالي',
    icon: '💰',
    role: 'تقييم الجدوى المالية والاستثمارية',
    focus: 'نموذج الإيرادات، التكاليف، العائد على الاستثمار، المخاطر المالية',
  },
  {
    name: 'خبير السوق السعودي',
    icon: '🇸🇦',
    role: 'تقييم الملاءمة للسوق السعودي',
    focus: 'الثقافة المحلية، الأنظمة، سلوك المستهلك السعودي، الفرص المحلية',
  },
  {
    name: 'مدير العمليات',
    icon: '⚙️',
    role: 'تقييم قابلية التنفيذ والعمليات',
    focus: 'الموارد، الجدول الزمني، الفريق، المتطلبات التشغيلية',
  },
  {
    name: 'خبير التسويق',
    icon: '📢',
    role: 'تحليل استراتيجية التسويق والنمو',
    focus: 'الجمهور المستهدف، قنوات التسويق، استراتيجية النمو، العلامة التجارية',
  },
  {
    name: 'محلل المخاطر',
    icon: '⚠️',
    role: 'تحديد وتقييم المخاطر المحتملة',
    focus: 'المخاطر التنافسية، التنظيمية، التشغيلية، المالية',
  },
];

export async function evaluateIdea(input: IdeaEvaluationInput): Promise<IdeaEvaluationResult> {
  try {
    // Build comprehensive evaluation prompt
    const evaluationPrompt = `أنت خبير تقييم مشاريع ريادة الأعمال متخصص في السوق السعودي. قم بتقييم الفكرة التالية بدقة واحترافية عالية:

**معلومات المشروع:**
- العنوان: ${input.title}
- الوصف: ${input.description}
- الفئة: ${input.category}
- السوق المستهدف: ${input.targetMarket}
- هدف التمويل: ${input.fundingGoal.toLocaleString('ar-SA')} ريال
- الجدول الزمني: ${input.timeline}
${input.teamSize ? `- حجم الفريق: ${input.teamSize} أفراد` : ''}
${input.existingTraction ? `- الإنجازات الحالية: ${input.existingTraction}` : ''}

**المطلوب:**
قم بتحليل شامل من 6 منظورات مختلفة (المحلل الاستراتيجي، الخبير المالي، خبير السوق السعودي، مدير العمليات، خبير التسويق، محلل المخاطر).

لكل منظور، قدم:
1. تقييم من 100 (كن دقيقاً وواقعياً)
2. 3-5 نقاط قوة محددة
3. 3-5 نقاط ضعف أو تحديات
4. 3-5 توصيات عملية قابلة للتنفيذ
5. رؤية رئيسية واحدة (جملة واحدة)

**ملاحظات مهمة:**
- كن واقعياً جداً في التقييم - لا تبالغ في الإيجابية
- ركز على السوق السعودي تحديداً
- استخدم بيانات وأرقام حقيقية عندما يكون ممكناً
- كن صريحاً في نقاط الضعف والمخاطر
- التقييمات يجب أن تكون متوازنة (نادراً ما تكون فكرة 90+/100)

قدم النتيجة بصيغة JSON التالية:
{
  "overallScore": number (0-100),
  "overallGrade": "ممتاز" | "جيد جداً" | "جيد" | "مقبول" | "ضعيف",
  "summary": "ملخص شامل في 2-3 جمل",
  "perspectives": [
    {
      "perspective": "اسم المنظور",
      "score": number (0-100),
      "strengths": ["نقطة قوة 1", "نقطة قوة 2", ...],
      "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", ...],
      "recommendations": ["توصية 1", "توصية 2", ...],
      "keyInsight": "الرؤية الرئيسية"
    }
  ],
  "marketOpportunity": {
    "score": number (0-100),
    "saudiMarketFit": number (0-100),
    "competitiveAdvantage": "وصف الميزة التنافسية",
    "marketSize": "تقدير حجم السوق",
    "growthPotential": "إمكانية النمو"
  },
  "financialViability": {
    "score": number (0-100),
    "fundingRealism": "تقييم واقعية المبلغ المطلوب",
    "revenueModel": "تحليل نموذج الإيرادات",
    "breakEvenEstimate": "تقدير نقطة التعادل",
    "riskLevel": "منخفض" | "متوسط" | "مرتفع" | "مرتفع جداً"
  },
  "executionReadiness": {
    "score": number (0-100),
    "teamStrength": "تقييم قوة الفريق",
    "timelineRealism": "تقييم واقعية الجدول الزمني",
    "resourceRequirements": "المتطلبات الأساسية",
    "criticalRisks": ["مخاطرة حرجة 1", "مخاطرة حرجة 2", ...]
  },
  "recommendations": {
    "immediate": ["إجراء فوري 1", "إجراء فوري 2", ...],
    "shortTerm": ["إجراء قصير المدى 1", "إجراء قصير المدى 2", ...],
    "longTerm": ["إجراء طويل المدى 1", "إجراء طويل المدى 2", ...]
  },
  "successProbability": number (0-100),
  "investmentRecommendation": "توصية استثمارية مفصلة"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تقييم مشاريع ريادة الأعمال متخصص في السوق السعودي. تقييماتك دقيقة، واقعية، ومبنية على بيانات حقيقية. أنت صريح في نقاط الضعف والمخاطر، ولا تبالغ في الإيجابية.',
        },
        {
          role: 'user',
          content: evaluationPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    // Add icons to perspectives
    result.perspectives = result.perspectives.map((p: any, index: number) => ({
      ...p,
      icon: PERSPECTIVES[index]?.icon || '📊',
    }));

    return result as IdeaEvaluationResult;
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    throw new Error('فشل في تقييم الفكرة باستخدام الذكاء الاصطناعي');
  }
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    'ممتاز': 'text-green-600',
    'جيد جداً': 'text-blue-600',
    'جيد': 'text-yellow-600',
    'مقبول': 'text-orange-600',
    'ضعيف': 'text-red-600',
  };
  return colors[grade] || 'text-gray-600';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 55) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    'منخفض': 'text-green-600',
    'متوسط': 'text-yellow-600',
    'مرتفع': 'text-orange-600',
    'مرتفع جداً': 'text-red-600',
  };
  return colors[risk] || 'text-gray-600';
}

