'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Rocket, Wallet, MessageSquare, Settings,
  TrendingUp, DollarSign, Eye, Activity, AlertCircle,
  CheckCircle, Clock, BarChart3, Shield, Database,
  Server, Globe, Star, Target, Award, Lightbulb
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchSandboxMode();
    fetchAdminStats();
  }, [sandboxMode]);

  const fetchSandboxMode = async () => {
    try {
      const res = await fetch('/api/admin/sandbox');
      const data = await res.json();
      if (data.success) {
        setSandboxMode(data.isActive);
      }
    } catch (error) {
      console.error('Error fetching sandbox mode:', error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`/api/admin/stats?sandbox=${sandboxMode}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSandboxMode = async () => {
    try {
      const res = await fetch('/api/admin/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: sandboxMode ? 'disable' : 'enable' }),
      });
      const data = await res.json();
      if (data.success) {
        setSandboxMode(data.isActive);
        window.location.reload(); // Reload to apply sandbox mode
      }
    } catch (error) {
      console.error('Error toggling sandbox mode:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `+${stats?.users?.thisMonth || 0} هذا الشهر`,
    },
    {
      title: 'إجمالي المشاريع',
      value: stats?.projects?.total || 0,
      icon: Rocket,
      color: 'from-purple-500 to-purple-600',
      change: `${stats?.projects?.active || 0} نشط`,
    },
    {
      title: 'إجمالي التمويل',
      value: `${(stats?.funding?.total || 0).toLocaleString()} ريال`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: 'إجمالي',
    },
    {
      title: 'المجتمعات',
      value: stats?.communities?.total || 0,
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600',
      change: 'نشطة',
    },
    {
      title: 'الفعاليات',
      value: stats?.events?.total || 0,
      icon: Star,
      color: 'from-amber-500 to-amber-600',
      change: 'فعالية',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="text-teal-400" size={32} />
                لوحة الإدارة الشاملة
              </h1>
              <p className="text-gray-400 mt-1">تحكم كامل في جميع جوانب المنصة</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Sandbox Mode Toggle */}
              <button
                onClick={toggleSandboxMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  sandboxMode
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {sandboxMode ? (
                  <>
                    <Database size={20} />
                    <span>وضع التجربة</span>
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  </>
                ) : (
                  <>
                    <Server size={20} />
                    <span>البيانات الحقيقية</span>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </>
                )}
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                العودة للتطبيق
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sandbox Mode Banner */}
      {sandboxMode && (
        <div className="bg-amber-500/10 border-y border-amber-500/30 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <AlertCircle size={20} />
              <p className="font-semibold">
                أنت الآن في وضع التجربة - جميع البيانات المعروضة هي بيانات وهمية للاختبار
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-500/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="text-white" size={24} />
                  </div>
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <h3 className="text-gray-400 text-sm mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'إدارة المستخدمين', icon: Users, link: '/admin/users', color: 'from-blue-500 to-blue-600', desc: 'تحكم كامل في المستخدمين' },
            { title: 'إدارة المشاريع', icon: Rocket, link: '/admin/projects', color: 'from-purple-500 to-purple-600', desc: 'اعتماد ومراجعة المشاريع' },
            { title: 'إدارة المحافظ', icon: Wallet, link: '/admin/wallets', color: 'from-green-500 to-green-600', desc: 'إدارة الأرصدة والمعاملات' },
            { title: 'إدارة المجتمعات', icon: MessageSquare, link: '/admin/communities', color: 'from-teal-500 to-teal-600', desc: 'إدارة المجتمعات والمحتوى' },
            { title: 'تقييمات الأفكار', icon: Lightbulb, link: '/admin/evaluations', color: 'from-yellow-500 to-orange-600', desc: 'عرض جميع التقييمات بالذكاء الاصطناعي' },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-teal-500/50 transition-all hover:shadow-xl hover:shadow-teal-500/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
              <div className="relative">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} w-fit mb-4`}>
                  <item.icon className="text-white" size={24} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Users */}
        {stats?.recentUsers && stats.recentUsers.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-teal-400" size={24} />
              المستخدمون الجدد
            </h2>
            <div className="space-y-4">
              {stats.recentUsers.slice(0, 5).map((user: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{user.name || 'مستخدم'}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString('ar-SA')}
                    </p>
                    <p className="text-teal-400 text-xs">{user.role || 'مستخدم'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="text-green-400" size={24} />
            حالة النظام
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'قاعدة البيانات', status: 'متصلة', color: 'green' },
              { title: 'خادم API', status: 'يعمل', color: 'green' },
              { title: 'نظام الدفع', status: 'جاهز', color: 'green' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-gray-700/30">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">{item.title}</p>
                  <div className={`flex items-center gap-2 text-${item.color}-400`}>
                    <div className={`w-2 h-2 rounded-full bg-${item.color}-400 animate-pulse`}></div>
                    <p className="text-sm font-semibold">{item.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

