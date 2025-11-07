'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Shield, Clock, DollarSign, Lock, Sparkles, Bot,
  AlertCircle, Target, TrendingUp, CheckCircle2, MessageCircle
} from 'lucide-react';
import AINegotiationChat from '@/components/negotiations/AINegotiationChat';

interface Project {
  id: number;
  title: string;
  slug: string;
  fundingGoal: number;
  currentFunding: number;
  creator: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface NegotiationSession {
  id: number;
  status: string;
  expiresAt: string;
  agreementReached: boolean;
}

export default function NegotiatePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [negotiation, setNegotiation] = useState<NegotiationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [startingNegotiation, setStartingNegotiation] = useState(false);

  const currentUserId = 1; // TODO: Get from session

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching project:', projectId);
      
      // Fetch project data
      const projectRes = await fetch(`/api/projects/slug/${projectId}`);
      console.log('Project response status:', projectRes.status);
      const projectData = await projectRes.json();
      console.log('Project data:', projectData);
      
      if (!projectData.success) {
        setError('المشروع غير موجود');
        return;
      }
      
      setProject(projectData.project);

      // Check for existing negotiation
      const negRes = await fetch(`/api/negotiations/active?projectId=${projectId}`);
      if (negRes.ok) {
        const negData = await negRes.json();
        if (negData.negotiation) {
          setNegotiation(negData.negotiation);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNegotiation = async () => {
    if (!agreedToTerms) {
      alert('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setStartingNegotiation(true);
    try {
      const response = await fetch('/api/negotiations/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          investorId: currentUserId
        })
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Reload to show chat interface
      await fetchData();
    } catch (error) {
      console.error('Error starting negotiation:', error);
      alert('حدث خطأ أثناء بدء التفاوض');
    } finally {
      setStartingNegotiation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error || 'المشروع غير موجود'}</p>
          <button
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  // If negotiation exists, show chat interface
  if (negotiation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة للمشروع</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {project.creator.avatar ? (
                    <img
                      src={project.creator.avatar}
                      alt={project.creator.name}
                      className="w-16 h-16 rounded-full border-4 border-purple-100"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-200">
                      <span className="text-2xl font-bold text-white">
                        {project.creator.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                      <Bot className="w-4 h-4" />
                      محادثة مع AI (يتقمص دور صاحب المشروع)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>الهدف: {project.fundingGoal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>المجموع: {project.currentFunding.toLocaleString()} ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AINegotiationChat
              negotiationId={negotiation.id}
              currentUserId={currentUserId}
              projectTitle={project.title}
              expiresAt={negotiation.expiresAt}
            />
          </motion.div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2">💡 عن هذه المحادثة</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  هذه محادثة تجريبية مع نظام ذكاء اصطناعي يتقمص دور صاحب المشروع. النظام يعرف كل تفاصيل المشروع ويستطيع التفاوض معك بشكل واقعي. 
                  الهدف هو اختبار جديتك كمستثمر وفهم اهتماماتك قبل التواصل مع صاحب المشروع الحقيقي.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>محادثة آمنة ومشفرة</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>بدون رسوم (نسخة تجريبية)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>تفاوض واقعي ومهني</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show start negotiation page
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للمشروع</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-start gap-6 mb-6">
              {project.creator.avatar ? (
                <img
                  src={project.creator.avatar}
                  alt={project.creator.name}
                  className="w-20 h-20 rounded-full border-4 border-purple-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-purple-200">
                  <span className="text-2xl font-bold text-white">
                    {project.creator.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                <p className="text-gray-600">صاحب المشروع: {project.creator.name}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>الهدف: {project.fundingGoal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>المجموع: {project.currentFunding.toLocaleString()} ر.س</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Negotiation Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8" />
            <h2 className="text-2xl font-bold">نظام التفاوض بالذكاء الاصطناعي 🤖</h2>
          </div>
          <p className="text-white/90 text-lg mb-6">
            تفاوض مع AI يتقمص دور صاحب المشروع - تجربة واقعية بدون رسوم!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <MessageCircle className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/70 mb-1">محادثة ذكية</p>
              <p className="text-lg font-bold">AI يعرف كل التفاصيل</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CheckCircle2 className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/70 mb-1">بدون رسوم</p>
              <p className="text-2xl font-bold">مجاني 100%</p>
              <p className="text-xs text-white/60 mt-1">نسخة تجريبية</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Clock className="w-6 h-6 mb-2" />
              <p className="text-sm text-white/70 mb-1">مدة التفاوض</p>
              <p className="text-2xl font-bold">3 أيام</p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            ماذا تحصل عند بدء التفاوض؟
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">محادثة ذكية وواقعية</h4>
                <p className="text-sm text-gray-600">
                  AI يتقمص دور صاحب المشروع ويعرف كل التفاصيل
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">بدون رسوم أو تكاليف</h4>
                <p className="text-sm text-gray-600">
                  نسخة تجريبية مجانية بالكامل للاختبار
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">بيئة آمنة ومحمية</h4>
                <p className="text-sm text-gray-600">
                  جميع المحادثات مشفرة ومحفوظة بشكل آمن
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">3 أيام للتفاوض</h4>
                <p className="text-sm text-gray-600">
                  وقت كافٍ للوصول لأفضل اتفاق ممكن
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terms and Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">الشروط والأحكام</h3>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                هذه محادثة تجريبية مع AI يتقمص دور صاحب المشروع
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                لا توجد رسوم أو تكاليف - النسخة التجريبية مجانية بالكامل
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                جميع المحادثات محفوظة ومشفرة بشكل آمن
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                مدة التفاوض 3 أيام من تاريخ البدء
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50 rounded-xl">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="terms" className="text-gray-700 cursor-pointer">
              أوافق على الشروط والأحكام وأفهم أن هذه محادثة تجريبية مع AI
            </label>
          </div>

          <button
            onClick={handleStartNegotiation}
            disabled={!agreedToTerms || startingNegotiation}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {startingNegotiation ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري البدء...</span>
              </>
            ) : (
              <>
                <Bot className="w-6 h-6" />
                <span>ابدأ التفاوض مع AI</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
