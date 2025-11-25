'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Gift, Calendar, TrendingUp, Download, RefreshCw } from 'lucide-react';

export default function AdminEarlySignupsPage() {
  const [signups, setSignups] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignups();
  }, []);

  const fetchSignups = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/early-signups');
      const data = await response.json();
      setSignups(data.signups || []);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Failed to fetch signups:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['البريد الإلكتروني', 'الاسم', 'الجوال', 'كود الإحالة', 'عدد الإحالات', 'تاريخ التسجيل'];
    const rows = signups.map(s => [
      s.email,
      s.name || '',
      s.phone || '',
      s.ownReferralCode,
      s.referralCount,
      new Date(s.createdAt).toLocaleDateString('ar-SA'),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `early-signups-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#14B8A6] rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">التسجيل المبكر</h1>
                <p className="text-gray-600">إدارة المسجلين في الإطلاق التجريبي</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchSignups}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>

              <button
                onClick={exportToCSV}
                disabled={signups.length === 0}
                className="bg-[#14B8A6] hover:bg-[#0F9D8F] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                تصدير CSV
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <p className="text-blue-600 font-medium">إجمالي المسجلين</p>
                </div>
                <p className="text-4xl font-bold text-blue-700">{stats.total || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <p className="text-green-600 font-medium">اليوم</p>
                </div>
                <p className="text-4xl font-bold text-green-700">{stats.today || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-purple-600" />
                  <p className="text-purple-600 font-medium">إجمالي الإحالات</p>
                </div>
                <p className="text-4xl font-bold text-purple-700">{stats.totalReferrals || 0}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-orange-600" />
                  <p className="text-orange-600 font-medium">أفضل مسوّق</p>
                </div>
                <p className="text-2xl font-bold text-orange-700">{stats.topReferrer || '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Signups Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">قائمة المسجلين</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-12 h-12 text-[#14B8A6] animate-spin mx-auto mb-4" />
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : signups.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا يوجد مسجلين بعد</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">#</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الجوال</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">كود الإحالة</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">عدد الإحالات</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {signups.map((signup, index) => (
                    <tr key={signup.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{signup.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{signup.name || '-'}</td>
                      <td className="px-6 py-4">
                        {signup.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{signup.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-[#14B8A6] text-white px-3 py-1 rounded-lg font-mono text-sm">
                          {signup.ownReferralCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-bold text-sm">
                          {signup.referralCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(signup.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
