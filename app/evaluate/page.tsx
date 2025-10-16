'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, TrendingUp, Target, DollarSign, Users,
  Lightbulb, Shield, Zap, ArrowRight, CheckCircle, AlertCircle,
  BarChart3, PieChart, Activity, Award, Star, Rocket
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface EvaluationResult {
  overallScore: number;
  innovation: number;
  marketViability: number;
  financialFeasibility: number;
  executability: number;
  competitiveAdvantage: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  marketAnalysis: string;
  financialProjection: string;
  riskAssessment: string;
}

export default function EvaluatePage() {
  const [step, setStep] = useState(1);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    targetMarket: '',
    businessModel: '',
    fundingGoal: '',
    timeline: '',
    team: '',
    competitors: '',
  });

  const categories = [
    { value: 'technology', label: 'التقنية', icon: Zap },
    { value: 'health', label: 'الصحة', icon: Activity },
    { value: 'education', label: 'التعليم', icon: Lightbulb },
    { value: 'finance', label: 'المالية', icon: DollarSign },
    { value: 'retail', label: 'التجزئة', icon: Users },
    { value: 'services', label: 'الخدمات', icon: Target },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    
    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.evaluation);
        setStep(3);
      }
    } catch (error) {
      console.error('Error evaluating project:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-teal-600';
    if (score >= 4) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-600';
    if (score >= 6) return 'from-teal-500 to-cyan-600';
    if (score >= 4) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-teal-600 py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">تقييم بالذكاء الاصطناعي</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              قيّم فكرتك بذكاء اصطناعي متقدم
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              احصل على تقييم شامل ودقيق لفكرتك باستخدام أحدث تقنيات الذكاء الاصطناعي، مع تحليل عميق للسوق والجدوى المالية
            </p>

            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-white/80">دقة التقييم</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-white/80">معيار تقييم</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">5 دقائق</div>
                <div className="text-white/80">وقت التقييم</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">معلومات المشروع</h3>
                    <p className="text-sm text-gray-600">أخبرنا عن فكرتك</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">الخطوة 1 من 2</div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    عنوان المشروع
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="مثال: منصة توصيل طعام صحي"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    وصف الفكرة
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="اشرح فكرتك بالتفصيل..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    القطاع
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => handleInputChange('category', cat.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.category === cat.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            formData.category === cat.value ? 'text-purple-600' : 'text-gray-400'
                          }`} />
                          <div className={`text-sm font-semibold ${
                            formData.category === cat.value ? 'text-purple-600' : 'text-gray-600'
                          }`}>
                            {cat.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    السوق المستهدف
                  </label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                    placeholder="مثال: الشباب في المدن الكبرى"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    نموذج العمل
                  </label>
                  <textarea
                    value={formData.businessModel}
                    onChange={(e) => handleInputChange('businessModel', e.target.value)}
                    placeholder="كيف ستحقق الإيرادات؟"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  <span>التالي</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">تفاصيل إضافية</h3>
                    <p className="text-sm text-gray-600">معلومات تساعد في التقييم</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">الخطوة 2 من 2</div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    هدف التمويل (ريال سعودي)
                  </label>
                  <input
                    type="number"
                    value={formData.fundingGoal}
                    onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                    placeholder="100000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    الجدول الزمني المتوقع
                  </label>
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    placeholder="مثال: 6 أشهر للإطلاق"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    الفريق
                  </label>
                  <textarea
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    placeholder="اذكر خبرات الفريق..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    المنافسون
                  </label>
                  <textarea
                    value={formData.competitors}
                    onChange={(e) => handleInputChange('competitors', e.target.value)}
                    placeholder="من هم منافسوك الرئيسيون؟"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    السابق
                  </button>
                  <button
                    onClick={handleEvaluate}
                    disabled={isEvaluating}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>جاري التقييم...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>ابدأ التقييم</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && evaluation && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Overall Score */}
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-teal-600 rounded-3xl p-8 text-white text-center">
                <Award className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">التقييم الإجمالي</h2>
                <div className="text-7xl font-bold mb-4">{evaluation.overallScore}/10</div>
                <p className="text-white/90">
                  {evaluation.overallScore >= 8 ? 'فكرة ممتازة ذات إمكانيات عالية' :
                   evaluation.overallScore >= 6 ? 'فكرة جيدة تحتاج بعض التحسينات' :
                   'فكرة تحتاج إلى تطوير كبير'}
                </p>
              </div>

              {/* Detailed Scores */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">التقييم التفصيلي</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: 'الابتكار', value: evaluation.innovation, icon: Lightbulb },
                    { label: 'جدوى السوق', value: evaluation.marketViability, icon: TrendingUp },
                    { label: 'الجدوى المالية', value: evaluation.financialFeasibility, icon: DollarSign },
                    { label: 'قابلية التنفيذ', value: evaluation.executability, icon: Rocket },
                    { label: 'الميزة التنافسية', value: evaluation.competitiveAdvantage, icon: Star },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5 text-purple-600" />
                            <span className="font-semibold text-gray-900">{item.label}</span>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(item.value)}`}>
                            {item.value}/10
                          </span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value * 10}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full bg-gradient-to-r ${getScoreGradient(item.value)}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-bold text-green-900">نقاط القوة</h4>
                  </div>
                  <ul className="space-y-2">
                    {evaluation.strengths.map((strength, idx) => (
                      <li key={idx} className="text-green-800 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-3xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h4 className="text-lg font-bold text-red-900">نقاط الضعف</h4>
                  </div>
                  <ul className="space-y-2">
                    {evaluation.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-red-800 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">التوصيات</h3>
                </div>
                <ul className="space-y-3">
                  {evaluation.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-gray-800">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setEvaluation(null);
                    setFormData({
                      title: '',
                      description: '',
                      category: 'technology',
                      targetMarket: '',
                      businessModel: '',
                      fundingGoal: '',
                      timeline: '',
                      team: '',
                      competitors: '',
                    });
                  }}
                  className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  تقييم فكرة جديدة
                </button>
                <button
                  onClick={() => window.location.href = '/projects/create'}
                  className="flex-1 py-4 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  <span>أنشئ مشروعك الآن</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

