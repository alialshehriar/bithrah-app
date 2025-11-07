/**
 * Quick Idea Expander - AI Prompt for expanding simple ideas into full details
 * 
 * This module uses GPT-4 to analyze a simple idea (3-4 inputs) and generate
 * all the missing details needed for a comprehensive evaluation.
 */

import OpenAI from 'openai';

export interface QuickIdeaInput {
  idea: string;
  problem: string;
  targetAudience: string;
  category?: string;
}

export interface ExpandedIdeaDetails {
  title: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  competitiveAdvantage: string;
  businessModel: string;
  estimatedFunding?: string;
  timeframe?: string;
}

export function buildQuickIdeaExpansionPrompt(input: QuickIdeaInput): string {
  const categoryContext = input.category 
    ? `التصنيف: ${getCategoryLabel(input.category)}`
    : '';

  return `أنت مستشار أعمال خبير متخصص في تطوير الأفكار الريادية في السوق السعودي.

**مهمتك:**
قام رائد أعمال بتقديم فكرة مبدئية بسيطة. مهمتك هي تحليل هذه الفكرة وتطويرها إلى خطة عمل متكاملة من خلال توليد جميع التفاصيل المفقودة بناءً على خبرتك ومعرفتك بالسوق السعودي.

**معلومات الفكرة المبدئية:**

1. **الفكرة:** ${input.idea}

2. **المشكلة التي تحلها:** ${input.problem}

3. **الجمهور المستهدف:** ${input.targetAudience}

${categoryContext}

---

**المطلوب منك:**

قم بتحليل الفكرة المبدئية وتوليد التفاصيل التالية بشكل احترافي ودقيق:

1. **عنوان الفكرة (title):**
   - عنوان جذاب ومختصر للفكرة (جملة واحدة)
   - يجب أن يكون واضحاً ومعبراً عن جوهر الفكرة

2. **وصف تفصيلي للفكرة (description):**
   - وصف شامل للفكرة في 2-3 جمل
   - يوضح ما هي الفكرة وكيف تعمل
   - يركز على القيمة المضافة

3. **المشكلة (problem):**
   - توسيع وتفصيل المشكلة المذكورة
   - إضافة أرقام أو إحصائيات إن أمكن (تقديرية ومنطقية)
   - شرح تأثير المشكلة على الجمهور المستهدف

4. **الحل المقترح (solution):**
   - شرح تفصيلي لكيفية حل الفكرة للمشكلة
   - الآليات والطرق المستخدمة
   - الميزات الرئيسية للحل

5. **السوق المستهدف (targetMarket):**
   - توسيع وتفصيل الجمهور المستهدف
   - تحديد الفئات العمرية والديموغرافية
   - حجم السوق المحتمل في السعودية

6. **الميزة التنافسية (competitiveAdvantage):**
   - ما الذي يميز هذه الفكرة عن الحلول الموجودة؟
   - لماذا سيختار العملاء هذا الحل؟
   - نقاط القوة الفريدة

7. **نموذج العمل (businessModel):**
   - كيف ستحقق الفكرة الإيرادات؟
   - اقتراح نموذج عمل مناسب (اشتراكات، عمولات، إعلانات، إلخ)
   - مصادر الدخل المحتملة

8. **التمويل المقدر (estimatedFunding):**
   - تقدير مبدئي للتمويل المطلوب بالريال السعودي
   - مثال: "500,000 - 1,000,000 ريال"

9. **الإطار الزمني (timeframe):**
   - تقدير الوقت اللازم لإطلاق المنتج الأولي (MVP)
   - مثال: "6-12 شهر"

---

**ملاحظات مهمة:**

- استخدم اللغة العربية الفصحى الواضحة
- كن واقعياً ومنطقياً في التقديرات
- ركز على السوق السعودي والثقافة المحلية
- اجعل الإجابات عملية وقابلة للتنفيذ
- استخدم أرقام وتقديرات منطقية بناءً على معرفتك بالسوق

---

**صيغة الإخراج المطلوبة (JSON فقط):**

\`\`\`json
{
  "title": "عنوان الفكرة",
  "description": "وصف تفصيلي للفكرة",
  "problem": "شرح تفصيلي للمشكلة",
  "solution": "شرح تفصيلي للحل",
  "targetMarket": "وصف تفصيلي للسوق المستهدف",
  "competitiveAdvantage": "الميزة التنافسية",
  "businessModel": "نموذج العمل المقترح",
  "estimatedFunding": "التمويل المقدر",
  "timeframe": "الإطار الزمني"
}
\`\`\`

**مهم جداً:** أرجع JSON فقط بدون أي نص إضافي قبله أو بعده.`;
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technology: 'التقنية',
    health: 'الصحة',
    education: 'التعليم',
    business: 'الأعمال',
    environment: 'البيئة',
    other: 'أخرى',
  };
  return labels[category] || category;
}

/**
 * Call OpenAI GPT-4 to expand the quick idea into full details
 */
export async function expandQuickIdea(
  input: QuickIdeaInput
): Promise<ExpandedIdeaDetails> {
  const prompt = buildQuickIdeaExpansionPrompt(input);

  // Initialize OpenAI client (must be inside function to access runtime env vars)
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: 'أنت مستشار أعمال خبير متخصص في تطوير الأفكار الريادية في السوق السعودي. تقوم بتحليل الأفكار البسيطة وتطويرها إلى خطط عمل متكاملة.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  }, {
    timeout: 50000, // 50 second timeout
  });

  const content = completion.choices[0].message.content?.trim() || '';

  // Extract JSON from response (remove markdown code blocks if present)
  let jsonContent = content;
  if (content.includes('```json')) {
    jsonContent = content.split('```json')[1].split('```')[0].trim();
  } else if (content.includes('```')) {
    jsonContent = content.split('```')[1].split('```')[0].trim();
  }

  try {
    const expandedDetails: ExpandedIdeaDetails = JSON.parse(jsonContent);
    return expandedDetails;
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Failed to parse AI response');
  }
}
