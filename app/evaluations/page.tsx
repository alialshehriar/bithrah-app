'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, TrendingUp, AlertTriangle, Target, Lightbulb, Calendar, Eye, Trash2, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function MyEvaluationsPage() {
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/evaluations');
      const data = await response.json();

      if (!data.success) {
        router.push('/auth/signin?redirect=/evaluations');
        return;
      }

      setEvaluations(data.evaluations || []);
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      router.push('/auth/signin?redirect=/evaluations');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    if (score >= 40) return 'متوسط';
    return 'ضعيف';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20" dir="rtl">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#14B8A6] to-[#0F9D8F] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">تقييماتي</h1>
                  <p className="text-gray-600">جميع تقييمات أفكارك بالذكاء الاصطناعي</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/evaluate')}
                className="bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] hover:from-[#0F9D8F] hover:to-[#0D8B7F] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                تقييم فكرة جديدة
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                <p className="text-blue-600 font-medium text-sm mb-1">إجمالي التقييمات</p>
                <p className="text-3xl font-bold text-blue-700">{evaluations.length}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                <p className="text-green-600 font-medium text-sm mb-1">أفكار ممتازة</p>
                <p className="text-3xl font-bold text-green-700">
                  {evaluations.filter(e => e.score >= 80).length}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                <p className="text-purple-600 font-medium text-sm mb-1">متوسط التقييم</p>
                <p className="text-3xl font-bold text-purple-700">
                  {evaluations.length > 0
                    ? Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length)
                    : 0}
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                <p className="text-orange-600 font-medium text-sm mb-1">هذا الشهر</p>
                <p className="text-3xl font-bold text-orange-700">
                  {evaluations.filter(e => {
                    const date = new Date(e.createdAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          {/* Evaluations List */}
          {evaluations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد تقييمات بعد</h3>
              <p className="text-gray-600 mb-6">ابدأ بتقييم فكرتك الأولى بالذكاء الاصطناعي</p>
              <button
                onClick={() => router.push('/evaluate')}
                className="bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] hover:from-[#0F9D8F] hover:to-[#0D8B7F] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
              >
                تقييم فكرة جديدة
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {evaluations.map((evaluation) => (
                <div key={evaluation.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {evaluation.projectName || 'فكرة بدون اسم'}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">{evaluation.idea}</p>
                      </div>

                      <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${getScoreColor(evaluation.score)} flex flex-col items-center justify-center text-white mr-4`}>
                        <div className="text-3xl font-bold">{evaluation.score}</div>
                        <div className="text-xs">{getScoreLabel(evaluation.score)}</div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">نقاط القوة</p>
                          <p className="font-bold text-gray-900">{evaluation.strengths?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-600">نقاط الضعف</p>
                          <p className="font-bold text-gray-900">{evaluation.weaknesses?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">الفرص</p>
                          <p className="font-bold text-gray-900">{evaluation.opportunities?.length || 0}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600">التوصيات</p>
                          <p className="font-bold text-gray-900">{evaluation.recommendations?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(evaluation.createdAt).toLocaleDateString('ar-SA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      <button
                        onClick={() => router.push(`/evaluations/${evaluation.id}`)}
                        className="bg-[#14B8A6] hover:bg-[#0F9D8F] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
