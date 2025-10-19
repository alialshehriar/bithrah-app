'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Plus, Search, Filter, TrendingUp, Clock,
  UserPlus, Lock, Globe, Star, MessageSquare, Eye,
  Sparkles, Target, Briefcase, Heart, Zap, BookOpen
} from 'lucide-react';
import { CommunityCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

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
  isDemo?: boolean;
  creator: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}

const categories = [
  { value: '', label: 'الكل', icon: Sparkles },
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'business', label: 'الأعمال', icon: Briefcase },
  { value: 'health', label: 'الصحة', icon: Heart },
  { value: 'education', label: 'التعليم', icon: BookOpen },
  { value: 'other', label: 'أخرى', icon: Target },
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
      params.append('sort', sort);

      const response = await fetch(`/api/communities?${params.toString()}`);
      const data = await response.json();
      setCommunities(data.communities || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    const found = categories.find(c => c.value === cat);
    return found?.icon || Target;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto">
                <Users className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">المجتمعات</h1>
            <p className="text-xl text-white/90 mb-6">انضم إلى مجتمعات رواد الأعمال والمستثمرين</p>
            
            <Link
              href="/communities/create"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              إنشاء مجتمع جديد
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث عن مجتمع..."
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              التصنيف
            </label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      category === cat.value
                        ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الترتيب
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSort('popular')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'popular'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                الأكثر شعبية
              </button>
              <button
                onClick={() => setSort('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'recent'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                الأحدث
              </button>
              <button
                onClick={() => setSort('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  sort === 'members'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                الأكثر أعضاء
              </button>
            </div>
          </div>
        </motion.div>

        {/* Communities Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CommunityCardSkeleton key={i} />
            ))}
          </div>
        ) : communities.length === 0 ? (
          <EmptyState
            icon={Users}
            title="لا توجد مجتمعات"
            description="جرّب تغيير معايير البحث أو الفلاتر للعثور على مجتمعات تناسبك"
            actionLabel="إنشاء مجتمع جديد"
            actionHref="/communities/create"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community, index) => {
              const CategoryIcon = getCategoryIcon(community.category);
              return (
                <motion.div
                  key={community.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={`/communities/${community.id}`}
                    className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-40 bg-gradient-to-br from-teal-500 to-purple-600 overflow-hidden">
                      {community.coverImage ? (
                        <img
                          src={community.coverImage}
                          alt={community.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Privacy Badge */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {community.isDemo && (
                          <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3 text-white" />
                            <span className="text-xs font-bold text-white">تجريبي</span>
                          </div>
                        )}
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          {community.privacy === 'private' ? (
                            <>
                              <Lock className="w-3 h-3 text-gray-700" />
                              <span className="text-xs font-medium text-gray-700">خاص</span>
                            </>
                          ) : (
                            <>
                              <Globe className="w-3 h-3 text-gray-700" />
                              <span className="text-xs font-medium text-gray-700">عام</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          {community.creator.avatar ? (
                            <img
                              src={community.creator.avatar}
                              alt={community.creator.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Users className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                            {community.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            بواسطة @{community.creator.username}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {community.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{community.memberCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{community.postCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

