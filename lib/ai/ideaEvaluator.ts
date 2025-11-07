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

export async function evaluateIdea(input: IdeaEvaluationInput): Promise<IdeaEvaluation> {
  try {
    if (!openai) {
      console.warn('OpenAI API key not configured');
      return getFallbackEvaluation(input);
    }

    const systemPrompt = `أنت خبير تقييم مشاريع محترف متخصص في السوق السعودي.

**أسلوبك:**
- تحليل واقعي وصريح
- توصيات عملية قابلة للتنفيذ
- أرقام ومؤشرات دقيقة

**تنسيق الرد:**
- JSON فقط
- جميع الحقول مطلوبة
- كل نقطة = 2-3 جمل مفصلة`;

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

2. **منظورين فقط** (كل منظور يحتوي):
- score: من 100
- strengths: 3 نقاط قوة (جملة واحدة لكل نقطة)
- weaknesses: 3 نقاط ضعف (جملة واحدة لكل نقطة)
- recommendations: 3 توصيات (جملة واحدة لكل توصية)
- keyInsight: رؤية رئيسية (جملة واحدة)

**strategicAnalyst**: التحليل الاستراتيجي والمالي
**saudiMarketExpert**: السوق السعودي (المنافسة، سلوك المستهلك)

3. **توصيات مرحلية** (3 توصيات لكل مرحلة، جملة واحدة لكل توصية):
- immediateActions: إجراءات فورية
- shortTermSteps: خطوات قصيرة المدى
- longTermVision: رؤية طويلة المدى

أرجع JSON فقط بهذا الشكل:
{
  "overallScore": 75,
  "successProbability": 45,
  "investmentRecommendation": "استثمار محتمل",
  "strategicAnalyst": {...},
  "saudiMarketExpert": {...},
  "immediateActions": ["...", "...", "..."],
  "shortTermSteps": ["...", "...", "..."],
  "longTermVision": ["...", "...", "..."]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      timeout: 50000 // 50 seconds timeout
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
  return {
    overallScore: 70,
    successProbability: 40,
    investmentRecommendation: "يحتاج تطوير",
    strategicAnalyst: {
      score: 70,
      strengths: [
        "الفكرة تعالج مشكلة حقيقية في السوق السعودي",
        "الفئة المستهدفة واضحة ومحددة",
        "التوقيت مناسب للدخول في هذا المجال"
      ],
      weaknesses: [
        "المنافسة قوية في هذا المجال",
        "الميزة التنافسية غير واضحة بشكل كافٍ",
        "يحتاج المزيد من التفاصيل حول نموذج العمل"
      ],
      recommendations: [
        "إجراء دراسة سوق مع 50+ عميل محتمل خلال شهرين",
        "تحديد الميزة التنافسية الرئيسية بوضوح",
        "بناء MVP بسيط واختباره مع مستخدمين حقيقيين"
      ],
      keyInsight: "الفكرة واعدة لكنها تحتاج المزيد من التطوير والتحقق من السوق قبل البدء في التنفيذ الكامل."
    },
    financialExpert: {
      score: 65,
      strengths: [
        "التمويل المطلوب واقعي ومناسب لحجم المشروع",
        "نموذج الإيرادات واضح ومباشر",
        "التكاليف التشغيلية معقولة"
      ],
      weaknesses: [
        "نقطة التعادل قد تأخذ وقت أطول من المتوقع",
        "هامش الربح قد يكون منخفض في البداية",
        "المخاطر المالية تحتاج إدارة أفضل"
      ],
      recommendations: [
        "إعداد نموذج مالي مفصل لأول 24 شهر",
        "تحديد مصادر دخل بديلة لتسريع الوصول للتعادل",
        "وضع خطة طوارئ للتعامل مع تأخر الإيرادات"
      ],
      keyInsight: "المشروع قابل للربحية لكنه يحتاج إدارة مالية دقيقة وتخطيط جيد للتدفق النقدي."
    },
    saudiMarketExpert: {
      score: 75,
      strengths: [
        "السوق السعودي يشهد نمو في هذا المجال",
        "سلوك المستهلك السعودي يتماشى مع الفكرة",
        "الدعم الحكومي متوفر لهذا القطاع"
      ],
      weaknesses: [
        "المنافسة المحلية قوية ومتقدمة",
        "التحديات التنظيمية قد تكون معقدة",
        "الثقافة المحلية قد تتطلب تعديلات على الفكرة"
      ],
      recommendations: [
        "دراسة المنافسين المحليين بعمق وتحديد الفجوات",
        "التواصل مع الجهات التنظيمية مبكراً",
        "تخصيص الحل للسوق السعودي بشكل أكبر"
      ],
      keyInsight: "السوق السعودي واعد لكنه يتطلب فهم عميق للثقافة المحلية والمنافسة القوية."
    },
    immediateActions: [
      "إجراء 30 مقابلة مع عملاء محتملين خلال 3 أسابيع للتحقق من الحاجة الفعلية",
      "دراسة 5 منافسين رئيسيين وتحديد نقاط القوة والضعف لكل منهم",
      "بناء landing page بسيط واختبار الطلب من خلال حملة إعلانية صغيرة"
    ],
    shortTermSteps: [
      "بناء MVP بميزانية 50,000 ريال واختباره مع 100 مستخدم مبكر",
      "تطوير نموذج العمل بناءً على feedback المستخدمين",
      "البحث عن شريك استراتيجي أو مستثمر ملاك"
    ],
    longTermVision: [
      "التوسع لدول الخليج بعد تحقيق 10,000 مستخدم نشط في السعودية",
      "بناء فريق قوي من 15-20 شخص",
      "جمع جولة Series A بقيمة 5M ريال"
    ]
  };
}
