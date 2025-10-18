'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, TrendingUp, Users, Zap, Crown, Medal, Award, Star,
  Flame, Target, Gift, ChevronRight, ArrowUp, ArrowDown,
  Sparkles, BarChart3, Activity, TrendingDown, Rocket, Heart,
  MessageSquare, DollarSign, Calendar, Swords, Crosshair, PartyPopper
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface LeaderboardUser {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  points: number;
  level: number;
  experience: number;
  rank: number;
  subscriptionTier: string;
  projectsCount?: number;
  investmentsCount?: number;
  communitiesCount?: number;
  eventsCount?: number;
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'all' | 'year' | 'month' | 'week'>('all');
  const [activeTab, setActiveTab] = useState<'points' | 'level' | 'projects' | 'investments' | 'communities' | 'events'>('points');
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);

  const tabs = [
    { id: 'points', name: 'النقاط', icon: Star, color: 'yellow' },
    { id: 'level', name: 'المستوى', icon: TrendingUp, color: 'blue' },
    { id: 'projects', name: 'المشاريع', icon: Rocket, color: 'purple' },
    { id: 'investments', name: 'الاستثمارات', icon: DollarSign, color: 'green' },
    { id: 'communities', name: 'المجتمعات', icon: Users, color: 'teal' },
    { id: 'events', name: 'الفعاليات', icon: Calendar, color: 'pink' },
  ];

  const periods = [
    { id: 'all', name: 'كل الأوقات', icon: Sparkles },
    { id: 'year', name: 'هذا العام', icon: Calendar },
    { id: 'month', name: 'هذا الشهر', icon: Activity },
    { id: 'week', name: 'هذا الأسبوع', icon: Flame },
  ];

  useEffect(() => {
    fetchLeaderboard();
    fetchChallenges();
    fetchRewards();
  }, [period, activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?period=${period}&type=${activeTab}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallenges = async () => {
    // Mock challenges - في الإنتاج، استبدل بـ API call
    setChallenges([
      {
        id: 1,
        title: 'تحدي الأسبوع',
        description: 'ادعم 5 مشاريع هذا الأسبوع',
        reward: '500 نقطة',
        progress: 2,
        target: 5,
        icon: 'Target',
        color: 'teal',
      },
      {
        id: 2,
        title: 'تحدي المجتمع',
        description: 'انضم لـ 3 مجتمعات جديدة',
        reward: '300 نقطة',
        progress: 1,
        target: 3,
        icon: 'Users',
        color: 'purple',
      },
      {
        id: 3,
        title: 'تحدي الفعاليات',
        description: 'احضر فعاليتين',
        reward: '400 نقطة',
        progress: 0,
        target: 2,
        icon: 'Trophy',
        color: 'pink',
      },
    ]);
  };

  const fetchRewards = async () => {
    // Mock rewards - في الإنتاج، استبدل بـ API call
    setRewards([
      {
        id: 1,
        title: 'مكافأة الأسبوع',
        description: 'للمركز الأول',
        prize: '1000 نقطة + شارة',
        icon: 'Award',
        deadline: 'ينتهي خلال 3 أيام',
      },
      {
        id: 2,
        title: 'مكافأة الشهر',
        description: 'للمراكز الثلاثة الأولى',
        prize: 'جوائز نقدية',
        icon: 'DollarSign',
        deadline: 'ينتهي خلال 15 يوم',
      },
    ]);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-10 h-10 text-yellow-500 drop-shadow-2xl animate-pulse" />;
    if (rank === 2) return <Medal className="w-10 h-10 text-gray-400 drop-shadow-xl" />;
    if (rank === 3) return <Award className="w-10 h-10 text-amber-600 drop-shadow-xl" />;
    return <span className="text-2xl font-black text-gray-600">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-4 border-yellow-500 shadow-2xl scale-105 relative overflow-hidden';
    if (rank === 2) return 'bg-gradient-to-br from-gray-100 via-slate-100 to-zinc-100 border-4 border-gray-400 shadow-xl scale-102';
    if (rank === 3) return 'bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 border-4 border-amber-500 shadow-xl scale-102';
    return 'bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-lg';
  };

  const getSubscriptionBadge = (tier: string) => {
    if (tier === 'platinum') return <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">بلاتيني</span>;
    if (tier === 'gold') return <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">ذهبي</span>;
    if (tier === 'silver') return <span className="px-3 py-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold rounded-full">فضي</span>;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">جاري تحميل لوحة الصدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-purple-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-4 mb-4">
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              لوحة الصدارة
            </h1>
            <Trophy className="w-16 h-16 text-yellow-500 animate-bounce" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            تنافس مع الأفضل واصعد للقمة
          </p>
        </motion.div>

        {/* Challenges Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br from-${challenge.color}-500 to-${challenge.color}-600 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 text-8xl opacity-10">{challenge.icon}</div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black">{challenge.title}</h3>
                  <Crosshair className="w-6 h-6" />
                </div>
                <p className="text-sm opacity-90 mb-4">{challenge.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">التقدم</span>
                    <span className="text-xs font-bold">{challenge.progress}/{challenge.target}</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold">
                  <Gift className="w-4 h-4" />
                  <span>{challenge.reward}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{reward.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-2">{reward.title}</h3>
                  <p className="text-sm opacity-90 mb-3">{reward.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold">{reward.prize}</span>
                    </div>
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{reward.deadline}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-2xl scale-110`
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-lg'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Period Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {periods.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id as any)}
                className={`px-5 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  period === p.id
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Podium - Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12 px-4">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl font-black">
                    {leaderboard[1].avatar ? (
                      <img src={leaderboard[1].avatar} alt={leaderboard[1].name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      leaderboard[1].name[0]
                    )}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Medal className="w-10 h-10 text-gray-400 drop-shadow-xl" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{leaderboard[1].name}</h3>
              <div className="flex items-center gap-1 text-yellow-600 font-bold mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span>{leaderboard[1].points.toLocaleString()}</span>
              </div>
              <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-t-3xl px-8 py-6 text-center shadow-xl">
                <p className="text-white text-4xl font-black">2</p>
                <p className="text-white text-sm font-medium mt-1">المركز الثاني</p>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-500 p-1 animate-pulse">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl font-black">
                    {leaderboard[0].avatar ? (
                      <img src={leaderboard[0].avatar} alt={leaderboard[0].name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      leaderboard[0].name[0]
                    )}
                  </div>
                </div>
                <div className="absolute -top-4 -right-2">
                  <Crown className="w-14 h-14 text-yellow-500 drop-shadow-2xl animate-bounce" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-1">{leaderboard[0].name}</h3>
              <div className="flex items-center gap-1 text-yellow-600 font-bold mb-2">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg">{leaderboard[0].points.toLocaleString()}</span>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-t-3xl px-10 py-8 text-center shadow-2xl">
                <p className="text-white text-5xl font-black">1</p>
                <p className="text-white text-sm font-medium mt-1">البطل</p>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-black">
                    {leaderboard[2].avatar ? (
                      <img src={leaderboard[2].avatar} alt={leaderboard[2].name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      leaderboard[2].name[0]
                    )}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Award className="w-9 h-9 text-amber-600 drop-shadow-xl" />
                </div>
              </div>
              <h3 className="font-bold text-base text-gray-900 mb-1">{leaderboard[2].name}</h3>
              <div className="flex items-center gap-1 text-yellow-600 font-bold mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span>{leaderboard[2].points.toLocaleString()}</span>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-t-3xl px-6 py-4 text-center shadow-xl">
                <p className="text-white text-3xl font-black">3</p>
                <p className="text-white text-xs font-medium mt-1">المركز الثالث</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="space-y-4">
          {leaderboard.slice(3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${getRankBg(user.rank)} rounded-2xl p-6 transition-all`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-16 text-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-black">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        user.name[0]
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{user.name}</h3>
                    {getSubscriptionBadge(user.subscriptionTier)}
                  </div>
                  <p className="text-sm text-gray-600">@{user.username}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-yellow-600 font-bold mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-lg">{user.points.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">نقطة</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-purple-600 font-bold mb-1">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-lg">{user.level}</span>
                    </div>
                    <p className="text-xs text-gray-500">مستوى</p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg">لا توجد بيانات في لوحة الصدارة</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

