'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users, ArrowLeft, UserPlus, UserMinus, Globe, Lock,
  MessageSquare, Send, Loader2, Trophy, Star, Crown,
  Medal, Heart, Share2, MoreVertical, Edit, Trash2,
  Image as ImageIcon, Paperclip
} from 'lucide-react';

interface Community {
  id: number;
  name: string;
  description: string;
  category: string;
  privacy: string;
  coverImage: string | null;
  rules: string | null;
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

interface Post {
  id: number;
  content: string;
  attachments: any;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    level: number;
  };
}

interface Member {
  id: number;
  role: string;
  points: number;
  joinedAt: string;
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    level: number;
  };
}

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchCommunityData();
  }, [communityId]);

  const fetchCommunityData = async () => {
    try {
      const response = await fetch(`/api/communities/${communityId}`);
      const data = await response.json();
      
      if (data.success) {
        setCommunity(data.community);
        setPosts(data.posts || []);
        setMembers(data.members || []);
        setIsMember(data.isMember);
        setMemberRole(data.memberRole);
      }
    } catch (error) {
      console.error('Error fetching community:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsMember(true);
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error joining community:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm('هل أنت متأكد من مغادرة المجتمع؟')) return;
    
    setJoining(true);
    try {
      const response = await fetch(`/api/communities/${communityId}/join`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsMember(false);
        setMemberRole(null);
        fetchCommunityData();
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    } finally {
      setJoining(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;

    setPosting(true);
    try {
      const response = await fetch(`/api/communities/${communityId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newPost }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosts([data.post, ...posts]);
        setNewPost('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">المجتمع غير موجود</p>
          <Link
            href="/communities"
            className="inline-block mt-4 text-teal-600 hover:text-teal-700"
          >
            العودة للمجتمعات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-br from-teal-500 to-purple-600 overflow-hidden">
        {community.coverImage ? (
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Users className="w-24 h-24 text-white/30" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Back Button */}
        <Link
          href="/communities"
          className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{community.name}</h1>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      {community.privacy === 'private' ? (
                        <>
                          <Lock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">خاص</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">عام</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{community.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{community.memberCount.toLocaleString()} عضو</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{community.postCount || 0} منشور</span>
                    </div>
                  </div>
                </div>

                {isMember ? (
                  <button
                    onClick={handleLeave}
                    disabled={joining}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <UserMinus className="w-4 h-4" />
                    مغادرة
                  </button>
                ) : (
                  <button
                    onClick={handleJoin}
                    disabled={joining}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {joining ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    انضم الآن
                  </button>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                  {community.creator.avatar ? (
                    <img
                      src={community.creator.avatar}
                      alt={community.creator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">أنشأ بواسطة</p>
                  <p className="font-medium text-gray-900">@{community.creator.username}</p>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'posts'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                المنشورات
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'members'
                    ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Trophy className="w-4 h-4" />
                لوحة الصدارة
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'posts' ? (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* New Post */}
                  {isMember && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="شارك أفكارك مع المجتمع..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none mb-3"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                            <ImageIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                            <Paperclip className="w-5 h-5" />
                          </button>
                        </div>
                        <button
                          onClick={handlePost}
                          disabled={posting || !newPost.trim()}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {posting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          نشر
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Posts List */}
                  {posts.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد منشورات بعد</p>
                    </div>
                  ) : (
                    posts.map((post) => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            {post.author.avatar ? (
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">{post.author.name}</h3>
                              <span className="text-sm text-gray-500">@{post.author.username}</span>
                              <span className="text-xs text-gray-400">
                                • {new Date(post.createdAt).toLocaleDateString('ar')}
                              </span>
                            </div>
                            <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm">{post.likesCount || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-colors">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm">{post.commentsCount || 0}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-colors mr-auto">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-teal-600" />
                      لوحة صدارة المجتمع
                    </h2>
                  </div>

                  {members.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">لا يوجد أعضاء بعد</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {members.map((member, index) => (
                        <div key={member.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 text-center">
                              {getRankIcon(index) || (
                                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                              )}
                            </div>

                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center">
                              {member.user.avatar ? (
                                <img
                                  src={member.user.avatar}
                                  alt={member.user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <Users className="w-6 h-6 text-white" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{member.user.name}</h3>
                                {member.role === 'admin' && (
                                  <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full">
                                    مشرف
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">@{member.user.username}</p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-bold text-teal-600">{member.points || 0}</p>
                              <p className="text-xs text-gray-500">نقطة</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rules */}
            {community.rules && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h2 className="text-lg font-bold text-gray-900 mb-4">قواعد المجتمع</h2>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{community.rules}</p>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">إحصائيات</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">الأعضاء</span>
                  <span className="font-bold text-gray-900">{community.memberCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">المنشورات</span>
                  <span className="font-bold text-gray-900">{community.postCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">تاريخ الإنشاء</span>
                  <span className="font-bold text-gray-900">
                    {new Date(community.createdAt).toLocaleDateString('ar')}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

