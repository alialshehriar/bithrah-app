'use client';

import { useState } from 'react';

interface UnifiedEvaluationFormProps {
  onResults: (results: any, formData: any) => void;
  onBack: () => void;
}

const categories = [
  { id: 'tech', label: 'التقنية', icon: '💻' },
  { id: 'health', label: 'الصحة', icon: '🏥' },
  { id: 'education', label: 'التعليم', icon: '📚' },
  { id: 'business', label: 'الأعمال', icon: '💼' },
  { id: 'environment', label: 'البيئة', icon: '🌱' },
  { id: 'finance', label: 'المالية', icon: '💰' },
  { id: 'entertainment', label: 'الترفيه', icon: '🎮' },
  { id: 'other', label: 'أخرى', icon: '🔷' },
];

export default function UnifiedEvaluationForm({ onResults, onBack }: UnifiedEvaluationFormProps) {
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
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء التقييم');
      }

      onResults(data.result, formData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">تقييم فكرتك الريادية</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            احصل على تحليل شامل ومفصل لفكرتك مدعوم بـ <span className="font-bold text-purple-600">GPT-4 Turbo</span> من OpenAI
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-sm text-purple-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>املأ المعلومات المتوفرة لديك - سنساعدك في البقية!</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name - Optional */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              اسم المشروع <span className="text-sm font-normal text-gray-500">(اختياري)</span>
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              placeholder="مثال: منصة تعليم الأطفال"
            />
          </div>

          {/* Idea - Required */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              وش فكرتك؟ *
            </label>
            <textarea
              required
              value={formData.idea}
              onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              rows={3}
              placeholder="اشرح فكرتك بشكل بسيط... حتى لو مو واضحة تماماً، سنساعدك!"
            />
            <p className="mt-2 text-sm text-gray-500">💡 نصيحة: اكتب أي شيء يخطر ببالك - لا تقلق من التفاصيل</p>
          </div>

          {/* Problem - Required */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              وش المشكلة اللي تحلها؟ *
            </label>
            <textarea
              required
              value={formData.problem}
              onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              rows={3}
              placeholder="وش المشكلة أو الحاجة اللي فكرتك بتحلها؟"
            />
          </div>

          {/* Solution - Optional but helpful */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              كيف بتحل المشكلة؟ <span className="text-sm font-normal text-gray-500">(اختياري)</span>
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              rows={3}
              placeholder="إذا عندك تصور للحل، اكتبه هنا... وإلا لا تقلق!"
            />
            <p className="mt-2 text-sm text-gray-500">💡 إذا ما عندك حل واضح، سنساعدك نطوره!</p>
          </div>

          {/* Target Audience - Required */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              مين الجمهور المستهدف؟ *
            </label>
            <input
              type="text"
              required
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              placeholder="مثال: الطلاب والمتعلمين في السعودية"
            />
          </div>

          {/* Competitors - Optional */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              مين منافسينك؟ <span className="text-sm font-normal text-gray-500">(اختياري)</span>
            </label>
            <textarea
              value={formData.competitors}
              onChange={(e) => setFormData({ ...formData, competitors: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
              rows={2}
              placeholder="إذا تعرف منافسين في نفس المجال، اذكرهم هنا"
            />
          </div>

          {/* Category - Optional */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              التصنيف <span className="text-sm font-normal text-gray-500">(اختياري)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.label })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.category === cat.label
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300 text-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-semibold">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              رجوع
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>جاري التحليل بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>تحليل الفكرة بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            ماذا سيحدث بعد ذلك؟
          </h3>
          <ul className="space-y-2 text-purple-800">
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">✓</span>
              <span>الذكاء الاصطناعي سيحلل فكرتك ويقترح التفاصيل الكاملة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">✓</span>
              <span>ستحصل على نموذج عمل متقدم وميزة تنافسية</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500 mt-1">✓</span>
              <span>ستتمكن من مراجعة التفاصيل وتعديلها قبل التقييم النهائي</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
