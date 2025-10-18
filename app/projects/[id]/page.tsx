'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, Flag, CheckCircle, Users, Target,
  Calendar, DollarSign, TrendingUp, Shield, Clock, Eye, Star,
  Package, ExternalLink, Info, BarChart3, MapPin, Mail,
  Bookmark, AlertCircle, Lock, Handshake, FileText, Download
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NDAModal from '@/components/NDAModal';
import NegotiationModal from '@/components/NegotiationModal';

interface Project {
  id: number;
  title: string;
  publicDescription: string;
  registeredDescription?: string;
  fullDescription?: string;
  category: string;
  fundingGoal: string;
  currentFunding: string;
  backersCount: number;
  fundingEndDate: string;
  image: string;
  creator: {
    id: number;
    name: string;
    avatar: string;
  };
  packages?: any[];
  confidentialDocs?: any[];
  negotiationEnabled?: boolean;
  negotiationDeposit?: string;
}

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessLevel, setAccessLevel] = useState<'public' | 'registered' | 'negotiator'>('public');
  const [needsNDA, setNeedsNDA] = useState(false);
  const [canNegotiate, setCanNegotiate] = useState(false);
  const [showNDAModal, setShowNDAModal] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      // Check if user is logged in
      const tokenResponse = await fetch('/api/user/profile');
      const tokenData = await tokenResponse.json();
      
      if (!tokenData.success) {
        // User not logged in, redirect to signin
        window.location.href = `/auth/signin?redirect=/projects/${id}`;
        return;
      }

      const response = await fetch(`/api/projects/${id}/view`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.project);
        setAccessLevel(data.accessLevel);
        setNeedsNDA(data.needsNDA);
        setCanNegotiate(data.canNegotiate);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNDASign = () => {
    // Refresh project data after signing NDA
    fetchProjectDetails();
  };

  const handleNegotiationSuccess = () => {
    // Refresh project data after opening negotiation
    fetchProjectDetails();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">المشروع غير موجود</h2>
            <Link href="/projects" className="text-teal-600 hover:underline">
              العودة إلى المشاريع
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = (Number(project.currentFunding) / Number(project.fundingGoal)) * 100;
  const daysLeft = Math.ceil((new Date(project.fundingEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة إلى المشاريع</span>
        </Link>

        {/* Access Level Banner */}
        <div className="mb-6">
          {accessLevel === 'public' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 mb-1">
                  وصول محدود - عرض عام فقط
                </p>
                <p className="text-sm text-amber-800">
                  للوصول إلى التفاصيل الكاملة، يجب عليك التسجيل وتوقيع اتفاقية عدم الإفشاء
                </p>
              </div>
            </div>
          )}
          
          {accessLevel === 'registered' && (
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-teal-900 mb-1">
                  وصول مسجل - تفاصيل كاملة
                </p>
                <p className="text-sm text-teal-800">
                  يمكنك الآن رؤية جميع التفاصيل والباقات. لرؤية المعلومات السرية، افتح بوابة التفاوض
                </p>
              </div>
            </div>
          )}
          
          {accessLevel === 'negotiator' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <Handshake className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-purple-900 mb-1">
                  وصول كامل - مفاوض
                </p>
                <p className="text-sm text-purple-800">
                  لديك وصول كامل لجميع التفاصيل السرية والمستندات الكاملة
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Image */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="relative h-96">
                <Image
                  src={project.image || '/placeholder-project.jpg'}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm font-medium mb-3">
                    {project.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      bookmarked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {project.creator.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{project.creator.name}</p>
                  <p className="text-sm text-gray-600">صاحب المشروع</p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">نبذة عن المشروع</h2>
                
                {/* Public Description (Level 1) */}
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p>{project.publicDescription}</p>
                </div>

                {/* Registered Description (Level 2) */}
                {accessLevel === 'registered' && project.registeredDescription && (
                  <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-teal-600" />
                      <span className="font-semibold text-teal-900">تفاصيل إضافية (للمسجلين)</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p>{project.registeredDescription}</p>
                    </div>
                  </div>
                )}

                {/* Full Description (Level 3) */}
                {accessLevel === 'negotiator' && project.fullDescription && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Handshake className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">الوصف الكامل (للمفاوضين)</span>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p>{project.fullDescription}</p>
                    </div>
                  </div>
                )}

                {/* Locked Content Indicator */}
                {accessLevel === 'public' && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 text-center">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-semibold text-gray-900 mb-2">محتوى محمي</p>
                    <p className="text-sm text-gray-600 mb-4">
                      للوصول إلى التفاصيل الكاملة، يجب التسجيل وتوقيع اتفاقية عدم الإفشاء
                    </p>
                    <button
                      onClick={() => setShowNDAModal(true)}
                      className="px-6 py-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      توقيع اتفاقية عدم الإفشاء
                    </button>
                  </div>
                )}
              </div>

              {/* Confidential Documents (Level 3 only) */}
              {accessLevel === 'negotiator' && project.confidentialDocs && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">المستندات السرية</h2>
                  <div className="space-y-3">
                    {project.confidentialDocs.map((doc: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-semibold text-gray-900">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.size}</p>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>تحميل</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages (Level 2+) */}
              {(accessLevel === 'registered' || accessLevel === 'negotiator') && project.packages && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">الباقات المتاحة</h2>
                  <div className="space-y-4">
                    {project.packages.map((pkg: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl border border-teal-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                          </div>
                          <span className="text-2xl font-bold text-teal-600">
                            {pkg.price} <span className="text-sm">ريال</span>
                          </span>
                        </div>
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                          دعم المشروع
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {Number(project.currentFunding).toLocaleString('ar-SA')}
                  </span>
                  <span className="text-sm text-gray-600">ريال</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  من {Number(project.fundingGoal).toLocaleString('ar-SA')} ريال
                </p>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-teal-600 to-purple-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{project.backersCount}</p>
                    <p className="text-sm text-gray-600">داعم</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{daysLeft}</p>
                    <p className="text-sm text-gray-600">يوم متبقي</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {needsNDA && (
                  <button
                    onClick={() => setShowNDAModal(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    <span>توقيع اتفاقية عدم الإفشاء</span>
                  </button>
                )}

                {canNegotiate && project.negotiationEnabled && (
                  <button
                    onClick={() => setShowNegotiationModal(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Handshake className="w-5 h-5" />
                    <span>فتح بوابة التفاوض</span>
                  </button>
                )}

                {(accessLevel === 'registered' || accessLevel === 'negotiator') && (
                  <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors">
                    دعم المشروع
                  </button>
                )}
              </div>

              {/* Negotiation Info */}
              {project.negotiationEnabled && project.negotiationDeposit && (
                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Handshake className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">التفاوض متاح</span>
                  </div>
                  <p className="text-sm text-purple-800">
                    مبلغ الجدية: {Number(project.negotiationDeposit).toLocaleString('ar-SA')} ريال
                  </p>
                </div>
              )}
            </div>

            {/* Platform Info */}
            <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-2xl shadow-sm p-6 border border-teal-200">
              <h3 className="font-bold text-gray-900 mb-4">حماية الملكية الفكرية</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p>جميع الأفكار محمية باتفاقية عدم إفشاء</p>
                </div>
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p>3 مستويات وصول لحماية التفاصيل السرية</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p>منصة وساطة ذكية معتمدة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      <NDAModal
        isOpen={showNDAModal}
        onClose={() => setShowNDAModal(false)}
        onSign={handleNDASign}
      />

      {project.negotiationEnabled && project.negotiationDeposit && (
        <NegotiationModal
          isOpen={showNegotiationModal}
          onClose={() => setShowNegotiationModal(false)}
          onSuccess={handleNegotiationSuccess}
          projectId={project.id}
          projectTitle={project.title}
          depositAmount={Number(project.negotiationDeposit)}
        />
      )}
    </div>
  );
}

