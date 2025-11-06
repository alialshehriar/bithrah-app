'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, Lightbulb,
  Target, Users, Zap
} from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

interface QuickFormData {
  idea: string;
  problem: string;
  targetAudience: string;
  category?: string;
}

const categories = [
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'health', label: 'الصحة', icon: Target },
  { value: 'education', label: 'التعليم', icon: Lightbulb },
  { value: 'business', label: 'الأعمال', icon: Target },
  { value: 'environment', label: 'البيئة', icon: Target },
  { value: 'other', label: 'أخرى', icon: Target },
];

interface Props {
  onBack: () => void;
  onSubmit: (data: QuickFormData) => void;
}

export default function QuickEvaluationForm({ onBack, onSubmit }: Props) {
  const [formData, setFormData] = useState<QuickFormData>({
    idea: '',
    problem: '',
    targetAudience: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.idea.trim()) {
      showToast({ type: 'error', title: 'الرجاء إدخال فكرتك' });
      return;
    }
    if (!formData.problem.trim()) {
      showToast({ type: 'error', title: 'الرجاء إدخال المشكلة التي تحلها' });
      return;
    }
    if (!formData.targetAudience.trim()) {
      showToast({ type: 'error', title: 'الرجاء إدخال الجمهور المستهدف' });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      showToast({ type: 'error', title: 'حدث خطأ أثناء إرسال النموذج' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            تقييم سريع ⚡
          </h1>
          <p className="text-lg text-gray-600">
            أجب على 3 أسئلة بسيطة ودعنا نكمل الباقي!
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question 1: Idea */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                <Lightbulb className="w-5 h-5 text-purple-500" />
                <span>1. وش فكرتك؟ *</span>
              </label>
              <Textarea
                value={formData.idea}
                onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                placeholder="مثال: منصة تعليمية تستخدم الذكاء الاصطناعي لتخصيص الدروس لكل طالب"
                rows={3}
                className="text-lg"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                اشرح فكرتك بجملة أو جملتين بسيطتين
              </p>
            </div>

            {/* Question 2: Problem */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                <Target className="w-5 h-5 text-pink-500" />
                <span>2. وش المشكلة اللي تحلها؟ *</span>
              </label>
              <Textarea
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="مثال: صعوبة التعلم الذاتي بسبب عدم تخصيص المحتوى التعليمي لمستوى كل طالب"
                rows={3}
                className="text-lg"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                وضح المشكلة الأساسية التي تريد حلها
              </p>
            </div>

            {/* Question 3: Target Audience */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                <Users className="w-5 h-5 text-cyan-500" />
                <span>3. مين الجمهور المستهدف؟ *</span>
              </label>
              <Input
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="مثال: الطلاب والمتعلمين في السعودية"
                className="text-lg"
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                من هم العملاء أو المستخدمين المستهدفين؟
              </p>
            </div>

            {/* Question 4: Category (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-3">
                <Zap className="w-5 h-5 text-orange-500" />
                <span>4. التصنيف (اختياري)</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      disabled={loading}
                      className={`
                        flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                        ${formData.category === cat.value
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-200 hover:border-purple-300 text-gray-700'
                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900 mb-2">
                    ماذا سيحدث بعد ذلك؟
                  </h3>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>الذكاء الاصطناعي سيحلل فكرتك ويقترح التفاصيل الكاملة</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>ستحصل على نموذج عمل مقترح وميزة تنافسية</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>ستتمكن من مراجعة التفاصيل وتعديلها قبل التقييم النهائي</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>رجوع</span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التحليل...</span>
                  </>
                ) : (
                  <>
                    <span>تحليل الفكرة بالذكاء الاصطناعي</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
