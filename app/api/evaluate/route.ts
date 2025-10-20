import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Return simple mock evaluation
    return NextResponse.json({
      success: true,
      evaluation: {
        overallScore: 75,
        marketPotential: 80,
        feasibility: 70,
        innovation: 75,
        financialViability: 70,
        teamCapability: 75,
        riskLevel: 65,
        recommendation: 'واعد - يحتاج تطوير',
        strengths: [
          'فكرة مبتكرة',
          'سوق واعد',
          'إمكانية نمو عالية'
        ],
        weaknesses: [
          'يحتاج فريق أقوى',
          'المنافسة عالية',
          'يحتاج تمويل كبير'
        ],
        opportunities: [
          'التوسع في السوق السعودي',
          'شراكات استراتيجية',
          'دعم حكومي محتمل'
        ],
        risks: [
          'تغيرات السوق',
          'منافسة شرسة',
          'تحديات تقنية'
        ],
        recommendations: [
          'تقوية الفريق',
          'بناء MVP سريع',
          'البحث عن شركاء استراتيجيين'
        ],
        estimatedFunding: data.fundingNeeded || 500000,
        targetAudience: 'الشركات الناشئة والمستثمرين',
        successFactors: [
          'جودة المنتج',
          'سرعة التنفيذ',
          'قوة الفريق'
        ]
      }
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التقييم' },
      { status: 500 }
    );
  }
}

