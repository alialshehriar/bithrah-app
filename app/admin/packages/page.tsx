'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package, Search, Plus, Edit, Trash2, Eye,
  DollarSign, Users, TrendingUp, Award, ArrowLeft,
  CheckCircle, XCircle, Star
} from 'lucide-react';

interface SupportPackage {
  id: string;
  projectId: string;
  projectTitle: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  maxBackers: number;
  currentBackers: number;
  isActive: boolean;
  tier: 'basic' | 'standard' | 'premium';
  createdAt: string;
}

export default function PackagesAdmin() {
  const [packages, setPackages] = useState<SupportPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: SupportPackage[] = [
        {
          id: '1',
          projectId: 'proj-1',
          projectTitle: 'مشروع بذره التجريبي الرسمي',
          name: 'الباقة الأساسية',
          price: 50,
          description: 'دعم أساسي للمشروع',
          benefits: [
            'شكر علني في صفحة المشروع',
            'دعوة للانضمام لمجتمع الداعمين',
            'تحديثات دورية عن المشروع',
            'شارة داعم على الملف الشخصي',
          ],
          maxBackers: 100,
          currentBackers: 8,
          isActive: true,
          tier: 'basic',
          createdAt: '2025-01-10T10:00:00',
        },
        {
          id: '2',
          projectId: 'proj-1',
          projectTitle: 'مشروع بذره التجريبي الرسمي',
          name: 'الباقة المتوسطة',
          price: 250,
          description: 'دعم متوسط مع مميزات إضافية',
          benefits: [
            'جميع مميزات الباقة الأساسية',
            'وصول مبكر للتحديثات والإعلانات',
            'حقوق تصويت رمزية على قرارات المشروع',
            'جلسة أسئلة وأجوبة خاصة شهرياً',
            'شارة داعم ذهبي',
          ],
          maxBackers: 50,
          currentBackers: 3,
          isActive: true,
          tier: 'standard',
          createdAt: '2025-01-10T10:00:00',
        },
        {
          id: '3',
          projectId: 'proj-1',
          projectTitle: 'مشروع بذره التجريبي الرسمي',
          name: 'الباقة المميزة',
          price: 1000,
          description: 'دعم مميز مع امتيازات حصرية',
          benefits: [
            'جميع مميزات الباقات السابقة',
            'عضوية VIP في المجتمع الحصري',
            'اجتماع شهري خاص مع فريق المشروع',
            'الاسم في قائمة الشكر الرسمية',
            'وصول مدى الحياة لجميع التحديثات',
            'شارة داعم بلاتيني حصرية',
            'أولوية في الدعم الفني',
          ],
          maxBackers: 20,
          currentBackers: 1,
          isActive: true,
          tier: 'premium',
          createdAt: '2025-01-10T10:00:00',
        },
      ];
      setPackages(mockData);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'from-green-500 to-emerald-500';
      case 'standard':
        return 'from-yellow-500 to-orange-500';
      case 'premium':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'أساسية';
      case 'standard':
        return 'متوسطة';
      case 'premium':
        return 'مميزة';
      default:
        return tier;
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = filterTier === 'all' || pkg.tier === filterTier;

    return matchesSearch && matchesTier;
  });

  const stats = {
    total: packages.length,
    active: packages.filter((p) => p.isActive).length,
    totalBackers: packages.reduce((sum, p) => sum + p.currentBackers, 0),
    totalRevenue: packages.reduce((sum, p) => sum + (p.price * p.currentBackers), 0),
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
                  <Package className="w-10 h-10 text-yellow-400" />
                  إدارة باقات الدعم
                </h1>
                <p className="text-white/70 text-lg">إدارة جميع باقات الدعم للمشاريع</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              إضافة باقة جديدة
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
                <Package className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">إجمالي الباقات</h3>
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
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">باقات نشطة</h3>
            <p className="text-4xl font-bold">{stats.active}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-white/70 text-sm mb-2">إجمالي الداعمين</h3>
            <p className="text-4xl font-bold">{stats.totalBackers}</p>
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
            <h3 className="text-white/70 text-sm mb-2">إجمالي الإيرادات</h3>
            <p className="text-4xl font-bold">{stats.totalRevenue.toLocaleString('ar-SA')}</p>
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
                placeholder="البحث في الباقات..."
                className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Tier Filter */}
            <div>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40"
              >
                <option value="all">جميع المستويات</option>
                <option value="basic">أساسية</option>
                <option value="standard">متوسطة</option>
                <option value="premium">مميزة</option>
              </select>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getTierColor(pkg.tier)} p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">{pkg.name}</h3>
                  {pkg.tier === 'premium' && <Star className="w-6 h-6" />}
                </div>
                <p className="text-white/90 text-sm mb-4">{getTierLabel(pkg.tier)}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{pkg.price}</span>
                  <span className="text-xl">ريال</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-white/70 mb-2">المشروع</p>
                  <p className="font-semibold">{pkg.projectTitle}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/70 mb-2">الوصف</p>
                  <p className="text-sm">{pkg.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/70 mb-3">المميزات</p>
                  <ul className="space-y-2">
                    {pkg.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                    {pkg.benefits.length > 3 && (
                      <li className="text-sm text-white/50">+{pkg.benefits.length - 3} مميزات أخرى</li>
                    )}
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/70">الداعمين</span>
                    <span className="text-sm font-semibold">{pkg.currentBackers} / {pkg.maxBackers}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${getTierColor(pkg.tier)} h-2 rounded-full`}
                      style={{ width: `${(pkg.currentBackers / pkg.maxBackers) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    عرض
                  </button>
                  <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                  <button className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">لا توجد باقات</p>
          </div>
        )}
      </div>
    </div>
  );
}

