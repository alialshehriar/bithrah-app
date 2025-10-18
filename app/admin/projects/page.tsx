'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Rocket, Search, Filter, Edit, Trash2, CheckCircle,
  XCircle, Clock, Eye, DollarSign, Users, TrendingUp,
  Calendar, AlertCircle
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  fundingGoal: number;
  currentFunding: number;
  status: string;
  image: string;
  createdAt: string;
  creator: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, [search, filterStatus, filterCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterCategory !== 'all') params.append('category', filterCategory);

      const response = await fetch(`/api/admin/projects?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (projectId: number, newStatus: string) => {
    if (!confirm(`هل أنت متأكد من تغيير حالة المشروع إلى "${newStatus}"؟`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        alert('تم تحديث حالة المشروع بنجاح');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('حدث خطأ أثناء تحديث المشروع');
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('تم حذف المشروع بنجاح');
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('حدث خطأ أثناء حذف المشروع');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'pending':
        return 'قيد المراجعة';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
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
                <Rocket className="w-10 h-10 text-purple-500" />
                <div>
                  <h1 className="text-4xl font-black text-white">إدارة المشاريع</h1>
                  <p className="text-gray-400">اعتماد ورفض وتعديل المشاريع</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-white">{projects.length}</div>
              <div className="text-gray-400 text-sm">إجمالي المشاريع</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث بالعنوان أو الوصف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="pending">قيد المراجعة</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">جميع الفئات</option>
              <option value="technology">تقنية</option>
              <option value="business">أعمال</option>
              <option value="health">صحة</option>
              <option value="education">تعليم</option>
              <option value="art">فن</option>
            </select>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">لا يوجد مشاريع</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 ${getStatusColor(project.status)} rounded-full text-white text-sm font-bold`}>
                    {getStatusText(project.status)}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <DollarSign className="w-4 h-4" />
                        <span>الهدف</span>
                      </div>
                      <div className="text-white font-bold">{project.fundingGoal.toLocaleString()} ر.س</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>التمويل الحالي</span>
                      </div>
                      <div className="text-white font-bold">{project.currentFunding.toLocaleString()} ر.س</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>نسبة التمويل</span>
                      <span>{calculateProgress(project.currentFunding, project.fundingGoal).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${calculateProgress(project.currentFunding, project.fundingGoal)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{project.creator?.name || 'غير معروف'}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-white text-center font-bold flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      عرض
                    </Link>
                    {project.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(project.id, 'active')}
                          className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl transition-colors text-white font-bold flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          اعتماد
                        </button>
                        <button
                          onClick={() => handleStatusChange(project.id, 'cancelled')}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl transition-colors text-white font-bold flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          رفض
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteProject(project.id)}
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

