'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Settings,
  Award, TrendingUp, Users, Target, Heart, MessageSquare,
  Share2, ExternalLink, CheckCircle, Clock, Sparkles,
  Wallet, DollarSign, Trophy, Star, Crown, Shield, Eye,
  Zap, Gift, BarChart3, Briefcase, Package, ArrowUpRight,
  Activity, Bell, Lock, LogOut, Camera, Plus, Check, X,
  Instagram, Twitter, Linkedin, Globe, Github, Send,
  UserPlus, UserCheck, Flag, MoreVertical
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [backings, setBackings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBackers: 0,
    totalBackings: 0,
    totalFunding: '0',
    successRate: 0,
    level: 1,
    points: 0,
    experience: 0,
    followers: 0,
    following: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'backings' | 'about'>('projects');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      const userRes = await fetch(`/api/users/${id}`);
      const userData = await userRes.json();
      if (userData.success) {
        setUser(userData.user);
        setStats(userData.stats || stats);
      }

      const projectsRes = await fetch(`/api/users/${id}/projects`);
      const projectsData = await projectsRes.json();
      if (projectsData.success) {
        setProjects(projectsData.projects || []);
      }

      const backingsRes = await fetch(`/api/users/${id}/backings`);
      const backingsData = await backingsRes.json();
      if (backingsData.success) {
        setBackings(backingsData.backings || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${id}/follow`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsFollowing(!isFollowing);
        setStats(prev => ({
          ...prev,
          followers: isFollowing ? prev.followers - 1 : prev.followers + 1
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const getSubscriptionBadge = (tier: string) => {
    const badges = {
      free: { icon: Shield, color: 'from-gray-400 to-gray-600', text: 'مجاني', glow: 'gray' },
      silver: { icon: Star, color: 'from-gray-300 to-gray-500', text: 'فضي', glow: 'gray' },
      gold: { icon: Trophy, color: 'from-yellow-400 to-yellow-600', text: 'ذهبي', glow: 'yellow' },
      platinum: { icon: Crown, color: 'from-purple-400 to-purple-600', text: 'بلاتيني', glow: 'purple' }
    };
    return badges[tier as keyof typeof badges] || badges.free;
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-bold mb-4">المستخدم غير موجود</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const subscriptionBadge = getSubscriptionBadge(user?.subscriptionTier || 'free');
  const progressToNextLevel = ((stats.experience % 1000) / 1000) * 100;

  const tabs = [
    { id: 'projects', label: 'المشاريع', icon: Briefcase, count: stats.totalProjects },
    { id: 'backings', label: 'الدعم', icon: Heart, count: stats.totalBackings },
    { id: 'about', label: 'عن المستخدم', icon: User, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ultra-Premium Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Cover with Advanced Gradient */}
          <div className="relative h-80 rounded-3xl overflow-hidden group">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] animate-gradient-x" />
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
              
              {/* Animated Mesh Gradient */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#14B8A6] rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#8B5CF6] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#14B8A6] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-6 right-6 flex gap-3">
              <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{stats.followers} متابع</span>
              </div>
              <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>المستوى {stats.level}</span>
              </div>
            </div>
          </div>

          {/* Profile Card - LinkedIn Style */}
          <div className="relative -mt-32 px-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
                {/* Main Profile Section */}
                <div className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-end gap-8">
                    {/* Avatar Section */}
                    <div className="relative -mt-24">
                      <div className="relative group/avatar">
                        <div className={`absolute inset-0 bg-gradient-to-br ${subscriptionBadge.color} rounded-3xl blur-2xl opacity-50 group-hover/avatar:opacity-75 transition-opacity duration-300`} />
                        
                        <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${subscriptionBadge.color} flex items-center justify-center text-white text-5xl font-black`}>
                              {user?.name?.[0] || 'A'}
                            </div>
                          )}
                        </div>

                        {/* Subscription Badge */}
                        <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r ${subscriptionBadge.color} rounded-xl shadow-lg flex items-center gap-2`}>
                          <subscriptionBadge.icon className="w-5 h-5 text-white" />
                          <span className="text-sm font-bold text-white">{subscriptionBadge.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-900">{user?.name || 'مستخدم'}</h1>
                            {user?.verified && (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0F9D8F] flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <p className="text-xl text-gray-600 mb-4">{user?.bio || 'لا يوجد وصف'}</p>
                          
                          {/* Location & Join Date */}
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            {user?.city && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{user.city}, {user.country || 'السعودية'}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>انضم {new Date(user?.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' })}</span>
                            </div>
                          </div>

                          {/* Social Links */}
                          {user?.socialLinks && (
                            <div className="flex items-center gap-3 mb-4">
                              {user.socialLinks.website && (
                                <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                                  <Globe className="w-5 h-5 text-gray-600" />
                                </a>
                              )}
                              {user.socialLinks.twitter && (
                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                                  <Twitter className="w-5 h-5 text-gray-600" />
                                </a>
                              )}
                              {user.socialLinks.linkedin && (
                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
                                  <Linkedin className="w-5 h-5 text-gray-600" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Follower Stats */}
                          <div className="flex items-center gap-6 text-sm">
                            <div>
                              <span className="text-2xl font-black text-gray-900">{stats.followers}</span>
                              <span className="text-gray-600 mr-2">متابع</span>
                            </div>
                            <div>
                              <span className="text-2xl font-black text-gray-900">{stats.following}</span>
                              <span className="text-gray-600 mr-2">يتابع</span>
                            </div>
                            <div>
                              <span className="text-2xl font-black text-gray-900">{stats.totalProjects}</span>
                              <span className="text-gray-600 mr-2">مشروع</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleFollow}
                            className={`px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2 ${
                              isFollowing
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                : 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white'
                            }`}
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-5 h-5" />
                                يتابع
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-5 h-5" />
                                متابعة
                              </>
                            )}
                          </motion.button>
                          
                          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            إرسال رسالة
                          </button>

                          <div className="flex gap-2">
                            <button 
                              onClick={handleShare}
                              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                            >
                              <Share2 className="w-5 h-5 mx-auto" />
                            </button>
                            <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#14B8A6]" />
                        <span className="font-bold text-gray-900">المستوى {stats.level}</span>
                        <span className="text-sm text-gray-600">• {stats.points} نقطة</span>
                      </div>
                      <span className="text-sm text-gray-600">{stats.experience} / {(stats.level + 1) * 1000} XP</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200">
                  {[
                    { label: 'المشاريع', value: stats.totalProjects, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
                    { label: 'الداعمين', value: stats.totalBackers, icon: Users, color: 'from-green-500 to-green-600' },
                    { label: 'التمويل', value: `${stats.totalFunding} ر.س`, icon: DollarSign, color: 'from-[#14B8A6] to-[#0F9D8F]' },
                    { label: 'معدل النجاح', value: `${stats.successRate}%`, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
                  ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 text-center">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-3`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm font-bold text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs & Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Premium Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-8 py-4 font-bold whitespace-nowrap transition-all relative ${
                    activeTab === tab.id
                      ? 'text-[#14B8A6]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-[#14B8A6] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                            className="group relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                            
                            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#14B8A6] transition-all shadow-lg hover:shadow-2xl">
                              <div className="relative h-48">
                                <img 
                                  src={project.image || '/images/placeholder.jpg'} 
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 px-3 py-1 bg-[#14B8A6] text-white rounded-full text-xs font-bold">
                                  {project.status}
                                </div>
                              </div>
                              
                              <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{project.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                                
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-2xl font-black text-[#14B8A6]">
                                      {((project.currentAmount / project.goalAmount) * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-xs text-gray-600">من الهدف</div>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm font-bold">{project.backers}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-bold">لا توجد مشاريع حتى الآن</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'backings' && (
                  <motion.div
                    key="backings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {backings.length > 0 ? (
                      backings.map((backing) => (
                        <div
                          key={backing.id}
                          className="flex items-center gap-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-[#14B8A6] transition-all"
                        >
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                            <Heart className="w-10 h-10 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{backing.projectTitle}</h4>
                            <p className="text-gray-600 text-sm mb-2">دعم بمبلغ {backing.amount} ر.س</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{new Date(backing.createdAt).toLocaleDateString('ar-SA')}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                                {backing.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-bold">لم يدعم أي مشاريع حتى الآن</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="prose max-w-none">
                      <h3 className="text-2xl font-black text-gray-900 mb-4">عن {user.name}</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {user.bio || 'لا يوجد وصف متاح'}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="text-xl font-black text-gray-900 mb-4">الإنجازات</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { icon: Trophy, label: 'مشروع ناجح', color: 'from-yellow-400 to-yellow-600' },
                          { icon: Star, label: 'داعم مميز', color: 'from-purple-400 to-purple-600' },
                          { icon: Crown, label: 'عضو بلاتيني', color: 'from-purple-500 to-purple-700' },
                          { icon: Award, label: 'رائد أعمال', color: 'from-blue-400 to-blue-600' },
                        ].map((achievement, index) => (
                          <div key={index} className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r ${achievement.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                            <div className="relative bg-white rounded-2xl p-4 border border-gray-200 text-center">
                              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${achievement.color} mb-2`}>
                                <achievement.icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-sm font-bold text-gray-900">{achievement.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-gray-900">مشاركة الملف الشخصي</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Twitter, label: 'تويتر', color: 'bg-blue-400' },
                  { icon: Linkedin, label: 'لينكدإن', color: 'bg-blue-600' },
                  { icon: Share2, label: 'نسخ الرابط', color: 'bg-gray-600' },
                  { icon: Send, label: 'إرسال', color: 'bg-[#14B8A6]' },
                ].map((item, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  </button>
                ))}
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
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

