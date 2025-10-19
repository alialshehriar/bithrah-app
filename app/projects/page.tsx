'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, TrendingUp, Clock, DollarSign, Users,
  Plus, Grid, List, ChevronDown, Star, Heart, Eye, ArrowRight,
  Sparkles, Zap, Target, Rocket
} from 'lucide-react';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  category: string;
  tags?: string[];
  image: string | null;
  coverImage?: string | null;
  fundingGoal: string;
  currentFunding: string;
  currency: string;
  backersCount: number;
  deadline: string;
  status: string;
  featured: boolean;
  trending: boolean;
  isSandbox: boolean;
  progress: number;
  daysLeft: number;
  creator: {
    id: number;
    name: string;
    username: string | null;
    avatar: string | null;
  };
}

const categories = [
  { value: '', label: 'الكل', icon: Sparkles },
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'health', label: 'الصحة', icon: Heart },
  { value: 'education', label: 'التعليم', icon: Target },
  { value: 'environment', label: 'البيئة', icon: TrendingUp },
  { value: 'business', label: 'الأعمال', icon: Rocket },
];

const sortOptions = [
  { value: 'recent', label: 'الأحدث' },
  { value: 'popular', label: 'الأكثر شعبية' },
  { value: 'funded', label: 'الأكثر تمويلاً' },
  { value: 'ending', label: 'ينتهي قريباً' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchProjects();
  }, [search, category, sortBy]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      params.append('sortBy', sortBy);

      const response = await fetch(`/api/projects?${params}`);
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

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.value === cat);
    return found?.icon || Target;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-500 via-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <Rocket className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">استكشف المشاريع</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              ادعم الأفكار الريادية وكن جزءاً من قصص النجاح
            </p>
            
            <Link
              href="/projects/create"
              className="inline-flex items-center gap-3 bg-white text-teal-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              أطلق مشروعك الآن
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-6"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن مشروع..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-teal-500 focus:bg-white transition-all duration-200 text-lg"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    category === cat.value
                      ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort and View Mode */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Grid/List */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-600">جرب تغيير معايير البحث أو الفلاتر</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({
  project,
  viewMode,
  index,
}: {
  project: Project;
  viewMode: 'grid' | 'list';
  index: number;
}) {
  const Icon = project.isSandbox ? Sparkles : Rocket;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
    >
      <Link
        href={`/projects/${project.id}`}
        className={`block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
          viewMode === 'list' ? 'flex w-full' : ''
        }`}
      >
        {/* Image */}
        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : 'h-64'} overflow-hidden`}>
          <img
            src={project.image || project.coverImage || '/images/placeholder-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {project.isSandbox && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg">
                <Sparkles className="w-4 h-4" />
                تجريبي
              </span>
            )}
            {project.featured && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                <Star className="w-4 h-4" />
                مميز
              </span>
            )}
            {project.trending && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-rose-500 text-white text-sm font-bold rounded-full shadow-lg">
                <TrendingUp className="w-4 h-4" />
                رائج
              </span>
            )}
          </div>

          {/* Progress Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(project.progress, 100)}%` }}
              />
            </div>
            <p className="text-white text-sm font-bold mt-2">{project.progress}% مكتمل</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
            {project.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <DollarSign className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">المبلغ المجموع</p>
              <p className="text-lg font-bold text-gray-900">
                {parseInt(project.currentFunding).toLocaleString()} {project.currency}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">الداعمون</p>
              <p className="text-lg font-bold text-gray-900">{project.backersCount}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-600 mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-sm text-gray-500">الأيام المتبقية</p>
              <p className="text-lg font-bold text-gray-900">{project.daysLeft}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {project.creator.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{project.creator.name}</p>
                <p className="text-xs text-gray-500">@{project.creator.username || 'user'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-teal-600 font-bold group-hover:gap-3 transition-all">
              <span>تفاصيل</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

