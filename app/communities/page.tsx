'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Plus, Search, Globe, Lock, TrendingUp,
  MessageSquare, ArrowRight, Sparkles, Briefcase,
  GraduationCap, Heart, LayoutGrid
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
  isPopular?: boolean;
  creator?: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
  };
}

export default function CommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'الكل', icon: LayoutGrid },
    { id: 'tech', name: 'التقنية', icon: Sparkles },
    { id: 'business', name: 'الأعمال', icon: Briefcase },
    { id: 'education', name: 'التعليم', icon: GraduationCap },
    { id: 'health', name: 'الصحة', icon: Heart },
    { id: 'other', name: 'أخرى', icon: LayoutGrid },
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities');
      
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }
      
      const data = await response.json();
      
      if (data.communities && Array.isArray(data.communities)) {
        setCommunities(data.communities);
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              المجتمعات
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              انضم إلى مجتمعات مميزة وشارك أفكارك مع الآخرين
            </p>

            <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ابحث عن مجتمع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
              </div>
              <Link
                href="/communities/create"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                إنشاء مجتمع
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {filteredCommunities.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                لا توجد مجتمعات
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery ? 'لم نجد مجتمعات تطابق بحثك' : 'كن أول من ينشئ مجتمعاً!'}
              </p>
              <Link
                href="/communities/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                إنشاء مجتمع جديد
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCommunities.map((community) => (
                <Link
                  key={community.id}
                  href={`/communities/${community.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 overflow-hidden">
                    {community.coverImage ? (
                      <img
                        src={community.coverImage}
                        alt={community.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-20 h-20 text-white/30" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {community.privacy === 'private' ? (
                          <>
                            <Lock className="w-4 h-4 text-white" />
                            <span className="text-sm text-white font-medium">خاص</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-4 h-4 text-white" />
                            <span className="text-sm text-white font-medium">عام</span>
                          </>
                        )}
                      </div>
                    </div>

                    {community.isPopular && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-1 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <TrendingUp className="w-4 h-4 text-white" />
                          <span className="text-sm text-white font-medium">رائج</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {community.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {community.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{community.memberCount?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{community.postCount || 0}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

