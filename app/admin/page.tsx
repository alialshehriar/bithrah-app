'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  LayoutDashboard, Users, Rocket, MessageSquare, TrendingUp,
  DollarSign, Award, Bell, Settings, Database, BarChart3,
  PieChart, Activity, Clock, CheckCircle, XCircle, AlertCircle,
  Eye, EyeOff, Play, Pause, RefreshCw, Download, Filter,
  Search, Calendar, Globe, Shield, Zap, Target, Sparkles,
  Crown, Heart, Star, Flame, Trophy, Gift, Lock, Unlock
} from 'lucide-react';

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
    activeProjects: number;
    totalFunding: number;
    totalBackings: number;
    totalCommunities: number;
    totalMessages: number;
  };
  growth: {
    usersGrowth: number;
    projectsGrowth: number;
    fundingGrowth: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    subscriptions: number;
    commissions: number;
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchStats();
  }, [sandboxMode, timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStats({
        overview: {
          totalUsers: sandboxMode ? 1247 : 89,
          activeUsers: sandboxMode ? 892 : 45,
          totalProjects: sandboxMode ? 156 : 12,
          activeProjects: sandboxMode ? 89 : 8,
          totalFunding: sandboxMode ? 12500000 : 450000,
          totalBackings: sandboxMode ? 2341 : 156,
          totalCommunities: sandboxMode ? 45 : 5,
          totalMessages: sandboxMode ? 8921 : 234
        },
        growth: {
          usersGrowth: 12.5,
          projectsGrowth: 8.3,
          fundingGrowth: 15.7
        },
        revenue: {
          total: sandboxMode ? 625000 : 22500,
          thisMonth: sandboxMode ? 125000 : 8500,
          lastMonth: sandboxMode ? 108000 : 7200,
          subscriptions: sandboxMode ? 85000 : 4500,
          commissions: sandboxMode ? 40000 : 4000
        }
      });
      setLoading(false);
    }, 500);
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'users', name: 'المستخدمون', icon: Users },
    { id: 'projects', name: 'المشاريع', icon: Rocket },
    { id: 'funding', name: 'التمويل', icon: DollarSign },
    { id: 'communities', name: 'المجتمعات', icon: Globe },
    { id: 'messages', name: 'المحادثات', icon: MessageSquare },
    { id: 'analytics', name: 'التحليلات', icon: BarChart3 },
    { id: 'settings', name: 'الإعدادات', icon: Settings }
  ];

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
            change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4" />
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة الإدارة</h1>
                <p className="text-gray-600">إدارة كاملة ومتقدمة لمنصة بذرة</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sandbox Toggle */}
                <button
                  onClick={() => setSandboxMode(!sandboxMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    sandboxMode
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {sandboxMode ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  {sandboxMode ? 'وضع Sandbox' : 'وضع الإنتاج'}
                </button>

                {/* Time Range */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="24h">آخر 24 ساعة</option>
                  <option value="7d">آخر 7 أيام</option>
                  <option value="30d">آخر 30 يوم</option>
                  <option value="90d">آخر 90 يوم</option>
                  <option value="1y">آخر سنة</option>
                </select>

                <button className="p-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                  <RefreshCw className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  {/* Main Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المستخدمين"
                      value={stats.overview.totalUsers}
                      change={stats.growth.usersGrowth}
                      icon={Users}
                      color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                      title="المشاريع النشطة"
                      value={stats.overview.activeProjects}
                      change={stats.growth.projectsGrowth}
                      icon={Rocket}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="إجمالي التمويل"
                      value={`${(stats.overview.totalFunding / 1000000).toFixed(1)}M`}
                      change={stats.growth.fundingGrowth}
                      icon={DollarSign}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="عمليات الدعم"
                      value={stats.overview.totalBackings}
                      icon={Heart}
                      color="from-pink-500 to-pink-600"
                    />
                  </div>

                  {/* Secondary Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                      title="المستخدمون النشطون"
                      value={stats.overview.activeUsers}
                      icon={Activity}
                      color="from-teal-500 to-teal-600"
                    />
                    <StatCard
                      title="المجتمعات"
                      value={stats.overview.totalCommunities}
                      icon={Globe}
                      color="from-indigo-500 to-indigo-600"
                    />
                    <StatCard
                      title="المحادثات"
                      value={stats.overview.totalMessages}
                      icon={MessageSquare}
                      color="from-cyan-500 to-cyan-600"
                    />
                    <StatCard
                      title="إجمالي المشاريع"
                      value={stats.overview.totalProjects}
                      icon={Target}
                      color="from-orange-500 to-orange-600"
                    />
                  </div>

                  {/* Revenue Stats */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">الإيرادات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">إجمالي الإيرادات</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.revenue.total.toLocaleString()} ر.س</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">هذا الشهر</p>
                        <p className="text-2xl font-bold text-green-600">{stats.revenue.thisMonth.toLocaleString()} ر.س</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">الاشتراكات</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.revenue.subscriptions.toLocaleString()} ر.س</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">العمولات</p>
                        <p className="text-2xl font-bold text-purple-600">{stats.revenue.commissions.toLocaleString()} ر.س</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">النشاط الأخير</h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">مستخدم جديد انضم للمنصة</p>
                            <p className="text-sm text-gray-600">منذ {i * 5} دقائق</p>
                          </div>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Tabs - Placeholder */}
              {activeTab !== 'overview' && (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <Sparkles className="w-16 h-16 text-teal-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">قريباً</h3>
                  <p className="text-gray-600">هذا القسم قيد التطوير</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

