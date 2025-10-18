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
    try {
      const response = await fetch(`/api/admin/stats?sandbox=${sandboxMode}&timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match component structure
        setStats({
          overview: {
            totalUsers: data.stats.users.total,
            activeUsers: data.stats.users.active,
            totalProjects: data.stats.projects.total,
            activeProjects: data.stats.projects.active,
            totalFunding: data.stats.funding.total,
            totalBackings: data.stats.negotiations.total,
            totalCommunities: data.stats.communities.total,
            totalMessages: data.stats.evaluations.total
          },
          growth: {
            usersGrowth: data.stats.users.growth || 0,
            projectsGrowth: 8.3,
            fundingGrowth: 15.7
          },
          revenue: {
            total: data.stats.funding.total * 0.05, // 5% commission
            thisMonth: data.stats.funding.total * 0.05,
            lastMonth: 0,
            subscriptions: 0,
            commissions: data.stats.funding.total * 0.05
          }
        });
      } else {
        console.error('Failed to fetch stats:', data.error);
        // Fallback to demo data
        setStats({
          overview: {
            totalUsers: sandboxMode ? 1247 : 0,
            activeUsers: sandboxMode ? 892 : 0,
            totalProjects: sandboxMode ? 156 : 0,
            activeProjects: sandboxMode ? 89 : 0,
            totalFunding: sandboxMode ? 12500000 : 0,
            totalBackings: sandboxMode ? 2341 : 0,
            totalCommunities: sandboxMode ? 45 : 0,
            totalMessages: sandboxMode ? 8921 : 0
          },
          growth: {
            usersGrowth: 0,
            projectsGrowth: 0,
            fundingGrowth: 0
          },
          revenue: {
            total: 0,
            thisMonth: 0,
            lastMonth: 0,
            subscriptions: 0,
            commissions: 0
          }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to demo data on error
      setStats({
        overview: {
          totalUsers: sandboxMode ? 1247 : 0,
          activeUsers: sandboxMode ? 892 : 0,
          totalProjects: sandboxMode ? 156 : 0,
          activeProjects: sandboxMode ? 89 : 0,
          totalFunding: sandboxMode ? 12500000 : 0,
          totalBackings: sandboxMode ? 2341 : 0,
          totalCommunities: sandboxMode ? 45 : 0,
          totalMessages: sandboxMode ? 8921 : 0
        },
        growth: {
          usersGrowth: 0,
          projectsGrowth: 0,
          fundingGrowth: 0
        },
        revenue: {
          total: 0,
          thisMonth: 0,
          lastMonth: 0,
          subscriptions: 0,
          commissions: 0
        }
      });
    } finally {
      setLoading(false);
    }
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

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Users Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المستخدمين"
                      value={stats?.overview.totalUsers || 0}
                      change={stats?.growth.usersGrowth}
                      icon={Users}
                      color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                      title="المستخدمون النشطون"
                      value={stats?.overview.activeUsers || 0}
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="مستخدمون جدد (هذا الشهر)"
                      value={sandboxMode ? 127 : 12}
                      icon={Star}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="معدل التفاعل"
                      value="87%"
                      icon={Flame}
                      color="from-orange-500 to-orange-600"
                    />
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="ابحث عن مستخدم..."
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <button className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        <span>فلترة</span>
                      </button>
                      <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        <span>تصدير</span>
                      </button>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المستخدم</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">البريد الإلكتروني</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المشاريع</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الدعم</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">النقاط</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">تاريخ الانضمام</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {Array.from({ length: sandboxMode ? 10 : 5 }).map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {String.fromCharCode(65 + i)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">مستخدم {i + 1}</p>
                                    <p className="text-sm text-gray-600">@user{i + 1}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">user{i + 1}@example.com</td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-medium text-sm">
                                  {Math.floor(Math.random() * 5)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-medium text-sm">
                                  {Math.floor(Math.random() * 10)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium text-sm">
                                  {Math.floor(Math.random() * 1000)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium text-sm flex items-center gap-1 w-fit">
                                  <CheckCircle className="w-4 h-4" />
                                  نشط
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {new Date(Date.now() - i * 86400000 * 7).toLocaleDateString('ar-SA')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Settings className="w-4 h-4 text-gray-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-600">عرض 1-{sandboxMode ? 10 : 5} من {stats?.overview.totalUsers || 0}</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">السابق</button>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium">1</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">2</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">3</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">التالي</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Projects Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المشاريع"
                      value={stats?.overview.totalProjects || 0}
                      icon={Rocket}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="المشاريع النشطة"
                      value={stats?.overview.activeProjects || 0}
                      change={stats?.growth.projectsGrowth}
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="مشاريع مكتملة"
                      value={sandboxMode ? 67 : 4}
                      icon={CheckCircle}
                      color="from-teal-500 to-teal-600"
                    />
                    <StatCard
                      title="معدل النجاح"
                      value="76%"
                      icon={Trophy}
                      color="from-yellow-500 to-yellow-600"
                    />
                  </div>

                  {/* Search and Filters */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="ابحث عن مشروع..."
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <select className="px-6 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500">
                        <option>كل الحالات</option>
                        <option>نشط</option>
                        <option>مكتمل</option>
                        <option>ملغي</option>
                      </select>
                      <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        <span>تصدير</span>
                      </button>
                    </div>
                  </div>

                  {/* Projects Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المشروع</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المنشئ</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الفئة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الهدف</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المجموع</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">التقدم</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الداعمون</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {Array.from({ length: sandboxMode ? 10 : 5 }).map((_, i) => {
                            const goal = (i + 1) * 100000;
                            const raised = goal * (0.3 + Math.random() * 0.6);
                            const progress = Math.round((raised / goal) * 100);
                            return (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                      <Rocket className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">مشروع {i + 1}</p>
                                      <p className="text-sm text-gray-600">مشروع مبتكر في مجال التقنية</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                                      {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="text-gray-900">مستخدم {i + 1}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm">
                                    التقنية
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-medium">
                                  {goal.toLocaleString()} ر.س
                                </td>
                                <td className="px-6 py-4 text-green-600 font-medium">
                                  {Math.round(raised).toLocaleString()} ر.س
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-teal-500 to-purple-500 transition-all"
                                        style={{ width: `${progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-left">{progress}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-medium text-sm">
                                    {Math.floor(Math.random() * 50) + 10}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 w-fit ${
                                    progress >= 100 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                                  }`}>
                                    {progress >= 100 ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                    {progress >= 100 ? 'مكتمل' : 'نشط'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                      <Eye className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                      <Settings className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-600">عرض 1-{sandboxMode ? 10 : 5} من {stats?.overview.totalProjects || 0}</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">السابق</button>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-medium">1</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">2</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium">التالي</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Funding Tab */}
              {activeTab === 'funding' && (
                <div className="space-y-6">
                  {/* Funding Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي التمويل"
                      value={`${(stats?.overview.totalFunding || 0) / 1000000}M`}
                      change={stats?.growth.fundingGrowth}
                      icon={DollarSign}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="عمليات الدعم"
                      value={stats?.overview.totalBackings || 0}
                      icon={Heart}
                      color="from-pink-500 to-pink-600"
                    />
                    <StatCard
                      title="متوسط الدعم"
                      value={sandboxMode ? '5,340 ر.س' : '2,885 ر.س'}
                      icon={TrendingUp}
                      color="from-teal-500 to-teal-600"
                    />
                    <StatCard
                      title="العمولات"
                      value={stats?.revenue.commissions.toLocaleString() + ' ر.س'}
                      icon={Award}
                      color="from-purple-500 to-purple-600"
                    />
                  </div>

                  {/* Funding Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">عمليات التمويل الأخيرة</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الداعم</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المشروع</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المبلغ</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">العمولة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">التاريخ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {Array.from({ length: sandboxMode ? 10 : 5 }).map((_, i) => {
                            const amount = (i + 1) * 1000 + Math.floor(Math.random() * 5000);
                            const commission = Math.round(amount * 0.05);
                            return (
                              <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                                      {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="text-gray-900">مستخدم {i + 1}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900">مشروع {Math.floor(Math.random() * 10) + 1}</td>
                                <td className="px-6 py-4">
                                  <span className="text-green-600 font-bold">{amount.toLocaleString()} ر.س</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-purple-600 font-medium">{commission.toLocaleString()} ر.س</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium text-sm flex items-center gap-1 w-fit">
                                    <CheckCircle className="w-4 h-4" />
                                    مكتمل
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {new Date(Date.now() - i * 86400000).toLocaleDateString('ar-SA')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Communities Tab */}
              {activeTab === 'communities' && (
                <div className="space-y-6">
                  {/* Communities Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المجتمعات"
                      value={stats?.overview.totalCommunities || 0}
                      icon={Globe}
                      color="from-indigo-500 to-indigo-600"
                    />
                    <StatCard
                      title="الأعضاء"
                      value={sandboxMode ? 3247 : 289}
                      icon={Users}
                      color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                      title="المنشورات"
                      value={sandboxMode ? 1834 : 167}
                      icon={MessageSquare}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="معدل النشاط"
                      value="92%"
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                  </div>

                  {/* Communities Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: sandboxMode ? 6 : 3 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
                            <Globe className="w-8 h-8 text-white" />
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 font-medium text-sm">
                            نشط
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">مجتمع {i + 1}</h3>
                        <p className="text-sm text-gray-600 mb-4">مجتمع لرواد الأعمال والمبتكرين</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{Math.floor(Math.random() * 500) + 100} عضو</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MessageSquare className="w-4 h-4" />
                            <span>{Math.floor(Math.random() * 200) + 50} منشور</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages/Conversations Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  {/* Messages Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المحادثات"
                      value={stats?.overview.totalMessages || 0}
                      icon={MessageSquare}
                      color="from-cyan-500 to-cyan-600"
                    />
                    <StatCard
                      title="محادثات نشطة"
                      value={sandboxMode ? 892 : 89}
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="متوسط وقت الرد"
                      value="2.5 د"
                      icon={Clock}
                      color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                      title="معدل الرضا"
                      value="94%"
                      icon={Star}
                      color="from-yellow-500 to-yellow-600"
                    />
                  </div>

                  {/* Messages List */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900">المحادثات الأخيرة</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {Array.from({ length: sandboxMode ? 10 : 5 }).map((_, i) => (
                        <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="flex gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                                {String.fromCharCode(65 + i)}
                              </div>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold -ml-3">
                                {String.fromCharCode(66 + i)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900">مستخدم {i + 1} ↔ مستخدم {i + 2}</h4>
                                <span className="text-sm text-gray-600">منذ {i + 1} ساعة</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">مرحبا، أريد الاستفسار عن مشروعك...</p>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                                  {Math.floor(Math.random() * 20) + 5} رسالة
                                </span>
                                {i % 3 === 0 && (
                                  <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-medium">
                                    جديد
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Analytics Header */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">تحليلات متقدمة</h2>
                    <p className="text-gray-600">تحليلات شاملة لأداء المنصة وسلوك المستخدمين</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">معدل النشاط</p>
                          <p className="text-2xl font-bold text-gray-900">87%</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600" style={{width: '87%'}}></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">معدل النمو</p>
                          <p className="text-2xl font-bold text-gray-900">+{stats?.growth.usersGrowth}%</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{width: `${stats?.growth.usersGrowth}%`}}></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">معدل التحويل</p>
                          <p className="text-2xl font-bold text-gray-900">76%</p>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600" style={{width: '76%'}}></div>
                      </div>
                    </div>
                  </div>

                  {/* User Behavior Analytics */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">تحليل سلوك المستخدمين</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">الصفحة الرئيسية</span>
                          <span className="text-sm font-bold text-gray-900">45%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{width: '45%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">المشاريع</span>
                          <span className="text-sm font-bold text-gray-900">32%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{width: '32%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">المجتمعات</span>
                          <span className="text-sm font-bold text-gray-900">15%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600" style={{width: '15%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">المحفظة</span>
                          <span className="text-sm font-bold text-gray-900">8%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-green-600" style={{width: '8%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Analytics */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">تحليل الوقت</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-xl bg-gray-50">
                        <Clock className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">12.5 د</p>
                        <p className="text-sm text-gray-600">متوسط وقت الجلسة</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gray-50">
                        <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">8.2</p>
                        <p className="text-sm text-gray-600">متوسط الصفحات/جلسة</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gray-50">
                        <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">3.4</p>
                        <p className="text-sm text-gray-600">متوسط النقرات/صفحة</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-gray-50">
                        <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900 mb-1">2.1 ث</p>
                        <p className="text-sm text-gray-600">متوسط وقت التحميل</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Settings Header */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">إعدادات النظام</h2>
                    <p className="text-gray-600">إدارة إعدادات المنصة والتحكم في الميزات</p>
                  </div>

                  {/* General Settings */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Settings className="w-6 h-6 text-teal-500" />
                      إعدادات عامة
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">وضع الصيانة</p>
                          <p className="text-sm text-gray-600">تفعيل وضع الصيانة للمنصة</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">
                          معطل
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">تسجيل مستخدمين جدد</p>
                          <p className="text-sm text-gray-600">السماح بتسجيل مستخدمين جدد</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                          مفعل
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">مراجعة المشاريع</p>
                          <p className="text-sm text-gray-600">مراجعة المشاريع قبل النشر</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                          مفعل
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <DollarSign className="w-6 h-6 text-green-500" />
                      إعدادات الدفع
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">نسبة العمولة</p>
                        <p className="text-2xl font-bold text-gray-900">5%</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">الحد الأدنى للدعم</p>
                        <p className="text-2xl font-bold text-gray-900">100 ر.س</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">الحد الأقصى للدعم</p>
                        <p className="text-2xl font-bold text-gray-900">100,000 ر.س</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">فترة السحب</p>
                        <p className="text-2xl font-bold text-gray-900">7 أيام</p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Bell className="w-6 h-6 text-purple-500" />
                      إعدادات الإشعارات
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">إشعارات البريد</p>
                          <p className="text-sm text-gray-600">إرسال إشعارات عبر البريد</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                          مفعل
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">إشعارات SMS</p>
                          <p className="text-sm text-gray-600">إرسال إشعارات عبر الرسائل</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors">
                          معطل
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">إشعارات Push</p>
                          <p className="text-sm text-gray-600">إشعارات فورية على التطبيق</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium">
                          مفعل
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Database Management */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <Database className="w-6 h-6 text-blue-500" />
                      إدارة قاعدة البيانات
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-teal-500 transition-all flex flex-col items-center gap-2">
                        <Download className="w-8 h-8 text-teal-500" />
                        <span className="font-medium text-gray-900">نسخ احتياطي</span>
                      </button>
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all flex flex-col items-center gap-2">
                        <RefreshCw className="w-8 h-8 text-purple-500" />
                        <span className="font-medium text-gray-900">استعادة</span>
                      </button>
                      <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-red-500 transition-all flex flex-col items-center gap-2">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                        <span className="font-medium text-gray-900">تنظيف</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

