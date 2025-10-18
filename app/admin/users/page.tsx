'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Search, Filter, Edit, Trash2, Ban, CheckCircle,
  XCircle, Crown, Shield, Star, TrendingUp, Calendar,
  Mail, Phone, MapPin, Award, Activity, Eye
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: string;
  status: string;
  level: number;
  points: number;
  subscriptionTier: string;
  createdAt: string;
  lastLoginAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [search, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير حالة المستخدم إلى "${newStatus}"؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('تم تحديث حالة المستخدم بنجاح');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('حدث خطأ أثناء تحديث المستخدم');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('تم حذف المستخدم بنجاح');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('حدث خطأ أثناء حذف المستخدم');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-red-500';
      case 'banned':
        return 'bg-gray-800';
      default:
        return 'bg-gray-500';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'from-purple-500 to-pink-500';
      case 'gold':
        return 'from-yellow-500 to-orange-500';
      case 'silver':
        return 'from-gray-400 to-gray-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← العودة
              </Link>
              <div className="flex items-center gap-3">
                <Users className="w-10 h-10 text-blue-500" />
                <div>
                  <h1 className="text-4xl font-black text-white">إدارة المستخدمين</h1>
                  <p className="text-gray-400">عرض وتعديل وحذف المستخدمين</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">{users.length}</div>
              <div className="text-gray-400 text-sm">إجمالي المستخدمين</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث بالاسم أو البريد..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">جميع الأدوار</option>
              <option value="user">مستخدم</option>
              <option value="admin">مدير</option>
              <option value="moderator">مشرف</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">موقوف</option>
              <option value="banned">محظور</option>
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا يوجد مستخدمين</p>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <Users className="w-8 h-8 text-white" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-2 border-gray-900`}></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                        {user.role === 'admin' && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTierColor(user.subscriptionTier)} text-white text-xs font-bold`}>
                          {user.subscriptionTier}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          المستوى {user.level}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {user.points} نقطة
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
                    >
                      <Eye className="w-5 h-5 text-white" />
                    </Link>
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="p-3 bg-teal-500 hover:bg-teal-600 rounded-xl transition-colors"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </Link>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                        className="p-3 bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors"
                      >
                        <Ban className="w-5 h-5 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user.id, 'active')}
                        className="p-3 bg-green-500 hover:bg-green-600 rounded-xl transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-3 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

