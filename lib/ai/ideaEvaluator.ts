import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE
}) : null;

export interface IdeaEvaluationInput {
  title: string;
  description: string;
  category: string;
  targetMarket?: string;
  fundingGoal?: number;
  timeline?: string;
}

export interface PerspectiveEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyInsight: string;
}

export interface IdeaEvaluation {
  overallScore: number;
  successProbability: number;
  investmentRecommendation: string;
  
  strategicAnalyst?: PerspectiveEvaluation;
  financialExpert?: PerspectiveEvaluation;
  saudiMarketExpert?: PerspectiveEvaluation;
  
  immediateActions?: string[];
  shortTermSteps?: string[];
  longTermVision?: string[];
}

// Configuration: Enable/disable perspectives for scalability
const PERSPECTIVES_CONFIG = {
  strategicAnalyst: true,  // Comprehensive strategic analysis
  financialExpert: false,  // Disabled for performance (can be enabled later)
  saudiMarketExpert: false, // Disabled for performance (can be enabled later)
};

// Generate perspective prompts dynamically
function generatePerspectivePrompts(): string {
  const perspectives: string[] = [];
  
  if (PERSPECTIVES_CONFIG.strategicAnalyst) {
    perspectives.push(`**strategicAnalyst**: تحليل شامل (الاستراتيجية، المالية، السوق السعودي)`);
  }
  
  if (PERSPECTIVES_CONFIG.financialExpert) {
    perspectives.push(`**financialExpert**: التحليل المالي (نموذج الإيرادات، التكاليف، ROI، التمويل)`);
  }
  
  if (PERSPECTIVES_CONFIG.saudiMarketExpert) {
    perspectives.push(`**saudiMarketExpert**: السوق السعودي (المنافسة، سلوك المستهلك، الفرص المحلية)`);
  }
  
  return perspectives.join('\n');
}

// Generate JSON structure example dynamically
function generateJsonExample(): string {
  const perspectives: string[] = [];
  
  if (PERSPECTIVES_CONFIG.strategicAnalyst) {
    perspectives.push(`  "strategicAnalyst": {...}`);
  }
  
  if (PERSPECTIVES_CONFIG.financialExpert) {
    perspectives.push(`  "financialExpert": {...}`);
  }
  
  if (PERSPECTIVES_CONFIG.saudiMarketExpert) {
    perspectives.push(`  "saudiMarketExpert": {...}`);
  }
  
  return `{
  "overallScore": 75,
  "successProbability": 45,
  "investmentRecommendation": "استثمار محتمل",
${perspectives.join(',\n')},
  "immediateActions": ["...", "..."],
  "shortTermSteps": ["...", "..."],
  "longTermVision": ["...", "..."]
}`;
}

export async function evaluateIdea(input: IdeaEvaluationInput): Promise<IdeaEvaluation> {
  try {
    if (!openai) {
      console.warn('OpenAI API key not configured');
      return getFallbackEvaluation(input);
    }

    const enabledPerspectivesCount = Object.values(PERSPECTIVES_CONFIG).filter(Boolean).length;
    
    const systemPrompt = `أنت خبير تقييم مشاريع محترف متخصص في السوق السعودي.

**أسلوبك:**
- تحليل واقعي وصريح
- توصيات عملية قابلة للتنفيذ
- أرقام ومؤشرات دقيقة

**تنسيق الرد:**
- JSON فقط
- جميع الحقول مطلوبة
- كل نقطة = جملة واحدة واضحة`;

    const userPrompt = `قيّم هذه الفكرة:

**المشروع:**
العنوان: ${input.title}
الوصف: ${input.description}
الفئة: ${input.category}
السوق: ${input.targetMarket || 'السوق السعودي'}
التمويل: ${input.fundingGoal?.toLocaleString() || '500,000'} ريال
المدة: ${input.timeline || '12 شهر'}

**المطلوب:**

1. **التقييم الإجمالي:**
- overallScore: رقم من 100
- successProbability: نسبة النجاح %
- investmentRecommendation: ("استثمار موصى به" أو "استثمار محتمل" أو "يحتاج تطوير" أو "غير موصى به")

2. **${enabledPerspectivesCount} منظور${enabledPerspectivesCount > 2 ? 'ات' : 'ين'}** (كل منظور يحتوي):
- score: من 100
- strengths: 2 نقاط قوة (جملة واحدة لكل نقطة)
- weaknesses: 2 نقاط ضعف (جملة واحدة لكل نقطة)
- recommendations: 2 توصيات (جملة واحدة لكل توصية)
- keyInsight: رؤية رئيسية (جملة واحدة)

${generatePerspectivePrompts()}

3. **توصيات مرحلية** (2 توصيات لكل مرحلة، جملة واحدة لكل توصية):
- immediateActions: إجراءات فورية
- shortTermSteps: خطوات قصيرة المدى
- longTermVision: رؤية طويلة المدى

أرجع JSON فقط بهذا الشكل:
${generateJsonExample()}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Faster and cheaper than gpt-4o
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
      timeout: 80000 // 80 seconds timeout (within 90s route limit)
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const evaluation = JSON.parse(content);
    return evaluation;

  } catch (error) {
    console.error('Error evaluating idea:', error);
    return getFallbackEvaluation(input);
  }
}

function getFallbackEvaluation(input: IdeaEvaluationInput): IdeaEvaluation {
  const fallback: IdeaEvaluation = {
    overallScore: 70,
    successProbability: 40,
    investmentRecommendation: "يحتاج تطوير",
  };
  
  // Add enabled perspectives to fallback
  if (PERSPECTIVES_CONFIG.strategicAnalyst) {
    fallback.strategicAnalyst = {
      score: 70,
      strengths: [
        "الفكرة تعالج مشكلة حقيقية في السوق السعودي",
        "الفئة المستهدفة واضحة ومحددة"
      ],
      weaknesses: [
        "يحتاج المزيد من التفاصيل حول نموذج العمل",
        "المنافسة في هذا المجال قوية"
      ],
      recommendations: [
        "إجراء دراسة سوق تفصيلية",
        "تطوير نموذج أولي (MVP)"
      ],
      keyInsight: "الفكرة واعدة لكن تحتاج تطوير استراتيجية واضحة"
    };
  }
  
  if (PERSPECTIVES_CONFIG.financialExpert) {
    fallback.financialExpert = {
      score: 65,
      strengths: [
        "نموذج الإيرادات قابل للتطبيق",
        "التكاليف التشغيلية معقولة"
      ],
      weaknesses: [
        "يحتاج رأس مال كبير للبدء",
        "فترة استرداد الاستثمار طويلة"
      ],
      recommendations: [
        "البحث عن مستثمرين استراتيجيين",
        "تقليل التكاليف الثابتة"
      ],
      keyInsight: "الجدوى المالية متوسطة وتحتاج تحسين"
    };
  }
  
  if (PERSPECTIVES_CONFIG.saudiMarketExpert) {
    fallback.saudiMarketExpert = {
      score: 75,
      strengths: [
        "السوق السعودي جاهز لهذا النوع من الحلول",
        "الدعم الحكومي متوفر للمشاريع التقنية"
      ],
      weaknesses: [
        "المنافسة المحلية قوية",
        "يحتاج توطين الحل للسوق السعودي"
      ],
      recommendations: [
        "دراسة المنافسين المحليين بعمق",
        "بناء شراكات مع جهات محلية"
      ],
      keyInsight: "السوق السعودي واعد لكن يحتاج استراتيجية محلية قوية"
    };
  }
  
  fallback.immediateActions = [
    "التحقق من جدوى الفكرة من خلال مقابلات مع العملاء المحتملين",
    "إعداد خطة عمل تفصيلية"
  ];
  
  fallback.shortTermSteps = [
    "تطوير نموذج أولي (MVP) خلال 3-6 أشهر",
    "اختبار المنتج مع مجموعة صغيرة من المستخدمين"
  ];
  
  fallback.longTermVision = [
    "التوسع في السوق السعودي",
    "إضافة ميزات جديدة بناءً على احتياجات السوق"
  ];
  
  return fallback;
}
