'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, AlertTriangle, Target, DollarSign,
  CheckCircle2, XCircle, BarChart3, Zap, Award, Shield,
  Rocket, Users, Clock, ChevronRight, Lightbulb, Brain
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AIEvaluationPage() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    fundingGoal: '',
    targetMarket: '',
    competitiveAdvantage: '',
  });
  const [evaluation, setEvaluation] = useState<any>(null);

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
    if (score >= 8) return 'from-green-500 to-emerald-600';
    if (score >= 6) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'ممتاز جداً';
    if (score >= 8) return 'ممتاز';
    if (score >= 7) return 'جيد جداً';
    if (score >= 6) return 'جيد';
    if (score >= 5) return 'مقبول';
    return 'يحتاج تحسين';
  };

  const categories = [
    { value: 'technology', label: 'التقنية', icon: Zap },
    { value: 'education', label: 'التعليم', icon: Award },
    { value: 'health', label: 'الصحة', icon: Shield },
    { value: 'finance', label: 'المالية', icon: DollarSign },
    { value: 'ecommerce', label: 'التجارة الإلكترونية', icon: Rocket },
    { value: 'social', label: 'التواصل الاجتماعي', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Navigation />
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#14B8A6]/20 to-[#8B5CF6]/20 rounded-full mb-6">
            <Brain className="w-6 h-6 text-[#14B8A6]" />
            <span className="text-lg font-bold bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] bg-clip-text text-transparent">
              تقييم ذكي بالـ AI
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            قيّم مشروعك بالذكاء الاصطناعي
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على تقييم شامل ومفصل لمشروعك خلال ثوانٍ باستخدام تقنيات الذكاء الاصطناعي المتقدمة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <h2 className="text-3xl font-black text-gray-900 mb-6">معلومات المشروع</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    عنوان المشروع *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#14B8A6] focus:outline-none transition-all"
                    placeholder="مثال: منصة تعليمية ذكية"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    التصنيف *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.value })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.category === cat.value
                              ? 'border-[#14B8A6] bg-[#14B8A6]/10'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            formData.category === cat.value ? 'text-[#14B8A6]' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-bold ${
                            formData.category === cat.value ? 'text-[#14B8A6]' : 'text-gray-600'
                          }`}>
                            {cat.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    وصف المشروع *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#14B8A6] focus:outline-none transition-all resize-none"
                    placeholder="اشرح فكرة مشروعك بالتفصيل..."
                  />
                </div>

                {/* Funding Goal */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    هدف التمويل (ريال سعودي) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.fundingGoal}
                    onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#14B8A6] focus:outline-none transition-all"
                    placeholder="100000"
                  />
                </div>

                {/* Target Market */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    السوق المستهدف
                  </label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#14B8A6] focus:outline-none transition-all"
                    placeholder="مثال: الطلاب والمعلمين في المملكة"
                  />
                </div>

                {/* Competitive Advantage */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الميزة التنافسية
                  </label>
                  <textarea
                    value={formData.competitiveAdvantage}
                    onChange={(e) => setFormData({ ...formData, competitiveAdvantage: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#14B8A6] focus:outline-none transition-all resize-none"
                    placeholder="ما الذي يميز مشروعك عن المنافسين؟"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري التقييم...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>احصل على التقييم</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {evaluation ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Overall Score */}
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getScoreColor(evaluation.overallScore)} opacity-10`} />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black text-gray-900">التقييم الإجمالي</h3>
                        <Award className="w-8 h-8 text-[#14B8A6]" />
                      </div>
                      
                      <div className="flex items-end gap-4 mb-4">
                        <div className={`text-7xl font-black bg-gradient-to-r ${getScoreColor(evaluation.overallScore)} bg-clip-text text-transparent`}>
                          {evaluation.overallScore}
                        </div>
                        <div className="text-3xl font-bold text-gray-400 mb-2">/10</div>
                      </div>
                      
                      <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor(evaluation.overallScore)} text-white font-bold`}>
                        {getScoreLabel(evaluation.overallScore)}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">التقييم التفصيلي</h3>
                    
                    <div className="space-y-4">
                      {[
                        { label: 'الابتكار', score: evaluation.innovationScore, icon: Lightbulb },
                        { label: 'جدوى السوق', score: evaluation.marketViabilityScore, icon: TrendingUp },
                        { label: 'الجدوى المالية', score: evaluation.financialViabilityScore, icon: DollarSign },
                        { label: 'قابلية التنفيذ', score: evaluation.executionFeasibilityScore, icon: Target },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Icon className="w-5 h-5 text-[#14B8A6]" />
                                <span className="font-bold text-gray-900">{item.label}</span>
                              </div>
                              <span className={`text-xl font-black bg-gradient-to-r ${getScoreColor(item.score)} bg-clip-text text-transparent`}>
                                {item.score}/10
                              </span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.score / 10) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className={`h-full bg-gradient-to-r ${getScoreColor(item.score)} rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Strengths */}
                  {evaluation.strengths && evaluation.strengths.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">نقاط القوة</h3>
                      </div>
                      
                      <ul className="space-y-3">
                        {evaluation.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">نقاط التحسين</h3>
                      </div>
                      
                      <ul className="space-y-3">
                        {evaluation.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {evaluation.recommendations && evaluation.recommendations.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">التوصيات</h3>
                      </div>
                      
                      <ul className="space-y-3">
                        {evaluation.recommendations.map((recommendation: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200 shadow-2xl text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-[#14B8A6]" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">جاهز للتقييم</h3>
                  <p className="text-gray-600 mb-6">
                    املأ النموذج واحصل على تقييم شامل ومفصل لمشروعك
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      'تقييم الابتكار',
                      'جدوى السوق',
                      'الجدوى المالية',
                      'قابلية التنفيذ',
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

