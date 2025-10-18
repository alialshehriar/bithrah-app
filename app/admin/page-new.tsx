'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  LayoutDashboard, Users, Rocket, MessageSquare, TrendingUp,
  DollarSign, Award, Bell, Settings, Database, BarChart3,
  PieChart, Activity, Clock, CheckCircle, XCircle, AlertCircle,
  Eye, EyeOff, Play, Pause, RefreshCw, Download, Filter,
  Search, Calendar, Globe, Shield, Zap, Target, Sparkles,
  Crown, Heart, Star, Flame, Trophy, Gift, Lock, Unlock,
  Edit, Trash2, X, Check
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

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  points: number;
  level: number;
  emailVerified: boolean;
  createdAt: string;
  status: string;
  projectsCount: number;
  investmentsCount: number;
  totalInvested: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  status: string;
  createdAt: string;
  imageUrl: string;
  packageType: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  backersCount: number;
  negotiationsCount: number;
  progress: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  // Users state
  const [usersPage, setUsersPage] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersPagination, setUsersPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Projects state
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsSearch, setProjectsSearch] = useState('');
  const [projectsStatus, setProjectsStatus] = useState('');
  const [projectsPagination, setProjectsPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  
  // Modals
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchStats();
  }, [sandboxMode, timeRange]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, usersPage, usersSearch, sandboxMode]);

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    }
  }, [activeTab, projectsPage, projectsSearch, projectsStatus, sandboxMode]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats?sandbox=${sandboxMode}&timeRange=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
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
            total: data.stats.funding.total * 0.05,
            thisMonth: data.stats.funding.total * 0.05,
            lastMonth: 0,
            subscriptions: 0,
            commissions: data.stats.funding.total * 0.05
          }
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `/api/admin/users?page=${usersPage}&limit=10&search=${usersSearch}&sandbox=${sandboxMode}`
      );
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
        setUsersPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        `/api/admin/projects?page=${projectsPage}&limit=10&search=${projectsSearch}&status=${projectsStatus}&sandbox=${sandboxMode}`
      );
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        setProjectsPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleApproveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: '' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('تم اعتماد المشروع بنجاح');
        fetchProjects();
        setShowApproveModal(false);
      } else {
        alert('فشل اعتماد المشروع: ' + data.error);
      }
    } catch (error) {
      console.error('Error approving project:', error);
      alert('حدث خطأ أثناء اعتماد المشروع');
    }
  };

  const handleRejectProject = async (projectId: string) => {
    if (!rejectReason.trim()) {
      alert('يجب تقديم سبب الرفض');
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('تم رفض المشروع بنجاح');
        fetchProjects();
        setShowRejectModal(false);
        setRejectReason('');
      } else {
        alert('فشل رفض المشروع: ' + data.error);
      }
    } catch (error) {
      console.error('Error rejecting project:', error);
      alert('حدث خطأ أثناء رفض المشروع');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف المستخدم بنجاح');
        fetchUsers();
      } else {
        alert('فشل حذف المستخدم: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ أثناء حذف المستخدم');
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
        <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
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

                <button 
                  onClick={fetchStats}
                  className="p-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                >
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
                      value={`${(stats.overview.totalFunding / 1000).toFixed(1)}K`}
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
                      title="التقييمات"
                      value={stats.overview.totalMessages}
                      icon={Star}
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
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Users Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                      title="إجمالي المستخدمين"
                      value={usersPagination.total}
                      icon={Users}
                      color="from-blue-500 to-blue-600"
                    />
                    <StatCard
                      title="المستخدمون النشطون"
                      value={users.filter(u => u.status === 'active').length}
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="مستخدمون جدد (هذا الشهر)"
                      value={users.filter(u => {
                        const created = new Date(u.createdAt);
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return created > monthAgo;
                      }).length}
                      icon={Star}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="إجمالي المشاريع"
                      value={users.reduce((sum, u) => sum + u.projectsCount, 0)}
                      icon={Rocket}
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
                          value={usersSearch}
                          onChange={(e) => setUsersSearch(e.target.value)}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <button 
                        onClick={fetchUsers}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        <span>بحث</span>
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
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الدور</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">المشاريع</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الاستثمارات</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">النقاط</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">الحالة</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">تاريخ الانضمام</th>
                            <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">إجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name}</p>
                                    <p className="text-sm text-gray-600">@{user.username}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-medium text-sm">
                                  {user.projectsCount}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-medium text-sm">
                                  {user.investmentsCount}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium text-sm">
                                  {user.points}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full font-medium text-sm flex items-center gap-1 w-fit ${
                                  user.status === 'active' 
                                    ? 'bg-green-50 text-green-600' 
                                    : 'bg-gray-50 text-gray-600'
                                }`}>
                                  {user.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                  {user.status === 'active' ? 'نشط' : 'غير نشط'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowUserModal(true);
                                    }}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                  </button>
                                  {user.role !== 'admin' && (
                                    <button 
                                      onClick={() => handleDeleteUser(user.id)}
                                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        عرض {((usersPage - 1) * 10) + 1}-{Math.min(usersPage * 10, usersPagination.total)} من {usersPagination.total}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                          disabled={usersPage === 1}
                          className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          السابق
                        </button>
                        {Array.from({ length: Math.min(5, usersPagination.totalPages) }, (_, i) => i + 1).map(page => (
                          <button 
                            key={page}
                            onClick={() => setUsersPage(page)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              page === usersPage
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button 
                          onClick={() => setUsersPage(Math.min(usersPagination.totalPages, usersPage + 1))}
                          disabled={usersPage === usersPagination.totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          التالي
                        </button>
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
                      value={projectsPagination.total}
                      icon={Rocket}
                      color="from-purple-500 to-purple-600"
                    />
                    <StatCard
                      title="المشاريع النشطة"
                      value={projects.filter(p => p.status === 'active').length}
                      icon={Activity}
                      color="from-green-500 to-green-600"
                    />
                    <StatCard
                      title="قيد المراجعة"
                      value={projects.filter(p => p.status === 'pending').length}
                      icon={Clock}
                      color="from-yellow-500 to-yellow-600"
                    />
                    <StatCard
                      title="مكتملة"
                      value={projects.filter(p => p.status === 'completed').length}
                      icon={CheckCircle}
                      color="from-teal-500 to-teal-600"
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
                          value={projectsSearch}
                          onChange={(e) => setProjectsSearch(e.target.value)}
                          className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <select
                        value={projectsStatus}
                        onChange={(e) => setProjectsStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">جميع الحالات</option>
                        <option value="pending">قيد المراجعة</option>
                        <option value="active">نشط</option>
                        <option value="completed">مكتمل</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                      <button 
                        onClick={fetchProjects}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Search className="w-5 h-5" />
                        <span>بحث</span>
                      </button>
                    </div>
                  </div>

                  {/* Projects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="h-48 bg-gradient-to-br from-teal-500 to-purple-500 relative">
                          {project.imageUrl && (
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              project.status === 'active' ? 'bg-green-500 text-white' :
                              project.status === 'pending' ? 'bg-yellow-500 text-white' :
                              project.status === 'completed' ? 'bg-blue-500 text-white' :
                              'bg-red-500 text-white'
                            }`}>
                              {project.status === 'active' ? 'نشط' :
                               project.status === 'pending' ? 'قيد المراجعة' :
                               project.status === 'completed' ? 'مكتمل' :
                               'مرفوض'}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">التقدم</span>
                              <span className="font-medium text-gray-900">{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{project.currentAmount.toLocaleString()} ر.س</span>
                              <span className="text-gray-600">{project.goalAmount.toLocaleString()} ر.س</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{project.backersCount} داعم</span>
                            <span className="mx-2">•</span>
                            <MessageSquare className="w-4 h-4" />
                            <span>{project.negotiationsCount} مفاوضة</span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedProject(project);
                                setShowProjectModal(true);
                              }}
                              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
                            >
                              عرض
                            </button>
                            {project.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowApproveModal(true);
                                  }}
                                  className="flex-1 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-sm font-medium"
                                >
                                  اعتماد
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowRejectModal(true);
                                  }}
                                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
                                >
                                  رفض
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        عرض {((projectsPage - 1) * 10) + 1}-{Math.min(projectsPage * 10, projectsPagination.total)} من {projectsPagination.total}
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setProjectsPage(Math.max(1, projectsPage - 1))}
                          disabled={projectsPage === 1}
                          className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          السابق
                        </button>
                        {Array.from({ length: Math.min(5, projectsPagination.totalPages) }, (_, i) => i + 1).map(page => (
                          <button 
                            key={page}
                            onClick={() => setProjectsPage(page)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              page === projectsPage
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                                : 'border border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button 
                          onClick={() => setProjectsPage(Math.min(projectsPagination.totalPages, projectsPage + 1))}
                          disabled={projectsPage === projectsPagination.totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          التالي
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Other Tabs - Coming Soon */}
              {['funding', 'communities', 'messages', 'analytics', 'settings'].includes(activeTab) && (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">قريباً</h3>
                  <p className="text-gray-600">هذا القسم قيد التطوير وسيكون متاحاً قريباً</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">اعتماد المشروع</h3>
            <p className="text-gray-600 mb-6">
              هل أنت متأكد من اعتماد مشروع "{selectedProject.title}"؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleApproveProject(selectedProject.id)}
                className="flex-1 px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors font-medium"
              >
                اعتماد
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedProject(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">رفض المشروع</h3>
            <p className="text-gray-600 mb-4">
              يرجى تقديم سبب رفض مشروع "{selectedProject.title}":
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="اكتب سبب الرفض..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleRejectProject(selectedProject.id)}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                رفض
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedProject(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

