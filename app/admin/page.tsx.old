'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown, Users, Rocket, Calendar, DollarSign, TrendingUp,
  Activity, Award, Settings, Shield, Database, Zap,
  BarChart3, PieChart, LineChart, AlertCircle, CheckCircle,
  XCircle, Clock, Star, Heart, MessageSquare, Globe,
  Lock, Unlock, Play, Pause, Trash2, RefreshCw, Eye,
  EyeOff, Sparkles, Target, Gift, Flame, Trophy
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface AdminStats {
  users: {
    total: number;
    active: number;
    thisMonth: number;
    growth: number;
  };
  projects: {
    total: number;
    active: number;
  };
  communities: {
    total: number;
  };
  events: {
    total: number;
  };
  funding: {
    total: number;
  };
  subscriptions: Array<{
    tier: string;
    count: number;
  }>;
  recentUsers: any[];
}

interface SandboxStats {
  users: number;
  projects: number;
  communities: number;
  events: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [sandboxStats, setSandboxStats] = useState<SandboxStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [sandboxActive, setSandboxActive] = useState(false);
  const [generatingData, setGeneratingData] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchSandboxStatus();
  }, [sandboxMode]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?sandbox=${sandboxMode}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSandboxStatus = async () => {
    try {
      const response = await fetch('/api/admin/sandbox');
      const data = await response.json();

      if (data.success) {
        setSandboxStats(data.stats);
        setSandboxActive(data.isActive);
      }
    } catch (error) {
      console.error('Error fetching sandbox status:', error);
    }
  };

  const generateSandboxData = async () => {
    try {
      setGeneratingData(true);
      const response = await fetch('/api/admin/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' }),
      });

      const data = await response.json();
      if (data.success) {
        alert('تم توليد البيانات الوهمية بنجاح!');
        fetchSandboxStatus();
        fetchStats();
      }
    } catch (error) {
      console.error('Error generating sandbox data:', error);
      alert('حدث خطأ أثناء توليد البيانات');
    } finally {
      setGeneratingData(false);
    }
  };

  const clearSandboxData = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات الوهمية؟')) {
      return;
    }

    try {
      setClearingData(true);
      const response = await fetch('/api/admin/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
      });

      const data = await response.json();
      if (data.success) {
        alert('تم حذف البيانات الوهمية بنجاح!');
        setSandboxActive(false);
        fetchSandboxStatus();
        fetchStats();
      }
    } catch (error) {
      console.error('Error clearing sandbox data:', error);
      alert('حدث خطأ أثناء حذف البيانات');
    } finally {
      setClearingData(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-white font-medium">جاري تحميل لوحة الإدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <Crown className="w-16 h-16 text-yellow-500 animate-pulse" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              لوحة الإدارة الملكية
            </h1>
            <Shield className="w-16 h-16 text-purple-500 animate-pulse" />
          </div>
          <p className="text-gray-300 text-xl font-medium">
            تحكم كامل في كل شيء
          </p>
        </motion.div>

        {/* Sandbox Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-8 mb-12 shadow-2xl border-4 border-teal-400"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Database className="w-12 h-12 text-white" />
              <div>
                <h2 className="text-3xl font-black text-white">نظام Sandbox</h2>
                <p className="text-teal-100">بيئة اختبار معزولة للبيانات الوهمية</p>
              </div>
            </div>
            
            {/* Sandbox Toggle */}
            <button
              onClick={() => setSandboxMode(!sandboxMode)}
              className={`relative inline-flex items-center h-14 w-28 rounded-full transition-all ${
                sandboxMode ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block w-12 h-12 transform rounded-full bg-white shadow-lg transition-transform ${
                  sandboxMode ? 'translate-x-14' : 'translate-x-1'
                }`}
              >
                {sandboxMode ? (
                  <Eye className="w-6 h-6 text-green-600 m-3" />
                ) : (
                  <EyeOff className="w-6 h-6 text-gray-600 m-3" />
                )}
              </span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className={`p-4 rounded-2xl mb-6 ${
            sandboxMode ? 'bg-green-500/20 border-2 border-green-400' : 'bg-gray-500/20 border-2 border-gray-400'
          }`}>
            <div className="flex items-center gap-3">
              {sandboxMode ? (
                <>
                  <Unlock className="w-6 h-6 text-green-400" />
                  <span className="text-white font-bold text-lg">وضع Sandbox مُفعّل - تعرض البيانات الوهمية</span>
                </>
              ) : (
                <>
                  <Lock className="w-6 h-6 text-gray-400" />
                  <span className="text-white font-bold text-lg">وضع الإنتاج - تعرض البيانات الحقيقية فقط</span>
                </>
              )}
            </div>
          </div>

          {/* Sandbox Stats */}
          {sandboxActive && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-black">{sandboxStats?.users || 0}</p>
                <p className="text-teal-100 text-sm">مستخدم وهمي</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Rocket className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-black">{sandboxStats?.projects || 0}</p>
                <p className="text-teal-100 text-sm">مشروع وهمي</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-black">{sandboxStats?.communities || 0}</p>
                <p className="text-teal-100 text-sm">مجتمع وهمي</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-white text-2xl font-black">{sandboxStats?.events || 0}</p>
                <p className="text-teal-100 text-sm">فعالية وهمية</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={generateSandboxData}
              disabled={generatingData}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingData ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  جاري التوليد...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  توليد بيانات وهمية
                </>
              )}
            </button>

            <button
              onClick={clearSandboxData}
              disabled={clearingData || !sandboxActive}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {clearingData ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  حذف البيانات الوهمية
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-12 h-12" />
              <div className="text-right">
                <p className="text-sm opacity-90">إجمالي المستخدمين</p>
                <p className="text-4xl font-black">{stats?.users.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>{stats?.users.growth}% نمو هذا الشهر</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Rocket className="w-12 h-12" />
              <div className="text-right">
                <p className="text-sm opacity-90">المشاريع النشطة</p>
                <p className="text-4xl font-black">{stats?.projects.active.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              <span>{stats?.projects.total} إجمالي</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-12 h-12" />
              <div className="text-right">
                <p className="text-sm opacity-90">إجمالي التمويل</p>
                <p className="text-4xl font-black">{(stats?.funding.total || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>ريال سعودي</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-600 to-red-600 rounded-3xl p-6 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-12 h-12" />
              <div className="text-right">
                <p className="text-sm opacity-90">الفعاليات</p>
                <p className="text-4xl font-black">{stats?.events.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>{stats?.communities.total} مجتمع</span>
            </div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Subscription Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
          >
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              توزيع الاشتراكات
            </h3>
            <div className="space-y-4">
              {stats?.subscriptions.map((sub) => {
                const total = stats.users.total;
                const percentage = (sub.count / total) * 100;
                
                return (
                  <div key={sub.tier}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium capitalize">{sub.tier}</span>
                      <span className="text-gray-400">{sub.count} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${
                          sub.tier === 'platinum' ? 'bg-gradient-to-r from-purple-600 to-pink-600' :
                          sub.tier === 'gold' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          sub.tier === 'silver' ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                          'bg-gradient-to-r from-blue-500 to-cyan-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700"
          >
            <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-teal-500" />
              أحدث المستخدمين
            </h3>
            <div className="space-y-3">
              {stats?.recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-teal-400 text-sm font-bold">{user.points} نقطة</p>
                    <p className="text-gray-500 text-xs">مستوى {user.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

