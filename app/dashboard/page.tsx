'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Rocket, TrendingUp, Users, Wallet, Bell, Settings,
  ArrowUpRight, ArrowDownRight, DollarSign, Target,
  Activity, Award, MessageSquare, Eye, Zap, Crown,
  Heart, Package, Calendar, Clock, CheckCircle, AlertCircle,
  BarChart3, PieChart as PieChartIcon, TrendingDown, Plus,
  Sparkles, Gift, Star, Shield, ExternalLink, Trophy
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const [stats, setStats] = useState({
    myProjects: 0,
    totalBackers: 0,
    totalFunding: '0',
    pendingNegotiations: 0,
    walletBalance: '0',
    referralEarnings: '0',
    level: 1,
    points: 0,
    experience: 0,
    totalViews: 0,
    conversionRate: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsRes = await fetch('/api/user/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch recent activity
      const activityRes = await fetch('/api/user/activity');
      const activityData = await activityRes.json();
      if (activityData.success) {
        setRecentActivity(activityData.activities || []);
      }

      // Fetch projects
      const projectsRes = await fetch('/api/user/projects');
      const projectsData = await projectsRes.json();
      if (projectsData.success) {
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for charts
  const monthlyData = [
    { month: 'يناير', funding: 12000, backers: 15, views: 450 },
    { month: 'فبراير', funding: 19000, backers: 25, views: 680 },
    { month: 'مارس', funding: 15000, backers: 20, views: 520 },
    { month: 'أبريل', funding: 28000, backers: 35, views: 890 },
    { month: 'مايو', funding: 32000, backers: 42, views: 1020 },
    { month: 'يونيو', funding: 45000, backers: 58, views: 1350 },
  ];

  const projectStatusData = [
    { name: 'نشط', value: 5, color: '#10b981' },
    { name: 'مكتمل', value: 3, color: '#3b82f6' },
    { name: 'معلق', value: 2, color: '#f59e0b' },
  ];

  const statCards = [
    {
      title: 'مشاريعي',
      value: stats.myProjects,
      change: '+12%',
      isPositive: true,
      icon: Rocket,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      link: '/profile?tab=projects'
    },
    {
      title: 'إجمالي الداعمين',
      value: stats.totalBackers,
      change: '+23%',
      isPositive: true,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      link: '/profile?tab=backers'
    },
    {
      title: 'إجمالي التمويل',
      value: `${stats.totalFunding} ر.س`,
      change: '+18%',
      isPositive: true,
      icon: DollarSign,
      color: 'from-[#14B8A6] to-[#0F9D8F]',
      bgColor: 'from-teal-50 to-teal-100',
      link: '/wallet'
    },
    {
      title: 'رصيد المحفظة',
      value: `${stats.walletBalance} ر.س`,
      change: '+5%',
      isPositive: true,
      icon: Wallet,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      bgColor: 'from-purple-50 to-purple-100',
      link: '/wallet'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const progressToNextLevel = ((stats.experience % 1000) / 1000) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                لوحة التحكم
              </h1>
              <p className="text-gray-600">مرحباً بك! إليك نظرة عامة على أدائك</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Level Badge */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-bold">المستوى</div>
                      <div className="text-2xl font-black text-gray-900">{stats.level}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <Link
                href="/projects/create"
                className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                مشروع جديد
              </Link>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border border-purple-200/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                <span className="font-bold text-gray-900">تقدمك إلى المستوى {stats.level + 1}</span>
              </div>
              <span className="text-sm text-gray-600">{stats.experience} / {(stats.level + 1) * 1000} نقطة</span>
            </div>
            <div className="w-full h-3 bg-white rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNextLevel}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Premium Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
              
              <Link href={stat.link}>
                <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg cursor-pointer`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      stat.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-600">{stat.title}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">أداء المشاريع</h3>
                  <p className="text-gray-600 text-sm">تحليل التمويل والداعمين</p>
                </div>
                
                <div className="flex gap-2">
                  {['week', 'month', 'year'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period as any)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : 'سنة'}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBackers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                  <Area 
                    type="monotone" 
                    dataKey="funding" 
                    stroke="#14B8A6" 
                    strokeWidth={3}
                    fill="url(#colorFunding)" 
                    name="التمويل (ر.س)"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="backers" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    fill="url(#colorBackers)" 
                    name="الداعمين"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Project Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 h-full">
              <h3 className="text-2xl font-black text-gray-900 mb-1">حالة المشاريع</h3>
              <p className="text-gray-600 text-sm mb-6">توزيع المشاريع</p>

              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3 mt-6">
                {projectStatusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="text-sm font-bold text-gray-700">{status.name}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{status.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">النشاط الأخير</h3>
                  <p className="text-gray-600 text-sm">آخر التحديثات</p>
                </div>
                <Activity className="w-6 h-6 text-[#14B8A6]" />
              </div>

              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-[#14B8A6] transition-all">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 mb-1">{activity.title}</p>
                        <p className="text-xs text-gray-600">{activity.description}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{activity.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-bold">لا يوجد نشاط حديث</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Top Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-1">أفضل المشاريع</h3>
                  <p className="text-gray-600 text-sm">الأكثر أداءً</p>
                </div>
                <Trophy className="w-6 h-6 text-[#F59E0B]" />
              </div>

              <div className="space-y-4">
                {projects.length > 0 ? (
                  projects.slice(0, 3).map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-[#14B8A6] transition-all group/project"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={project.image || '/images/placeholder.jpg'} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 mb-1 truncate">{project.title}</h4>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-600">{project.backers} داعم</span>
                          <span className="text-[#14B8A6] font-bold">
                            {((project.currentAmount / project.goalAmount) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover/project:text-[#14B8A6] transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-bold mb-3">لا توجد مشاريع حتى الآن</p>
                    <Link
                      href="/projects/create"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      إنشاء مشروع
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

