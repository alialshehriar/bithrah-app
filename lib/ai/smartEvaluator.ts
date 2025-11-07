import OpenAI from 'openai';

export interface SmartEvaluationInput {
  projectName?: string;
  idea: string;
  problem: string;
  solution?: string;
  targetAudience: string;
  competitors?: string;
  category?: string;
}

export interface EvaluationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  risks: string[];
  recommendations: string[];
  marketAnalysis: string;
  financialProjection: string;
  expandedIdea?: {
    projectName: string;
    fullDescription: string;
    detailedSolution: string;
    businessModel: string;
    competitiveAdvantage: string;
  };
}

/**
 * Smart AI Evaluator that adapts to any level of detail
 * - If user provides minimal info: Helps expand and clarify the idea first
 * - If user provides full details: Provides deep comprehensive analysis
 */
export async function evaluateIdea(input: SmartEvaluationInput): Promise<EvaluationResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Determine detail level
  const hasMinimalInfo = !input.solution || input.solution.length < 50;
  const hasCompetitorInfo = input.competitors && input.competitors.length > 10;
  const detailLevel = hasMinimalInfo ? 'expand_and_evaluate' : 'deep_evaluation';

  const systemPrompt = `أنت مستشار أعمال خبير متخصص في تقييم وتطوير الأفكار الريادية في السوق السعودي. لديك خبرة 20+ سنة في:
- تحليل وتطوير نماذج الأعمال وتقييم الجدوى
- دراسة السوق السعودي والخليجي بعمق
- التخطيط المالي والتوقعات الاستثمارية
- تحديد الفرص والمخاطر بدقة عالية
- مساعدة رواد الأعمال في توضيح وتطوير أفكارهم

مهمتك: ${
    detailLevel === 'expand_and_evaluate'
      ? 'مساعدة صاحب الفكرة في توضيحها وتطويرها، ثم تقديم تقييم شامل ودقيق'
      : 'تقديم تقييم تفصيلي شامل ودقيق للفكرة الريادية'
  }`;

  let userPrompt = '';

  if (detailLevel === 'expand_and_evaluate') {
    userPrompt = `لدي فكرة ريادية أحتاج مساعدتك في توضيحها وتطويرها ثم تقييمها:

**المعلومات المتوفرة:**
${input.projectName ? `**اسم المشروع:** ${input.projectName}` : ''}
**الفكرة:** ${input.idea}
**المشكلة التي تحلها:** ${input.problem}
${input.solution ? `**الحل المقترح:** ${input.solution}` : '**الحل:** غير محدد بعد'}
**الجمهور المستهدف:** ${input.targetAudience}
${input.competitors ? `**المنافسون:** ${input.competitors}` : ''}
${input.category ? `**التصنيف:** ${input.category}` : ''}

---

**المطلوب منك:**

**أولاً: توضيح وتطوير الفكرة**
1. اقترح اسم مشروع احترافي ومناسب (إذا لم يكن موجوداً)
2. اكتب وصفاً كاملاً ومفصلاً للفكرة (150-200 كلمة)
3. طور حلاً تفصيلياً ومبتكراً للمشكلة
4. اقترح نموذج عمل واضح ومربح
5. حدد الميزة التنافسية الرئيسية

**ثانياً: التقييم الشامل**

1. **درجة التقييم الإجمالية (من 100):**
   - قيّم الفكرة بناءً على: الابتكار، حجم السوق، قابلية التنفيذ، الميزة التنافسية، والعائد المتوقع
   - كن واقعياً ودقيقاً في التقييم

2. **نقاط القوة (5-7 نقاط مفصلة):**
   - حدد المزايا الحقيقية والقوية للفكرة
   - ركز على ما يميزها عن الحلول الموجودة
   - اذكر الفرص الكبيرة التي يمكن استغلالها

3. **نقاط الضعف (5-7 نقاط مفصلة):**
   - كن صريحاً في تحديد التحديات والعقبات
   - اذكر المخاطر المحتملة والثغرات
   - حدد ما يحتاج إلى تحسين أو تطوير

4. **الفرص المتاحة (5-7 نقاط مفصلة):**
   - حدد الفرص السوقية الحقيقية بدقة
   - اذكر إمكانيات التوسع والنمو
   - ركز على الاتجاهات السوقية المواتية

5. **المخاطر المحتملة (5-7 نقاط مفصلة):**
   - حدد المخاطر التشغيلية والمالية
   - اذكر التحديات التنظيمية والقانونية
   - ركز على المنافسة والتغيرات السوقية

6. **التوصيات الاستراتيجية (5-7 نقاط مفصلة):**
   - قدم نصائح عملية وقابلة للتنفيذ
   - اقترح خطوات واضحة للبدء
   - ركز على أولويات التطوير

7. **تحليل السوق (فقرتان شاملتان 200-250 كلمة):**
   - حلل حجم السوق السعودي المستهدف بدقة
   - اذكر الاتجاهات والفرص الحالية
   - قيّم المنافسة والطلب المتوقع
   - استخدم أرقام تقديرية واقعية

8. **التوقعات المالية (فقرتان شاملتان 200-250 كلمة):**
   - قدّر التكاليف الأولية المطلوبة بالتفصيل
   - توقع الإيرادات المحتملة في السنة الأولى
   - اذكر نقطة التعادل المتوقعة
   - قيّم العائد على الاستثمار (ROI)

---

**مهم جداً:**
- يجب أن يكون الرد بصيغة JSON فقط
- استخدم اللغة العربية الفصحى المبسطة
- كن دقيقاً ومهنياً في التحليل
- قدم معلومات واقعية وقابلة للتطبيق

**الصيغة المطلوبة:**
\`\`\`json
{
  "expandedIdea": {
    "projectName": "اسم المشروع المقترح",
    "fullDescription": "وصف كامل ومفصل للفكرة...",
    "detailedSolution": "الحل التفصيلي المقترح...",
    "businessModel": "نموذج العمل المقترح...",
    "competitiveAdvantage": "الميزة التنافسية الرئيسية..."
  },
  "score": 85,
  "strengths": [
    "نقطة قوة مفصلة مع شرح",
    "نقطة قوة أخرى",
    "..."
  ],
  "weaknesses": [
    "نقطة ضعف واضحة مع شرح",
    "..."
  ],
  "opportunities": [
    "فرصة سوقية محددة",
    "..."
  ],
  "risks": [
    "مخاطرة محتملة مع تفاصيل",
    "..."
  ],
  "recommendations": [
    "توصية عملية قابلة للتنفيذ",
    "..."
  ],
  "marketAnalysis": "تحليل شامل للسوق السعودي...",
  "financialProjection": "توقعات مالية واقعية..."
}
\`\`\``;
  } else {
    // Deep evaluation for detailed input
    userPrompt = `قيّم هذا المشروع الريادي بشكل تفصيلي شامل ومهني:

${input.projectName ? `**اسم المشروع:** ${input.projectName}` : ''}
**الفكرة:** ${input.idea}
**المشكلة التي يحلها:** ${input.problem}
**الحل المقترح:** ${input.solution}
**الجمهور المستهدف:** ${input.targetAudience}
${input.competitors ? `**المنافسون:** ${input.competitors}` : ''}
${input.category ? `**التصنيف:** ${input.category}` : ''}

---

**المطلوب منك:**

1. **درجة التقييم الإجمالية (من 100):**
   - قيّم المشروع بناءً على: الابتكار، حجم السوق، قابلية التنفيذ، الميزة التنافسية، قوة الحل، والعائد المتوقع
   - كن واقعياً ودقيقاً جداً في التقييم

2. **نقاط القوة (5-7 نقاط مفصلة):**
   - حدد المزايا الحقيقية والقوية للمشروع
   - ركز على ما يميزه عن المنافسين
   - اذكر الفرص الكبيرة التي يمكن استغلالها
   - حلل قوة الحل المقترح

3. **نقاط الضعف (5-7 نقاط مفصلة):**
   - كن صريحاً جداً في تحديد التحديات والعقبات
   - اذكر المخاطر المحتملة والثغرات بدقة
   - حدد ما يحتاج إلى تحسين أو تطوير
   - قيّم نقاط الضعف مقارنة بالمنافسين

4. **الفرص المتاحة (5-7 نقاط مفصلة):**
   - حدد الفرص السوقية الحقيقية بدقة
   - اذكر إمكانيات التوسع والنمو المحلي والإقليمي
   - ركز على الاتجاهات السوقية المواتية
   - حدد فرص الشراكات والتعاون

5. **المخاطر المحتملة (5-7 نقاط مفصلة):**
   - حدد المخاطر التشغيلية والمالية بدقة
   - اذكر التحديات التنظيمية والقانونية
   - ركز على المنافسة والتغيرات السوقية
   - قيّم مخاطر التنفيذ والتوسع

6. **التوصيات الاستراتيجية (5-7 نقاط مفصلة):**
   - قدم نصائح عملية وقابلة للتنفيذ فوراً
   - اقترح خطوات واضحة ومرتبة حسب الأولوية
   - ركز على استراتيجيات النمو والتوسع
   - قدم توصيات للتميز عن المنافسين

7. **تحليل السوق (فقرتان شاملتان 200-250 كلمة):**
   - حلل حجم السوق السعودي والخليجي المستهدف بدقة
   - اذكر الاتجاهات والفرص الحالية والمستقبلية
   - قيّم المنافسة بالتفصيل (نقاط قوتهم وضعفهم)
   - حلل الطلب المتوقع ومعدل النمو السنوي
   - استخدم أرقام تقديرية واقعية ومصادر موثوقة

8. **التوقعات المالية (فقرتان شاملتان 200-250 كلمة):**
   - قدّر التكاليف الأولية المطلوبة بالتفصيل
   - توقع الإيرادات المحتملة في السنوات الثلاث الأولى
   - اذكر نقطة التعادل المتوقعة بدقة
   - قيّم العائد على الاستثمار (ROI) والربحية
   - حدد مصادر التمويل المقترحة
   - قدم سيناريوهات متفائلة وواقعية

---

**مهم جداً:**
- يجب أن يكون الرد بصيغة JSON فقط
- استخدم اللغة العربية الفصحى المبسطة
- كن دقيقاً جداً ومهنياً في التحليل
- قدم معلومات واقعية وقابلة للتطبيق
- اجعل التحليل شاملاً ومفصلاً

**الصيغة المطلوبة:**
\`\`\`json
{
  "score": 85,
  "strengths": [
    "نقطة قوة مفصلة جداً مع شرح وتحليل",
    "نقطة قوة أخرى مع أمثلة",
    "..."
  ],
  "weaknesses": [
    "نقطة ضعف واضحة مع شرح مفصل",
    "..."
  ],
  "opportunities": [
    "فرصة سوقية محددة بدقة",
    "..."
  ],
  "risks": [
    "مخاطرة محتملة مع تفاصيل وتحليل",
    "..."
  ],
  "recommendations": [
    "توصية عملية قابلة للتنفيذ فوراً",
    "..."
  ],
  "marketAnalysis": "تحليل شامل ومفصل جداً للسوق السعودي والخليجي...",
  "financialProjection": "توقعات مالية واقعية ومفصلة جداً..."
}
\`\`\``;
  }

  try {
    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      },
      {
        timeout: 60000,
      }
    );

    const content = completion.choices[0].message.content?.trim() || '{}';
    const result: EvaluationResult = JSON.parse(content);

    // Validate result structure
    if (!result.score || !result.strengths || !result.weaknesses) {
      throw new Error('Invalid response format from AI');
    }

    return result;
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    throw new Error(`فشل التقييم: ${error.message}`);
  }
}
