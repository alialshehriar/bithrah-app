'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Zap, Briefcase, Heart, BookOpen, Target, Users, Plus, TrendingUp, Clock } from 'lucide-react';
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
  { value: '', label: 'الكل', iconName: 'Sparkles' },
  { value: 'technology', label: 'التقنية', iconName: 'Zap' },
  { value: 'business', label: 'الأعمال', iconName: 'Briefcase' },
  { value: 'health', label: 'الصحة', iconName: 'Heart' },
  { value: 'education', label: 'التعليم', iconName: 'BookOpen' },
  { value: 'other', label: 'أخرى', iconName: 'Target' },
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 glass-strong">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-teal blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-purple blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-3">المجتمعات</h1>
            <p className="text-text-secondary text-lg mb-6">انضم إلى مجتمعات رواد الأعمال والمستثمرين</p>
            
            <Link
              href="/communities/create"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>إنشاء مجتمع جديد</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-2xl p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مجتمع..."
              className="input-field pr-12"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">التصنيف</label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    category === cat.value
                      ? 'gradient-bg text-white shadow-glow'
                      : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                  }`}
                >
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">الترتيب</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSort('popular')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  sort === 'popular'
                    ? 'gradient-bg text-white shadow-glow'
                    : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <span></span>
                <span>الأكثر شعبية</span>
              </button>
              <button
                onClick={() => setSort('recent')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  sort === 'recent'
                    ? 'gradient-bg text-white shadow-glow'
                    : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <span>🕐</span>
                <span>الأحدث</span>
              </button>
              <button
                onClick={() => setSort('members')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  sort === 'members'
                    ? 'gradient-bg text-white shadow-glow'
                    : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>الأكثر أعضاء</span>
              </button>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 rounded-2xl gradient-bg animate-pulse"></div>
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted text-lg">لا توجد مجتمعات متاحة</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link
                key={community.id}
                href={`/communities/${community.id}`}
                className="card-luxury group overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-40 rounded-xl bg-gradient-to-br from-teal-500/20 to-purple-500/20 overflow-hidden mb-4">
                  {community.coverImage ? (
                    <img
                      src={community.coverImage}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {community.category === 'technology' && <Zap className="w-12 h-12 text-teal" />}
                      {community.category === 'business' && <Briefcase className="w-12 h-12 text-purple" />}
                      {community.category === 'health' && <Heart className="w-12 h-12 text-pink-500" />}
                      {community.category === 'education' && <BookOpen className="w-12 h-12 text-blue-500" />}
                      {community.category === 'other' && <Target className="w-12 h-12 text-teal" />}
                      {!community.category && <Sparkles className="w-12 h-12 text-teal" />}
                    </div>
                  )}
                  
                  {/* Privacy Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      community.privacy === 'private'
                        ? 'bg-purple/20 text-purple border border-purple/30'
                        : 'bg-teal/20 text-teal border border-teal/30'
                    }`}>
                      {community.privacy === 'private' ? '🔒 خاص' : '🌐 عام'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0 shadow-glow">
                    {community.creator.avatar ? (
                      <img
                        src={community.creator.avatar}
                        alt={community.creator.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold">
                        {community.creator.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text-primary mb-1 truncate">
                      {community.name}
                    </h3>
                    <p className="text-sm text-text-muted">
                      بواسطة @{community.creator.username}
                    </p>
                  </div>
                </div>

                <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                  {community.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{community.memberCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span></span>
                    <span>{community.postCount || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

