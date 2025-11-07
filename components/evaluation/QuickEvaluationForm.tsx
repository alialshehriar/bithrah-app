'use client';

import { useState } from 'react';

interface QuickEvaluationFormProps {
  onResults: (results: any) => void;
  onBack: () => void;
}

const categories = [
  { id: 'tech', label: 'التقنية', icon: '💻' },
  { id: 'health', label: 'الصحة', icon: '🏥' },
  { id: 'education', label: 'التعليم', icon: '📚' },
  { id: 'business', label: 'الأعمال', icon: '💼' },
  { id: 'environment', label: 'البيئة', icon: '🌱' },
  { id: 'other', label: 'أخرى', icon: '🔷' },
];

export default function QuickEvaluationForm({ onResults, onBack }: QuickEvaluationFormProps) {
  const [formData, setFormData] = useState({
    idea: '',
    problem: '',
    targetAudience: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/evaluate/quick', {
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">تقييم سريع</h2>
          <p className="text-gray-600">أجب على 3 أسئلة بسيطة واحصل على تحليل شامل!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              1. وش فكرتك؟ *
            </label>
            <textarea
              required
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-colors resize-none"
              rows={3}
              placeholder="مثال: منصة تعليمية للأطفال تستخدم الألعاب التفاعلية"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              2. وش المشكلة اللي تحلها؟ *
            </label>
            <textarea
              required
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-colors resize-none"
              rows={3}
              placeholder="مثال: نقص المحتوى التعليمي الترفيهي للأطفال"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              3. مين الجمهور المستهدف؟ *
            </label>
            <input
              type="text"
              required
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 transition-colors"
              placeholder="مثال: الأطفال من 5-12 سنة في السعودية"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              4. التصنيف (اختياري)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === cat.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                </button>
              ))}
            </div>
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
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  جاري التحليل...
                </>
              ) : (
                'تحليل الفكرة بالذكاء الاصطناعي'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
