'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, Download, TrendingUp, Award,
  Calendar, ArrowLeft, RefreshCw, Eye, Gift, Star,
  CheckCircle, Clock, BarChart3, Target, Zap
} from 'lucide-react';

interface Referral {
  id: number;
  referrerId: number;
  referredId: number;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  status: string;
  createdAt: string;
  activatedAt: string | null;
}

interface ReferralStats {
  total: number;
  active: number;
  pending: number;
  thisMonth: number;
  topReferrers: Array<{
    id: number;
    name: string;
    email: string;
    referralCount: number;
    activeReferrals: number;
  }>;
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    total: 0,
    active: 0,
    pending: 0,
    thisMonth: 0,
    topReferrers: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchReferrals();
  }, []);

  useEffect(() => {
    filterReferrals();
  }, [referrals, searchQuery, filterStatus]);

  const fetchReferrals = async () => {
    try {
      const res = await fetch('/api/admin/referrals');
      const data = await res.json();
      if (data.success) {
        setReferrals(data.referrals || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterReferrals = () => {
    let filtered = [...referrals];

    if (searchQuery) {
      filtered = filtered.filter(ref =>
        ref.referrerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.referrerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.referredName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ref.referredEmail?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(ref => ref.status === filterStatus);
    }

    setFilteredReferrals(filtered);
  };

  const exportData = () => {
    const csv = [
      ['ID', 'الداعي', 'بريد الداعي', 'المدعو', 'بريد المدعو', 'الحالة', 'تاريخ الإنشاء', 'تاريخ التفعيل'],
      ...filteredReferrals.map(ref => [
        ref.id,
        ref.referrerName,
        ref.referrerEmail,
        ref.referredName,
        ref.referredEmail,
        ref.status,
        new Date(ref.createdAt).toLocaleDateString('ar-SA'),
        ref.activatedAt ? new Date(ref.activatedAt).toLocaleDateString('ar-SA') : '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `referrals_${new Date().toISOString()}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold text-lg">جاري تحميل الإحالات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-black mb-2">إدارة الإحالات</h1>
                <p className="text-white/80">تتبع وإدارة نظام الإحالة والمكافآت</p>
              </div>
            </div>
            <button
              onClick={fetchReferrals}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>تحديث</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-white/80" />
                <TrendingUp className="w-5 h-5 text-green-300" />
              </div>
              <p className="text-white/70 text-sm mb-1">إجمالي الإحالات</p>
              <p className="text-3xl font-black">{stats.total}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-300" />
                <Award className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-white/70 text-sm mb-1">إحالات نشطة</p>
              <p className="text-3xl font-black">{stats.active}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-yellow-300" />
                <Target className="w-5 h-5 text-blue-300" />
              </div>
              <p className="text-white/70 text-sm mb-1">قيد الانتظار</p>
              <p className="text-3xl font-black">{stats.pending}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-blue-300" />
                <Zap className="w-5 h-5 text-purple-300" />
              </div>
              <p className="text-white/70 text-sm mb-1">هذا الشهر</p>
              <p className="text-3xl font-black">{stats.thisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Top Referrers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">أفضل المسوقين</h2>
              <p className="text-gray-500 text-sm">المستخدمين الأكثر إحالة</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.topReferrers.slice(0, 3).map((referrer, index) => (
              <div
                key={referrer.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                    'bg-gradient-to-br from-amber-700 to-amber-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{referrer.name}</p>
                    <p className="text-sm text-gray-500">{referrer.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-black text-purple-600">{referrer.referralCount}</p>
                    <p className="text-xs text-gray-500">إجمالي الإحالات</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-bold text-green-600">{referrer.activeReferrals}</p>
                    <p className="text-xs text-gray-500">نشطة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث عن إحالة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشطة</option>
              <option value="pending">قيد الانتظار</option>
              <option value="expired">منتهية</option>
            </select>

            <button
              onClick={exportData}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الداعي</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">المدعو</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحالة</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاريخ الإنشاء</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">تاريخ التفعيل</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">لا توجد إحالات</p>
                    </td>
                  </tr>
                ) : (
                  filteredReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        #{referral.id}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{referral.referrerName}</p>
                          <p className="text-xs text-gray-500">{referral.referrerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{referral.referredName}</p>
                          <p className="text-xs text-gray-500">{referral.referredEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'active' ? 'bg-green-100 text-green-700' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {referral.status === 'active' ? 'نشطة' :
                           referral.status === 'pending' ? 'قيد الانتظار' :
                           'منتهية'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {referral.activatedAt ? new Date(referral.activatedAt).toLocaleDateString('ar-SA') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/referrals/${referral.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>عرض</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
