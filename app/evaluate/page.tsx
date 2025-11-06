'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, Target, TrendingUp, Users, DollarSign,
  AlertCircle, CheckCircle, Lightbulb, BarChart3, Shield,
  Zap, Clock, Globe, Award, ArrowRight, Loader2
} from 'lucide-react';
import ProgressSteps from '@/components/ui/ProgressSteps';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

interface EvaluationResult {
  overallScore: number;
  marketPotential: number;
  feasibility: number;
  innovation: number;
  scalability: number;
  financialViability: number;
  competitiveAdvantage: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: string[];
  summary: string;
  estimatedFunding: {
    min: number;
    max: number;
  };
  timeToMarket: string;
  targetAudience: string;
  keySuccessFactors: string[];
}

const categories = [
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'health', label: 'الصحة', icon: Shield },
  { value: 'education', label: 'التعليم', icon: Brain },
  { value: 'business', label: 'الأعمال', icon: TrendingUp },
  { value: 'environment', label: 'البيئة', icon: Globe },
  { value: 'other', label: 'أخرى', icon: Target },
];

export default function EvaluatePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(process.env.NEXT_PUBLIC_DEMO_MODE === 'true');
  }, []);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    problem: '',
    solution: '',
    targetMarket: '',
    competitiveAdvantage: '',
    businessModel: '',
    fundingNeeded: '',
    timeline: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      console.log('API Response:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (data.success) {
        setResult(data.evaluation);
        setStep(3);
      } else {
        alert('حدث خطأ أثناء التقييم. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error evaluating idea:', error);
      alert('حدث خطأ أثناء التقييم. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = () => {
    if (step === 1) {
      return formData.title && formData.category && formData.description;
    }
    if (step === 2) {
      return formData.problem && formData.solution && formData.targetMarket &&
             formData.competitiveAdvantage && formData.businessModel;
    }
    return true;
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            className={`${
              score >= 80 ? 'text-green-500' :
              score >= 60 ? 'text-blue-500' :
              score >= 40 ? 'text-yellow-500' :
              'text-red-500'
            } transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 pb-24">
      {/* Demo Mode Notice */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-amber-900">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">نسخة تجريبية - النسخة النهائية قريباً</span>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
                <Sparkles className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">تقييم الفكرة بالذكاء الاصطناعي</h1>
            <p className="text-xl text-white/90 mb-2">احصل على تقييم شامل ودقيق لفكرتك الاستثمارية</p>
            <p className="text-lg text-white/80">مدعوم بتقنية GPT-4 من OpenAI</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <AnimatePresence mode="wait">
          {step < 3 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
            >
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    الخطوة {step} من 2
                  </span>
                  <span className="text-sm font-medium text-purple-600">
                    {Math.round((step / 2) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-teal-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 2) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">المعلومات الأساسية</h2>
                    <p className="text-gray-600">أخبرنا عن فكرتك الاستثمارية</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الفكرة *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="مثال: منصة تعليمية بالذكاء الاصطناعي"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التصنيف *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            onClick={() => handleInputChange('category', cat.value)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                              formData.category === cat.value
                                ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        وصف الفكرة *
                      </label>
                      <span className="text-sm text-gray-500">
                        {formData.description.length} / 1000 حرف
                      </span>
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="اشرح فكرتك بالتفصيل..."
                      rows={5}
                      maxLength={1000}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Detailed Info */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">التفاصيل الاستراتيجية</h2>
                    <p className="text-gray-600">معلومات إضافية لتقييم أدق</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المشكلة التي تحلها *
                    </label>
                    <textarea
                      value={formData.problem}
                      onChange={(e) => handleInputChange('problem', e.target.value)}
                      placeholder="ما المشكلة التي تعالجها فكرتك؟"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحل المقترح *
                    </label>
                    <textarea
                      value={formData.solution}
                      onChange={(e) => handleInputChange('solution', e.target.value)}
                      placeholder="كيف تحل فكرتك هذه المشكلة؟"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      السوق المستهدف *
                    </label>
                    <input
                      type="text"
                      value={formData.targetMarket}
                      onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                      placeholder="من هم عملاؤك المستهدفون؟"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الميزة التنافسية *
                    </label>
                    <textarea
                      value={formData.competitiveAdvantage}
                      onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                      placeholder="ما الذي يميز فكرتك عن المنافسين؟"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نموذج العمل *
                    </label>
                    <textarea
                      value={formData.businessModel}
                      onChange={(e) => handleInputChange('businessModel', e.target.value)}
                      placeholder="كيف ستحقق الإيرادات؟"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التمويل المطلوب (اختياري)
                      </label>
                      <input
                        type="text"
                        value={formData.fundingNeeded}
                        onChange={(e) => handleInputChange('fundingNeeded', e.target.value)}
                        placeholder="مثال: 500,000 ريال"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        الإطار الزمني (اختياري)
                      </label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => handleInputChange('timeline', e.target.value)}
                        placeholder="مثال: 6-12 شهر"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-all"
                  >
                    السابق
                  </button>
                )}
                
                {step < 2 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!isStepComplete()}
                    className={`mr-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      isStepComplete()
                        ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    التالي
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleEvaluate}
                    disabled={!isStepComplete() || loading}
                    className={`mr-auto px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      isStepComplete() && !loading
                        ? 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري التقييم...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        تقييم الفكرة
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {step === 3 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-3xl p-8 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">التقييم الإجمالي</h2>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - result.overallScore / 100)}`}
                        className="text-white transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold">{result.overallScore}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-white/90">{result.summary}</p>
              </div>

              {/* Detailed Scores */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">التقييم التفصيلي</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <ScoreCircle score={result.marketPotential} label="إمكانات السوق" />
                  <ScoreCircle score={result.feasibility} label="الجدوى" />
                  <ScoreCircle score={result.innovation} label="الابتكار" />
                  <ScoreCircle score={result.scalability} label="قابلية التوسع" />
                  <ScoreCircle score={result.financialViability} label="الجدوى المالية" />
                  <ScoreCircle score={result.competitiveAdvantage} label="الميزة التنافسية" />
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">نقاط القوة</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.strengths.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                    <h3 className="text-xl font-bold text-gray-900">نقاط الضعف</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.weaknesses.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-xl font-bold text-gray-900">الفرص</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.opportunities.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-900">التهديدات</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.threats.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Insights */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                  <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">التمويل المقترح</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.estimatedFunding.min.toLocaleString()} - {result.estimatedFunding.max.toLocaleString()} ر.س
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                  <Clock className="w-8 h-8 text-green-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">الوقت للسوق</h4>
                  <p className="text-2xl font-bold text-green-600">{result.timeToMarket}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
                  <Users className="w-8 h-8 text-purple-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">الجمهور المستهدف</h4>
                  <p className="text-lg font-bold text-purple-600">{result.targetAudience}</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 text-teal-600" />
                  <h3 className="text-2xl font-bold text-gray-900">التوصيات</h3>
                </div>
                <ul className="space-y-3">
                  {result.recommendations.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Success Factors */}
              <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-3xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-6 h-6 text-teal-600" />
                  <h3 className="text-2xl font-bold text-gray-900">عوامل النجاح الرئيسية</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.keySuccessFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white rounded-xl p-4">
                      <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                      <span className="text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                    setFormData({
                      title: '',
                      category: '',
                      description: '',
                      problem: '',
                      solution: '',
                      targetMarket: '',
                      competitiveAdvantage: '',
                      businessModel: '',
                      fundingNeeded: '',
                      timeline: '',
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  تقييم فكرة جديدة
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  طباعة التقرير
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

