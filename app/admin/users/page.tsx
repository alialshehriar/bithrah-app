'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Download, Upload, Edit, Trash2,
  CheckCircle, XCircle, Eye, MoreVertical, ArrowLeft, Plus,
  Mail, Phone, Calendar, MapPin, Award, DollarSign, Activity,
  TrendingUp, Clock, Shield, Crown, Star, Zap, Target,
  BarChart3, Package, MessageCircle, Heart, AlertCircle,
  UserCheck, UserX, RefreshCw, Settings, ChevronDown, ChevronUp,
  User as UserIcon
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  level: number;
  points: number;
  walletBalance: string;
  totalProjects: number;
  totalInvestments: number;
  totalEarnings: string;
  joinedAt: string;
  lastActive: string;
  verified: boolean;
  avatar?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('joinedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    newThisMonth: 0,
    verified: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, filterStatus, filterRole, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof User];
      let bValue: any = b[sortBy as keyof User];

      if (sortBy === 'joinedAt' || sortBy === 'lastActive') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const exportUsers = () => {
    const csv = [
      ['الاسم', 'البريد', 'الهاتف', 'الدور', 'الحالة', 'المستوى', 'النقاط', 'الرصيد', 'تاريخ الانضمام'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.phone || '',
        user.role,
        user.status,
        user.level,
        user.points,
        user.walletBalance,
        new Date(user.joinedAt).toLocaleDateString('ar-SA')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString()}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المستخدمين...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي المستخدمين', value: stats.total, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'نشط', value: stats.active, icon: UserCheck, color: 'from-green-500 to-green-600' },
    { label: 'غير نشط', value: stats.inactive, icon: UserX, color: 'from-gray-500 to-gray-600' },
    { label: 'موقوف', value: stats.suspended, icon: AlertCircle, color: 'from-red-500 to-red-600' },
    { label: 'جديد هذا الشهر', value: stats.newThisMonth, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { label: 'موثق', value: stats.verified, icon: Shield, color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/admin"
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="text-gray-400" size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Users className="text-teal-400" size={32} />
                  إدارة المستخدمين
                </h1>
              </div>
              <p className="text-gray-400 mr-11">تحكم كامل في جميع المستخدمين والصلاحيات</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportUsers}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all"
              >
                <Download size={20} />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <RefreshCw size={20} />
                <span className="hidden sm:inline">تحديث</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="بحث بالاسم، البريد، أو الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="all">كل الحالات</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-teal-500 transition-colors"
              >
                <option value="all">كل الأدوار</option>
                <option value="user">مستخدم</option>
                <option value="investor">مستثمر</option>
                <option value="marketer">مسوق</option>
                <option value="admin">مدير</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
            <span className="text-gray-400 text-sm">ترتيب حسب:</span>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'joinedAt', label: 'تاريخ الانضمام' },
                { value: 'lastActive', label: 'آخر نشاط' },
                { value: 'name', label: 'الاسم' },
                { value: 'level', label: 'المستوى' },
                { value: 'points', label: 'النقاط' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (sortBy === option.value) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy(option.value);
                      setSortOrder('desc');
                    }
                  }}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                    sortBy === option.value
                      ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                      : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {option.label}
                  {sortBy === option.value && (
                    sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    الدور
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    المستوى
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    الرصيد
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    آخر نشاط
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-semibold flex items-center gap-2">
                              {user.name}
                              {user.verified && (
                                <Shield className="text-teal-400" size={14} />
                              )}
                            </p>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                          user.role === 'investor' ? 'bg-blue-500/20 text-blue-400' :
                          user.role === 'marketer' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.role === 'admin' && <Crown size={12} />}
                          {user.role === 'investor' && <DollarSign size={12} />}
                          {user.role === 'marketer' && <Target size={12} />}
                          {user.role === 'admin' ? 'مدير' :
                           user.role === 'investor' ? 'مستثمر' :
                           user.role === 'marketer' ? 'مسوق' : 'مستخدم'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          user.status === 'suspended' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {user.status === 'active' ? 'نشط' :
                           user.status === 'suspended' ? 'موقوف' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Zap className="text-yellow-400" size={16} />
                          <span className="text-white font-bold">{user.level}</span>
                          <span className="text-gray-400 text-sm">({user.points} نقطة)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-semibold">{user.walletBalance} ر.س</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Clock size={14} />
                          {new Date(user.lastActive).toLocaleDateString('ar-SA')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="text-blue-400" size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(
                              user.id,
                              user.status === 'active' ? 'suspended' : 'active'
                            )}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title={user.status === 'active' ? 'إيقاف' : 'تفعيل'}
                          >
                            {user.status === 'active' ? (
                              <UserX className="text-red-400" size={18} />
                            ) : (
                              <UserCheck className="text-green-400" size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="text-red-400" size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Users className="mx-auto text-gray-600 mb-4" size={48} />
                      <p className="text-gray-400 text-lg">لا توجد نتائج</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center text-gray-400 text-sm">
          عرض {filteredUsers.length} من {users.length} مستخدم
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserDetails && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUserDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {selectedUser.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    تفاصيل المستخدم
                  </h2>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <XCircle className="text-gray-400" size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <UserIcon size={16} />
                      <span className="text-sm">الاسم الكامل</span>
                    </div>
                    <p className="text-white font-semibold">{selectedUser.name}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Mail size={16} />
                      <span className="text-sm">البريد الإلكتروني</span>
                    </div>
                    <p className="text-white font-semibold">{selectedUser.email}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Phone size={16} />
                      <span className="text-sm">رقم الهاتف</span>
                    </div>
                    <p className="text-white font-semibold">{selectedUser.phone || 'غير محدد'}</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar size={16} />
                      <span className="text-sm">تاريخ الانضمام</span>
                    </div>
                    <p className="text-white font-semibold">
                      {new Date(selectedUser.joinedAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
                    <Zap className="text-blue-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedUser.level}</p>
                    <p className="text-sm text-gray-400">المستوى</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
                    <Star className="text-yellow-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedUser.points}</p>
                    <p className="text-sm text-gray-400">النقاط</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
                    <DollarSign className="text-green-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedUser.walletBalance}</p>
                    <p className="text-sm text-gray-400">الرصيد (ر.س)</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                    <Package className="text-purple-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">{selectedUser.totalProjects}</p>
                    <p className="text-sm text-gray-400">المشاريع</p>
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-teal-400" size={20} />
                    ملخص النشاط
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400 text-sm">إجمالي الاستثمارات</span>
                      <span className="text-white font-bold">{selectedUser.totalInvestments}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400 text-sm">إجمالي الأرباح</span>
                      <span className="text-white font-bold">{selectedUser.totalEarnings} ر.س</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400 text-sm">آخر نشاط</span>
                      <span className="text-white font-bold">
                        {new Date(selectedUser.lastActive).toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleStatusChange(
                      selectedUser.id,
                      selectedUser.status === 'active' ? 'suspended' : 'active'
                    )}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      selectedUser.status === 'active'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                    }`}
                  >
                    {selectedUser.status === 'active' ? (
                      <>
                        <UserX size={20} />
                        إيقاف الحساب
                      </>
                    ) : (
                      <>
                        <UserCheck size={20} />
                        تفعيل الحساب
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.id)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={20} />
                    حذف المستخدم
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

