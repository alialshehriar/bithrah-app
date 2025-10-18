'use client';

import { useState } from 'react';
import { Brain, Sparkles, TrendingUp, Target, DollarSign, Users, Zap, Award, Lightbulb, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface EvaluationResult {
  overallScore: number;
  scores: {
    innovation: number;
    marketViability: number;
    feasibility: number;
    financialProjection: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

export default function AIEvaluationPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    fundingGoal: '',
    targetMarket: '',
    competitiveAdvantage: '',
  });
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const categories = [
    { value: 'technology', label: 'التقنية', Icon: Zap },
    { value: 'education', label: 'التعليم', Icon: Lightbulb },
    { value: 'health', label: 'الصحة', Icon: Target },
    { value: 'business', label: 'الأعمال', Icon: TrendingUp },
    { value: 'ecommerce', label: 'التجارة الإلكترونية', Icon: DollarSign },
    { value: 'social', label: 'التواصل الاجتماعي', Icon: Users },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEvaluation(null);

    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setEvaluation(data.evaluation);
      } else {
        alert(data.error || 'حدث خطأ في التقييم');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-teal';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-teal-500 to-cyan-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-3xl gradient-bg mb-4">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            تقييم ذكي بالـ AI
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            احصل على تقييم شامل ومفصل لمشروعك خلال ثوانٍ باستخدام تقنيات الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="card-luxury">
            <h2 className="text-2xl font-bold text-text-primary mb-6">معلومات المشروع</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  عنوان المشروع *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: منصة تعليمية ذكية"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">
                  التصنيف *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.Icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          formData.category === cat.value
                            ? 'gradient-bg text-white shadow-glow'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-hover border border-border'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  وصف المشروع *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="اشرح فكرة مشروعك بالتفصيل..."
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200 resize-none"
                />
              </div>

              {/* Funding Goal */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  هدف التمويل (ريال) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200"
                />
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  السوق المستهدف *
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="مثال: الطلاب والمعلمون في السعودية"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200"
                />
              </div>

              {/* Competitive Advantage */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  الميزة التنافسية *
                </label>
                <textarea
                  required
                  value={formData.competitiveAdvantage}
                  onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
                  rows={3}
                  placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                  className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 gradient-bg text-white rounded-xl font-bold text-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>جاري التقييم...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>احصل على التقييم</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!evaluation && !loading && (
              <div className="card-luxury text-center py-20">
                <Brain className="w-20 h-20 text-teal mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">جاهز للتقييم</h3>
                <p className="text-text-muted">
                  املأ النموذج واحصل على تقييم شامل ومفصل لمشروعك
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8 text-right">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-text-primary">تقييم الابتكار</p>
                      <p className="text-sm text-text-muted">تحليل مدى ابتكارية الفكرة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-text-primary">جدوى السوق</p>
                      <p className="text-sm text-text-muted">تقييم فرص النجاح</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-text-primary">قابلية التنفيذ</p>
                      <p className="text-sm text-text-muted">إمكانية تطبيق الفكرة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-text-primary">الجدوى المالية</p>
                      <p className="text-sm text-text-muted">التوقعات المالية</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="card-luxury text-center py-20">
                <Loader className="w-16 h-16 text-teal mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">جاري التقييم...</h3>
                <p className="text-text-muted">
                  يتم تحليل مشروعك باستخدام الذكاء الاصطناعي
                </p>
              </div>
            )}

            {evaluation && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="card-luxury text-center">
                  <h3 className="text-lg font-medium text-text-secondary mb-4">التقييم الإجمالي</h3>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(evaluation.overallScore)}`}>
                    {evaluation.overallScore}
                    <span className="text-2xl">/100</span>
                  </div>
                  <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(evaluation.overallScore)} transition-all duration-1000`}
                      style={{ width: `${evaluation.overallScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Detailed Scores */}
                <div className="card-luxury space-y-4">
                  <h3 className="text-xl font-bold text-text-primary mb-4">التقييم التفصيلي</h3>
                  
                  {[
                    { key: 'innovation', label: 'الابتكار', Icon: Lightbulb },
                    { key: 'marketViability', label: 'جدوى السوق', Icon: TrendingUp },
                    { key: 'feasibility', label: 'قابلية التنفيذ', Icon: Target },
                    { key: 'financialProjection', label: 'الجدوى المالية', Icon: DollarSign },
                  ].map((item) => {
                    const Icon = item.Icon;
                    const score = evaluation.scores[item.key as keyof typeof evaluation.scores];
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-teal" />
                            <span className="font-medium text-text-primary">{item.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                            {score}/100
                          </span>
                        </div>
                        <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getScoreGradient(score)} transition-all duration-1000`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="card-luxury">
                  <h3 className="text-xl font-bold text-text-primary mb-4">الملخص</h3>
                  <p className="text-text-secondary leading-relaxed">{evaluation.summary}</p>
                </div>

                {/* Strengths */}
                <div className="card-luxury">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-teal" />
                    نقاط القوة
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-text-secondary">
                        <CheckCircle className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="card-luxury">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    نقاط الضعف
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-text-secondary">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="card-luxury">
                  <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple" />
                    التوصيات
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-text-secondary">
                        <Award className="w-5 h-5 text-purple flex-shrink-0 mt-0.5" />
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

