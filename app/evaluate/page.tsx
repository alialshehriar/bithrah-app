'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb,
  DollarSign, Users, BarChart3, CheckCircle, XCircle,
  ArrowLeft, Loader2, Send
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function EvaluatePage() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState({
    ideaTitle: '',
    ideaDescription: '',
    category: '',
    targetMarket: '',
  });
  const [evaluation, setEvaluation] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ideaTitle.trim() || !formData.ideaDescription.trim()) {
      toast.error('يرجى تقديم عنوان ووصف الفكرة');
      return;
    }

    setStep('loading');

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setEvaluation(data.evaluation);
        setStep('result');
        toast.success('تم تقييم الفكرة بنجاح!');
      } else {
        toast.error(data.error || 'فشل التقييم');
        setStep('form');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء التقييم');
      setStep('form');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-600';
    if (score >= 6) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <Toaster position="top-center" />
      <Navigation />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/home" className="inline-flex items-center text-slate-600 hover:text-teal-600 mb-8">
          <ArrowLeft className="w-5 h-5 ml-2" />
          العودة للرئيسية
        </Link>

        {/* Form Step */}
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">تقييم الأفكار بالذكاء الاصطناعي</h1>
                    <p className="text-white/90">احصل على تقييم احترافي ودقيق لفكرتك التجارية</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    عنوان الفكرة *
                  </label>
                  <input
                    type="text"
                    value={formData.ideaTitle}
                    onChange={(e) => setFormData({ ...formData, ideaTitle: e.target.value })}
                    placeholder="مثال: منصة توصيل الطعام الصحي"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    وصف الفكرة *
                  </label>
                  <textarea
                    value={formData.ideaDescription}
                    onChange={(e) => setFormData({ ...formData, ideaDescription: e.target.value })}
                    placeholder="اشرح فكرتك بالتفصيل: ما هي المشكلة التي تحلها؟ من هم العملاء المستهدفون؟ كيف ستحقق الإيرادات؟"
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      الفئة
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">اختر الفئة</option>
                      <option value="تقنية">تقنية</option>
                      <option value="صحة">صحة</option>
                      <option value="تعليم">تعليم</option>
                      <option value="طعام">طعام ومشروبات</option>
                      <option value="تجارة">تجارة إلكترونية</option>
                      <option value="خدمات">خدمات</option>
                      <option value="ترفيه">ترفيه</option>
                      <option value="أخرى">أخرى</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      السوق المستهدف
                    </label>
                    <input
                      type="text"
                      value={formData.targetMarket}
                      onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                      placeholder="مثال: الشباب في السعودية"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                    نصائح للحصول على تقييم دقيق:
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>كن واضحاً ومحدداً في وصف الفكرة</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>اذكر المشكلة التي تحلها فكرتك</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>حدد السوق المستهدف والعملاء المحتملين</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>اشرح كيف ستحقق الإيرادات</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                  تقييم الفكرة الآن
                </button>
              </form>
            </motion.div>
          )}

          {/* Loading Step */}
          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">جاري تقييم فكرتك...</h2>
              <p className="text-slate-600 mb-6">يقوم الذكاء الاصطناعي بتحليل فكرتك بدقة</p>
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && evaluation && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className={`bg-gradient-to-r ${getScoreGradient(evaluation.score)} rounded-3xl shadow-2xl p-8 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">نتيجة التقييم</h2>
                    <p className="text-white/90">تحليل شامل لفكرتك التجارية</p>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">{evaluation.score}</div>
                    <div className="text-white/90">من 10</div>
                  </div>
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  نقاط القوة
                </h3>
                <ul className="space-y-3">
                  {evaluation.strengths?.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-green-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  نقاط الضعف
                </h3>
                <ul className="space-y-3">
                  {evaluation.weaknesses?.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue-600" />
                  الفرص
                </h3>
                <ul className="space-y-3">
                  {evaluation.opportunities?.map((opportunity: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{opportunity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  المخاطر
                </h3>
                <ul className="space-y-3">
                  {evaluation.risks?.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                  التوصيات
                </h3>
                <ul className="space-y-3">
                  {evaluation.recommendations?.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-slate-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Market Analysis */}
              {evaluation.marketAnalysis && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-teal-600" />
                    تحليل السوق
                  </h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{evaluation.marketAnalysis}</p>
                </div>
              )}

              {/* Financial Projection */}
              {evaluation.financialProjection && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    التوقعات المالية
                  </h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{evaluation.financialProjection}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setStep('form');
                    setFormData({ ideaTitle: '', ideaDescription: '', category: '', targetMarket: '' });
                    setEvaluation(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  تقييم فكرة جديدة
                </button>
                <Link
                  href="/home"
                  className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all text-center"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

