'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, MessageSquare, Heart, Share2, Send, Image as ImageIcon,
  Smile, MoreVertical, ArrowLeft, Sparkles, ThumbsUp, Bookmark, 
  Filter, X, UserPlus, UserMinus, Loader2, TrendingUp, Clock, Star
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import toast, { Toaster } from 'react-hot-toast';

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunityData();
  }, [id, sortBy]);

  const fetchCommunityData = async () => {
    try {
      setIsLoading(true);
      const [communityRes, postsRes, membersRes] = await Promise.all([
        fetch(`/api/community/${id}`),
        fetch(`/api/community/posts?communityId=${id}&sort=${sortBy}&limit=20`),
        fetch(`/api/community/${id}/members?limit=10`),
      ]);

      const communityData = await communityRes.json();
      const postsData = await postsRes.json();
      const membersData = await membersRes.json();

      if (communityData.success) {
        setCommunity(communityData.community);
        setIsMember(communityData.isMember || false);
        setMemberRole(communityData.memberRole);
      }
      if (postsData.success) {
        setPosts(postsData.posts || []);
      }
      if (membersData.success) {
        setMembers(membersData.members || []);
      }
    } catch (error) {
      console.error(error);
      toast.error('فشل في تحميل بيانات المجتمع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/community/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isMember ? 'leave' : 'join' }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsMember(!isMember);
        toast.success(data.message);
        fetchCommunityData();
      } else {
        toast.error(data.error || 'فشلت العملية');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      toast.error('يرجى كتابة محتوى المنشور');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          communityId: id,
          title: newPostTitle.trim() || null,
          content: newPostContent,
          contentType: 'text'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewPostContent('');
        setNewPostTitle('');
        setShowNewPostModal(false);
        toast.success('تم نشر المنشور بنجاح');
        fetchCommunityData();
      } else {
        toast.error(data.error || 'فشل نشر المنشور');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (postId: number, isLiked: boolean) => {
    try {
      const response = await fetch(`/api/community/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId,
          action: isLiked ? 'unlike' : 'like'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update post in state
        setPosts(posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                isLiked: !isLiked,
                likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1
              }
            : post
        ));
      } else {
        toast.error(data.error || 'فشلت العملية');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ');
    }
  };

  const handleComment = async (postId: number) => {
    if (!commentText.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    try {
      const response = await fetch(`/api/community/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId,
          content: commentText,
          parentId: null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCommentText('');
        setSelectedPost(null);
        toast.success('تم إضافة التعليق بنجاح');
        fetchCommunityData();
      } else {
        toast.error(data.error || 'فشل إضافة التعليق');
      }
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl text-slate-600 mb-4">المجتمع غير موجود</p>
            <Link href="/communities" className="text-teal-600 hover:text-teal-700">
              العودة للمجتمعات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <Toaster position="top-center" />
      <Navigation />

      {/* Community Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/communities" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-5 h-5 ml-2" />
            العودة للمجتمعات
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-6">
              {community.image && (
                <img 
                  src={community.image} 
                  alt={community.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20"
                />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
                <p className="text-white/90 text-lg mb-4">{community.description}</p>
                <div className="flex items-center gap-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{community.memberCount || 0} عضو</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>{community.postsCount || 0} منشور</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleJoinCommunity}
                disabled={isSubmitting}
                className={`
                  px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                  ${isMember 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-white text-teal-600 hover:bg-white/90'}
                  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isMember ? (
                  <>
                    <UserMinus className="w-5 h-5" />
                    مغادرة المجتمع
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    انضم للمجتمع
                  </>
                )}
              </button>

              {isMember && (
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="px-8 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  منشور جديد
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sort Filter */}
            <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
              <Filter className="w-5 h-5 text-slate-400" />
              <div className="flex gap-2">
                {[
                  { value: 'recent', label: 'الأحدث', icon: Clock },
                  { value: 'popular', label: 'الأكثر شعبية', icon: Star },
                  { value: 'trending', label: 'الرائج', icon: TrendingUp },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSortBy(value as any)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                      ${sortBy === value 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg">لا توجد منشورات بعد</p>
                {isMember && (
                  <button
                    onClick={() => setShowNewPostModal(true)}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                  >
                    كن أول من ينشر
                  </button>
                )}
              </div>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                          {post.userName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{post.userName || 'مستخدم'}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      <button className="text-slate-400 hover:text-slate-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-6">
                    {post.title && (
                      <h2 className="text-2xl font-bold text-slate-900 mb-3">{post.title}</h2>
                    )}
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="px-6 pb-6 flex items-center gap-6">
                    <button
                      onClick={() => handleLikePost(post.id, post.isLiked)}
                      className={`flex items-center gap-2 transition-all ${
                        post.isLiked ? 'text-red-600' : 'text-slate-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="font-medium">{post.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-2 text-slate-600 hover:text-teal-600 transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">{post.commentsCount || 0}</span>
                    </button>

                    <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all">
                      <Share2 className="w-5 h-5" />
                    </button>

                    <button className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-all mr-auto">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About Community */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">عن المجتمع</h3>
              <p className="text-slate-600 mb-4">{community.description}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">الفئة</span>
                  <span className="font-medium text-slate-900">{community.category || 'عام'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">تاريخ الإنشاء</span>
                  <span className="font-medium text-slate-900">
                    {new Date(community.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">الأعضاء النشطون</h3>
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {member.userName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{member.userName || 'مستخدم'}</p>
                      <p className="text-xs text-slate-500">{member.points || 0} نقطة</p>
                    </div>
                    {member.role === 'admin' && (
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">منشور جديد</h2>
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="عنوان المنشور (اختياري)"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />

                <textarea
                  placeholder="ماذا تريد أن تشارك؟"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />

                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-all"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري النشر...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      نشر
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">التعليقات</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {selectedPost.userName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{selectedPost.userName || 'مستخدم'}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(selectedPost.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  {selectedPost.title && (
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedPost.title}</h3>
                  )}
                  <p className="text-slate-700">{selectedPost.content}</p>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex gap-3">
                    <textarea
                      placeholder="اكتب تعليقك..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => handleComment(selectedPost.id)}
                      disabled={!commentText.trim()}
                      className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      إرسال
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

