'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Handshake, Search, Filter, Download, Eye, CheckCircle,
  XCircle, Clock, DollarSign, User, Briefcase, ArrowLeft,
  Calendar, AlertCircle, TrendingUp, Activity
} from 'lucide-react';

interface Negotiation {
  id: string;
  projectId: string;
  projectTitle: string;
  investorName: string;
  investorEmail: string;
  depositAmount: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  ndaSigned: boolean;
  lastActivity: string;
}

export default function NegotiationsAdmin() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: Negotiation[] = [
        {
          id: '1',
          projectId: 'proj-1',
          projectTitle: 'مشروع بذره التجريبي الرسمي',
          investorName: 'أحمد المستثمر',
          investorEmail: 'ahmed@example.com',
          depositAmount: 5000,
          status: 'active',
          startDate: '2025-01-15T10:00:00',
          endDate: '2025-01-20T10:00:00',
          daysRemaining: 3,
          ndaSigned: true,
          lastActivity: '2025-01-18T14:30:00',
        },
        {
          id: '2',
          projectId: 'proj-2',
          projectTitle: 'منصة تعليمية تفاعلية',
          investorName: 'فاطمة الاستثمارية',
          investorEmail: 'fatima@example.com',
          depositAmount: 5000,
          status: 'completed',
          startDate: '2025-01-10T09:00:00',
          endDate: '2025-01-15T09:00:00',
          daysRemaining: 0,
          ndaSigned: true,
          lastActivity: '2025-01-15T08:45:00',
        },
        {
          id: '3',
          projectId: 'proj-3',
          projectTitle: 'تطبيق توصيل طعام صحي',
          investorName: 'خالد رأس المال',
          investorEmail: 'khaled@example.com',
          depositAmount: 5000,
          status: 'active',
          startDate: '2025-01-16T11:00:00',
          endDate: '2025-01-21T11:00:00',
          daysRemaining: 4,
          ndaSigned: true,
          lastActivity: '2025-01-17T16:20:00',
        },
        {
          id: '4',
          projectId: 'proj-4',
          projectTitle: 'منصة للعمل الحر',
          investorName: 'سارة الأعمال',
          investorEmail: 'sara@example.com',
          depositAmount: 5000,
          status: 'cancelled',
          startDate: '2025-01-12T10:00:00',
          endDate: '2025-01-17T10:00:00',
          daysRemaining: 0,
          ndaSigned: true,
          lastActivity: '2025-01-14T12:00:00',
        },
      ];
      setNegotiations(mockData);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'expired':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      case 'expired':
        return 'منتهي';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredNegotiations = negotiations.filter((negotiation) => {
    const matchesSearch =
      negotiation.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      negotiation.investorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      negotiation.investorEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || negotiation.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: negotiations.length,
    active: negotiations.filter((n) => n.status === 'active').length,
    completed: negotiations.filter((n) => n.status === 'completed').length,
    totalValue: negotiations.reduce((sum, n) => sum + n.depositAmount, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white" dir="rtl">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                  <Handshake className="w-10 h-10 text-indigo-400" />
                  إدارة التفاوضات
                </h1>
                <p className="text-white/70 text-lg">مراقبة وإدارة جميع التفاوضات على المشاريع</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Download className="w-5 h-5" />
              تصدير البيانات
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Handshake className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">إجمالي التفاوضات</h3>
            <p className="text-4xl font-bold">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">تفاوضات نشطة</h3>
            <p className="text-4xl font-bold">{stats.active}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">تفاوضات مكتملة</h3>
            <p className="text-4xl font-bold">{stats.completed}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">القيمة الإجمالية</h3>
            <p className="text-4xl font-bold">{stats.totalValue.toLocaleString('ar-SA')}</p>
            <p className="text-sm text-white/50 mt-1">ريال</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث في التفاوضات..."
                className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
              >
                <option value="all">جميع الحالات</option>
                <option value="active">نشط</option>
                <option value="completed">مكتمل</option>
                <option value="cancelled">ملغي</option>
                <option value="expired">منتهي</option>
              </select>
            </div>
          </div>
        </div>

        {/* Negotiations Table */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">المشروع</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">المستثمر</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">مبلغ التأمين</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">الحالة</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">تاريخ البدء</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">تاريخ الانتهاء</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">الأيام المتبقية</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">NDA</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-white/70">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredNegotiations.map((negotiation, index) => (
                  <motion.tr
                    key={negotiation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        <span className="font-semibold text-white">{negotiation.projectTitle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{negotiation.investorName}</div>
                      <div className="text-sm text-white/50">{negotiation.investorEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-yellow-400">{negotiation.depositAmount.toLocaleString('ar-SA')}</div>
                      <div className="text-sm text-white/50">ريال</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(negotiation.status)}`}>
                        {getStatusIcon(negotiation.status)}
                        {getStatusLabel(negotiation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {new Date(negotiation.startDate).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {new Date(negotiation.endDate).toLocaleDateString('ar-SA')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {negotiation.status === 'active' ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span className="font-semibold text-orange-400">{negotiation.daysRemaining} يوم</span>
                        </div>
                      ) : (
                        <span className="text-white/50">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {negotiation.ndaSigned ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="عرض التفاصيل">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredNegotiations.length === 0 && (
            <div className="text-center py-12">
              <Handshake className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 text-lg">لا توجد تفاوضات</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

