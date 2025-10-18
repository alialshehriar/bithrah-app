'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Search, Globe, Lock, Eye, Edit, Trash2,
  CheckCircle, XCircle, TrendingUp, MessageSquare
} from 'lucide-react';

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  privacy: string;
  status: string;
  coverImage: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
  creator: {
    id: number;
    name: string;
    username: string;
  };
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCommunities();
  }, [search, filterPrivacy, filterStatus]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterPrivacy !== 'all') params.append('privacy', filterPrivacy);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/communities?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setCommunities(data.communities);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (communityId: number, newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير حالة المجتمع إلى "${newStatus}"؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/communities/${communityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('تم تحديث حالة المجتمع بنجاح');
        fetchCommunities();
      }
    } catch (error) {
      console.error('Error updating community:', error);
      alert('حدث خطأ أثناء تحديث المجتمع');
    }
  };

  const handleDeleteCommunity = async (communityId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المجتمع؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/communities/${communityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('تم حذف المجتمع بنجاح');
        fetchCommunities();
      }
    } catch (error) {
      console.error('Error deleting community:', error);
      alert('حدث خطأ أثناء حذف المجتمع');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'suspended':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
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
                <Users className="w-10 h-10 text-teal-500" />
                <div>
                  <h1 className="text-4xl font-black text-white">إدارة المجتمعات</h1>
                  <p className="text-gray-400">عرض وتعديل وحذف المجتمعات</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">{communities.length}</div>
              <div className="text-gray-400 text-sm">إجمالي المجتمعات</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث بالاسم..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={filterPrivacy}
              onChange={(e) => setFilterPrivacy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="public">عام</option>
              <option value="private">خاص</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="suspended">موقوف</option>
              <option value="pending">قيد المراجعة</option>
            </select>
          </div>
        </motion.div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا يوجد مجتمعات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all"
              >
                {/* Cover Image */}
                <div className="relative h-32 bg-gradient-to-br from-teal-600 to-cyan-600">
                  {community.coverImage && (
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className={`px-3 py-1 ${getStatusColor(community.status)} rounded-full text-white text-sm font-bold`}>
                      {community.status}
                    </div>
                    {community.privacy === 'private' ? (
                      <div className="px-3 py-1 bg-gray-800 rounded-full text-white text-sm font-bold flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        خاص
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-blue-600 rounded-full text-white text-sm font-bold flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        عام
                      </div>
                    )}
                  </div>
                </div>

                {/* Community Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{community.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{community.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                      <div className="text-white font-bold">{community.memberCount}</div>
                      <div className="text-gray-400 text-xs">عضو</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <MessageSquare className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-white font-bold">{community.postCount}</div>
                      <div className="text-gray-400 text-xs">منشور</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                      <div className="text-white font-bold">{community.category}</div>
                      <div className="text-gray-400 text-xs">الفئة</div>
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span>المنشئ:</span>
                    <span className="text-white font-bold">{community.creator?.name || 'غير معروف'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/communities/${community.id}`}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-white text-center font-bold flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      عرض
                    </Link>
                    {community.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(community.id, 'suspended')}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition-colors text-white font-bold flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        إيقاف
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(community.id, 'active')}
                        className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl transition-colors text-white font-bold flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        تفعيل
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteCommunity(community.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
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

