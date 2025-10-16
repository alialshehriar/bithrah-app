'use client';

import { motion } from 'framer-motion';
import { Trophy, Award, Star, Crown, Medal, Target, Zap, Heart, Users, TrendingUp, Sparkles, Lock } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string | null;
  progress?: number;
  maxProgress?: number;
}

interface ProfileAchievementsProps {
  achievements: Achievement[];
}

const iconMap: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  star: Star,
  crown: Crown,
  medal: Medal,
  target: Target,
  zap: Zap,
  heart: Heart,
  users: Users,
  trending: TrendingUp,
  sparkles: Sparkles,
};

const rarityConfig = {
  common: {
    bg: 'from-gray-400 to-gray-600',
    glow: 'shadow-gray-500/50',
    border: 'border-gray-400',
    text: 'عادي',
  },
  rare: {
    bg: 'from-blue-400 to-blue-600',
    glow: 'shadow-blue-500/50',
    border: 'border-blue-400',
    text: 'نادر',
  },
  epic: {
    bg: 'from-purple-400 to-purple-600',
    glow: 'shadow-purple-500/50',
    border: 'border-purple-400',
    text: 'أسطوري',
  },
  legendary: {
    bg: 'from-yellow-400 to-orange-500',
    glow: 'shadow-yellow-500/50',
    border: 'border-yellow-400',
    text: 'خرافي',
  },
};

export default function ProfileAchievements({ achievements }: ProfileAchievementsProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">لم يتم فتح أي إنجازات بعد</p>
        <p className="text-gray-400 text-sm mt-2">ابدأ رحلتك لفتح الإنجازات المذهلة</p>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-4 text-white">
          <Trophy className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
          <p className="text-sm opacity-90">إنجاز مفتوح</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <Lock className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">{lockedAchievements.length}</p>
          <p className="text-sm opacity-90">إنجاز مقفل</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <Star className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </p>
          <p className="text-sm opacity-90">نسبة الإنجاز</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <Crown className="w-8 h-8 mb-2" />
          <p className="text-2xl font-bold">
            {unlockedAchievements.filter(a => a.rarity === 'legendary').length}
          </p>
          <p className="text-sm opacity-90">خرافي</p>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-teal-600" />
            الإنجازات المفتوحة
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Trophy;
              const config = rarityConfig[achievement.rarity];
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 ${config.border} ${config.glow} group`}
                >
                  {/* Rarity Badge */}
                  <div className={`absolute top-3 left-3 px-2 py-1 bg-gradient-to-r ${config.bg} text-white text-xs font-bold rounded-full`}>
                    {config.text}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${config.bg} rounded-full flex items-center justify-center shadow-lg ${config.glow} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h4 className="text-center font-bold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-center text-sm text-gray-600 mb-3">{achievement.description}</p>

                  {/* Date */}
                  <p className="text-center text-xs text-gray-400">
                    فُتح في {new Date(achievement.unlockedAt!).toLocaleDateString('ar-SA')}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-gray-400" />
            الإنجازات المقفلة
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement, index) => {
              const Icon = iconMap[achievement.icon] || Trophy;
              const config = rarityConfig[achievement.rarity];
              const progress = achievement.progress || 0;
              const maxProgress = achievement.maxProgress || 100;
              const progressPercent = (progress / maxProgress) * 100;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative bg-gray-50 rounded-xl p-6 border-2 border-gray-200 opacity-60 hover:opacity-80 transition-all"
                >
                  {/* Rarity Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded-full">
                    {config.text}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center relative">
                    <Icon className="w-8 h-8 text-gray-500" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="text-center font-bold text-gray-700 mb-2">{achievement.title}</h4>
                  <p className="text-center text-sm text-gray-500 mb-3">{achievement.description}</p>

                  {/* Progress */}
                  {achievement.maxProgress && (
                    <div>
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>التقدم</span>
                        <span>{progress} / {maxProgress}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

