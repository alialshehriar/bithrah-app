'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Settings,
  Award, TrendingUp, Users, Target, Heart, MessageSquare,
  Share2, ExternalLink, CheckCircle, Clock, Sparkles,
  Wallet, DollarSign, Trophy, Star, Crown, Shield, Eye,
  Zap, Gift, BarChart3, Briefcase, Package, ArrowUpRight,
  Activity, Bell, Lock, LogOut, Camera, Plus, Check, X
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [backings, setBackings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalBackings: 0,
    totalEarnings: '0',
    totalReferrals: 0,
    level: 1,
    points: 0,
    experience: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'backings' | 'marketing' | 'communities' | 'favorites' | 'referrals'>('projects');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const userRes = await fetch('/api/user/profile');
      const userData = await userRes.json();
      
      if (!userData.success) {
        // User not authenticated, redirect to signin
        window.location.href = '/auth/signin?redirect=/profile';
        return;
      }
      
      if (userData.success) {
        setUser(userData.user);
      }

      const projectsRes = await fetch('/api/user/projects');
      const projectsData = await projectsRes.json();
      if (projectsData.success) {
        setProjects(projectsData.projects || []);
      }

      const backingsRes = await fetch('/api/user/backings');
      const backingsData = await backingsRes.json();
      if (backingsData.success) {
        setBackings(backingsData.backings || []);
      }

      const statsRes = await fetch('/api/user/stats');
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error(error);
      // Redirect to signin on error
      window.location.href = '/auth/signin?redirect=/profile';
    } finally {
      setIsLoading(false);
    }
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

  const subscriptionBadge = getSubscriptionBadge(user?.subscriptionTier || 'free');
  const progressToNextLevel = ((stats.experience % 1000) / 1000) * 100;

  const tabs = [
    { id: 'projects', label: 'مشاريعي', icon: Briefcase, count: stats.totalProjects },
    { id: 'backings', label: 'دعمت', icon: Heart, count: stats.totalBackings },
    { id: 'marketing', label: 'سوّقت', icon: TrendingUp, count: 0 },
    { id: 'communities', label: 'مجتمعاتي', icon: Users, count: 0 },
    { id: 'favorites', label: 'المفضلة', icon: Star, count: 0 },
    { id: 'referrals', label: 'إحالاتي', icon: Gift, count: stats.totalReferrals },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Cover with Gradient Overlay */}
          <div className="relative h-64 rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] animate-gradient-x" />
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
            
            {/* Floating Particles Effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: Math.random() * 100 + '%',
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, '-100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            {/* Edit Cover Button */}
            <button className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100">
              <Camera className="w-5 h-5 inline-block mr-2" />
              تغيير الغلاف
            </button>
          </div>

          {/* Profile Info Card */}
          <div className="relative -mt-20 px-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-6">
                    {/* Premium Avatar */}
                    <div className="relative group/avatar">
                      <div className={`absolute inset-0 bg-gradient-to-br ${subscriptionBadge.color} rounded-2xl blur-xl opacity-50 group-hover/avatar:opacity-75 transition-opacity duration-300`} />
                      
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${subscriptionBadge.color} flex items-center justify-center text-white text-4xl font-black`}>
                            {user?.name?.[0] || 'A'}
                          </div>
                        )}
                        
                        {/* Edit Avatar Overlay */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Subscription Badge */}
                      <div className={`absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r ${subscriptionBadge.color} rounded-xl shadow-lg flex items-center gap-1`}>
                        <subscriptionBadge.icon className="w-4 h-4 text-white" />
                        <span className="text-xs font-bold text-white">{subscriptionBadge.text}</span>
                      </div>
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-gray-900">{user?.name || 'مستخدم'}</h1>
                        {user?.verified && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0F9D8F] flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{user?.bio || 'لا يوجد وصف'}</p>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{user?.city || 'غير محدد'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">انضم {new Date(user?.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowEditModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      تعديل الملف الشخصي
                    </motion.button>
                    
                    <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      مشاركة الملف
                    </button>
                  </div>
                </div>

                {/* Level Progress Bar */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#14B8A6]" />
                      <span className="font-bold text-gray-900">المستوى {stats.level}</span>
                    </div>
                    <span className="text-sm text-gray-600">{stats.experience} / {(stats.level + 1) * 1000} نقطة</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNextLevel}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Briefcase, label: 'مشاريعي', value: stats.totalProjects, color: 'from-blue-500 to-blue-600', bgColor: 'from-blue-50 to-blue-100' },
            { icon: Heart, label: 'دعمت', value: stats.totalBackings, color: 'from-red-500 to-red-600', bgColor: 'from-red-50 to-red-100' },
            { icon: DollarSign, label: 'أرباحي', value: `${stats.totalEarnings} ر.س`, color: 'from-green-500 to-green-600', bgColor: 'from-green-50 to-green-100' },
            { icon: Users, label: 'إحالاتي', value: stats.totalReferrals, color: 'from-purple-500 to-purple-600', bgColor: 'from-purple-50 to-purple-100' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
              
              <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-white/50 shadow-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-gray-600">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs & Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-3xl blur-2xl" />
          
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
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
                        <p className="text-gray-600 font-bold mb-4">لا توجد مشاريع حتى الآن</p>
                        <Link
                          href="/projects/create"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          إنشاء مشروع جديد
                        </Link>
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
                            <p className="text-gray-600 text-sm mb-2">دعمت بمبلغ {backing.amount} ر.س</p>
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
                        <p className="text-gray-600 font-bold">لم تدعم أي مشاريع حتى الآن</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'marketing' && (
                  <motion.div
                    key="marketing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-bold mb-2">لم تسوّق لأي مشاريع حتى الآن</p>
                    <p className="text-gray-500 text-sm">سوّق للمشاريع واحصل على عمولة عن كل دعم!</p>
                  </motion.div>
                )}

                {activeTab === 'communities' && (
                  <motion.div
                    key="communities"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-bold mb-2">لم تنضم إلى أي مجتمعات حتى الآن</p>
                    <p className="text-gray-500 text-sm">انضم إلى المجتمعات وتواصل مع المبدعين!</p>
                  </motion.div>
                )}

                {activeTab === 'favorites' && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-16"
                  >
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 font-bold mb-2">لا توجد مفضلة حتى الآن</p>
                    <p className="text-gray-500 text-sm">أضف مشاريع إلى المفضلة لتتابعها لاحقاً!</p>
                  </motion.div>
                )}

                {activeTab === 'referrals' && (
                  <motion.div
                    key="referrals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Referral Code Card */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                      
                      <div className="relative bg-gradient-to-br from-teal-50 to-purple-50 rounded-2xl p-8 border-2 border-dashed border-[#14B8A6]">
                        <div className="text-center mb-6">
                          <Gift className="w-16 h-16 text-[#14B8A6] mx-auto mb-4" />
                          <h3 className="text-2xl font-black text-gray-900 mb-2">كود الإحالة الخاص بك</h3>
                          <p className="text-gray-600">شارك هذا الكود مع أصدقائك واحصل على سنة إضافية مجاناً!</p>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 mb-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <label className="text-sm text-gray-600 mb-2 block">كود الإحالة</label>
                              <code className="text-3xl font-black text-[#14B8A6] tracking-wider">{user?.referralCode || 'LOADING...'}</code>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(user?.referralCode || '');
                                alert('تم نسخ كود الإحالة!');
                              }}
                              className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                            >
                              <Share2 className="w-5 h-5" />
                              نسخ
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <label className="text-sm text-gray-600 mb-2 block">رابط الإحالة</label>
                              <code className="text-sm text-gray-700 break-all">https://bithrahapp.com?ref={user?.referralCode}</code>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`https://bithrahapp.com?ref=${user?.referralCode}`);
                                alert('تم نسخ رابط الإحالة!');
                              }}
                              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                              <Share2 className="w-5 h-5" />
                              نسخ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Referral Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalReferrals}</div>
                        <div className="text-sm font-bold text-gray-600">إجمالي الإحالات</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{stats.totalReferrals}</div>
                        <div className="text-sm font-bold text-gray-600">سنوات مجانية مكتسبة</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">{0 || '0'} ر.س</div>
                        <div className="text-sm font-bold text-gray-600">أرباح الإحالة</div>
                      </div>
                    </div>
                    
                    {/* How it works */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">
                      <h4 className="text-xl font-black text-gray-900 mb-6">كيف يعمل نظام الإحالة؟</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                          <div>
                            <h5 className="font-bold text-gray-900 mb-1">شارك كودك أو رابطك</h5>
                            <p className="text-gray-600 text-sm">أرسل كود الإحالة أو الرابط لأصدقائك عبر واتساب أو تويتر أو أي وسيلة أخرى</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                          <div>
                            <h5 className="font-bold text-gray-900 mb-1">صديقك يسجل</h5>
                            <p className="text-gray-600 text-sm">عندما يسجل صديقك عبر رابطك، يحصل على اشتراك مستثمر لمدة سنة</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#14B8A6] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                          <div>
                            <h5 className="font-bold text-gray-900 mb-1">أنت تحصل على سنة إضافية!</h5>
                            <p className="text-gray-600 text-sm">عند تسجيل كل شخص عبر رابطك، تحصل على سنة إضافية مجانًا من اشتراك المستثمر!</p>
                          </div>
                        </div>
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
    </div>
  );
}

