'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, Users, Clock, DollarSign,
  Target, TrendingUp, Sparkles, Star, Package, Shield,
  Handshake, FileText, Lock, CheckCircle, AlertCircle,
  Eye, Bookmark, Calendar, MapPin, ExternalLink
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags?: string[];
  image: string | null;
  coverImage?: string | null;
  video?: string | null;
  fundingGoal: string;
  currentFunding: string;
  currency: string;
  backersCount: number;
  deadline: string;
  status: string;
  featured: boolean;
  verified: boolean;
  isSandbox: boolean;
  trending: boolean;
  progress: number;
  daysLeft: number;
  creator: {
    id: number;
    name: string;
    username: string | null;
    avatar: string | null;
    bio?: string | null;
  };
  packages: Array<{
    id: number;
    name: string;
    description: string;
    amount: string;
    features: string[];
    maxBackers: number | null;
    currentBackers: number;
    isActive: boolean;
  }>;
}

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();

      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async (packageId: number) => {
    // Handle support logic
    alert('سيتم إضافة نظام الدعم قريباً');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">المشروع غير موجود</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمشاريع
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pb-24">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Cover Image */}
        <div className="absolute inset-0">
          <img
            src={project.coverImage || project.image || '/images/placeholder-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Header Navigation */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLiked(!liked)}
                className={`p-3 rounded-xl backdrop-blur-md transition-all ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => setBookmarked(!bookmarked)}
                className={`p-3 rounded-xl backdrop-blur-md transition-all ${
                  bookmarked
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Project Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 pb-8">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.isSandbox && (
                <span className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  تجريبي
                </span>
              )}
              {project.featured && (
                <span className="flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <Star className="w-4 h-4" />
                  مميز
                </span>
              )}
              {project.verified && (
                <span className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  موثق
                </span>
              )}
              {project.trending && (
                <span className="flex items-center gap-1 px-4 py-2 bg-rose-500 text-white text-sm font-bold rounded-full shadow-lg">
                  <TrendingUp className="w-4 h-4" />
                  رائج
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              {project.title}
            </h1>

            {/* Creator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {project.creator.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-bold text-lg">{project.creator.name}</p>
                <p className="text-white/80">@{project.creator.username || 'user'}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-sm">المبلغ المجموع</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {parseInt(project.currentFunding).toLocaleString()} {project.currency}
                </p>
                <p className="text-sm text-white/60 mt-1">
                  من {parseInt(project.fundingGoal).toLocaleString()} {project.currency}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">الداعمون</span>
                </div>
                <p className="text-2xl font-bold text-white">{project.backersCount}</p>
                <p className="text-sm text-white/60 mt-1">داعم</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">الأيام المتبقية</span>
                </div>
                <p className="text-2xl font-bold text-white">{project.daysLeft}</p>
                <p className="text-sm text-white/60 mt-1">يوم</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <div className="flex items-center gap-2 text-white/80 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm">التقدم</span>
                </div>
                <p className="text-2xl font-bold text-white">{project.progress}%</p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(project.progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">عن المشروع</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </motion.div>

            {/* Video (if exists) */}
            {project.video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">فيديو المشروع</h2>
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <video
                    src={project.video}
                    controls
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Support Packages */}
            {project.packages && project.packages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl shadow-lg p-6 sticky top-6"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Package className="w-6 h-6 text-teal-600" />
                  باقات الدعم
                </h3>

                <div className="space-y-4">
                  {project.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                        <span className="text-2xl font-bold text-teal-600">
                          {parseInt(pkg.amount).toLocaleString()} {project.currency}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{pkg.description}</p>

                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {pkg.maxBackers && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{pkg.currentBackers}</span> من{' '}
                          <span className="font-medium">{pkg.maxBackers}</span> داعم
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => selectedPackage && handleSupport(selectedPackage)}
                  disabled={!selectedPackage}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ادعم المشروع
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

