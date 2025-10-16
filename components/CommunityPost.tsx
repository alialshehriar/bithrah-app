'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, MoreVertical, Pin, Trash2,
  ThumbsUp, Smile, Frown, Send
} from 'lucide-react';
import Link from 'next/link';

interface Author {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  level: number;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
  replies?: Comment[];
}

interface Post {
  id: number;
  content: string;
  attachments: any;
  reactions: {
    like: number;
    love: number;
    laugh: number;
    wow: number;
    sad: number;
    angry: number;
  };
  commentsCount: number;
  isPinned: boolean;
  createdAt: string;
  author: Author;
  comments?: Comment[];
}

interface CommunityPostProps {
  post: Post;
  onReact: (postId: number, reaction: string) => void;
  onComment: (postId: number, content: string, parentId?: number) => void;
  onDelete?: (postId: number) => void;
  onPin?: (postId: number) => void;
  canModerate?: boolean;
}

const reactions = [
  { type: 'like', icon: ThumbsUp, label: 'أعجبني', color: 'text-blue-500' },
  { type: 'love', icon: Heart, label: 'أحببته', color: 'text-red-500' },
  { type: 'laugh', icon: Smile, label: 'مضحك', color: 'text-yellow-500' },
  { type: 'wow', icon: Smile, label: 'رائع', color: 'text-purple-500' },
  { type: 'sad', icon: Frown, label: 'محزن', color: 'text-gray-500' },
  { type: 'angry', icon: Frown, label: 'غاضب', color: 'text-orange-500' },
];

export default function CommunityPost({
  post,
  onReact,
  onComment,
  onDelete,
  onPin,
  canModerate = false,
}: CommunityPostProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);
  const topReaction = Object.entries(post.reactions).sort((a, b) => b[1] - a[1])[0];

  const handleComment = () => {
    if (!newComment.trim()) return;
    onComment(post.id, newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now.getTime() - postDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return postDate.toLocaleDateString('ar-SA');
  };

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? 'mr-12' : ''}`}>
      <div className="flex gap-3 mb-3">
        <Link href={`/profile/${comment.author.id}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {comment.author.name[0]}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl p-3">
            <Link href={`/profile/${comment.author.id}`}>
              <p className="font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                {comment.author.name}
              </p>
            </Link>
            <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>{formatDate(comment.createdAt)}</span>
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="hover:text-teal-600 transition-colors font-medium"
            >
              رد
            </button>
          </div>

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Pinned Badge */}
      {post.isPinned && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 flex items-center gap-2">
          <Pin className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-medium">منشور مثبت</span>
        </div>
      )}

      <div className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-3 flex-1">
            <Link href={`/profile/${post.author.id}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {post.author.name[0]}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex-1">
              <Link href={`/profile/${post.author.id}`}>
                <h3 className="font-bold text-gray-900 hover:text-teal-600 transition-colors">
                  {post.author.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">
                @{post.author.username} • المستوى {post.author.level}
              </p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* More Menu */}
          {canModerate && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10"
                  >
                    {onPin && (
                      <button
                        onClick={() => {
                          onPin(post.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-right hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      >
                        <Pin className="w-4 h-4" />
                        {post.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
                            onDelete(post.id);
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-right hover:bg-red-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Reactions Summary */}
        {totalReactions > 0 && (
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-3">
            <div className="flex -space-x-1">
              {Object.entries(post.reactions)
                .filter(([_, count]) => count > 0)
                .slice(0, 3)
                .map(([type, _]) => {
                  const reaction = reactions.find((r) => r.type === type);
                  if (!reaction) return null;
                  const Icon = reaction.icon;
                  return (
                    <div
                      key={type}
                      className={`w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center ${reaction.color}`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  );
                })}
            </div>
            <span className="text-sm text-gray-600">{totalReactions.toLocaleString()}</span>
            {post.commentsCount > 0 && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-sm text-gray-600">
                  {post.commentsCount} تعليق
                </span>
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Reactions Button */}
          <div className="relative flex-1">
            <button
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
              onClick={() => onReact(post.id, 'like')}
              className="w-full py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-teal-600"
            >
              <ThumbsUp className="w-5 h-5" />
              <span className="text-sm font-medium">إعجاب</span>
            </button>

            {/* Reactions Popup */}
            <AnimatePresence>
              {showReactions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onMouseEnter={() => setShowReactions(true)}
                  onMouseLeave={() => setShowReactions(false)}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-full shadow-2xl border border-gray-200 px-3 py-2 flex gap-2 z-10"
                >
                  {reactions.map((reaction) => {
                    const Icon = reaction.icon;
                    return (
                      <button
                        key={reaction.type}
                        onClick={() => {
                          onReact(post.id, reaction.type);
                          setShowReactions(false);
                        }}
                        className={`p-2 hover:scale-125 transition-transform ${reaction.color}`}
                        title={reaction.label}
                      >
                        <Icon className="w-6 h-6" />
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex-1 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-teal-600"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">تعليق</span>
          </button>

          {/* Share Button */}
          <button className="flex-1 py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-teal-600">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">مشاركة</span>
          </button>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              {/* Comment Input */}
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">أ</span>
                </div>
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    placeholder={replyingTo ? 'اكتب ردك...' : 'اكتب تعليقك...'}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="p-2 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {replyingTo && (
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                  <span>الرد على تعليق</span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-red-500 hover:text-red-600"
                  >
                    إلغاء
                  </button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-4">
                    لا توجد تعليقات بعد. كن أول من يعلق!
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

