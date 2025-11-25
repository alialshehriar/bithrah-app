'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Rocket } from 'lucide-react';

interface EvaluationResultsProps {
  results: {
    score: number;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    risks: string[];
    recommendations: string[];
    marketAnalysis: string;
    financialProjection: string;
  };
  formData: {
    projectName: string;
    idea: string;
    problem: string;
    solution: string;
    targetAudience: string;
    competitors: string;
    category: string;
  };
  onReset: () => void;
}

export default function EvaluationResults({ results, formData, onReset }: EvaluationResultsProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [evaluationId, setEvaluationId] = useState<number | null>(null);

  useEffect(() => {
    saveEvaluation();
  }, []);

  const saveEvaluation = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/evaluations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ...results,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaved(true);
        setEvaluationId(data.evaluation.id);
      }
    } catch (error) {
      console.error('Failed to save evaluation:', error);
    } finally {
      setSaving(false);
    }
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'text-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'ممتاز جداً';
    if (score >= 80) return 'ممتاز';
    if (score >= 70) return 'جيد جداً';
    if (score >= 60) return 'جيد';
    if (score >= 50) return 'مقبول';
    return 'يحتاج تطوير';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">نتائج التقييم</h2>
          <div className={`inline-flex flex-col items-center justify-center w-40 h-40 rounded-full ${getScoreBg(results.score)} mb-4`}>
            <span className={`text-6xl font-bold ${getScoreColor(results.score)}`}>
              {results.score}
            </span>
            <span className="text-sm font-semibold text-gray-700 mt-1">
              {getScoreLabel(results.score)}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <span>✅</span> نقاط القوة
            </h3>
            <ul className="space-y-2">
              {results.strengths.map((item, i) => (
                <li key={i} className="text-green-800 flex gap-2">
                  <span className="text-green-600 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <span>⚠️</span> نقاط الضعف
            </h3>
            <ul className="space-y-2">
              {results.weaknesses.map((item, i) => (
                <li key={i} className="text-red-800 flex gap-2">
                  <span className="text-red-600 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span>🚀</span> الفرص
            </h3>
            <ul className="space-y-2">
              {results.opportunities.map((item, i) => (
                <li key={i} className="text-blue-800 flex gap-2">
                  <span className="text-blue-600 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
              <span>⚡</span> المخاطر
            </h3>
            <ul className="space-y-2">
              {results.risks.map((item, i) => (
                <li key={i} className="text-orange-800 flex gap-2">
                  <span className="text-orange-600 font-bold">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <span>💡</span> التوصيات الاستراتيجية
          </h3>
          <ul className="space-y-2">
            {results.recommendations.map((item, i) => (
              <li key={i} className="text-purple-800 flex gap-2">
                <span className="text-purple-600 font-bold">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> تحليل السوق
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{results.marketAnalysis}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span> التوقعات المالية
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{results.financialProjection}</p>
        </div>

        {saving && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-blue-700 font-medium">جاري حفظ التقييم...</p>
          </div>
        )}

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-700 font-medium">✅ تم حفظ التقييم بنجاح!</p>
          </div>
        )}

        <div className="flex gap-4">
          {saved && evaluationId && (
            <button
              onClick={() => router.push(`/evaluations/${evaluationId}`)}
              className="flex-1 bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] text-white px-8 py-4 rounded-xl font-semibold hover:from-[#0F9D8F] hover:to-[#0D8B7F] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              عرض التقييم الكامل
            </button>
          )}
          <button
            onClick={onReset}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
          >
            تقييم فكرة جديدة
          </button>
        </div>
      </div>
    </div>
  );
}
