'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Users, Copy, Check, TrendingUp, DollarSign, Gift,
  Clock, CheckCircle, Share2, Sparkles, Crown, Star,
  ArrowRight, ExternalLink, RefreshCw
} from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalEarnings: string;
  paidEarnings: string;
  pendingEarnings: string;
  referralCount: number;
  referralEarnings: string;
}

interface Referral {
  id: number;
  referralCode: string;
  status: string;
  commissionEarned: string;
  commissionPaid: boolean;
  createdAt: string;
  referredUser: {
    id: number;
    name: string;
    username: string;
    email: string;
    joinedAt: string;
  };
}

interface Commission {
  id: number;
  type: string;
  sourceType: string;
  amount: string;
  rate: string;
  baseAmount: string;
  status: string;
  createdAt: string;
  approvedAt: string | null;
  paidAt: string | null;
}

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasReferralCode, setHasReferralCode] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState('');

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();

      if (data.success) {
        setReferralCode(data.referralCode || '');
        setStats(data.stats);
        setReferrals(data.referrals);
        setCommissions(data.commissions);
        setHasReferralCode(data.hasReferralCode);
        setSubscriptionTier(data.subscriptionTier);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await fetch('/api/referrals/generate', {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        setReferralCode(data.referralCode);
        setHasReferralCode(true);
        alert(data.message);
      } else {
        alert('فشل في إنشاء كود الإحالة: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      alert('حدث خطأ أثناء إنشاء كود الإحالة');
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`;
    const text = `انضم إلى منصة بذرة باستخدام كود الإحالة الخاص بي: ${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'انضم إلى بذرة',
        text: text,
        url: referralLink
      });
    } else {
      copyReferralLink();
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">نظام الإحالة والمكافآت</h1>
                <p className="text-gray-600">احصل على مكافآت عند دعوة أصدقائك للانضمام إلى بذرة</p>
              </div>
              <button
                onClick={fetchReferralStats}
                className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Plus Badge */}
            {subscriptionTier === 'bithrah_plus' && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6" />
                  <h3 className="text-xl font-bold">باقة Plus النشطة</h3>
                </div>
                <p className="text-white/90">تحصل على 5% عمولة من كل إحالة بدلاً من 2%</p>
              </div>
            )}
          </div>

          {/* Referral Code Section */}
          {!hasReferralCode ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ابدأ في كسب المكافآت</h3>
              <p className="text-gray-600 mb-6">قم بإنشاء كود إحالة خاص بك ودعوة أصدقائك</p>
              <button
                onClick={generateReferralCode}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all"
              >
                إنشاء كود الإحالة
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-teal-500 to-purple-500 rounded-2xl p-8 shadow-lg mb-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Share2 className="w-6 h-6" />
                <h3 className="text-2xl font-bold">كود الإحالة الخاص بك</h3>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/80 mb-1">كود الإحالة</p>
                    <p className="text-3xl font-bold">{referralCode}</p>
                  </div>
                  <button
                    onClick={copyReferralLink}
                    className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={copyReferralLink}
                    className="flex-1 px-4 py-3 rounded-lg bg-white text-teal-600 font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    نسخ الرابط
                  </button>
                  <button
                    onClick={shareReferralLink}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    مشاركة
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">معدل العمولة</p>
                  <p className="text-2xl font-bold">{subscriptionTier === 'bithrah_plus' ? '5%' : '2%'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">إجمالي الإحالات</p>
                  <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">إجمالي الأرباح</p>
                  <p className="text-2xl font-bold">{stats?.totalEarnings || '0.00'} ر.س</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="إجمالي الإحالات"
                value={stats.totalReferrals}
                icon={Users}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="الإحالات النشطة"
                value={stats.activeReferrals}
                icon={CheckCircle}
                color="from-green-500 to-green-600"
              />
              <StatCard
                title="الأرباح المدفوعة"
                value={`${stats.paidEarnings} ر.س`}
                icon={DollarSign}
                color="from-teal-500 to-teal-600"
              />
              <StatCard
                title="الأرباح المعلقة"
                value={`${stats.pendingEarnings} ر.س`}
                icon={Clock}
                color="from-purple-500 to-purple-600"
              />
            </div>
          )}

          {/* Referrals List */}
          {referrals.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">الإحالات</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المستخدم</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">البريد الإلكتروني</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">تاريخ الانضمام</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">العمولة</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {referral.referredUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{referral.referredUser.name}</p>
                              <p className="text-sm text-gray-600">@{referral.referredUser.username}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{referral.referredUser.email}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(referral.referredUser.joinedAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{referral.commissionEarned} ر.س</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            referral.status === 'completed' 
                              ? 'bg-green-50 text-green-600'
                              : referral.status === 'pending'
                              ? 'bg-yellow-50 text-yellow-600'
                              : 'bg-gray-50 text-gray-600'
                          }`}>
                            {referral.status === 'completed' ? 'مكتمل' : 
                             referral.status === 'pending' ? 'قيد الانتظار' : referral.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Commissions List */}
          {commissions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">سجل العمولات</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">التاريخ</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">النوع</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المبلغ الأساسي</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">النسبة</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">العمولة</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {commissions.map((commission) => (
                      <tr key={commission.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(commission.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
                            {commission.sourceType === 'backing' ? 'دعم' : commission.sourceType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{commission.baseAmount} ر.س</td>
                        <td className="px-6 py-4 text-gray-900">{commission.rate}%</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-teal-600">{commission.amount} ر.س</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            commission.status === 'paid' 
                              ? 'bg-green-50 text-green-600'
                              : commission.status === 'approved'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {commission.status === 'paid' ? 'مدفوع' : 
                             commission.status === 'approved' ? 'معتمد' : 'قيد المراجعة'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {hasReferralCode && referrals.length === 0 && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد إحالات بعد</h3>
              <p className="text-gray-600 mb-6">شارك كود الإحالة الخاص بك مع أصدقائك لتبدأ في كسب المكافآت</p>
              <button
                onClick={shareReferralLink}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                مشاركة الآن
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

