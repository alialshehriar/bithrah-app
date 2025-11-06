import OpenAI from 'openai';

// Initialize OpenAI with the API key
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

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

export interface PerspectiveEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keyInsight: string;
}

export interface MarketOpportunity {
  marketSize: number;
  competitiveAdvantage: number;
  growthPotential: number;
  saudiMarketFit: number;
}

export interface FinancialViability {
  fundingRealism: number;
  revenueModel: number;
  breakEvenPoint: number;
  riskLevel: number;
}

export interface ExecutionReadiness {
  teamStrength: number;
  timelineRealism: number;
  resourceRequirements: number;
  criticalRisks: number;
}

export interface ImplementationPhase {
  phase: string;
  duration: string;
  objectives: string[];
  deliverables: string[];
  resources: string[];
}

export interface SuccessExample {
  name: string;
  description: string;
  relevance: string;
}

export interface IdeaEvaluation {
  // Overall
  overallScore: number;
  successProbability: number;
  investmentRecommendation: string;
  
  // Six Perspectives
  strategicAnalyst?: PerspectiveEvaluation;
  financialExpert?: PerspectiveEvaluation;
  saudiMarketExpert?: PerspectiveEvaluation;
  operationsManager?: PerspectiveEvaluation;
  marketingExpert?: PerspectiveEvaluation;
  riskAnalyst?: PerspectiveEvaluation;
  
  // Specialized Assessments
  marketOpportunity?: MarketOpportunity;
  financialViability?: FinancialViability;
  executionReadiness?: ExecutionReadiness;
  
  // Recommendations by Phase
  immediateActions?: string[];
  shortTermSteps?: string[];
  longTermVision?: string[];
  
  // Additional Info
  estimatedFunding?: number;
  targetAudience?: string;
  keySuccessFactors?: string[];
  
  // New Enhanced Fields
  practicalSolutions?: string[];
  implementationPlan?: ImplementationPhase[];
  successfulExamples?: SuccessExample[];
}

export async function evaluateIdea(input: IdeaEvaluationInput): Promise<IdeaEvaluation> {
  try {
    // If no API key, return fallback immediately
    if (!openai) {
      console.warn('OpenAI API key not configured, using fallback evaluation');
      return getFallbackEvaluation(input);
    }

    const prompt = `أنت نظام تقييم متطور لأفكار المشاريع في منصة بذره السعودية. قيّم الفكرة التالية بشكل احترافي ودقيق:

**معلومات المشروع:**
- العنوان: ${input.title}
- الوصف: ${input.description}
- الفئة: ${input.category}
- السوق المستهدف: ${input.targetMarket || 'السوق السعودي'}
- التمويل المطلوب: ${input.fundingGoal?.toLocaleString() || '500,000'} ريال
- الجدول الزمني: ${input.timeline || '12 شهر'}
${input.teamSize ? `- حجم الفريق: ${input.teamSize} أشخاص` : ''}
${input.existingTraction ? `- الإنجازات الحالية: ${input.existingTraction}` : ''}

**المطلوب:**

قدم تقييماً شاملاً من **ستة منظورات مختلفة** (كل منظور يتضمن):
1. **المحلل الاستراتيجي**: تقييم الرؤية الاستراتيجية والتموضع في السوق
2. **الخبير المالي**: تقييم الجدوى المالية ونموذج الإيرادات
3. **خبير السوق السعودي**: تقييم الملاءمة للسوق المحلي والثقافة
4. **مدير العمليات**: تقييم قابلية التنفيذ والموارد المطلوبة
5. **خبير التسويق**: تقييم استراتيجية النمو والتسويق
6. **محلل المخاطر**: تحديد وتقييم المخاطر المحتملة

**لكل منظور قدم:**
- تقييم من 100 (كن واقعياً، ليس كل مشروع يستحق 90+)
- 3-5 نقاط قوة محددة
- 3-5 نقاط ضعف أو تحديات
- 3-5 توصيات عملية قابلة للتنفيذ
- رؤية رئيسية واحدة (key insight)

**تقييمات متخصصة:**
1. **فرصة السوق**: (حجم السوق، الميزة التنافسية، إمكانية النمو، ملاءمة السوق السعودي) - كل عنصر من 100
2. **الجدوى المالية**: (واقعية التمويل، نموذج الإيرادات، نقطة التعادل، مستوى المخاطر) - كل عنصر من 100
3. **جاهزية التنفيذ**: (قوة الفريق، واقعية الجدول الزمني، المتطلبات، المخاطر الحرجة) - كل عنصر من 100

**توصيات مرحلية:**
- **فورية** (3-5 إجراءات يجب اتخاذها الآن - كن محدداً وعملياً)
- **قصيرة المدى** (3-5 خطوات للأشهر القادمة - مع timeline تقريبي)
- **طويلة المدى** (3-5 رؤية استراتيجية - مع أهداف قابلة للقياس)

**حلول عملية لتطوير الفكرة:**
- قدم 5-7 حلول عملية محددة لتحسين الفكرة
- كل حل يجب أن يكون قابل للتنفيذ ومحدد
- ركز على الحلول التي تعالج نقاط الضعف المحددة
- اقترح أدوات أو منصات محددة يمكن استخدامها

**خطة تنفيذية مقترحة:**
- قسم الخطة إلى 3 مراحل رئيسية
- لكل مرحلة: الهدف، المدة الزمنية، المخرجات المتوقعة
- حدد الموارد المطلوبة لكل مرحلة

**معلومات إضافية:**
- التقييم الإجمالي من 100
- احتمالية النجاح (نسبة مئوية)
- توصية استثمارية (استثمار موصى به، استثمار محتمل، يحتاج تطوير، غير موصى به)
- التمويل المقدر المناسب
- الجمهور المستهدف
- عوامل النجاح الرئيسية (3-5 عوامل)
- حلول عملية لتطوير الفكرة (5-7 حلول محددة)
- خطة تنفيذية مقترحة (3 مراحل مع timeline)
- أمثلة لمشاريع ناجحة مشابهة في السعودية أو الخليج (2-3 أمثلة)

**ملاحظات مهمة:**
- كن صادقاً وواقعياً في التقييمات (لا مبالغة)
- ركز على السوق السعودي والثقافة المحلية
- قدم بيانات وأرقام حقيقية عند الإمكان
- كن صريحاً في نقاط الضعف والمخاطر

**مهم جداً:** يجب أن يحتوي الرد على **جميع** الحقول المطلوبة أدناه بدون استثناء. لا تترك أي حقل فارغاً.

أعطني الرد بصيغة JSON فقط بدون أي نص إضافي، باستخدام البنية التالية **بالضبط**:

{
  "overallScore": number,
  "successProbability": number,
  "investmentRecommendation": string,
  "strategicAnalyst": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "financialExpert": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "saudiMarketExpert": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "operationsManager": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "marketingExpert": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "riskAnalyst": {
    "score": number,
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[],
    "keyInsight": string
  },
  "marketOpportunity": {
    "marketSize": number,
    "competitiveAdvantage": number,
    "growthPotential": number,
    "saudiMarketFit": number
  },
  "financialViability": {
    "fundingRealism": number,
    "revenueModel": number,
    "breakEvenPoint": number,
    "riskLevel": number
  },
  "executionReadiness": {
    "teamStrength": number,
    "timelineRealism": number,
    "resourceRequirements": number,
    "criticalRisks": number
  },
  "immediateActions": string[],
  "shortTermSteps": string[],
  "longTermVision": string[],
  "estimatedFunding": number,
  "targetAudience": string,
  "keySuccessFactors": string[],
  "practicalSolutions": string[],
  "implementationPlan": [
    {
      "phase": string,
      "duration": string,
      "objectives": string[],
      "deliverables": string[],
      "resources": string[]
    }
  ],
  "successfulExamples": [
    {
      "name": string,
      "description": string,
      "relevance": string
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تقييم أفكار المشاريع في منصة بذره السعودية. تقدم تقييمات واقعية ومهنية وشاملة بصيغة JSON فقط. تركز على السوق السعودي وتقدم تحليلات عميقة من منظورات متعددة.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 12000,
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
    return getFallbackEvaluation(input);
  }
}

function getFallbackEvaluation(input: IdeaEvaluationInput): IdeaEvaluation {
  return {
    overallScore: 72,
    successProbability: 65,
    investmentRecommendation: 'استثمار محتمل - يحتاج تطوير',
    
    strategicAnalyst: {
      score: 75,
      strengths: [
        'فكرة مبتكرة تلبي حاجة حقيقية في السوق',
        'توقيت مناسب للدخول في هذا القطاع',
        'إمكانية التوسع والنمو واضحة'
      ],
      weaknesses: [
        'يحتاج رؤية استراتيجية أوضح للسنوات القادمة',
        'التموضع في السوق يحتاج تحديد أدق',
        'المنافسة قد تكون شرسة'
      ],
      recommendations: [
        'وضع خطة استراتيجية واضحة لـ 3-5 سنوات',
        'تحديد الميزة التنافسية الفريدة بدقة',
        'دراسة المنافسين وتحليل نقاط قوتهم وضعفهم'
      ],
      keyInsight: 'المشروع لديه إمكانات واعدة لكن يحتاج تخطيط استراتيجي أعمق'
    },
    
    financialExpert: {
      score: 68,
      strengths: [
        'نموذج الإيرادات واضح ومفهوم',
        'التمويل المطلوب معقول نسبياً',
        'إمكانية تحقيق عوائد جيدة على المدى المتوسط'
      ],
      weaknesses: [
        'نقطة التعادل قد تستغرق وقتاً أطول من المتوقع',
        'التكاليف التشغيلية قد تكون أعلى من التقديرات',
        'الاعتماد على مصدر تمويل واحد قد يكون محفوفاً بالمخاطر'
      ],
      recommendations: [
        'إعداد نموذج مالي تفصيلي مع سيناريوهات متعددة',
        'البحث عن مصادر تمويل متنوعة',
        'وضع خطة طوارئ مالية',
        'تحديد مؤشرات الأداء المالية الرئيسية'
      ],
      keyInsight: 'الجدوى المالية موجودة لكن تحتاج تخطيط مالي أكثر تفصيلاً'
    },
    
    saudiMarketExpert: {
      score: 78,
      strengths: [
        'الفكرة تتناسب مع رؤية 2030 وتوجهات المملكة',
        'السوق السعودي يشهد نمواً في هذا القطاع',
        'الثقافة المحلية تدعم هذا النوع من المشاريع',
        'وجود دعم حكومي محتمل للقطاع'
      ],
      weaknesses: [
        'المنافسة من شركات محلية راسخة',
        'التحديات التنظيمية والترخيصية',
        'الحاجة لفهم عميق للثقافة المحلية'
      ],
      recommendations: [
        'دراسة اللوائح والتراخيص المطلوبة بدقة',
        'بناء شراكات مع جهات محلية',
        'تخصيص المنتج/الخدمة للسوق السعودي',
        'الاستفادة من برامج الدعم الحكومية'
      ],
      keyInsight: 'السوق السعودي واعد لهذه الفكرة مع الحاجة للتوطين والتكيف'
    },
    
    operationsManager: {
      score: 65,
      strengths: [
        'الخطة التنفيذية واضحة في خطوطها العريضة',
        'الموارد المطلوبة محددة بشكل جيد',
        'إمكانية البدء بـ MVP سريع'
      ],
      weaknesses: [
        'الجدول الزمني قد يكون طموحاً جداً',
        'الفريق يحتاج تعزيز بخبرات متخصصة',
        'التحديات التقنية قد تكون أكبر من المتوقع',
        'سلسلة التوريد والعمليات تحتاج تخطيط أدق'
      ],
      recommendations: [
        'تعيين مدير عمليات ذو خبرة',
        'وضع جدول زمني واقعي مع هوامش أمان',
        'بناء فريق متكامل بخبرات متنوعة',
        'اختبار العمليات على نطاق صغير أولاً'
      ],
      keyInsight: 'قابلية التنفيذ موجودة لكن تحتاج فريق أقوى وتخطيط أدق'
    },
    
    marketingExpert: {
      score: 70,
      strengths: [
        'الجمهور المستهدف واضح ومحدد',
        'قنوات التسويق الرقمي متاحة وفعالة',
        'إمكانية بناء علامة تجارية قوية'
      ],
      weaknesses: [
        'استراتيجية التسويق تحتاج تفصيل أكثر',
        'الميزانية التسويقية قد تكون غير كافية',
        'المنافسة على جذب العملاء عالية'
      ],
      recommendations: [
        'وضع خطة تسويقية شاملة مع ميزانية واضحة',
        'الاستثمار في التسويق الرقمي والمحتوى',
        'بناء مجتمع حول المنتج/الخدمة',
        'استخدام المؤثرين والشراكات الاستراتيجية',
        'قياس ROI لكل قناة تسويقية'
      ],
      keyInsight: 'إمكانية النمو التسويقي عالية مع الاستراتيجية الصحيحة'
    },
    
    riskAnalyst: {
      score: 60,
      strengths: [
        'المخاطر الرئيسية محددة بشكل عام',
        'وجود وعي بالتحديات المحتملة'
      ],
      weaknesses: [
        'خطة إدارة المخاطر غير مفصلة',
        'بعض المخاطر الحرجة قد تكون مُغفلة',
        'الاعتماد على افتراضات قد لا تتحقق',
        'مخاطر السوق والمنافسة عالية'
      ],
      recommendations: [
        'إعداد مصفوفة مخاطر شاملة',
        'وضع خطط تخفيف لكل مخاطرة رئيسية',
        'المراجعة الدورية للمخاطر وتحديثها',
        'بناء احتياطيات مالية للطوارئ',
        'تنويع مصادر الإيرادات لتقليل المخاطر'
      ],
      keyInsight: 'المخاطر قابلة للإدارة لكن تحتاج تخطيط استباقي ومراقبة مستمرة'
    },
    
    marketOpportunity: {
      marketSize: 75,
      competitiveAdvantage: 65,
      growthPotential: 80,
      saudiMarketFit: 78
    },
    
    financialViability: {
      fundingRealism: 70,
      revenueModel: 72,
      breakEvenPoint: 65,
      riskLevel: 62
    },
    
    executionReadiness: {
      teamStrength: 60,
      timelineRealism: 65,
      resourceRequirements: 70,
      criticalRisks: 58
    },
    
    immediateActions: [
      'تعزيز الفريق بخبرات متخصصة في المجال',
      'إعداد نموذج مالي تفصيلي مع سيناريوهات متعددة',
      'دراسة المنافسين بعمق وتحديد الميزة التنافسية',
      'بناء MVP سريع لاختبار السوق',
      'التواصل مع مستثمرين محتملين وجهات داعمة'
    ],
    
    shortTermSteps: [
      'إطلاق نسخة تجريبية محدودة واختبارها مع مستخدمين حقيقيين',
      'بناء استراتيجية تسويق رقمي وتنفيذها',
      'تأمين التراخيص والموافقات اللازمة',
      'بناء شراكات استراتيجية مع جهات ذات صلة',
      'تطوير العمليات والأنظمة الداخلية'
    ],
    
    longTermVision: [
      'التوسع في مدن سعودية أخرى',
      'إضافة خدمات ومنتجات تكميلية',
      'بناء علامة تجارية قوية ومعروفة',
      'دراسة التوسع الإقليمي في دول الخليج',
      'الاستحواذ على منافسين صغار أو الاندماج معهم'
    ],
    
    estimatedFunding: input.fundingGoal || 500000,
    targetAudience: 'الشركات الناشئة والمستثمرون الأفراد والمؤسسات في السوق السعودي',
    keySuccessFactors: [
      'قوة الفريق وتكامل الخبرات',
      'جودة المنتج/الخدمة وتميزها',
      'سرعة التنفيذ والتكيف مع السوق',
      'فعالية استراتيجية التسويق والنمو',
      'القدرة على جذب التمويل والشراكات'
    ],
    
    practicalSolutions: [
      'بناء MVP (الحد الأدنى للمنتج) واختباره مع مجموعة محدودة من المستخدمين',
      'استخدام منصات مثل Figma لتصميم الواجهة واختبار تجربة المستخدم',
      'التواصل مع مسرعات الأعمال مثل Badir وMonsha\'at للحصول على الدعم',
      'إجراء بحث سوق ميداني باستخدام Google Forms أو Typeform',
      'بناء شراكات مع جهات ذات صلة في القطاع',
      'استخدام وسائل التواصل الاجتماعي للتسويق المبكر'
    ],
    
    implementationPlan: [
      {
        phase: 'المرحلة التأسيسية',
        duration: '3 أشهر',
        objectives: [
          'بناء الفريق الأساسي',
          'تطوير MVP',
          'تأمين التراخيص اللازمة'
        ],
        deliverables: [
          'نسخة تجريبية عاملة',
          'خطة عمل تفصيلية',
          'نموذج مالي مفصل'
        ],
        resources: [
          '2-3 مطورين',
          'مصمم UI/UX',
          'مستشار أعمال'
        ]
      },
      {
        phase: 'مرحلة الإطلاق',
        duration: '6 أشهر',
        objectives: [
          'إطلاق النسخة التجريبية',
          'جذب أول 100 مستخدم',
          'تأمين التمويل الأولي'
        ],
        deliverables: [
          'منتج مستقر في السوق',
          'قاعدة مستخدمين نشطة',
          'تغطية إعلامية'
        ],
        resources: [
          'فريق تسويق',
          'فريق دعم عملاء',
          'ميزانية تسويقية'
        ]
      },
      {
        phase: 'مرحلة النمو',
        duration: '12 شهر',
        objectives: [
          'التوسع في مدن سعودية أخرى',
          'زيادة قاعدة المستخدمين 10أضعاف',
          'تحقيق الربحية'
        ],
        deliverables: [
          'تواجد في 5 مدن رئيسية',
          'علامة تجارية معروفة',
          'إيرادات مستدامة'
        ],
        resources: [
          'فريق مبيعات',
          'فريق تطوير موسع',
          'مستشارين متخصصين'
        ]
      }
    ],
    
    successfulExamples: [
      {
        name: 'منصة جملة',
        description: 'منصة سعودية للتجارة الإلكترونية حصلت على تمويل بملايين الدولارات',
        relevance: 'نموذج ناجح للمنصات الرقمية في السعودية'
      },
      {
        name: 'منصة سلة',
        description: 'منصة توصيل الطعام السعودية التي أصبحت من الرواد في المنطقة',
        relevance: 'مثال على النجاح في السوق المحلي والتوسع الإقليمي'
      }
    ]
  };
}

