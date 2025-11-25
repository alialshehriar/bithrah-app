'use client';

import { useState, useEffect } from 'react';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CleanupPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/cleanup');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات التجريبية؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    setCleaning(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup' }),
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Refresh stats after cleanup
        await fetchStats();
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      setResult({ error: 'فشل تنظيف قاعدة البيانات' });
    } finally {
      setCleaning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تنظيف قاعدة البيانات</h1>
              <p className="text-gray-600">حذف جميع البيانات التجريبية والوهمية</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">تحذير مهم!</p>
                <p className="text-yellow-800 text-sm mt-1">
                  هذا الإجراء سيحذف جميع المستخدمين والمشاريع والمجتمعات التجريبية بشكل نهائي.
                  سيتم الإبقاء فقط على الحسابات الحقيقية للمستخدمين.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <RefreshCw className="w-12 h-12 text-[#14B8A6] animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
          </div>
        ) : stats ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الإحصائيات الحالية</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-red-50 rounded-xl p-6">
                <p className="text-red-600 text-sm font-medium mb-2">مستخدمين تجريبيين</p>
                <p className="text-4xl font-bold text-red-700">{stats.demoUsers}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-blue-600 text-sm font-medium mb-2">إجمالي المستخدمين</p>
                <p className="text-4xl font-bold text-blue-700">{stats.totalUsers}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <p className="text-purple-600 text-sm font-medium mb-2">المشاريع</p>
                <p className="text-4xl font-bold text-purple-700">{stats.totalProjects}</p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-green-600 text-sm font-medium mb-2">المجتمعات</p>
                <p className="text-4xl font-bold text-green-700">{stats.totalCommunities}</p>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <p className="text-orange-600 text-sm font-medium mb-2">حسابات غير مفعّلة</p>
                <p className="text-4xl font-bold text-orange-700">{stats.unverifiedUsers}</p>
              </div>

              <div className="bg-teal-50 rounded-xl p-6">
                <p className="text-teal-600 text-sm font-medium mb-2">حسابات حقيقية</p>
                <p className="text-4xl font-bold text-teal-700">{stats.totalUsers - stats.demoUsers}</p>
              </div>
            </div>

            {/* Cleanup Button */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleCleanup}
                disabled={cleaning || stats.demoUsers === 0}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                {cleaning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    جاري التنظيف...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    حذف البيانات التجريبية ({stats.demoUsers})
                  </>
                )}
              </button>

              <button
                onClick={fetchStats}
                disabled={loading || cleaning}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>
        ) : null}

        {/* Result */}
        {result && (
          <div className={`rounded-2xl shadow-lg p-8 ${result.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
              )}
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                  {result.success ? 'تم التنظيف بنجاح!' : 'فشل التنظيف'}
                </h3>
                
                {result.success && result.stats && (
                  <div className="space-y-2 text-green-800">
                    <p>✓ تم حذف {result.stats.deletedUsers} مستخدم تجريبي</p>
                    <p>✓ المستخدمين المتبقين: {result.stats.remainingUsers}</p>
                    <p>✓ المشاريع المتبقية: {result.stats.remainingProjects}</p>
                    <p>✓ المجتمعات المتبقية: {result.stats.remainingCommunities}</p>
                    <p>⚠️ حسابات غير مفعّلة: {result.stats.unverifiedUsers}</p>
                  </div>
                )}

                {result.error && (
                  <p className="text-red-800">{result.error}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
