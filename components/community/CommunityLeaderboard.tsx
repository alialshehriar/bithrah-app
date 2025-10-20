'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Star } from 'lucide-react';

interface LeaderboardMember {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  posts: number;
  comments: number;
  rank: number;
}

interface CommunityLeaderboardProps {
  communityId: number;
  members?: LeaderboardMember[];
}

export default function CommunityLeaderboard({ communityId, members = [] }: CommunityLeaderboardProps) {
  // بيانات تجريبية إذا لم تكن هناك بيانات
  const defaultMembers: LeaderboardMember[] = [
    { id: 1, name: 'أحمد محمد', points: 1250, posts: 45, comments: 180, rank: 1 },
    { id: 2, name: 'سارة علي', points: 980, posts: 38, comments: 142, rank: 2 },
    { id: 3, name: 'خالد عبدالله', points: 850, posts: 32, comments: 128, rank: 3 },
    { id: 4, name: 'فاطمة حسن', points: 720, posts: 28, comments: 95, rank: 4 },
    { id: 5, name: 'عمر يوسف', points: 650, posts: 24, comments: 88, rank: 5 }
  ];

  const leaderboardData = members.length > 0 ? members : defaultMembers;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 2:
        return 'from-gray-400/20 to-slate-400/20 border-gray-400/30';
      case 3:
        return 'from-amber-600/20 to-orange-600/20 border-amber-600/30';
      default:
        return 'from-gray-100 to-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">لوحة الصدارة</h3>
          <p className="text-sm text-gray-500">الأعضاء الأكثر نشاطاً</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        {leaderboardData.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative overflow-hidden rounded-xl border p-4
              bg-gradient-to-r ${getRankColor(member.rank)}
              hover:shadow-md transition-all duration-300
            `}
          >
            <div className="flex items-center gap-4">
              {/* Rank Icon */}
              <div className="flex-shrink-0">
                {getRankIcon(member.rank)}
              </div>

              {/* Member Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {member.name}
                  </h4>
                  {member.rank <= 3 && (
                    <span className="px-2 py-0.5 bg-white/50 rounded-full text-xs font-medium">
                      #{member.rank}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{member.posts} منشور</span>
                  <span>{member.comments} تعليق</span>
                </div>
              </div>

              {/* Points */}
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {member.points.toLocaleString('ar-SA')}
                </div>
                <div className="text-xs text-gray-500">نقطة</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-1.5 bg-gray-200/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(member.points / leaderboardData[0].points) * 100}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          النقاط تُحسب بناءً على المنشورات والتعليقات والتفاعلات
        </p>
      </div>
    </div>
  );
}

