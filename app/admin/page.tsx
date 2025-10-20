'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Rocket, Wallet, MessageSquare, Settings,
  TrendingUp, DollarSign, Eye, Activity, AlertCircle,
  CheckCircle, Clock, BarChart3, Shield, Database,
  Server, Globe, Star, Target, Award, Lightbulb,
  ArrowUpRight, ArrowDownRight, Calendar, Download,
  Filter, Search, RefreshCw, Bell, Zap, TrendingDown
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y

  useEffect(() => {
    fetchAdminStats();
  }, [timeRange]);



  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`/api/admin/stats?range=${timeRange}`);
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



  // Sample data for charts (will be replaced with real data from API)
  const userGrowthData = [
    { name: 'يناير', users: 400, active: 240 },
    { name: 'فبراير', users: 600, active: 380 },
    { name: 'مارس', users: 800, active: 500 },
    { name: 'أبريل', users: 1200, active: 780 },
    { name: 'مايو', users: 1600, active: 1100 },
    { name: 'يونيو', users: 2000, active: 1400 },
  ];

  const revenueData = [
    { name: 'الأسبوع 1', revenue: 12000 },
    { name: 'الأسبوع 2', revenue: 19000 },
    { name: 'الأسبوع 3', revenue: 15000 },
    { name: 'الأسبوع 4', revenue: 25000 },
    { name: 'الأسبوع 5', revenue: 22000 },
    { name: 'الأسبوع 6', revenue: 30000 },
  ];

  const projectCategoriesData = [
    { name: 'تقنية', value: 35, color: '#8B5CF6' },
    { name: 'تجارة', value: 25, color: '#14B8A6' },
    { name: 'صحة', value: 20, color: '#F59E0B' },
    { name: 'تعليم', value: 15, color: '#3B82F6' },
    { name: 'أخرى', value: 5, color: '#6B7280' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold text-lg">جاري تحميل لوحة التحكم...</p>
          <p className="text-gray-400 text-sm mt-2">يتم تحليل البيانات</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.users?.total || 2847,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: stats?.users?.thisMonth || 156,
      changePercent: '+12.5%',
      trend: 'up',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'إجمالي المشاريع',
      value: stats?.projects?.total || 1234,
      icon: Rocket,
      color: 'from-purple-500 to-purple-600',
      change: stats?.projects?.active || 89,
      changePercent: '+8.3%',
      trend: 'up',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'إجمالي التمويل',
      value: `${((stats?.funding?.total || 5420000) / 1000000).toFixed(1)}م`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: 'ريال سعودي',
      changePercent: '+15.2%',
      trend: 'up',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'المجتمعات النشطة',
      value: stats?.communities?.total || 45,
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600',
      change: stats?.communities?.active || 38,
      changePercent: '+5.7%',
      trend: 'up',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  const quickActions = [
    { title: 'إدارة المستخدمين', icon: Users, link: '/admin/users', color: 'from-blue-500 to-blue-600', desc: 'تحكم كامل في المستخدمين', count: stats?.users?.total || 2847 },
    { title: 'إدارة المشاريع', icon: Rocket, link: '/admin/projects', color: 'from-purple-500 to-purple-600', desc: 'اعتماد ومراجعة المشاريع', count: stats?.projects?.total || 1234 },
    { title: 'إدارة المحافظ', icon: Wallet, link: '/admin/wallets', color: 'from-green-500 to-green-600', desc: 'إدارة الأرصدة والمعاملات', count: stats?.wallets?.total || 2847 },
    { title: 'إدارة المجتمعات', icon: MessageSquare, link: '/admin/communities', color: 'from-teal-500 to-teal-600', desc: 'إدارة المجتمعات والمحتوى', count: stats?.communities?.total || 45 },
    { title: 'تقييمات الأفكار', icon: Lightbulb, link: '/admin/evaluations', color: 'from-yellow-500 to-orange-600', desc: 'عرض جميع التقييمات بالذكاء الاصطناعي', count: stats?.evaluations?.total || 567 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  لوحة التحكم الإدارية
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">تحكم كامل ودقيق في جميع جوانب المنصة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {[
                  { label: '7 أيام', value: '7d' },
                  { label: '30 يوم', value: '30d' },
                  { label: '90 يوم', value: '90d' },
                  { label: 'سنة', value: '1y' },
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      timeRange === range.value
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>



              {/* Refresh Button */}
              <button
                onClick={() => fetchAdminStats()}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                title="تحديث البيانات"
              >
                <RefreshCw size={18} />
              </button>

              {/* Back to App */}
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-purple-500/30"
              >
                العودة للتطبيق
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl hover:shadow-purple-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.changePercent}
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-2">{stat.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-400">+{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">نمو المستخدمين</h2>
                <p className="text-sm text-gray-500 mt-1">إجمالي المستخدمين والنشطين</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={18} className="text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="active" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">الإيرادات الأسبوعية</h2>
                <p className="text-sm text-gray-500 mt-1">إجمالي الإيرادات بالريال السعودي</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={18} className="text-gray-600" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Categories & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Project Categories Pie Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">تصنيفات المشاريع</h2>
              <p className="text-sm text-gray-500 mt-1">توزيع المشاريع حسب الفئة</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {projectCategoriesData.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <span className="text-gray-700">{category.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - Takes 2 columns */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="group relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-xl hover:shadow-purple-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                    <item.icon className="text-white" size={20} />
                  </div>
                  <ArrowUpRight className="text-gray-400 group-hover:text-purple-600 transition-colors" size={20} />
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{item.desc}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{item.count.toLocaleString()}</span>
                  <span className="text-xs text-gray-500">عنصر</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="text-purple-600" size={20} />
                  المستخدمون الجدد
                </h2>
                <p className="text-sm text-gray-500 mt-1">آخر المنضمين للمنصة</p>
              </div>
              <Link href="/admin/users" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                عرض الكل
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { name: 'أحمد محمد', email: 'ahmed@example.com', role: 'مستثمر', time: 'منذ ساعتين' },
                { name: 'فاطمة علي', email: 'fatima@example.com', role: 'صاحب مشروع', time: 'منذ 3 ساعات' },
                { name: 'خالد سعيد', email: 'khaled@example.com', role: 'مسوق', time: 'منذ 5 ساعات' },
                { name: 'نورة عبدالله', email: 'noura@example.com', role: 'مستثمر', time: 'منذ 6 ساعات' },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">{user.name}</p>
                      <p className="text-gray-500 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-purple-600 text-xs font-semibold">{user.role}</p>
                    <p className="text-gray-400 text-xs">{user.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Zap className="text-green-600" size={20} />
                حالة النظام
              </h2>
              <p className="text-sm text-gray-500 mt-1">مراقبة الخدمات والأداء</p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'قاعدة البيانات', status: 'متصلة', uptime: '99.9%', color: 'green', icon: Database },
                { title: 'خادم API', status: 'يعمل', uptime: '99.8%', color: 'green', icon: Server },
                { title: 'نظام الدفع', status: 'جاهز', uptime: '100%', color: 'green', icon: DollarSign },
                { title: 'خدمة الإشعارات', status: 'نشطة', uptime: '99.7%', color: 'green', icon: Bell },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${item.color}-50`}>
                        <item.icon className={`text-${item.color}-600`} size={18} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold text-sm">{item.title}</p>
                        <p className="text-gray-500 text-xs">وقت التشغيل: {item.uptime}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 text-${item.color}-600`}>
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-500 animate-pulse`}></div>
                      <p className="text-sm font-semibold">{item.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 بذرة - جميع الحقوق محفوظة</p>
            <p className="flex items-center gap-2">
              تطوير
              <span className="font-bold text-gray-900">CandlesTech (A.S)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

