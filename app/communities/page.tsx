'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Zap, Briefcase, Heart, BookOpen, Target, 
  Users, Plus, TrendingUp, Clock, Search, Filter,
  Globe, Lock, MessageCircle, Eye
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  privacy: string;
  coverImage: string | null;
  memberCount: number;
  postCount: number;
  createdAt: string;
  creator: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}

const categories = [
  { value: '', label: 'الكل', icon: Sparkles, color: 'from-purple-500 to-pink-500' },
  { value: 'technology', label: 'التقنية', icon: Zap, color: 'from-blue-500 to-cyan-500' },
  { value: 'business', label: 'الأعمال', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
  { value: 'health', label: 'الصحة', icon: Heart, color: 'from-red-500 to-pink-500' },
  { value: 'education', label: 'التعليم', icon: BookOpen, color: 'from-yellow-500 to-orange-500' },
  { value: 'other', label: 'أخرى', icon: Target, color: 'from-indigo-500 to-purple-500' },
];

const sortOptions = [
  { value: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
  { value: 'recent', label: 'الأحدث', icon: Clock },
  { value: 'members', label: 'الأكثر أعضاء', icon: Users },
];

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    fetchCommunities();
  }, [search, category, sort]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);

      const response = await fetch(`/api/communities?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCommunities(data);
      } else {
        console.error('Failed to fetch communities');
        setCommunities([]);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.icon : Target;
  };

  const getCategoryColor = (categoryValue: string) => {
    const cat = categories.find(c => c.value === categoryValue);
    return cat ? cat.color : 'from-gray-500 to-gray-600';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
                  <Users className="w-12 h-12" />
                  المجتمعات
                </h1>
                <p className="text-xl text-white/90">
                  انضم إلى مجتمعات ملهمة وتواصل مع رواد الأعمال والمبدعين
                </p>
              </div>
              <Link
                href="/communities/create"
                className="flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                إنشاء مجتمع
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن مجتمعات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pr-12 pl-6 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Filters */}
          <div className="mb-12">
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                التصنيفات
              </h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        category === cat.value
                          ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">الترتيب</h3>
              <div className="flex gap-3">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSort(option.value)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        sort === option.value
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Communities Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                لا توجد مجتمعات بعد
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                كن أول من ينشئ مجتمعاً جديداً!
              </p>
              <Link
                href="/communities/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                إنشاء مجتمع
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => {
                const CategoryIcon = getCategoryIcon(community.category);
                const categoryColor = getCategoryColor(community.category);
                
                return (
                  <Link
                    key={community.id}
                    href={`/communities/${community.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Cover Image */}
                    <div className={`h-40 bg-gradient-to-r ${categoryColor} relative`}>
                      {community.coverImage ? (
                        <img
                          src={community.coverImage}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <CategoryIcon className="w-20 h-20 text-white/30" />
                        </div>
                      )}
                      
                      {/* Privacy Badge */}
                      <div className="absolute top-4 left-4">
                        {community.privacy === 'private' ? (
                          <div className="flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            <Lock className="w-4 h-4" />
                            خاص
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            <Globe className="w-4 h-4" />
                            عام
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {community.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {community.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{community.memberCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{community.postCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-medium">
                          <Eye className="w-4 h-4" />
                          عرض
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

