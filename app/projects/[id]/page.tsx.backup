'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, Flag, CheckCircle, Users, Target,
  Calendar, DollarSign, TrendingUp, MessageSquare, Shield, Award,
  Sparkles, Clock, Eye, Star, Check, Package, Zap, Crown, Gift,
  ExternalLink, Info, BarChart3, MapPin, Globe, Mail, Phone,
  Bookmark, Play, Image as ImageIcon, FileText, Link as LinkIcon,
  AlertCircle, ThumbsUp, MessageCircle, Send, User
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  backers: number;
  daysLeft: number;
  image: string;
  images: string[];
  video: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    projects: number;
    followers: number;
  };
  location: string;
  website: string;
  featured: boolean;
  trending: boolean;
  views: number;
  likes: number;
  updates: any[];
  faqs: any[];
  risks: string[];
  timeline: any[];
}

interface PackageType {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  delivery: string;
  available: number;
  sold: number;
}

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'updates' | 'comments' | 'faqs'>('details');
  const [selectedImage, setSelectedImage] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (data.success) {
        setProject(data.project);
        setPackages(data.packages || []);
        if (data.packages && data.packages.length > 0) {
          setSelectedPackage(data.packages[0]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    // TODO: API call
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: API call
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.title,
        text: project?.description,
        url: window.location.href,
      });
    }
  };

  const handleSupport = () => {
    if (selectedPackage) {
      window.location.href = `/payment?projectId=${id}&packageId=${selectedPackage.id}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-xl font-bold text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">المشروع غير موجود</h2>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للمشاريع</span>
          </Link>
        </div>
      </div>
    );
  }

  const fundingPercentage = project.goalAmount > 0
    ? Math.min((project.currentAmount / project.goalAmount) * 100, 100)
    : 0;

  const tabs = [
    { id: 'details', label: 'التفاصيل', icon: FileText },
    { id: 'updates', label: 'التحديثات', icon: Sparkles },
    { id: 'comments', label: 'التعليقات', icon: MessageCircle },
    { id: 'faqs', label: 'الأسئلة الشائعة', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#14B8A6] mb-8 transition-colors font-bold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للمشاريع</span>
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image & Gallery */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <div className="relative h-96">
                  <Image
                    src={project.images?.[selectedImage] || project.image || '/placeholder-project.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2">
                    {project.featured && (
                      <span className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg">
                        <Star className="w-4 h-4" />
                        مميز
                      </span>
                    )}
                    {project.trending && (
                      <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full flex items-center gap-2 shadow-lg">
                        <TrendingUp className="w-4 h-4" />
                        رائج
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-6 left-6 flex gap-2">
                    <button
                      onClick={handleLike}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                        liked
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleBookmark}
                      className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                        bookmarked
                          ? 'bg-[#14B8A6] text-white'
                          : 'bg-white/90 text-gray-700 hover:bg-white'
                      }`}
                    >
                      <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-all"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Stats Overlay */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                      <Eye className="w-4 h-4" />
                      <span>{project.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
                      <Heart className="w-4 h-4" />
                      <span>{project.likes || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Image Gallery */}
                {project.images && project.images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {project.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all ${
                          selectedImage === index
                            ? 'ring-4 ring-[#14B8A6] scale-105'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-[#14B8A6]/10 text-[#14B8A6] text-sm font-bold rounded-full">
                    {project.category}
                  </span>
                  {project.location && (
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                  {project.title}
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Creator Info */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">صاحب المشروع</h3>
                
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {project.creator?.name?.[0] || 'A'}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {project.creator?.name || 'مجهول'}
                    </h4>
                    <p className="text-gray-600 mb-4">
                      {project.creator?.bio || 'لا يوجد وصف'}
                    </p>
                    
                    <div className="flex items-center gap-6 mb-6">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {project.creator?.projects || 0}
                        </div>
                        <div className="text-sm text-gray-600">مشروع</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {project.creator?.followers || 0}
                        </div>
                        <div className="text-sm text-gray-600">متابع</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/profile/${project.creator?.id}`}
                        className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-lg transition-all"
                      >
                        عرض الملف الشخصي
                      </Link>
                      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                        إرسال رسالة
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-200 overflow-x-auto">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-8 py-4 font-bold whitespace-nowrap transition-all ${
                          activeTab === tab.id
                            ? 'text-[#14B8A6] border-b-4 border-[#14B8A6]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-8">
                  {activeTab === 'details' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">وصف المشروع</h3>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                          <p>{project.description}</p>
                        </div>
                      </div>

                      {project.timeline && project.timeline.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6">الجدول الزمني</h3>
                          <div className="space-y-4">
                            {project.timeline.map((item: any, index: number) => (
                              <div key={index} className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-6 h-6 text-[#14B8A6]" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                  <p className="text-gray-600">{item.description}</p>
                                  <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.risks && project.risks.length > 0 && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">المخاطر والتحديات</h3>
                          <div className="space-y-3">
                            {project.risks.map((risk: string, index: number) => (
                              <div key={index} className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-gray-700">{risk}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'updates' && (
                    <div className="space-y-6">
                      {project.updates && project.updates.length > 0 ? (
                        project.updates.map((update: any, index: number) => (
                          <div key={index} className="p-6 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3 mb-3">
                              <Sparkles className="w-5 h-5 text-[#14B8A6]" />
                              <span className="text-sm text-gray-600">{update.date}</span>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{update.title}</h4>
                            <p className="text-gray-700">{update.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">لا توجد تحديثات حتى الآن</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'comments' && (
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white font-bold flex-shrink-0">
                          A
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="اكتب تعليقك..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#14B8A6]/20 focus:border-[#14B8A6] transition-all resize-none"
                            rows={3}
                          />
                          <button className="mt-3 px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            <span>إرسال</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-center py-12">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">لا توجد تعليقات حتى الآن</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'faqs' && (
                    <div className="space-y-4">
                      {project.faqs && project.faqs.length > 0 ? (
                        project.faqs.map((faq: any, index: number) => (
                          <div key={index} className="p-6 bg-gray-50 rounded-2xl">
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h4>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-600">لا توجد أسئلة شائعة حتى الآن</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Card - Sticky */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 sticky top-24">
                <div className="mb-6">
                  <div className="text-4xl font-black text-gray-900 mb-2">
                    {(project.currentAmount / 1000).toFixed(0)}K ر.س
                  </div>
                  <div className="text-gray-600">
                    من {(project.goalAmount / 1000).toFixed(0)}K ر.س
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-[#14B8A6]">
                      {fundingPercentage.toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-600">
                      {project.daysLeft} يوم متبقي
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full transition-all"
                      style={{ width: `${fundingPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{project.backers}</div>
                    <div className="text-sm text-gray-600">داعم</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{project.daysLeft}</div>
                    <div className="text-sm text-gray-600">يوم متبقي</div>
                  </div>
                </div>

                {/* Packages */}
                {packages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">اختر باقة الدعم</h4>
                    <div className="space-y-3">
                      {packages.map((pkg) => (
                        <button
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`w-full p-4 rounded-2xl border-2 transition-all text-right ${
                            selectedPackage?.id === pkg.id
                              ? 'border-[#14B8A6] bg-[#14B8A6]/5'
                              : 'border-gray-200 hover:border-[#14B8A6]/50'
                          }`}
                        >
                          <div className="font-bold text-gray-900 mb-1">{pkg.title}</div>
                          <div className="text-2xl font-black text-[#14B8A6] mb-2">
                            {pkg.price.toLocaleString()} ر.س
                          </div>
                          <div className="text-sm text-gray-600">
                            متبقي: {pkg.available - pkg.sold}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <button
                  onClick={handleSupport}
                  className="w-full py-4 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                   <Zap className="w-5 h-5" />
                  <span>ادعم المشروع</span>
                </button>

                {/* Premium Negotiation Button */}
                <div className="mt-4 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#14B8A6] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                  <Link
                    href={`/negotiations/start?projectId=${project.id}`}
                    className="relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-[#8B5CF6] text-[#8B5CF6] rounded-2xl font-bold hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:to-[#14B8A6] hover:text-white hover:border-transparent transition-all shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>فتح باب التفاوض</span>
                    <Sparkles className="w-4 h-4" />
                  </Link>
                </div>
                
                {/* Negotiation Info Badge */}
                <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border border-purple-200/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#14B8A6] flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-sm mb-1">تفاوض آمن ومراقب</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        3 أيام للتفاوض المباشر مع حماية كاملة للملكية الفكرية
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4">
                  معاملات آمنة 100% • حماية كاملة للمستثمرين
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

