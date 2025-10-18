'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, TrendingUp, Clock, Target, Heart, Share2, Rocket, Sparkles, Zap, Briefcase, BookOpen } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  backersCount: number;
  daysLeft: number;
  image: string | null;
  status: string;
  creator: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}

const categories = [
  { value: '', label: 'الكل', Icon: Sparkles },
  { value: 'technology', label: 'التقنية', Icon: Zap },
  { value: 'business', label: 'الأعمال', Icon: Briefcase },
  { value: 'health', label: 'الصحة', Icon: Heart },
  { value: 'education', label: 'التعليم', Icon: BookOpen },
  { value: 'other', label: 'أخرى', Icon: Target },
];

const sortOptions = [
  { value: 'trending', label: 'الأكثر رواجاً', Icon: TrendingUp },
  { value: 'newest', label: 'الأحدث', Icon: Clock },
  { value: 'goal', label: 'الأقرب للهدف', Icon: Target },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [search, category, sort]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);

      const response = await fetch(`/api/projects?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-block p-4 rounded-3xl gradient-bg mb-4">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            استكشف المشاريع
          </h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            اكتشف مشاريع مبتكرة من رواد الأعمال السعوديين وادعم الأفكار التي تؤمن بها
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-luxury space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مشروع..."
              className="w-full pr-12 pl-4 py-4 bg-bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal/50 text-text-primary transition-all duration-200"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
                showFilters ? 'bg-teal text-white' : 'bg-bg-hover text-text-secondary hover:bg-teal/10'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">التصنيف</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.Icon;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          category === cat.value
                            ? 'gradient-bg text-white shadow-glow'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3">الترتيب</label>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.Icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSort(option.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          sort === option.value
                            ? 'gradient-bg text-white shadow-glow'
                            : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card-luxury animate-pulse">
                <div className="w-full h-48 bg-bg-secondary rounded-2xl mb-4"></div>
                <div className="h-6 bg-bg-secondary rounded mb-2"></div>
                <div className="h-4 bg-bg-secondary rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <Rocket className="w-20 h-20 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">لا توجد مشاريع متاحة</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);
              
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="card-luxury group hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Project Image */}
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-teal-500/20 to-purple-500/20">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-teal" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-teal/20 text-teal border border-teal/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {project.status === 'active' ? 'نشط' : 'منتهي'}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-700" />
                      </button>
                      <button className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {project.description}
                    </p>

                    {/* Creator */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                        {project.creator.name.charAt(0)}
                      </div>
                      <span className="text-sm text-text-secondary">
                        {project.creator.name}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">التقدم</span>
                        <span className="text-teal font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-bg-secondary overflow-hidden">
                        <div 
                          className="h-full gradient-bg transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-text-muted">تم جمع</p>
                        <p className="text-lg font-bold text-teal">
                          {project.raisedAmount.toLocaleString()} ريال
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-text-muted">من</p>
                        <p className="text-lg font-bold text-text-primary">
                          {project.goalAmount.toLocaleString()} ريال
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <span>{project.backersCount} داعم</span>
                      <span>{project.daysLeft} يوم متبقي</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

