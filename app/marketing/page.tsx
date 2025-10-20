'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Users, Link as LinkIcon,
  Copy, CheckCircle, Share2, BarChart3, Calendar,
  ExternalLink, ArrowUpRight, Award, Target
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface MarketingStats {
  totalReferrals: number;
  totalCommissions: string;
  pendingCommissions: string;
  paidCommissions: string;
  topProjects: Array<{
    id: number;
    title: string;
    referrals: number;
    commission: string;
  }>;
}

export default function MarketingDashboard() {
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarketingStats();
    generateReferralCode();
  }, []);

  const fetchMarketingStats = async () => {
    try {
      const response = await fetch('/api/marketing/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await fetch('/api/marketing/generate-code', { method: 'POST' });
      const data = await response.json();
      setReferralCode(data.referralCode);
    } catch (error) {
      console.error(error);
      setReferralCode('MKT' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  };

  const getReferralLink = (projectId?: number) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const path = projectId ? `/projects/${projectId}` : '/projects';
    return `${baseUrl}${path}?ref=${referralCode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة المسوق</h1>
          <p className="text-gray-600">
            اكسب 0.5% عمولة من كل مبلغ يدخل صندوق المشروع عبر رابطك
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">إجمالي الإحالات</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalReferrals}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">إجمالي العمولات</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalCommissions}</p>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">عمولات معلقة</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.pendingCommissions}</p>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">عمولات مدفوعة</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.paidCommissions}</p>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Link */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-r from-teal-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <LinkIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">رابط الإحالة الخاص بك</h2>
                  <p className="text-white/90 text-sm mt-1">
                    شارك هذا الرابط واحصل على 0.5% من كل دعم
                  </p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/20 rounded-lg px-4 py-3 font-mono text-sm">
                    {getReferralLink()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(getReferralLink())}
                    className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  <span>مشاركة</span>
                </button>
                <button className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>فتح</span>
                </button>
              </div>
            </div>

            {/* Top Projects */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">أفضل المشاريع</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                {stats?.topProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.referrals} إحالة</p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-teal-600">{project.commission}</p>
                      <p className="text-xs text-gray-500">ريال</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">كيف يعمل؟</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-teal-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">انسخ رابطك</h3>
                    <p className="text-sm text-gray-600">
                      احصل على رابط الإحالة الخاص بك من الأعلى
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">شارك المشاريع</h3>
                    <p className="text-sm text-gray-600">
                      انشر الرابط على وسائل التواصل الاجتماعي
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-amber-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">اكسب العمولة</h3>
                    <p className="text-sm text-gray-600">
                      احصل على 0.5% من كل مبلغ يدخل الصندوق
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">اسحب أرباحك</h3>
                    <p className="text-sm text-gray-600">
                      اسحب عمولاتك إلى محفظتك في أي وقت
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Info */}
            <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl shadow-sm p-6 border border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-teal-600" />
                <h3 className="font-bold text-gray-900">نظام العمولات</h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p>0.5% من كل مبلغ يدخل صندوق المشروع</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p>العمولة تُخصم من حصة المنصة</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p>دفع شهري للعمولات المستحقة</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p>لا حد أقصى للعمولات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

