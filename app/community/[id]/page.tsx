'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users, MessageSquare, TrendingUp, Award, Calendar,
  Share2, Bell, Settings, Plus, Heart, MessageCircle,
  Send, Image as ImageIcon, Smile, MoreVertical
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  creatorId: number;
  creatorName: string;
  creatorUsername: string;
  memberCount: number;
  postCount: number;
  createdAt: string;
  posts: Array<{
    id: number;
    content: string;
    userId: number;
    authorName: string;
    authorUsername: string;
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  }>;
  members: Array<{
    id: number;
    name: string;
    username: string;
    points: number;
  }>;
}

export default function CommunityPage() {
  const params = useParams();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'leaderboard'>('posts');
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    fetchCommunity();
  }, [params.id]);

  const fetchCommunity = async () => {
    try {
      const { getCommunityById } = await import('@/app/actions/communities');
      const data = await getCommunityById(Number(params.id));
      if ('error' in data) {
        console.error(data.error);
      } else {
        setCommunity(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    try {
      const { createCommunityPost } = await import('@/app/actions/communities');
      const result = await createCommunityPost(Number(params.id), newPost, 44); // Using test user ID
      
      if ('success' in result) {
        setNewPost('');
        fetchCommunity();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">المجتمع غير موجود</h1>
          <button
            onClick={() => router.push('/communities')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            العودة للمجتمعات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Users className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
                  <p className="text-white/90">
                    أنشأه {community.creatorName} • {new Date(community.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
              <p className="text-xl text-white/90 mb-6 max-w-2xl">
                {community.description}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{community.memberCount} عضو</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-semibold">{community.postCount} منشور</span>
                </div>
                <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <span className="font-semibold">{community.category}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-white text-teal-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Bell className="w-5 h-5" />
                متابعة
              </button>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                مشاركة
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              المنشورات
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'leaderboard'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              لوحة الصدارة
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'posts' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">إنشاء منشور جديد</h3>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="شارك أفكارك مع المجتمع..."
                  className="w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={4}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.trim()}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    نشر
                  </button>
                </div>
              </div>

              {/* Posts */}
              {community.posts && community.posts.length > 0 ? (
                community.posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {post.authorName?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.authorName}</h4>
                          <p className="text-sm text-gray-500">
                            @{post.authorUsername} • {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                    <div className="flex items-center gap-6 pt-4 border-t">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="font-semibold">{post.likesCount || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-semibold">{post.commentsCount || 0}</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منشورات بعد</h3>
                  <p className="text-gray-600">كن أول من ينشر في هذا المجتمع!</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Members */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  أفضل الأعضاء
                </h3>
                <div className="space-y-4">
                  {community.members && community.members.slice(0, 5).map((member, index) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{member.name}</h4>
                        <p className="text-xs text-gray-500">@{member.username}</p>
                      </div>
                      <div className="text-sm font-semibold text-teal-600">
                        {member.points} نقطة
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">إحصائيات المجتمع</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">إجمالي الأعضاء</span>
                    <span className="font-semibold text-gray-900">{community.memberCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">إجمالي المنشورات</span>
                    <span className="font-semibold text-gray-900">{community.postCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">تاريخ الإنشاء</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(community.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Leaderboard */
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">لوحة الصدارة</h2>
            <div className="space-y-4">
              {community.members && community.members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-500">@{member.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-600">{member.points}</div>
                    <div className="text-sm text-gray-500">نقطة</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

