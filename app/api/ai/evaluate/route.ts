import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifySession } from '@/lib/auth';
import { query } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE,
});

// Helper function to log user activity
async function logActivity(
  userId: number | null,
  activityType: string,
  activityData: any,
  request: NextRequest
) {
  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    await query(
      `INSERT INTO user_activities (user_id, activity_type, activity_data, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, activityType, JSON.stringify(activityData), ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user session (optional - can evaluate without login)
    let userId: number | null = null;
    try {
      const session = await verifySession(request);
      userId = session?.userId || null;
    } catch {
      // Continue without user session
    }

    const body = await request.json();
    const { title, description, category, fundingGoal, targetMarket, competitiveAdvantage } = body;

    // Log evaluation request
    await logActivity(userId, 'ai_evaluation_request', {
      title,
      category,
      fundingGoal,
    }, request);

    if (!title || !description || !fundingGoal) {
      return NextResponse.json(
        { success: false, error: 'الرجاء إدخال جميع الحقول المطلوبة' },
        { status: 400 }
      );
    }

    // Create comprehensive prompt for AI evaluation
    const prompt = `أنت خبير في تقييم المشاريع الريادية والاستثمارية في السوق السعودي. قيّم المشروع التالي بدقة واحترافية:

**عنوان المشروع:** ${title}
**الوصف:** ${description}
**التصنيف:** ${category}
**هدف التمويل:** ${fundingGoal} ريال سعودي
**السوق المستهدف:** ${targetMarket || 'غير محدد'}
**الميزة التنافسية:** ${competitiveAdvantage || 'غير محددة'}

قدم تقييماً شاملاً ومفصلاً يتضمن:

1. **التقييم الإجمالي** (من 10): رقم دقيق يعكس جودة المشروع
2. **نقاط القوة** (3-5 نقاط): أهم نقاط القوة في المشروع
3. **نقاط الضعف** (3-5 نقاط): التحديات والمخاطر المحتملة
4. **التوصيات** (3-5 توصيات): نصائح عملية لتحسين المشروع
5. **تقييم تفصيلي** لكل من:
   - **الابتكار** (من 10): مدى ابتكارية الفكرة
   - **جدوى السوق** (من 10): حجم السوق والطلب
   - **الجدوى المالية** (من 10): واقعية التمويل والعوائد
   - **قابلية التنفيذ** (من 10): سهولة تنفيذ المشروع
   - **الميزة التنافسية** (من 10): قوة المشروع مقارنة بالمنافسين

**مهم جداً:**
- كن دقيقاً وواقعياً في التقييم
- راعِ خصوصية السوق السعودي
- قدم تقييماً متوازناً (ليس متفائلاً جداً ولا متشائماً جداً)
- استخدم أرقام دقيقة (مثل 7.5، 8.2) وليس أرقام تقريبية فقط

أرجع النتيجة بصيغة JSON فقط بدون أي نص إضافي:
{
  "overallScore": رقم من 10,
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", ...],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", ...],
  "recommendations": ["توصية 1", "توصية 2", ...],
  "detailedScores": {
    "innovation": رقم من 10,
    "marketViability": رقم من 10,
    "financialViability": رقم من 10,
    "feasibility": رقم من 10,
    "competitiveAdvantage": رقم من 10
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير في تقييم المشاريع الريادية والاستثمارية في السوق السعودي. تقدم تقييمات دقيقة ومفصلة وواقعية.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const evaluationText = completion.choices[0].message.content;
    if (!evaluationText) {
      throw new Error('No evaluation received from AI');
    }

    const evaluation = JSON.parse(evaluationText);

    // Save evaluation to database
    try {
      await query(
        `INSERT INTO project_evaluations (
          user_id, title, description, category, funding_goal, target_market, competitive_advantage,
          overall_score, innovation_score, market_viability_score, financial_viability_score,
          feasibility_score, competitive_advantage_score, strengths, weaknesses, recommendations,
          evaluation_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          userId,
          title,
          description,
          category,
          parseFloat(fundingGoal),
          targetMarket || null,
          competitiveAdvantage || null,
          evaluation.overallScore,
          evaluation.detailedScores.innovation,
          evaluation.detailedScores.marketViability,
          evaluation.detailedScores.financialViability,
          evaluation.detailedScores.feasibility,
          evaluation.detailedScores.competitiveAdvantage,
          JSON.stringify(evaluation.strengths),
          JSON.stringify(evaluation.weaknesses),
          JSON.stringify(evaluation.recommendations),
          JSON.stringify(evaluation),
        ]
      );

      // Log successful evaluation
      await logActivity(userId, 'ai_evaluation_success', {
        title,
        overallScore: evaluation.overallScore,
      }, request);
    } catch (dbError) {
      console.error('Error saving evaluation to database:', dbError);
      // Continue even if DB save fails
    }

    return NextResponse.json({
      success: true,
      evaluation,
    });
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    
    // Log evaluation error
    try {
      await logActivity(null, 'ai_evaluation_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      }, request);
    } catch {}

    return NextResponse.json(
      { success: false, error: 'حدث خطأ في التقييم. الرجاء المحاولة مرة أخرى.' },
      { status: 500 }
    );
  }
}

