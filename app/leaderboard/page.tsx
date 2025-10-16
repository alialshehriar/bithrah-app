'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, TrendingUp, Users, Zap, Crown, Medal, Award, Star,
  Flame, Target, Gift, ChevronRight, ArrowUp, ArrowDown,
  Sparkles, BarChart3, Activity, TrendingDown
} from 'lucide-react';


export default function LeaderboardPage() {
  const [period, setPeriod] = useState<'all' | 'year' | 'month' | 'week'>('all');
  const [activeTab, setActiveTab] = useState<'points' | 'level' | 'projects' | 'investments'>('points');
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
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



  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500 drop-shadow-lg" />;
    if (rank === 2) return <Medal className="w-8 h-8 text-gray-400 drop-shadow-lg" />;
    if (rank === 3) return <Award className="w-8 h-8 text-amber-600 drop-shadow-lg" />;
    return <span className="text-2xl font-black text-gray-600">#{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-400 shadow-2xl scale-105';
    if (rank === 2) return 'bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 border-2 border-gray-400 shadow-xl scale-102';
    if (rank === 3) return 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-2 border-amber-400 shadow-xl scale-102';
    return 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-[#14B8A6] hover:shadow-lg';
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <TrendingDown className="w-4 h-4 text-gray-400 rotate-90" />;
  };

  const tabs = [
    { id: 'points', label: 'النقاط', icon: Zap, color: 'from-[#F59E0B] to-[#D97706]' },
    { id: 'level', label: 'المستوى', icon: TrendingUp, color: 'from-[#8B5CF6] to-[#7C3AED]' },
    { id: 'projects', label: 'المشاريع', icon: Sparkles, color: 'from-[#14B8A6] to-[#0D9488]' },
    { id: 'investments', label: 'الاستثمارات', icon: Users, color: 'from-[#EC4899] to-[#DB2777]' },
  ];

  const periods = [
    { id: 'all', label: 'كل الأوقات' },
    { id: 'year', label: 'هذا العام' },
    { id: 'month', label: 'هذا الشهر' },
    { id: 'week', label: 'هذا الأسبوع' },
  ];

  const currentData = leaderboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 pb-24">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#14B8A6]/20 to-[#8B5CF6]/20 rounded-full mb-6">
            <Trophy className="w-6 h-6 text-[#14B8A6]" />
            <span className="text-lg font-bold bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] bg-clip-text text-transparent">
              لوحة الصدارة
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
            الأبطال والمتميزون
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            تعرف على أبرز المبدعين والمستثمرين في منصة بذرة
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Period Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-12"
        >
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                period === p.id
                  ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </motion.div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#14B8A6] border-t-transparent"></div>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">لا توجد بيانات متاحة</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <AnimatePresence mode="wait">
              {currentData.map((user: any, index: number) => (
              <motion.div
                key={`${activeTab}-${user.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-3xl p-6 transition-all duration-300 ${getRankBg(index + 1)}`}
              >
                <div className="flex items-center gap-6">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
                      {index < 3 && (
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold">
                          متميز
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span>{user.points?.toLocaleString() || 0} نقطة</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-[#14B8A6]" />
                        <span>المستوى {user.level || 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#8B5CF6]" />
                        <span>{user.experience?.toLocaleString() || 0} خبرة</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {user.subscriptionTier && user.subscriptionTier !== 'free' && (
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.subscriptionTier === 'platinum' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white' :
                        user.subscriptionTier === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                        user.subscriptionTier === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.subscriptionTier === 'platinum' ? 'بلاتيني' :
                         user.subscriptionTier === 'gold' ? 'ذهبي' :
                         user.subscriptionTier === 'silver' ? 'فضي' : ''}
                      </span>
                    </div>
                  )}

                  {/* View Profile */}
                  <Link
                    href={`/profile/${user.id}`}
                    className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white hover:shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

    </div>
  );
}

