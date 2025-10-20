import { NextRequest, NextResponse } from 'next/server';
import { evaluateIdea, IdeaEvaluationInput } from '@/lib/ai/ideaEvaluator';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    const data = await request.json();

    // Map old format to new format for backward compatibility
    const input: IdeaEvaluationInput = {
      title: data.title,
      description: data.description || `${data.problem}\n\n${data.solution}`,
      category: data.category,
      targetMarket: data.targetMarket || 'السوق السعودي',
      fundingGoal: parseFloat(data.fundingNeeded) || 500000,
      timeline: data.timeline || '12 شهر',
      teamSize: data.teamSize,
      existingTraction: data.existingTraction,
    };

    // Validate input
    if (!input.title || !input.description || !input.category) {
      return NextResponse.json(
        { error: 'يرجى تقديم جميع المعلومات المطلوبة' },
        { status: 400 }
      );
    }

    // Evaluate idea using AI
    const evaluation = await evaluateIdea(input);

    return NextResponse.json({
      success: true,
      evaluation,
      message: 'تم تقييم الفكرة بنجاح',
    });

  } catch (error) {
    console.error('Evaluation API error:', error);
    
    // Return fallback evaluation if API fails
    const fallbackEvaluation = {
      overallScore: 70,
      overallGrade: 'جيد',
      summary: 'فكرة واعدة بإمكانات جيدة تحتاج إلى تخطيط دقيق وتنفيذ محكم',
      perspectives: [
        {
          perspective: 'المحلل الاستراتيجي',
          icon: '🎯',
          score: 72,
          strengths: ['فكرة مبتكرة تلبي حاجة حقيقية في السوق', 'رؤية استراتيجية واضحة'],
          weaknesses: ['يحتاج إلى تحديد أوضح للميزة التنافسية', 'السوق قد يكون مزدحماً'],
          recommendations: ['حدد الميزة التنافسية بوضوح', 'ادرس المنافسين بعمق'],
          keyInsight: 'الفكرة جيدة لكن تحتاج لتمايز أوضح',
        },
        {
          perspective: 'الخبير المالي',
          icon: '💰',
          score: 68,
          strengths: ['نموذج إيرادات واضح', 'إمكانية تحقيق عوائد جيدة'],
          weaknesses: ['التكاليف الأولية قد تكون مرتفعة', 'نقطة التعادل قد تستغرق وقتاً'],
          recommendations: ['راجع التكاليف بدقة', 'ابحث عن طرق لتقليل الاستثمار الأولي'],
          keyInsight: 'الجدوى المالية مقبولة مع حاجة لتحسين الكفاءة',
        },
        {
          perspective: 'خبير السوق السعودي',
          icon: '🇸🇦',
          score: 75,
          strengths: ['ملاءمة جيدة للسوق السعودي', 'توافق مع رؤية 2030'],
          weaknesses: ['قد يحتاج لتكييف ثقافي أكبر', 'المنافسة المحلية قوية'],
          recommendations: ['ادرس السلوك الشرائي المحلي بعمق', 'ابحث عن شراكات محلية'],
          keyInsight: 'السوق السعودي واعد لكن يحتاج فهماً عميقاً',
        },
        {
          perspective: 'مدير العمليات',
          icon: '⚙️',
          score: 65,
          strengths: ['خطة تنفيذ واضحة', 'متطلبات تشغيلية معقولة'],
          weaknesses: ['قد تحتاج لفريق أكبر', 'الجدول الزمني قد يكون متفائلاً'],
          recommendations: ['خطط لتوظيف مبكر', 'أضف هامش أمان للجدول الزمني'],
          keyInsight: 'التنفيذ ممكن لكن يحتاج تخطيط أدق',
        },
        {
          perspective: 'خبير التسويق',
          icon: '📢',
          score: 70,
          strengths: ['جمهور مستهدف واضح', 'إمكانية نمو عضوي'],
          weaknesses: ['استراتيجية التسويق غير واضحة', 'تكلفة اكتساب العملاء قد تكون مرتفعة'],
          recommendations: ['طور استراتيجية تسويق رقمي قوية', 'استثمر في بناء العلامة التجارية'],
          keyInsight: 'التسويق سيكون عامل نجاح حاسم',
        },
        {
          perspective: 'محلل المخاطر',
          icon: '⚠️',
          score: 60,
          strengths: ['مخاطر تنظيمية منخفضة', 'قابلية للتكيف مع التغيرات'],
          weaknesses: ['مخاطر تنافسية عالية', 'اعتماد على عوامل خارجية'],
          recommendations: ['طور خطة طوارئ', 'نوع مصادر الإيرادات'],
          keyInsight: 'المخاطر موجودة لكن يمكن إدارتها',
        },
      ],
      marketOpportunity: {
        score: 73,
        saudiMarketFit: 75,
        competitiveAdvantage: 'ميزة تنافسية جيدة لكن تحتاج لتعزيز',
        marketSize: 'سوق متوسط إلى كبير',
        growthPotential: 'إمكانية نمو جيدة',
      },
      financialViability: {
        score: 68,
        fundingRealism: 'المبلغ المطلوب معقول',
        revenueModel: 'نموذج إيرادات واضح ومتنوع',
        breakEvenEstimate: '18-24 شهر',
        riskLevel: 'متوسط',
      },
      executionReadiness: {
        score: 65,
        teamStrength: 'الفريق جيد لكن قد يحتاج لتعزيز',
        timelineRealism: 'الجدول الزمني متفائل قليلاً',
        resourceRequirements: 'موارد معقولة ومتاحة',
        criticalRisks: ['المنافسة الشديدة', 'صعوبة اكتساب العملاء', 'التكاليف التشغيلية'],
      },
      recommendations: {
        immediate: ['ابدأ بنموذج أولي (MVP)', 'احصل على تغذية راجعة من السوق', 'حدد الميزة التنافسية بوضوح'],
        shortTerm: ['بناء فريق قوي', 'تطوير استراتيجية تسويق', 'البحث عن شراكات استراتيجية'],
        longTerm: ['التوسع الجغرافي', 'تنويع مصادر الإيرادات', 'بناء علامة تجارية قوية'],
      },
      successProbability: 68,
      investmentRecommendation: 'فرصة استثمارية جيدة مع مخاطر متوسطة. يُنصح بالاستثمار بعد تحسين بعض الجوانب الاستراتيجية والتشغيلية.',
    };

    return NextResponse.json({
      success: true,
      evaluation: fallbackEvaluation,
      note: 'تم استخدام تقييم افتراضي بسبب خطأ مؤقت في الذكاء الاصطناعي',
    });
  }
}

