'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Search, Filter, Download, Eye, Trash2,
  TrendingUp, TrendingDown, Calendar, User, Tag,
  BarChart3, CheckCircle, AlertCircle
} from 'lucide-react';

interface Evaluation {
  id: string;
  title: string;
  category: string;
  userName: string;
  userEmail: string;
  overallScore: number;
  marketPotential: number;
  feasibility: number;
  innovation: number;
  scalability: number;
  financialViability: number;
  competitiveAdvantage: number;
  createdAt: string;
}

export default function AdminEvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/evaluations');
      const data = await response.json();
      setEvaluations(data.evaluations || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    
    try {
      const response = await fetch(`/api/admin/evaluations/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvaluations(evaluations.filter(e => e.id !== id));
        alert('تم حذف التقييم بنجاح');
      }
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      alert('حدث خطأ أثناء حذف التقييم');
    }
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.title.toLowerCase().includes(search.toLowerCase()) ||
                         evaluation.userName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || evaluation.category === categoryFilter;
    const matchesScore = !scoreFilter || 
      (scoreFilter === 'high' && evaluation.overallScore >= 80) ||
      (scoreFilter === 'medium' && evaluation.overallScore >= 60 && evaluation.overallScore < 80) ||
      (scoreFilter === 'low' && evaluation.overallScore < 60);
    
    return matchesSearch && matchesCategory && matchesScore;
  });

  const stats = {
    total: evaluations.length,
    avgScore: evaluations.length > 0 
      ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
      : 0,
    highScore: evaluations.filter(e => e.overallScore >= 80).length,
    lowScore: evaluations.filter(e => e.overallScore < 60).length,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'ممتاز', color: 'bg-green-500' };
    if (score >= 60) return { text: 'جيد', color: 'bg-blue-500' };
    if (score >= 40) return { text: 'متوسط', color: 'bg-yellow-500' };
    return { text: 'ضعيف', color: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">إدارة التقييمات</h1>
          </div>
          <p className="text-gray-600">عرض وإدارة جميع تقييمات الأفكار الاستثمارية</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">إجمالي التقييمات</span>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">متوسط التقييم</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgScore}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">تقييمات عالية</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.highScore}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">تقييمات منخفضة</span>
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.lowScore}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="w-4 h-4 inline mr-2" />
                البحث
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن تقييم..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-2" />
                التصنيف
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">الكل</option>
                <option value="technology">التقنية</option>
                <option value="health">الصحة</option>
                <option value="education">التعليم</option>
                <option value="business">الأعمال</option>
                <option value="environment">البيئة</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="w-4 h-4 inline mr-2" />
                التقييم
              </label>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">الكل</option>
                <option value="high">عالي (80+)</option>
                <option value="medium">متوسط (60-79)</option>
                <option value="low">منخفض (&lt;60)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Evaluations List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد تقييمات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvaluations.map((evaluation, index) => {
              const badge = getScoreBadge(evaluation.overallScore);
              return (
                <motion.div
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{evaluation.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{evaluation.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>{evaluation.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(evaluation.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                            {evaluation.overallScore}
                          </div>
                          <div className="text-xs text-gray-500">إجمالي</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">{evaluation.marketPotential}</div>
                          <div className="text-xs text-gray-500">السوق</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">{evaluation.feasibility}</div>
                          <div className="text-xs text-gray-500">الجدوى</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">{evaluation.innovation}</div>
                          <div className="text-xs text-gray-500">الابتكار</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">{evaluation.scalability}</div>
                          <div className="text-xs text-gray-500">التوسع</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">{evaluation.financialViability}</div>
                          <div className="text-xs text-gray-500">المالية</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mr-4">
                      <button
                        onClick={() => setSelectedEvaluation(evaluation)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEvaluation.title}</h2>
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">المستخدم:</span>
                  <p className="font-medium">{selectedEvaluation.userName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">البريد:</span>
                  <p className="font-medium">{selectedEvaluation.userEmail}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">التصنيف:</span>
                  <p className="font-medium">{selectedEvaluation.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">التاريخ:</span>
                  <p className="font-medium">
                    {new Date(selectedEvaluation.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-4">التقييمات التفصيلية</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">{selectedEvaluation.overallScore}</div>
                    <div className="text-sm text-gray-600">التقييم الإجمالي</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedEvaluation.marketPotential}</div>
                    <div className="text-sm text-gray-600">إمكانات السوق</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedEvaluation.feasibility}</div>
                    <div className="text-sm text-gray-600">الجدوى</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{selectedEvaluation.innovation}</div>
                    <div className="text-sm text-gray-600">الابتكار</div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-600">{selectedEvaluation.scalability}</div>
                    <div className="text-sm text-gray-600">قابلية التوسع</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{selectedEvaluation.financialViability}</div>
                    <div className="text-sm text-gray-600">الجدوى المالية</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvaluation(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

