'use client';

import { useState } from 'react';
import { Brain, Sparkles, TrendingUp, Target, DollarSign, Users, Zap, Award, Lightbulb, CheckCircle, AlertTriangle, Loader, FileText, Heart, Shield, Sun, Leaf, Eye } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface HatScore {
  score: number;
  analysis: string;
}

interface EvaluationResult {
  scores: {
    facts: HatScore;
    emotions: HatScore;
    risks: HatScore;
    opportunities: HatScore;
    innovation: HatScore;
    overall: HatScore;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  marketFit: string;
  successProbability: number;
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
    if (score >= 8) return 'text-teal-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-teal-500 to-cyan-500';
    if (score >= 6) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScorePercentage = (score: number) => {
    return (score / 10) * 100;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-3xl bg-gradient-to-r from-teal-500 to-purple-600 mb-4">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
            تقييم ذكي بالـ AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            احصل على تقييم شامل ومفصل لمشروعك خلال ثوانٍ باستخدام تقنيات الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات المشروع</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان المشروع *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: منصة تعليمية ذكية"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-900 transition-all duration-200"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
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
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف المشروع *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="اشرح فكرة مشروعك بالتفصيل..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-900 transition-all duration-200 resize-none"
                />
              </div>

              {/* Funding Goal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  هدف التمويل (ريال) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  placeholder="100000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-900 transition-all duration-200"
                />
              </div>

              {/* Target Market */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السوق المستهدف *
                </label>
                <input
                  type="text"
                  required
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  placeholder="مثال: الطلاب والمعلمون في السعودية"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-900 transition-all duration-200"
                />
              </div>

              {/* Competitive Advantage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الميزة التنافسية *
                </label>
                <textarea
                  required
                  value={formData.competitiveAdvantage}
                  onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
                  rows={3}
                  placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-gray-900 transition-all duration-200 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center py-20">
                <Brain className="w-20 h-20 text-teal-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">جاهز للتقييم</h3>
                <p className="text-gray-600">
                  املأ النموذج واحصل على تقييم شامل ومفصل لمشروعك
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-8 text-right">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">تحليل مدى ابتكارية الفكرة</p>
                      <p className="text-sm text-gray-600">تقييم الابتكار والإبداع</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">تقييم فرص النجاح</p>
                      <p className="text-sm text-gray-600">احتمالية النجاح في السوق</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">التوقعات المالية</p>
                      <p className="text-sm text-gray-600">تحليل الجدوى المالية</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">إمكانية تطبيق الفكرة</p>
                      <p className="text-sm text-gray-600">قابلية التنفيذ العملي</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center py-20">
                <Loader className="w-16 h-16 text-teal-500 mx-auto mb-4 animate-spin" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">جاري التقييم...</h3>
                <p className="text-gray-600">
                  يتم تحليل مشروعك باستخدام الذكاء الاصطناعي
                </p>
              </div>
            )}

            {evaluation && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">التقييم الإجمالي</h3>
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(evaluation.scores.overall.score)}`}>
                    {evaluation.scores.overall.score}
                    <span className="text-2xl">/10</span>
                  </div>
                  <p className="text-gray-600 mb-4">{evaluation.scores.overall.analysis}</p>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(evaluation.scores.overall.score)} transition-all duration-1000`}
                      style={{ width: `${getScorePercentage(evaluation.scores.overall.score)}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 p-4 bg-teal-50 rounded-xl">
                    <p className="text-sm font-medium text-teal-900">احتمالية النجاح</p>
                    <p className="text-3xl font-bold text-teal-600">{evaluation.successProbability}%</p>
                  </div>
                </div>

                {/* Six Hats Scores */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">تقييم القبعات الست</h3>
                  
                  {[
                    { key: 'facts', label: 'القبعة البيضاء - الحقائق والبيانات', Icon: FileText, color: 'gray' },
                    { key: 'emotions', label: 'القبعة الحمراء - المشاعر والحدس', Icon: Heart, color: 'red' },
                    { key: 'risks', label: 'القبعة السوداء - المخاطر والتحديات', Icon: Shield, color: 'gray' },
                    { key: 'opportunities', label: 'القبعة الصفراء - الفرص والإيجابيات', Icon: Sun, color: 'yellow' },
                    { key: 'innovation', label: 'القبعة الخضراء - الإبداع والابتكار', Icon: Leaf, color: 'green' },
                  ].map((item) => {
                    const Icon = item.Icon;
                    const hatData = evaluation.scores[item.key as keyof typeof evaluation.scores] as HatScore;
                    return (
                      <div key={item.key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 text-${item.color}-600`} />
                            <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(hatData.score)}`}>
                            {hatData.score}/10
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 pr-7">{hatData.analysis}</p>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getScoreGradient(hatData.score)} transition-all duration-1000`}
                            style={{ width: `${getScorePercentage(hatData.score)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Market Fit */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">ملاءمة السوق</h3>
                  <p className="text-gray-700 leading-relaxed">{evaluation.marketFit}</p>
                </div>

                {/* Strengths */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                    نقاط القوة
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    نقاط الضعف
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    التوصيات
                  </h3>
                  <ul className="space-y-2">
                    {evaluation.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
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

