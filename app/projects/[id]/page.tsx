'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Heart, Share2, Bookmark, Calendar, Users, Target, TrendingUp,
  Clock, MapPin, Award, CheckCircle, MessageCircle, Send, 
  Package, DollarSign, Zap, Shield, Star, ArrowRight, User,
  FileText, Image as ImageIcon, Video, Download, ExternalLink
} from 'lucide-react';

interface ProjectPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  features: string[];
  maxBackers: number;
  currentBackers: number;
  isPopular?: boolean;
}

interface Project {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  coverImage: string;
  gallery: string[];
  video?: string;
  fundingGoal: number;
  currentFunding: number;
  backersCount: number;
  deadline: string;
  creator: {
    id: number;
    name: string;
    avatar: string;
    level: number;
    projectsCount: number;
  };
  packages: ProjectPackage[];
  updates: any[];
  faq: any[];
  teamMembers: any[];
  status: string;
  location: {
    city: string;
    country: string;
  };
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'updates' | 'comments' | 'faq'>('description');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [showBackingModal, setShowBackingModal] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackProject = async (packageId: string) => {
    setSelectedPackage(packageId);
    setShowBackingModal(true);
  };

  const confirmBacking = async () => {
    if (!selectedPackage) return;
    
    try {
      const response = await fetch(`/api/projects/${projectId}/back`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: selectedPackage }),
      });

      if (response.ok) {
        alert('تم دعم المشروع بنجاح!');
        setShowBackingModal(false);
        fetchProject();
      }
    } catch (error) {
      console.error('Error backing project:', error);
    }
  };

  const handleNegotiate = () => {
    router.push(`/projects/${projectId}/negotiate`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">المشروع غير موجود</h2>
          <button
            onClick={() => router.push('/projects')}
            className="btn-primary"
          >
            العودة للمشاريع
          </button>
        </div>
      </MainLayout>
    );
  }

  const fundingProgress = (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="relative h-96 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <img
            src={project.coverImage || project.image || '/placeholder-project.jpg'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-3 rounded-xl backdrop-blur-md transition-all ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-xl backdrop-blur-md transition-all ${
                isBookmarked 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-xl bg-white/90 hover:bg-white text-gray-700 backdrop-blur-md transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Category */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="badge-teal mb-3">{project.category}</div>
            <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
            <p className="text-white/90 text-lg">{project.shortDescription}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Funding Stats */}
            <div className="card-luxury">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold gradient-text">
                    {project.currentFunding.toLocaleString()} ريال
                  </div>
                  <div className="text-gray-600">
                    من {project.fundingGoal.toLocaleString()} ريال
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{project.backersCount}</div>
                  <div className="text-gray-600">داعم</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{daysLeft}</div>
                  <div className="text-gray-600">يوم متبقي</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="progress-bar mb-4">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                ></div>
              </div>

              <div className="text-sm text-gray-600 text-center">
                تم تحقيق {fundingProgress.toFixed(1)}% من الهدف
              </div>
            </div>

            {/* Creator Info */}
            <div className="card-luxury">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={project.creator.avatar || '/default-avatar.png'}
                    alt={project.creator.name}
                    className="w-16 h-16 rounded-full border-4 border-teal-100"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{project.creator.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-teal-500" />
                      <span>المستوى {project.creator.level}</span>
                      <span>•</span>
                      <span>{project.creator.projectsCount} مشاريع</span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary">
                  <MessageCircle className="w-5 h-5 ml-2" />
                  تواصل
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="card-luxury">
              <div className="flex gap-4 border-b border-gray-200 mb-6">
                {[
                  { key: 'description', label: 'الوصف', icon: FileText },
                  { key: 'updates', label: 'التحديثات', icon: TrendingUp },
                  { key: 'comments', label: 'التعليقات', icon: MessageCircle },
                  { key: 'faq', label: 'الأسئلة الشائعة', icon: CheckCircle },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 ${
                      activeTab === tab.key
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-600 hover:text-teal-600'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </div>

                  {/* Gallery */}
                  {project.gallery && project.gallery.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">معرض الصور</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {project.gallery.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`صورة ${idx + 1}`}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Team */}
                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">الفريق</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {project.teamMembers.map((member: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                            <User className="w-10 h-10 text-gray-400" />
                            <div>
                              <div className="font-bold text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-600">{member.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="اكتب تعليقك..."
                      className="input-luxury flex-1 min-h-[100px] resize-none"
                    />
                  </div>
                  <button className="btn-primary">
                    <Send className="w-5 h-5 ml-2" />
                    إرسال التعليق
                  </button>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {project.faq && project.faq.length > 0 ? (
                    project.faq.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-bold text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">لا توجد أسئلة شائعة بعد</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Packages */}
          <div className="space-y-6">
            <div className="card-luxury sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">باقات الدعم</h2>
              
              <div className="space-y-4">
                {project.packages && project.packages.length > 0 ? (
                  project.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`relative p-6 border-2 rounded-2xl transition-all cursor-pointer ${
                        pkg.isPopular
                          ? 'border-teal-500 bg-teal-50/50 shadow-glow'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                      onClick={() => handleBackProject(pkg.id)}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 right-4">
                          <div className="badge-teal">
                            <Star className="w-3 h-3 ml-1 fill-current" />
                            الأكثر شعبية
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{pkg.title}</h3>
                          <p className="text-sm text-gray-600">{pkg.description}</p>
                        </div>
                      </div>

                      <div className="text-3xl font-bold gradient-text mb-4">
                        {pkg.price.toLocaleString()} ريال
                      </div>

                      <div className="space-y-2 mb-4">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{pkg.deliveryDays} يوم توصيل</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{pkg.currentBackers}/{pkg.maxBackers}</span>
                        </div>
                      </div>

                      <button className="btn-primary w-full">
                        <Package className="w-5 h-5 ml-2" />
                        دعم المشروع
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    لا توجد باقات متاحة حالياً
                  </div>
                )}
              </div>

              {/* Negotiate Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleNegotiate}
                  className="btn-secondary w-full"
                >
                  <Zap className="w-5 h-5 ml-2" />
                  بدء تفاوض خاص
                </button>
                <p className="text-xs text-gray-600 text-center mt-2">
                  للحصول على عرض مخصص حسب احتياجك
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backing Modal */}
      {showBackingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">تأكيد الدعم</h3>
            <p className="text-gray-700 mb-6">
              أنت على وشك دعم هذا المشروع. سيتم توجيهك لصفحة الدفع.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmBacking}
                className="btn-primary flex-1"
              >
                متابعة للدفع
              </button>
              <button
                onClick={() => setShowBackingModal(false)}
                className="btn-secondary flex-1"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

