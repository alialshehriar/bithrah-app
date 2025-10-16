'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Heart, Eye, Share2, Send, Image as ImageIcon,
  Smile, MoreVertical, Pin, Flag, Award, Star, Crown, Trophy,
  TrendingUp, Clock, CheckCircle, Plus, ArrowLeft, Sparkles,
  ThumbsUp, Bookmark, Filter, Search, X, Paperclip, AtSign, Shield
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');

  useEffect(() => {
    fetchCommunityData();
  }, [id]);

  const fetchCommunityData = async () => {
    try {
      const [communityRes, postsRes, membersRes] = await Promise.all([
        fetch(`/api/communities/${id}`),
        fetch(`/api/communities/${id}/posts`),
        fetch(`/api/communities/${id}/members`),
      ]);

      const communityData = await communityRes.json();
      const postsData = await postsRes.json();
      const membersData = await membersRes.json();

      if (communityData.success) {
        setCommunity(communityData.community);
        setIsMember(communityData.isMember || false);
      }
      if (postsData.success) {
        setPosts(postsData.posts || []);
      }
      if (membersData.success) {
        setMembers(membersData.members || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${id}/join`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsMember(true);
        fetchCommunityData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch(`/api/communities/${id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPostContent }),
      });

      if (response.ok) {
        setNewPostContent('');
        setShowNewPostModal(false);
        fetchCommunityData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await fetch(`/api/communities/posts/${postId}/like`, {
        method: 'POST',
      });
      fetchCommunityData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentText.trim()) return;

    try {
      await fetch(`/api/communities/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText }),
      });
      setCommentText('');
      setSelectedPost(null);
      fetchCommunityData();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-bold mb-4">المجتمع غير موجود</p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمجتمعات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Community Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          <div className="relative h-48 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] animate-gradient-x" />
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
          </div>

          <div className="relative -mt-20 px-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center shadow-lg">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                    
                    <div>
                      <h1 className="text-3xl font-black text-gray-900 mb-2">{community.name}</h1>
                      <p className="text-gray-600 mb-3">{community.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">{community.members} عضو</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-bold">{community.posts} منشور</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span className="font-bold">{community.views} مشاهدة</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {isMember ? (
                      <>
                        <button
                          onClick={() => setShowNewPostModal(true)}
                          className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          منشور جديد
                        </button>
                        <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          عضو
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleJoinCommunity}
                        className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        انضم للمجتمع
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sort Options */}
            <div className="flex items-center gap-3">
              {[
                { id: 'recent', label: 'الأحدث', icon: Clock },
                { id: 'popular', label: 'الأكثر شعبية', icon: TrendingUp },
                { id: 'trending', label: 'الرائج', icon: Sparkles },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                    sortBy === option.id
                      ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#14B8A6]'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:border-[#14B8A6] transition-all">
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white font-black">
                            {post.author?.name?.[0] || 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{post.author?.name}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {new Date(post.createdAt).toLocaleDateString('ar-SA', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                        
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                      </div>

                      {/* Post Image */}
                      {post.image && (
                        <div className="mb-4 rounded-2xl overflow-hidden">
                          <img src={post.image} alt="" className="w-full" />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                              post.isLiked
                                ? 'bg-red-50 text-red-600'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 text-gray-600 transition-all"
                          >
                            <MessageSquare className="w-5 h-5" />
                            <span>{post.comments?.length || 0}</span>
                          </button>
                          
                          <button className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 text-gray-600 transition-all">
                            <Share2 className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                          <Bookmark className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {selectedPost?.id === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-gray-200"
                        >
                          <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                            {post.comments?.map((comment: any) => (
                              <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-black flex-shrink-0">
                                  {comment.author?.name?.[0] || 'A'}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                                  <div className="font-bold text-sm text-gray-900 mb-1">{comment.author?.name}</div>
                                  <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="اكتب تعليقاً..."
                              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#14B8A6] focus:outline-none font-bold"
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-bold mb-4">لا توجد منشورات حتى الآن</p>
                  {isMember && (
                    <button
                      onClick={() => setShowNewPostModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      كن أول من ينشر
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-20" />
              
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">أعضاء مميزون</h3>
                    <p className="text-sm text-gray-600">الأكثر نشاطاً</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {members.slice(0, 5).map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-[#14B8A6] transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white font-black">
                        {member.name?.[0] || 'A'}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">{member.name}</div>
                        <div className="text-xs text-gray-600">{member.posts} منشور</div>
                      </div>

                      {index < 3 && (
                        <Crown className={`w-5 h-5 ${
                          index === 0 ? 'text-[#F59E0B]' :
                          index === 1 ? 'text-gray-400' :
                          'text-[#CD7F32]'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Community Rules */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl blur-2xl opacity-20" />
              
              <div className="relative bg-white rounded-3xl p-6 shadow-2xl border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900">قواعد المجتمع</h3>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                    <span>احترم جميع الأعضاء</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                    <span>لا تنشر محتوى مسيء</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                    <span>شارك محتوى ذو قيمة</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                    <span>لا تنشر إعلانات غير مصرح بها</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewPostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900">منشور جديد</h3>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="شارك أفكارك مع المجتمع..."
                className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#14B8A6] focus:outline-none resize-none font-bold"
              />

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2">
                  <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    newPostContent.trim()
                      ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  نشر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}

