'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, TrendingUp, Target, Zap, AlertTriangle, Calendar, User, Eye } from 'lucide-react';

interface Evaluation {
  id: string;
  ideaTitle: string;
  ideaDescription: string;
  overallScore: number;
  feasibilityScore: number;
  marketScore: number;
  executionScore: number;
  innovationScore: number;
  riskScore: number;
  analysis: string;
  recommendations: string;
  createdAt: string;
  userId: string;
  userName?: string;
}

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const response = await fetch('/api/admin/evaluations');
      if (response.ok) {
        const data = await response.json();
        setEvaluations(data.evaluations || []);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    if (filter === 'all') return true;
    if (filter === 'high') return evaluation.overallScore >= 80;
    if (filter === 'medium') return evaluation.overallScore >= 60 && evaluation.overallScore < 80;
    if (filter === 'low') return evaluation.overallScore < 60;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للوحة الإدارة</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                تقييمات الأفكار
              </h1>
              <p className="text-white/70">
                جميع التقييمات المحفوظة بالذكاء الاصطناعي
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <p className="text-3xl font-bold text-white">{evaluations.length}</p>
                <p className="text-white/70 text-sm">تقييم كلي</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            الكل ({evaluations.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'high'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            ممتاز ({evaluations.filter(e => e.overallScore >= 80).length})
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'medium'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            جيد ({evaluations.filter(e => e.overallScore >= 60 && e.overallScore < 80).length})
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'low'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            يحتاج تحسين ({evaluations.filter(e => e.overallScore < 60).length})
          </button>
        </div>

        {/* Evaluations Grid */}
        {filteredEvaluations.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center border border-white/20">
            <Lightbulb className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">لا توجد تقييمات</h3>
            <p className="text-white/70">لم يتم تقييم أي أفكار بعد</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvaluations.map((evaluation) => (
              <div
                key={evaluation.id}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:border-teal-500/50 transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                      {evaluation.ideaTitle}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2">
                      {evaluation.ideaDescription}
                    </p>
                  </div>

                  <div className={`px-4 py-2 rounded-xl font-bold text-sm ${getScoreColor(evaluation.overallScore)}`}>
                    {evaluation.overallScore}%
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                    <p className="text-white font-bold text-lg">{evaluation.feasibilityScore}%</p>
                    <p className="text-white/60 text-xs">الجدوى</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <p className="text-white font-bold text-lg">{evaluation.marketScore}%</p>
                    <p className="text-white/60 text-xs">السوق</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                    <p className="text-white font-bold text-lg">{evaluation.innovationScore}%</p>
                    <p className="text-white/60 text-xs">الابتكار</p>
                  </div>
                </div>

                {/* Analysis Preview */}
                <div className="bg-white/5 rounded-xl p-4 mb-4">
                  <p className="text-white/90 text-sm line-clamp-3">
                    {evaluation.analysis}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4 text-white/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(evaluation.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {evaluation.userName && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{evaluation.userName}</span>
                      </div>
                    )}
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 rounded-xl transition-all">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">عرض التفاصيل</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

