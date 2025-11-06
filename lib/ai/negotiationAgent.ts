import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE
}) : null;

export interface NegotiationContext {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  ownerName: string;
  timeline?: string;
  teamSize?: number;
  existingTraction?: string;
}

export interface NegotiationMessage {
  role: 'investor' | 'owner';
  content: string;
}

export interface NegotiationResponse {
  message: string;
  suggestedTerms?: {
    investmentAmount?: number;
    equity?: number;
    expectedReturn?: number;
    timeline?: string;
  };
  agreementReached?: boolean;
}

/**
 * Generate AI response in negotiation
 */
export async function generateAIResponse(
  investorMessage: string,
  conversationHistory: NegotiationMessage[],
  context: NegotiationContext
): Promise<NegotiationResponse> {
  return negotiateAsProjectOwner(context, conversationHistory, investorMessage);
}

/**
 * AI Negotiation Agent that role-plays as the project owner
 * Handles intelligent negotiation with investors
 */
export async function negotiateAsProjectOwner(
  context: NegotiationContext,
  conversationHistory: NegotiationMessage[],
  investorMessage: string
): Promise<NegotiationResponse> {
  
  if (!openai) {
    // Fallback response if no API key
    return {
      message: "شكراً على اهتمامك! للأسف، نظام التفاوض الذكي غير متاح حالياً. يرجى المحاولة لاحقاً.",
      agreementReached: false
    };
  }

  const systemPrompt = `أنت ${context.ownerName}، مؤسس ومالك مشروع "${context.projectTitle}".

**معلومات المشروع:**
- الوصف: ${context.projectDescription}
- الفئة: ${context.category}
- التمويل المطلوب: ${context.fundingGoal.toLocaleString()} ريال
- التمويل الحالي: ${context.currentFunding.toLocaleString()} ريال
- الجدول الزمني: ${context.timeline}
${context.teamSize ? `- حجم الفريق: ${context.teamSize} أشخاص` : ''}
${context.existingTraction ? `- الإنجازات الحالية: ${context.existingTraction}` : ''}

**دورك:**
أنت تتفاوض مع مستثمر محتمل. كن احترافياً، واقعياً، وذكياً في التفاوض.

**إرشادات التفاوض:**

1. **الترحيب والتعريف:**
   - رحب بالمستثمر بحرارة
   - عرّف عن نفسك والمشروع بشكل مختصر
   - أظهر حماسك للمشروع

2. **الإجابة على الأسئلة:**
   - أجب بصدق وشفافية
   - قدم تفاصيل محددة وأرقام واقعية
   - إذا لم تعرف إجابة، اعترف بذلك واقترح البحث عنها

3. **التفاوض على الشروط:**
   - كن مرناً لكن لا تتنازل بسهولة
   - اقترح شروط واقعية ومنطقية
   - ركز على القيمة المتبادلة (win-win)
   - لا تقبل شروط غير عادلة

4. **الشروط المالية:**
   - نسبة الملكية: 5-25% (حسب حجم الاستثمار)
   - العائد المتوقع: 2-5x خلال 3-5 سنوات
   - كن واقعياً في التوقعات

5. **علامات الاتفاق:**
   - عندما تتفق على:
     * مبلغ الاستثمار
     * نسبة الملكية أو العائد
     * الجدول الزمني
     * الشروط الأساسية
   - قل: "يبدو أننا وصلنا لاتفاق مبدئي! دعني ألخص الشروط..."
   - ثم اسأل: "هل أنت موافق على هذه الشروط؟"

6. **الأسلوب:**
   - استخدم لغة عربية فصحى مبسطة
   - كن ودوداً لكن محترفاً
   - أظهر ثقة بالمشروع
   - كن صادقاً في نقاط الضعف والمخاطر

7. **الحدود:**
   - لا تقبل استثمار أقل من 10% من التمويل المطلوب
   - لا تعطي أكثر من 30% ملكية
   - لا تقبل شروط تعسفية

**مهم جداً:**
- إذا وصلتم لاتفاق واضح، أضف في نهاية ردك: [AGREEMENT_REACHED]
- قدم الشروط المتفق عليها بوضوح

أجب بصيغة JSON:
{
  "message": "رسالتك للمستثمر",
  "suggestedTerms": {
    "investmentAmount": number أو null,
    "equity": number أو null,
    "expectedReturn": number أو null,
    "timeline": string أو null
  },
  "agreementReached": boolean
}`;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'investor' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      { role: 'user', content: investorMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages,
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content) as NegotiationResponse;
    return result;

  } catch (error) {
    console.error('Negotiation AI error:', error);
    
    // Fallback response
    return {
      message: "عذراً، واجهت مشكلة تقنية. هل يمكنك إعادة صياغة سؤالك؟",
      agreementReached: false
    };
  }
}

/**
 * Generate initial greeting from project owner
 */
export function generateInitialGreeting(context: NegotiationContext): string {
  return `مرحباً! أنا ${context.ownerName}، مؤسس "${context.projectTitle}". 

سعيد جداً باهتمامك بمشروعنا! نحن نعمل على ${context.projectDescription}

نبحث حالياً عن ${context.fundingGoal.toLocaleString()} ريال لتحقيق أهدافنا خلال ${context.timeline}.

ما الذي يهمك معرفته عن المشروع؟ وما هو حجم الاستثمار الذي تفكر فيه؟`;
}
