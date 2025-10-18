'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare, Search, ArrowLeft, Users, MessageCircle, TrendingUp,
  RefreshCw, CheckCircle, XCircle, Trash2
} from 'lucide-react';

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  postsCount: number;
  status: string;
  creatorName: string;
}

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalMembers: 0,
    totalPosts: 0
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    filterCommunities();
  }, [communities, searchQuery]);

  const fetchCommunities = async () => {
    try {
      const res = await fetch('/api/admin/communities');
      const data = await res.json();
      if (data.success) {
        setCommunities(data.communities || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCommunities = () => {
    let filtered = [...communities];

    if (searchQuery) {
      filtered = filtered.filter(community =>
        community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCommunities(filtered);
  };

  const handleStatusChange = async (communityId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/communities/${communityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCommunities();
      }
    } catch (error) {
      console.error('Error updating community:', error);
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المجتمع؟')) return;
    
    try {
      const res = await fetch(`/api/admin/communities/${communityId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchCommunities();
      }
    } catch (error) {
      console.error('Error deleting community:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المجتمعات...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي المجتمعات', value: stats.total, icon: MessageSquare, color: 'from-blue-500 to-blue-600' },
    { label: 'نشط', value: stats.active, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { label: 'إجمالي الأعضاء', value: stats.totalMembers, icon: Users, color: 'from-purple-500 to-purple-600' },
    { label: 'إجمالي المنشورات', value: stats.totalPosts, icon: MessageCircle, color: 'from-teal-500 to-teal-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="text-gray-400" size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <MessageSquare className="text-teal-400" size={32} />
                  إدارة المجتمعات
                </h1>
              </div>
              <p className="text-gray-400 mr-11">إدارة المجتمعات والمحتوى</p>
            </div>
            <button
              onClick={fetchCommunities}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="بحث بالاسم أو الوصف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">المجتمع</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الفئة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الأعضاء</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">المنشورات</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredCommunities.length > 0 ? (
                  filteredCommunities.map((community, index) => (
                    <motion.tr
                      key={community.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{community.name}</p>
                          <p className="text-gray-400 text-sm">{community.creatorName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                          {community.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="text-gray-400" size={16} />
                          <span className="text-white font-semibold">{community.memberCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="text-gray-400" size={16} />
                          <span className="text-white font-semibold">{community.postsCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          community.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {community.status === 'active' ? 'نشط' : 'موقوف'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatusChange(
                              community.id,
                              community.status === 'active' ? 'inactive' : 'active'
                            )}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title={community.status === 'active' ? 'إيقاف' : 'تفعيل'}
                          >
                            {community.status === 'active' ? (
                              <XCircle className="text-red-400" size={18} />
                            ) : (
                              <CheckCircle className="text-green-400" size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteCommunity(community.id)}
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                      <p className="text-gray-400 text-lg">لا توجد نتائج</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          عرض {filteredCommunities.length} من {communities.length} مجتمع
        </div>
      </div>
    </div>
  );
}

