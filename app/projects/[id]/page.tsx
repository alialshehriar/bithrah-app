'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, CheckCircle, Users, Target,
  Calendar, DollarSign, TrendingUp, Clock, Gift, Crown,
  Handshake, Lock, Sparkles, Package as PackageIcon
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface SupportTier {
  id: number;
  title: string;
  description: string;
  amount: string;
  rewards: string[];
  maxBackers?: number;
  currentBackers: number;
  deliveryDate?: string;
  shippingIncluded: boolean;
}

interface Project {
  id: number;
  title: string;
  public_description: string;
  category: string;
  funding_goal: string;
  current_funding: string;
  backers_count: number;
  funding_end_date: string;
  image_url?: string;
  platform_package_id?: string;
  creator: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [supportTiers, setSupportTiers] = useState<SupportTier[]>([]);
  const [platformPackage, setPlatformPackage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  useEffect(() => {
    fetchProjectDetails();
    fetchSupportTiers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.project);
        
        // Fetch platform package if exists
        if (data.project.platform_package_id) {
          const pkgResponse = await fetch(`/api/platform-packages?id=${data.project.platform_package_id}`);
          const pkgData = await pkgResponse.json();
          if (pkgData.success && pkgData.packages.length > 0) {
            setPlatformPackage(pkgData.packages[0]);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupportTiers = async () => {
    try {
      const response = await fetch(`/api/support-tiers?projectId=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setSupportTiers(data.tiers.map((tier: any) => ({
          ...tier,
          rewards: JSON.parse(tier.rewards || '[]')
        })));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBackProject = async (tierId: number) => {
    const tier = supportTiers.find(t => t.id === tierId);
    if (!tier) return;

    try {
      const response = await fetch('/api/backings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: id,
          tierId: tier.id,
          amount: tier.amount,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم دعم المشروع بنجاح! 🎉');
        fetchProjectDetails();
        fetchSupportTiers();
      } else {
        alert(data.error || 'فشل الدعم');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ');
    }
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">المشروع غير موجود</h2>
            <Link href="/projects" className="text-teal-600 hover:underline">
              العودة للمشاريع
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fundingPercentage = (parseFloat(project.current_funding) / parseFloat(project.funding_goal)) * 100;
  const daysLeft = Math.ceil((new Date(project.funding_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة للمشاريع</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {project.image_url && (
                <div className="aspect-video bg-gradient-to-br from-teal-500 to-purple-600 relative">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-gray-600">{project.public_description}</p>
                  </div>
                  
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`p-3 rounded-full transition-all ${
                      liked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {project.creator.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">صاحب المشروع</p>
                    <p className="font-bold text-gray-900">{project.creator.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Tiers */}
            {supportTiers.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="w-8 h-8 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">باقات الدعم</h2>
                </div>

                <div className="space-y-4">
                  {supportTiers.map((tier) => {
                    const isAvailable = !tier.maxBackers || tier.currentBackers < tier.maxBackers;
                    const isFull = tier.maxBackers && tier.currentBackers >= tier.maxBackers;

                    return (
                      <motion.div
                        key={tier.id}
                        whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          selectedTier === tier.id
                            ? 'border-purple-500 bg-purple-50'
                            : isFull
                            ? 'border-gray-200 bg-gray-50 opacity-60'
                            : 'border-gray-200 hover:border-purple-300 cursor-pointer'
                        }`}
                        onClick={() => isAvailable && setSelectedTier(tier.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{tier.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{tier.description}</p>
                            
                            {/* Rewards */}
                            <div className="space-y-2 mb-4">
                              {tier.rewards.map((reward, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{reward}</span>
                                </div>
                              ))}
                            </div>

                            {/* Delivery Date */}
                            {tier.deliveryDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>التسليم المتوقع: {new Date(tier.deliveryDate).toLocaleDateString('ar-SA')}</span>
                              </div>
                            )}
                          </div>

                          <div className="text-left mr-4">
                            <div className="text-3xl font-bold text-purple-600 mb-1">
                              {parseFloat(tier.amount).toLocaleString()} ر.س
                            </div>
                            
                            {tier.maxBackers && (
                              <div className="text-sm text-gray-600">
                                {tier.currentBackers} / {tier.maxBackers} داعم
                              </div>
                            )}

                            {isFull && (
                              <div className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg font-medium">
                                مكتملة
                              </div>
                            )}
                          </div>
                        </div>

                        {selectedTier === tier.id && isAvailable && (
                          <button
                            onClick={() => handleBackProject(tier.id)}
                            className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                          >
                            ادعم المشروع بـ {parseFloat(tier.amount).toLocaleString()} ر.س
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Stats */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {parseFloat(project.current_funding).toLocaleString()} ر.س
                  </span>
                  <span className="text-sm text-gray-600">
                    من {parseFloat(project.funding_goal).toLocaleString()} ر.س
                  </span>
                </div>
                
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-purple-600 transition-all"
                    style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                  />
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  {fundingPercentage.toFixed(1)}% مكتمل
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Users className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{project.backers_count}</div>
                  <div className="text-sm text-gray-600">داعم</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{daysLeft}</div>
                  <div className="text-sm text-gray-600">يوم متبقي</div>
                </div>
              </div>

              {supportTiers.length === 0 && (
                <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                  ادعم المشروع
                </button>
              )}
            </div>

            {/* Platform Package */}
            {platformPackage && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  {platformPackage.icon === 'crown' ? (
                    <Crown className="w-8 h-8 text-purple-600" />
                  ) : (
                    <PackageIcon className="w-8 h-8 text-purple-600" />
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900">{platformPackage.name}</h3>
                    <p className="text-sm text-gray-600">{platformPackage.badge}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>عمولة المنصة:</span>
                    <span className="font-bold text-purple-600">{platformPackage.commission_percentage}%</span>
                  </div>
                  {platformPackage.equity_percentage && (
                    <div className="flex items-center justify-between">
                      <span>شراكة استراتيجية:</span>
                      <span className="font-bold text-purple-600">{platformPackage.equity_percentage}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Category */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">التصنيف</h3>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-100 to-purple-100 text-purple-700 rounded-xl font-medium">
                {project.category}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

