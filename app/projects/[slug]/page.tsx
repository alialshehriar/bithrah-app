'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Users, Calendar, Target, TrendingUp, Share2, Bookmark,
  Heart, MessageCircle, Award, Shield, Clock, DollarSign, CheckCircle,
  Star, MapPin, Briefcase, Globe, Mail, Phone, Sparkles
} from 'lucide-react';
import ShareButton from '@/components/ShareButton';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  backersCount: number;
  deadline: string;
  status: string;
  image: string | null;
  coverImage: string | null;
  creator: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface SupportPackage {
  id: number;
  title: string;
  description: string;
  amount: number;
  backersCount: number;
  maxBackers: number | null;
  estimatedDelivery: string | null;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [packages, setPackages] = useState<SupportPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [startingNegotiation, setStartingNegotiation] = useState(false);
  
  // حساب مبلغ التأمين (1% من هدف التمويل، بحد أدنى 1000 ريال)
  const depositAmount = project ? Math.max(Math.round(project.fundingGoal * 0.01), 1000) : 5000;

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.project);
        // Fetch support packages
        fetchPackages(data.project.id);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async (projectId: number) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/packages`);
      const data = await response.json();
      if (data.success) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-teal-600" />
          </div>
          <p className="text-xl font-bold text-gray-900 mb-2">جاري التحميل</p>
          <p className="text-gray-500">نحضر لك تفاصيل المشروع...</p>
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">المشروع غير موجود</h2>
          <p className="text-gray-600 mb-8">عذراً، لم نتمكن من العثور على هذا المشروع</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمشاريع
          </Link>
        </motion.div>
      </div>
    );
  }

  const progress = (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = project.deadline ? Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 via-teal-500 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">العودة للمشاريع</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">مشروع مميز</span>
              </div>
              
              <h1 className="text-5xl font-bold mb-6 leading-tight">{project.title}</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">{project.description}</p>

              {/* Creator Info */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                {project.creator.avatar ? (
                  <img
                    src={project.creator.avatar}
                    alt={project.creator.name}
                    className="w-16 h-16 rounded-full border-4 border-white/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                    <span className="text-2xl font-bold">{project.creator.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-white/70">صاحب المشروع</p>
                  <p className="text-lg font-bold">{project.creator.name}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              {project.coverImage || project.image ? (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={project.coverImage || project.image || ''}
                    alt={project.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
                  <Award className="w-32 h-32 text-white/30" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200"
              >
                <DollarSign className="w-8 h-8 text-teal-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">المبلغ المجموع</p>
                <p className="text-2xl font-bold text-gray-900">{project.currentFunding.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">ر.س</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200"
              >
                <Target className="w-8 h-8 text-blue-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">الهدف</p>
                <p className="text-2xl font-bold text-gray-900">{project.fundingGoal.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">ر.س</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200"
              >
                <Users className="w-8 h-8 text-purple-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">الداعمون</p>
                <p className="text-2xl font-bold text-gray-900">{project.backersCount}</p>
                <p className="text-xs text-gray-500 mt-1">داعم</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
              >
                <Clock className="w-8 h-8 text-orange-600 mb-3" />
                <p className="text-sm text-gray-600 mb-1">المتبقي</p>
                <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
                <p className="text-xs text-gray-500 mt-1">يوم</p>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">نسبة الإنجاز</h3>
                <span className="text-3xl font-bold text-teal-600">{progress.toFixed(1)}%</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 via-teal-600 to-blue-600 rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              <p className="text-sm text-gray-500 mt-3 text-center">
                تم جمع {project.currentFunding.toLocaleString()} ر.س من {project.fundingGoal.toLocaleString()} ر.س
              </p>
            </motion.div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['overview', 'packages', 'updates'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab === 'overview' && 'نظرة عامة'}
                    {tab === 'packages' && 'باقات الدعم'}
                    {tab === 'updates' && 'التحديثات'}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">عن المشروع</h3>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  </div>
                )}

                {activeTab === 'packages' && (
                  <div className="space-y-4">
                    {packages.length > 0 ? (
                      packages.map((pkg, index) => (
                        <motion.div
                          key={pkg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h4>
                              <p className="text-gray-600">{pkg.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-bold text-teal-600">{pkg.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">ر.س</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{pkg.backersCount} داعم</span>
                              {pkg.maxBackers && <span className="text-gray-400">/ {pkg.maxBackers}</span>}
                            </div>
                            <button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-xl transition-all">
                              دعم الآن
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">لا توجد باقات دعم متاحة حالياً</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'updates' && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد تحديثات بعد</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">اتخذ إجراء</h3>
                            <Link
                href={`/projects/${project.slug || project.id}/negotiate`}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 mb-4"
              >
                <Shield className="w-5 h-5" />
                بدء التفاوض
              </Link>        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all mb-4 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                دعم المشروع
              </button>

              <div className="grid grid-cols-3 gap-3">
                <ShareButton
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={project?.title || ''}
                  description={project?.description || ''}
                  variant="secondary"
                  size="md"
                  shape="icon"
                />
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                  <Bookmark className="w-5 h-5 text-gray-600 mx-auto" />
                </button>
                <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all">
                  <Star className="w-5 h-5 text-gray-600 mx-auto" />
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>مشروع موثق</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>محمي بضمان بذرة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

