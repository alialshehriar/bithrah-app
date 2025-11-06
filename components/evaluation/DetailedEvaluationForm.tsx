'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, Brain, Target, Users, DollarSign, Clock, Zap, Shield, Globe, TrendingUp
} from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

const categories = [
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'health', label: 'الصحة', icon: Shield },
  { value: 'education', label: 'التعليم', icon: Brain },
  { value: 'business', label: 'الأعمال', icon: TrendingUp },
  { value: 'environment', label: 'البيئة', icon: Globe },
  { value: 'other', label: 'أخرى', icon: Target },
];

interface Props {
  onBack: () => void;
  onSubmit: (data: any) => void;
}

export default function DetailedEvaluationForm({ onBack, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

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

  const handleNext = () => {
    if (!isStepComplete()) {
      showToast('الرجاء إكمال جميع الحقول المطلوبة', 'error');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!isStepComplete()) {
      showToast('الرجاء إكمال جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      showToast('حدث خطأ أثناء التقييم', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            تقييم تفصيلي 📋
          </h1>
          <p className="text-lg text-gray-600">
            املأ جميع التفاصيل للحصول على تقييم دقيق من 6 خبراء
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              الخطوة {step} من 2
            </span>
            <span className="text-sm font-medium text-cyan-600">
              {Math.round((step / 2) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 2) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        >
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">المعلومات الأساسية</h2>
                <p className="text-gray-600">أخبرنا عن فكرتك الاستثمارية</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الفكرة *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="مثال: منصة تعليمية بالذكاء الاصطناعي"
                  disabled={loading}
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
                        disabled={loading}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                          formData.category === cat.value
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الفكرة *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="اشرح فكرتك بالتفصيل..."
                  rows={5}
                  disabled={loading}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">التفاصيل الاستراتيجية</h2>
                <p className="text-gray-600">معلومات إضافية لتقييم أدق</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المشكلة التي تحلها *
                </label>
                <Textarea
                  value={formData.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  placeholder="ما هي المشكلة الأساسية التي تحلها فكرتك؟"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحل المقترح *
                </label>
                <Textarea
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="كيف تحل فكرتك هذه المشكلة؟"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السوق المستهدف *
                </label>
                <Input
                  value={formData.targetMarket}
                  onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                  placeholder="من هم عملاؤك المستهدفون؟"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الميزة التنافسية *
                </label>
                <Textarea
                  value={formData.competitiveAdvantage}
                  onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
                  placeholder="ما الذي يميز فكرتك عن المنافسين؟"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نموذج العمل *
                </label>
                <Textarea
                  value={formData.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  placeholder="كيف ستحقق الإيرادات؟"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التمويل المطلوب (اختياري)
                  </label>
                  <Input
                    value={formData.fundingNeeded}
                    onChange={(e) => handleInputChange('fundingNeeded', e.target.value)}
                    placeholder="مثال: 500,000 ريال"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الإطار الزمني (اختياري)
                  </label>
                  <Input
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    placeholder="مثال: 12 شهر"
                    disabled={loading}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={step === 1 ? onBack : () => setStep(1)}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>رجوع</span>
            </button>

            {step === 1 ? (
              <button
                onClick={handleNext}
                disabled={loading || !isStepComplete()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>التالي</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepComplete()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التقييم...</span>
                  </>
                ) : (
                  <>
                    <span>تقييم الفكرة</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
