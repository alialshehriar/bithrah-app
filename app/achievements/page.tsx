'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Award, Target, TrendingUp, Lock, Unlock,
  CheckCircle, Circle, Zap, Crown, Gift, Sparkles, Medal,
  Flame, Heart, Users, MessageSquare, Rocket, DollarSign,
  BarChart3, Calendar, Filter, Search, Grid3x3, List
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement: number;
  points: number;
  unlocked: boolean;
  unlockedAt: Date | null;
  progress: number;
  progressPercentage: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: string;
  requirement: number;
  unlocked: boolean;
  unlockedAt: Date | null;
}

interface Stats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalBadges: number;
  unlockedBadges: number;
  totalPoints: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAchievements: 0,
    unlockedAchievements: 0,
    totalBadges: 0,
    unlockedBadges: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'الكل', icon: Grid3x3 },
    { id: 'projects', name: 'المشاريع', icon: Rocket },
    { id: 'support', name: 'الدعم', icon: Heart },
    { id: 'community', name: 'المجتمع', icon: Users },
    { id: 'engagement', name: 'التفاعل', icon: MessageSquare },
    { id: 'negotiation', name: 'التفاوض', icon: DollarSign },
    { id: 'level', name: 'المستوى', icon: TrendingUp },
    { id: 'referral', name: 'الإحالات', icon: Users },
    { id: 'special', name: 'خاص', icon: Sparkles },
  ];

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/achievements');
      const data = await response.json();

      if (data.success) {
        setAchievements(data.achievements);
        setBadges(data.badges);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    const matchesSearch = achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Trophy;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">
              الإنجازات والشارات
            </h1>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg">
            اجمع الإنجازات واكسب الشارات لتصبح الأفضل في بذرة
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Trophy className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">الإنجازات</p>
            <p className="text-3xl font-black">
              {stats.unlockedAchievements}/{stats.totalAchievements}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Award className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">الشارات</p>
            <p className="text-3xl font-black">
              {stats.unlockedBadges}/{stats.totalBadges}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Star className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">النقاط</p>
            <p className="text-3xl font-black">{stats.totalPoints.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Target className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">نسبة الإكمال</p>
            <p className="text-3xl font-black">
              {stats.totalAchievements > 0 
                ? Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)
                : 0}%
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl p-6 text-white shadow-2xl"
          >
            <Flame className="w-10 h-10 mb-3" />
            <p className="text-sm opacity-90 mb-1">الحماس</p>
            <p className="text-3xl font-black">
              {stats.unlockedAchievements > 10 ? 'Fire' : stats.unlockedAchievements > 5 ? 'Star' : 'Zap'}
            </p>
          </motion.div>
        </div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-black text-gray-900">شاراتي</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-4 rounded-2xl text-center transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 border-2 border-gray-300 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-bold text-sm text-gray-900">{badge.name}</p>
                {badge.unlocked && (
                  <CheckCircle className="absolute top-2 left-2 w-5 h-5 text-green-600" />
                )}
                {!badge.unlocked && (
                  <Lock className="absolute top-2 left-2 w-5 h-5 text-gray-400" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن إنجاز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
              />
            </div>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredAchievements.map((achievement, index) => {
            const Icon = getCategoryIcon(achievement.category);
            
            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden ${
                  achievement.unlocked ? 'border-2 border-teal-400' : 'border-2 border-gray-200'
                }`}
              >
                <div className={`p-6 ${achievement.unlocked ? 'bg-gradient-to-r from-teal-50 to-purple-50' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                    {achievement.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">التقدم</span>
                      <span className="text-xs font-bold text-gray-900">
                        {achievement.progress}/{achievement.requirement}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progressPercentage}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className={`h-full rounded-full ${
                          achievement.unlocked
                            ? 'bg-gradient-to-r from-teal-600 to-purple-600'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600 capitalize">{achievement.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600 font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{achievement.points}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">لا توجد إنجازات تطابق البحث</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

