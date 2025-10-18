'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, TrendingUp, Users, Sparkles, Gift, Bell,
  Wallet, User, Star, Crown, Trophy, MessageCircle,
  Calendar, Award, Heart, Zap, Target, ArrowLeft,
  Eye, ThumbsUp, DollarSign, Clock, MapPin, Tag,
  TrendingDown, Plus, ExternalLink, CheckCircle,
  BarChart3, Activity, Shield, Package, Flame
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [trendingProjects, setTrendingProjects] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    walletBalance: '0',
    achievements: 0
  });
  const [platformStats, setPlatformStats] = useState({
    activeProjects: 0,
    activeUsers: 0,
    todayFunding: 0,
    newAchievements: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'featured' | 'trending' | 'new'>('featured');

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch platform stats
      const platformStatsRes = await fetch('/api/stats/platform');
      if (platformStatsRes.ok) {
        const data = await platformStatsRes.json();
        if (data.success) {
          setPlatformStats(data.stats);
        }
      }

      // Fetch user stats
      const statsRes = await fetch('/api/user/stats');
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) {
          setUserStats(data.stats);
        }
      }

      // Fetch featured projects
      const projectsRes = await fetch('/api/projects?featured=true&limit=6');
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setFeaturedProjects(data.projects || []);
      }

      // Fetch trending projects
      const trendingRes = await fetch('/api/projects?trending=true&limit=6');
      if (trendingRes.ok) {
        const data = await trendingRes.json();
        setTrendingProjects(data.projects || []);
      }

      // Fetch communities
      const communitiesRes = await fetch('/api/communities?limit=4');
      if (communitiesRes.ok) {
        const data = await communitiesRes.json();
        setCommunities(data.communities || []);
      }

      // Fetch events
      const eventsRes = await fetch('/api/events?upcoming=true&limit=3');
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events || []);
      }

      // Fetch leaderboard
      const leaderboardRes = await fetch('/api/leaderboard?limit=5');
      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json();
        setLeaderboard(data.users || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const quickStats = [
    {
      icon: Rocket,
      label: 'مشاريع نشطة',
      value: formatNumber(platformStats.activeProjects),
      trend: '+12%',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      label: 'مستخدمين نشطين',
      value: formatNumber(platformStats.activeUsers),
      trend: '+23%',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: DollarSign,
      label: 'تمويل اليوم',
      value: formatNumber(platformStats.todayFunding),
      trend: '+18%',
      color: 'from-[#14B8A6] to-[#0F9D8F]'
    },
    {
      icon: Trophy,
      label: 'إنجازات جديدة',
      value: formatNumber(platformStats.newAchievements),
      trend: '+8%',
      color: 'from-[#8B5CF6] to-[#7C3AED]'
    }
  ];

  const displayProjects = activeTab === 'featured' ? featuredProjects : 
                         activeTab === 'trending' ? trendingProjects : 
                         featuredProjects;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-20 pb-12">
        {/* Hero Section with User Stats */}
        <section className="px-4 py-12 bg-gradient-to-r from-[#14B8A6]/10 via-purple-50/50 to-[#8B5CF6]/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Welcome Card */}
              <div className="lg:col-span-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-20" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-black text-gray-900 mb-2">
                        مرحباً بك في بذرة! 👋
                      </h1>
                      <p className="text-gray-600 text-lg">
                        اكتشف أحدث المشاريع والفرص المميزة
                      </p>
                    </div>
                    <Link
                      href="/projects/create"
                      className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      مشروع جديد
                    </Link>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group/stat"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-lg opacity-0 group-hover/stat:opacity-30 transition-opacity`} />
                        <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                          <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`} />
                          <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-600 font-bold mb-1">{stat.label}</div>
                          <div className="text-xs text-green-600 font-bold">{stat.trend}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Profile Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20" />
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-white/50 shadow-2xl h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-[#8B5CF6]" />
                        <span className="text-sm text-gray-600 font-bold">المستوى</span>
                      </div>
                      <div className="text-4xl font-black text-gray-900">{userStats.level}</div>
                    </div>
                    <div className="space-y-3">
                      <Link href="/wallet" className="flex items-center justify-between p-3 bg-white/80 rounded-xl hover:bg-white transition-all">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-[#14B8A6]" />
                          <span className="text-sm font-bold text-gray-700">المحفظة</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{userStats.walletBalance} ر.س</span>
                      </Link>
                      <Link href="/achievements" className="flex items-center justify-between p-3 bg-white/80 rounded-xl hover:bg-white transition-all">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-bold text-gray-700">الإنجازات</span>
                        </div>
                        <span className="text-sm font-black text-gray-900">{userStats.achievements}</span>
                      </Link>
                      <Link href="/profile" className="w-full px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2">
                        <User className="w-4 h-4" />
                        الملف الشخصي
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  المشاريع المميزة
                </h2>
                <p className="text-gray-600">اكتشف أفضل المشاريع على المنصة</p>
              </div>
              <Link
                href="/projects"
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-2xl font-bold text-gray-700 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all flex items-center gap-2"
              >
                عرض الكل
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'featured', label: 'مميزة', icon: Star },
                { id: 'trending', label: 'رائجة', icon: Flame },
                { id: 'new', label: 'جديدة', icon: Sparkles }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.length > 0 ? (
                displayProjects.map((project, index) => (
                  <motion.div
                    key={project.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/20 to-[#8B5CF6]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Link href={`/projects/${project.id}`}>
                      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-full">
                        {/* Project Image */}
                        <div className="relative h-48 bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                          <Rocket className="w-16 h-16 text-[#14B8A6]" />
                          <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#14B8A6]">
                            {project.category || 'تقنية'}
                          </div>
                        </div>

                        {/* Project Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">
                            {project.title || 'مشروع تقني مبتكر'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {project.description || 'وصف المشروع يظهر هنا مع تفاصيل مختصرة عن الفكرة والأهداف'}
                          </p>

                          {/* Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="font-bold text-gray-700">
                                {project.currentFunding || '50,000'} ر.س
                              </span>
                              <span className="text-gray-500">
                                من {project.targetFunding || '100,000'} ر.س
                              </span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full"
                                style={{ width: `${project.progress || 50}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>{project.backers || 125}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>{project.daysLeft || 15} يوم</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-[#14B8A6]">
                              <Heart className="w-4 h-4" />
                              <span className="font-bold">{project.likes || 89}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                // Placeholder projects
                [...Array(6)].map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/20 to-[#8B5CF6]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                      <div className="relative h-48 bg-gradient-to-br from-[#14B8A6]/20 to-[#8B5CF6]/20 flex items-center justify-center">
                        <Rocket className="w-16 h-16 text-[#14B8A6]" />
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[#14B8A6]">
                          تقنية
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-black text-gray-900 mb-2">
                          مشروع تقني مبتكر {index + 1}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          منصة رقمية متطورة تهدف إلى تحسين تجربة المستخدم وتقديم حلول مبتكرة
                        </p>
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-bold text-gray-700">50,000 ر.س</span>
                            <span className="text-gray-500">من 100,000 ر.س</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full w-1/2" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>125</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>15 يوم</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[#14B8A6]">
                            <Heart className="w-4 h-4" />
                            <span className="font-bold">89</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Communities & Events Section */}
        <section className="px-4 py-12 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Communities */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                      المجتمعات النشطة
                    </h2>
                    <p className="text-gray-600">انضم إلى مجتمعات متخصصة</p>
                  </div>
                  <Link
                    href="/communities"
                    className="text-[#14B8A6] font-bold hover:underline flex items-center gap-1"
                  >
                    الكل
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                              مجتمع التقنية والابتكار
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>2.5K عضو</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>450 منشور</span>
                              </div>
                            </div>
                          </div>
                          <Link
                            href="/communities/1"
                            className="px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold text-sm hover:shadow-xl transition-all"
                          >
                            انضم
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Events & Leaderboard */}
              <div className="space-y-8">
                {/* Events */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">
                        الفعاليات القادمة
                      </h2>
                      <p className="text-gray-600">لا تفوت الفرصة</p>
                    </div>
                    <Link
                      href="/events"
                      className="text-[#14B8A6] font-bold hover:underline flex items-center gap-1"
                    >
                      الكل
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center text-white flex-shrink-0">
                              <div className="text-2xl font-black">25</div>
                              <div className="text-xs">أكتوبر</div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-black text-gray-900 mb-2">
                                ورشة عمل: كيف تطلق مشروعك
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>6:00 مساءً</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>أونلاين</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 mb-2">
                        لوحة الصدارة
                      </h2>
                      <p className="text-gray-600">أفضل المساهمين</p>
                    </div>
                    <Link
                      href="/leaderboard"
                      className="text-[#14B8A6] font-bold hover:underline flex items-center gap-1"
                    >
                      الكل
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl blur-lg" />
                    <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                      <div className="space-y-3">
                        {[...Array(5)].map((_, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-white ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                              'bg-gray-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900">مستخدم {index + 1}</div>
                              <div className="text-xs text-gray-600">{1000 - index * 100} نقطة</div>
                            </div>
                            {index < 3 && (
                              <Trophy className={`w-5 h-5 ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' :
                                'text-orange-500'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

