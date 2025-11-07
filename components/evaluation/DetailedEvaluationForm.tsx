'use client';

import { useState } from 'react';

interface DetailedEvaluationFormProps {
  onResults: (results: any) => void;
  onBack: () => void;
}

const categories = [
  { id: 'tech', label: 'التقنية' },
  { id: 'health', label: 'الصحة' },
  { id: 'education', label: 'التعليم' },
  { id: 'business', label: 'الأعمال' },
  { id: 'environment', label: 'البيئة' },
  { id: 'other', label: 'أخرى' },
];

export default function DetailedEvaluationForm({ onResults, onBack }: DetailedEvaluationFormProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    idea: '',
    problem: '',
    solution: '',
    targetAudience: '',
    competitors: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/evaluate/detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التقييم');
      }

      onResults(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">تقييم تفصيلي</h2>
          <p className="text-gray-600">املأ التفاصيل للحصول على تقييم شامل ودقيق</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              1. اسم المشروع *
            </label>
            <input
              type="text"
              required
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
              placeholder="مثال: منصة تعليم"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              2. وصف الفكرة *
            </label>
            <textarea
              required
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="اشرح فكرتك بالتفصيل..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              3. المشكلة *
            </label>
            <textarea
              required
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
              rows={3}
              placeholder="ما المشكلة التي يحلها مشروعك؟"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              4. الحل المقترح *
            </label>
            <textarea
              required
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
              rows={4}
              placeholder="كيف يحل مشروعك هذه المشكلة؟"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              5. الجمهور المستهدف *
            </label>
            <input
              type="text"
              required
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
              placeholder="من هم عملاؤك المستهدفون؟"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              6. المنافسون *
            </label>
            <textarea
              required
              value={formData.competitors}
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
              rows={3}
              placeholder="من هم منافسوك الرئيسيون؟"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              7. التصنيف (اختياري)
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
            >
              <option value="">اختر التصنيف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
            >
              رجوع
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري التحليل التفصيلي...
                </>
              ) : (
                'تحليل المشروع بالذكاء الاصطناعي'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
