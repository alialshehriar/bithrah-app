'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket, Search, Filter, Download, ArrowLeft, CheckCircle, XCircle,
  Eye, Edit, Trash2, Clock, DollarSign, Users, TrendingUp, Package,
  AlertCircle, Calendar, Target, BarChart3, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  fundingGoal: string;
  currentFunding: string;
  backersCount: number;
  creatorName: string;
  createdAt: string;
  deadline: string;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    funded: 0,
    rejected: 0,
    totalFunding: '0'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchQuery, filterStatus, filterCategory, sortBy, sortOrder]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.creatorName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(project => project.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(project => project.category === filterCategory);
    }

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Project];
      let bValue: any = b[sortBy as keyof Project];

      if (sortBy === 'createdAt' || sortBy === 'deadline') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي المشاريع', value: stats.total, icon: Package, color: 'from-blue-500 to-blue-600' },
    { label: 'قيد المراجعة', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { label: 'نشط', value: stats.active, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'ممول بالكامل', value: stats.funded, icon: CheckCircle, color: 'from-teal-500 to-teal-600' },
    { label: 'مرفوض', value: stats.rejected, icon: XCircle, color: 'from-red-500 to-red-600' },
    { label: 'إجمالي التمويل', value: `${stats.totalFunding} ر.س`, icon: DollarSign, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/admin" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="text-gray-400" size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Rocket className="text-purple-400" size={32} />
                  إدارة المشاريع
                </h1>
              </div>
              <p className="text-gray-400 mr-11">اعتماد ومراجعة وإدارة جميع المشاريع</p>
            </div>
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">تحديث</span>
            </button>
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

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="بحث بالعنوان، الوصف، أو المؤسس..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">كل الحالات</option>
                <option value="pending">قيد المراجعة</option>
                <option value="active">نشط</option>
                <option value="funded">ممول</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="all">كل الفئات</option>
                <option value="tech">تقنية</option>
                <option value="business">أعمال</option>
                <option value="creative">إبداعية</option>
                <option value="social">اجتماعية</option>
              </select>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700/50 border-b border-gray-700">
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">المشروع</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الفئة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الحالة</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">التمويل</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">الداعمون</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{project.title}</p>
                          <p className="text-gray-400 text-sm">{project.creatorName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400">
                          {project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                          project.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          project.status === 'funded' ? 'bg-teal-500/20 text-teal-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {project.status === 'active' ? 'نشط' :
                           project.status === 'pending' ? 'قيد المراجعة' :
                           project.status === 'funded' ? 'ممول' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-semibold">{project.currentFunding} ر.س</p>
                          <p className="text-gray-400 text-sm">من {project.fundingGoal} ر.س</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="text-gray-400" size={16} />
                          <span className="text-white font-semibold">{project.backersCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {project.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(project.id, 'active')}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="اعتماد"
                              >
                                <CheckCircle className="text-green-400" size={18} />
                              </button>
                              <button
                                onClick={() => handleStatusChange(project.id, 'rejected')}
                                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                                title="رفض"
                              >
                                <XCircle className="text-red-400" size={18} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteProject(project.id)}
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
                      <Package className="mx-auto text-gray-600 mb-4" size={48} />
                      <p className="text-gray-400 text-lg">لا توجد نتائج</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-gray-400 text-sm">
          عرض {filteredProjects.length} من {projects.length} مشروع
        </div>
      </div>
    </div>
  );
}

