'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, 
  Calendar, ArrowRight, CheckCircle, XCircle, DollarSign,
  Users, BarChart3, Rocket, Download, Share2
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function EvaluationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    fetchEvaluation();
  }, [params.id]);

  const fetchEvaluation = async () => {
    try {
      const response = await fetch(`/api/evaluations/${params.id}`);
      const data = await response.json();

      if (!data.success) {
        router.push('/evaluations');
        return;
      }

      setEvaluation(data.evaluation);
    } catch (error) {
      console.error('Failed to fetch evaluation:', error);
      router.push('/evaluations');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToProject = async () => {
    setConverting(true);
    
    // Store evaluation data in localStorage to pre-fill project creation form
    localStorage.setItem('projectFromEvaluation', JSON.stringify({
      name: evaluation.projectName || '',
      description: evaluation.idea,
      problem: evaluation.problem,
      solution: evaluation.solution || '',
      targetAudience: evaluation.targetAudience,
      competitors: evaluation.competitors || '',
      category: evaluation.category || '',
      evaluationId: evaluation.id,
    }));

    // Redirect to project creation page
    router.push('/projects/create');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز - فكرة واعدة جداً';
    if (score >= 60) return 'جيد - فكرة قابلة للتطوير';
    if (score >= 40) return 'متوسط - تحتاج تحسينات';
    return 'ضعيف - تحتاج إعادة نظر';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20" dir="rtl">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header with Score */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => router.push('/evaluations')}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    ← العودة للتقييمات
                  </button>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {evaluation.projectName || 'فكرة بدون اسم'}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(evaluation.createdAt).toLocaleDateString('ar-SA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {evaluation.category && (
                    <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold">
                      {evaluation.category}
                    </span>
                  )}
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  {evaluation.idea}
                </p>
              </div>

              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${getScoreColor(evaluation.score)} flex flex-col items-center justify-center text-white mr-6 shadow-lg`}>
                <div className="text-5xl font-bold mb-1">{evaluation.score}</div>
                <div className="text-xs text-center px-2">{getScoreLabel(evaluation.score).split(' - ')[0]}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleConvertToProject}
                disabled={converting}
                className="flex-1 bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] hover:from-[#0F9D8F] hover:to-[#0D8B7F] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Rocket className="w-5 h-5" />
                {converting ? 'جاري التحويل...' : 'تحويل إلى مشروع'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                مشاركة
              </button>

              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                تحميل PDF
              </button>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">المشكلة</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{evaluation.problem}</p>
            </div>

            {evaluation.solution && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">الحل المقترح</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{evaluation.solution}</p>
              </div>
            )}
          </div>

          {/* Target Audience & Competitors */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">الجمهور المستهدف</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{evaluation.targetAudience}</p>
            </div>

            {evaluation.competitors && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">المنافسون</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{evaluation.competitors}</p>
              </div>
            )}
          </div>

          {/* SWOT Analysis */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">نقاط القوة</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.strengths?.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">نقاط الضعف</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.weaknesses?.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">الفرص</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.opportunities?.map((opportunity: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">المخاطر</h2>
              </div>
              <ul className="space-y-3">
                {evaluation.risks?.map((risk: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">التوصيات والخطوات التالية</h2>
            </div>
            <ul className="space-y-4">
              {evaluation.recommendations?.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start gap-3 bg-white rounded-xl p-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 pt-1">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Market Analysis */}
          {evaluation.marketAnalysis && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">تحليل السوق</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {evaluation.marketAnalysis}
              </p>
            </div>
          )}

          {/* Financial Projection */}
          {evaluation.financialProjection && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">التوقعات المالية</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {evaluation.financialProjection}
              </p>
            </div>
          )}

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] rounded-2xl shadow-lg p-8 text-center text-white">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-3">جاهز لتحويل فكرتك إلى مشروع؟</h3>
            <p className="text-teal-50 mb-6 text-lg">
              ابدأ الآن في جمع التمويل وتحقيق حلمك على منصة بذرة
            </p>
            <button
              onClick={handleConvertToProject}
              disabled={converting}
              className="bg-white text-[#14B8A6] hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center gap-3 disabled:opacity-50"
            >
              <Rocket className="w-5 h-5" />
              {converting ? 'جاري التحويل...' : 'تحويل إلى مشروع الآن'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
