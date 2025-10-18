'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Shield, Clock, FileText, CheckCircle, ArrowRight,
  DollarSign, Users, Lock, Award, Sparkles, Crown, RefreshCw, 
  Check, Info, AlertCircle, ChevronDown, Star, Zap, TrendingUp,
  Eye, Heart, Target, Gift, ThumbsUp, MessageCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

function NegotiationStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
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

  const handleStartNegotiation = async () => {
    if (!agreed) {
      alert('يرجى الموافقة على الشروط والأحكام أولاً');
      return;
    }
    
    if (!project) {
      alert('لم يتم العثور على المشروع');
      return;
    }
    
    setIsStarting(true);
    try {
      const response = await fetch('/api/negotiations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          projectId: parseInt(projectId!),
          receiverId: project.creator.id,
          initialOffer: 0, // Will be set during negotiation
          message: 'أرغب في بدء مفاوضات بشأن هذا المشروع'
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/negotiations/${data.negotiation.id}`);
      } else {
        alert(data.error || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Error starting negotiation:', error);
      alert('حدث خطأ أثناء بدء التفاوض');
    } finally {
      setIsStarting(false);
    }
  };

  const FAQS = [
    {
      question: 'ما هو التفاوض المباشر؟',
      answer: 'التفاوض المباشر هو خدمة تتيح لك التواصل المباشر مع صاحب المشروع لمناقشة تفاصيل الاستثمار والشروط بشكل خاص ومراقب.'
    },
    {
      question: 'هل الرسوم قابلة للاسترداد؟',
      answer: 'نعم، الرسوم قابلة للاسترداد بالكامل إذا لم يتم التوصل لاتفاق خلال فترة التفاوض.'
    },
    {
      question: 'كم تستمر فترة التفاوض؟',
      answer: 'فترة التفاوض 3 أيام كاملة، يمكنك خلالها مناقشة جميع التفاصيل مع صاحب المشروع.'
    },
    {
      question: 'هل المحادثات مراقبة؟',
      answer: 'نعم، جميع المحادثات مراقبة من قبل فريق المنصة لضمان الشفافية والالتزام بالقوانين.'
    },
    {
      question: 'ماذا يحدث عند الاتفاق؟',
      answer: 'عند التوصل لاتفاق، نوفر لك عقد قانوني موثق يحمي حقوق الطرفين ويضمن تنفيذ الاتفاق.'
    },
    {
      question: 'هل يمكنني التفاوض مع أكثر من مشروع؟',
      answer: 'نعم، يمكنك فتح باب التفاوض مع عدة مشاريع في نفس الوقت.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      <div className="pt-24 pb-20">
        {/* Ultra Premium Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated Background with Luxury Gradients */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-[#14B8A6]/20 via-[#8B5CF6]/20 to-transparent rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-[#8B5CF6]/20 via-[#14B8A6]/20 to-transparent rounded-full blur-3xl"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="flex justify-center mb-10"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative inline-flex items-center gap-3 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white/50">
                  <Sparkles className="w-6 h-6 text-[#14B8A6]" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] font-black text-lg">
                    نظام التفاوض الذكي المتقدم
                  </span>
                  <Crown className="w-6 h-6 text-[#8B5CF6]" />
                </div>
              </div>
            </motion.div>

            {/* Main Title with Luxury Typography */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-8"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] bg-[length:200%_auto] animate-gradient">
                  ابدأ رحلة التفاوض
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                نظام تفاوض آمن ومراقب بالذكاء الاصطناعي يضمن حقوق الطرفين مع حماية كاملة للملكية الفكرية
              </p>
            </motion.div>

            {/* Premium Stats with Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {[
                { icon: Users, label: 'صفقة ناجحة', value: '2,500+', gradient: 'from-[#14B8A6] to-[#0F9D8F]' },
                { icon: Shield, label: 'حماية كاملة', value: '100%', gradient: 'from-[#8B5CF6] to-[#7C3AED]' },
                { icon: TrendingUp, label: 'معدل النجاح', value: '94%', gradient: 'from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6]' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                  
                  {/* Glass Card */}
                  <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl p-8 border border-white/50 shadow-2xl">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} mb-6 shadow-lg`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-bold text-lg">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Project Card with Premium Design */}
        {project && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-2xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white text-4xl font-black flex-shrink-0 shadow-xl">
                    {project.title?.[0] || 'P'}
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-3xl font-black text-gray-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
                  </div>
                  <div className="text-center md:text-left bg-gradient-to-br from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-2xl p-6">
                    <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] mb-2">
                      {(project.goalAmount / 1000).toFixed(0)}K ر.س
                    </div>
                    <div className="text-sm text-gray-600 font-bold">هدف التمويل</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* How It Works - Premium Design */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6]">
              كيف يعمل نظام التفاوض؟
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              عملية بسيطة وآمنة مصممة لحماية مصالح جميع الأطراف
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: MessageSquare,
                title: 'بدء المحادثة',
                description: 'ابدأ محادثة مباشرة مع صاحب المشروع في بيئة آمنة ومشفرة بأحدث التقنيات',
                gradient: 'from-[#14B8A6] to-[#0F9D8F]'
              },
              {
                step: '02',
                icon: Clock,
                title: 'فترة 3 أيام',
                description: 'لديك 3 أيام كاملة للتفاوض والوصول إلى اتفاق مناسب للطرفين',
                gradient: 'from-[#3B82F6] to-[#2563EB]'
              },
              {
                step: '03',
                icon: Shield,
                title: 'مراقبة ذكية',
                description: 'نظام AI متقدم يراقب المحادثة لضمان الاحترام وحماية الملكية الفكرية',
                gradient: 'from-[#8B5CF6] to-[#7C3AED]'
              },
              {
                step: '04',
                icon: CheckCircle,
                title: 'إتمام الصفقة',
                description: 'عند الاتفاق، يتم توثيق الصفقة قانونياً وحماية حقوق الطرفين بالكامل',
                gradient: 'from-[#10B981] to-[#059669]'
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -15, scale: 1.03 }}
                className="relative group"
              >
                {/* Connection Line */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-1 -z-10">
                    <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-transparent" />
                  </div>
                )}
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500`} />
                
                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                  {/* Step Number Badge */}
                  <div className="absolute -top-5 -right-5 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center text-white font-black text-lg shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${item.gradient} mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Ultra Premium Pricing Section */}
        <div className="relative overflow-hidden py-24">
          {/* Luxury Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1a2e] to-gray-900">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                تسعير شفاف وعادل
              </h2>
              <p className="text-gray-400 text-xl">
                رسوم بسيطة مقابل خدمة متكاملة وحماية شاملة
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl mx-auto"
            >
              <div className="relative group">
                {/* Mega Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] rounded-[2.5rem] blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                {/* Premium Card */}
                <div className="relative bg-white rounded-[2rem] overflow-hidden shadow-2xl">
                  {/* Header with Gradient */}
                  <div className="relative bg-gradient-to-br from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] p-12 text-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '30px 30px'
                      }} />
                    </div>
                    
                    <div className="relative">
                      <div className="inline-flex items-center gap-3 px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8">
                        <Crown className="w-6 h-6 text-white" />
                        <span className="text-white font-black text-lg">باقة التفاوض الذكي</span>
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex items-baseline justify-center gap-3 mb-6">
                        <span className="text-7xl md:text-8xl font-black text-white">
                          499
                        </span>
                        <span className="text-3xl text-white/90 font-bold">ريال</span>
                      </div>
                      
                      <p className="text-white/90 text-xl font-medium">رسوم لمرة واحدة فقط</p>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {[
                        { icon: MessageSquare, text: '3 أيام من المحادثات المراقبة', gradient: 'from-[#14B8A6] to-[#0F9D8F]' },
                        { icon: Shield, text: 'حماية كاملة للملكية الفكرية', gradient: 'from-[#8B5CF6] to-[#7C3AED]' },
                        { icon: Lock, text: 'تشفير متقدم للمحادثات', gradient: 'from-[#3B82F6] to-[#2563EB]' },
                        { icon: FileText, text: 'توثيق قانوني للاتفاقية', gradient: 'from-[#10B981] to-[#059669]' },
                        { icon: Zap, text: 'وساطة ذكية بالذكاء الاصطناعي', gradient: 'from-[#F59E0B] to-[#D97706]' },
                        { icon: CheckCircle, text: 'ضمان استرجاع المبلغ', gradient: 'from-[#EC4899] to-[#DB2777]' },
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          whileHover={{ scale: 1.05, x: 10 }}
                          className="flex items-center gap-4 group/item"
                        >
                          <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover/item:shadow-xl transition-shadow duration-300`}>
                            <feature.icon className="w-7 h-7 text-white" />
                          </div>
                          <span className="text-gray-700 font-bold text-lg">{feature.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Refund Policy - Premium Alert */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="relative group/alert overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-20 group-hover/alert:opacity-30 transition-opacity duration-300" />
                      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200/50">
                        <div className="flex items-start gap-5">
                          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                            <Info className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-gray-900 text-xl mb-3">سياسة استرجاع المبلغ</h4>
                            <p className="text-gray-700 leading-relaxed text-lg">
                              إذا لم يتم الوصول إلى اتفاق خلال فترة الـ 3 أيام، سيتم استرجاع المبلغ كاملاً تلقائياً خلال 24 ساعة. نحن نضمن حقوقك بالكامل ونوفر لك تجربة آمنة ومريحة.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Premium Terms & Agreement Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-[2rem] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] p-10">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2">الشروط والأحكام</h2>
                      <p className="text-white/90 text-lg">يرجى قراءة الشروط بعناية قبل المتابعة</p>
                    </div>
                  </div>
                </div>

                <div className="p-10">
                  {/* Terms Content */}
                  <div className="space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
                    {[
                      {
                        title: '1. نطاق الخدمة',
                        content: 'توفر منصة بذرة خدمة وساطة متقدمة بين صاحب المشروع والداعم المحتمل لمدة 3 أيام. المنصة لا تدير الأموال ولا تتدخل في تفاصيل الاتفاق المالي بين الطرفين، بل تقدم بيئة آمنة ومراقبة للتفاوض.'
                      },
                      {
                        title: '2. حماية الملكية الفكرية',
                        content: 'يتعهد الطرفان بعدم الكشف عن أي معلومات سرية أو أفكار خاصة بالمشروع لأي طرف ثالث. أي انتهاك سيتم التعامل معه قانونياً وفقاً للأنظمة السعودية. نحن نستخدم تقنيات متقدمة لحماية البيانات.'
                      },
                      {
                        title: '3. المراقبة الذكية بالذكاء الاصطناعي',
                        content: 'يتم مراقبة المحادثات بواسطة نظام ذكاء اصطناعي متقدم لضمان الاحترام المتبادل وعدم مشاركة معلومات حساسة. أي سلوك غير لائق أو محاولة للاحتيال سيؤدي إلى إيقاف المحادثة فوراً وإبلاغ الجهات المختصة.'
                      },
                      {
                        title: '4. سياسة الاسترجاع الكاملة',
                        content: 'في حالة عدم الوصول إلى اتفاق خلال 3 أيام، سيتم استرجاع رسوم التفاوض (499 ريال) كاملة تلقائياً خلال 24 ساعة إلى نفس وسيلة الدفع المستخدمة. لا توجد أي رسوم خفية أو شروط إضافية.'
                      },
                      {
                        title: '5. التوثيق القانوني والعقود',
                        content: 'عند الوصول إلى اتفاق، يجب على الطرفين توثيق الاتفاقية رسمياً. المنصة توفر قوالب قانونية معتمدة ومراجعة من محامين متخصصين، ولكن ننصح بشدة بمراجعة محامي متخصص لضمان حماية كاملة لحقوقك.'
                      },
                      {
                        title: '6. المسؤولية والضمانات',
                        content: 'منصة بذرة غير مسؤولة عن أي نزاعات تنشأ بعد إتمام الاتفاق وخارج نطاق فترة التفاوض. دورنا يقتصر على توفير بيئة آمنة للتفاوض والوساطة فقط. نحن نضمن سلامة المنصة وحماية البيانات.'
                      },
                      {
                        title: '7. إنهاء الخدمة والإلغاء',
                        content: 'يحق لأي من الطرفين إنهاء المحادثة في أي وقت خلال فترة الـ 3 أيام دون إبداء أسباب. في هذه الحالة، سيتم استرجاع المبلغ كاملاً وفقاً لسياسة الاسترجاع المذكورة أعلاه خلال 24 ساعة.'
                      },
                      {
                        title: '8. الخصوصية وحماية البيانات',
                        content: 'نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لأعلى المعايير الدولية. جميع المحادثات مشفرة بتقنية End-to-End Encryption ولا يمكن الوصول إليها إلا من قبل الطرفين المعنيين.'
                      },
                    ].map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-6 border-r-4 border-[#14B8A6] pr-4 py-3 hover:bg-gray-50/50 rounded-lg transition-colors duration-200"
                      >
                        <h3 className="font-black text-gray-900 mb-3 text-lg">{section.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{section.content}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Agreement Checkbox - Premium Design */}
                  <div className="mt-10 pt-8 border-t-2 border-gray-200">
                    <label className="flex items-start gap-5 cursor-pointer group/checkbox">
                      <div className="relative flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-8 h-8 border-3 border-gray-300 rounded-xl peer-checked:border-[#14B8A6] peer-checked:bg-gradient-to-br peer-checked:from-[#14B8A6] peer-checked:to-[#8B5CF6] transition-all duration-300 flex items-center justify-center shadow-lg">
                          {agreed && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Check className="w-6 h-6 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-bold text-lg group-hover/checkbox:text-gray-900 transition-colors mb-2">
                          أوافق على جميع الشروط والأحكام المذكورة أعلاه وأتعهد بالالتزام بها
                        </p>
                        <p className="text-gray-500 text-sm">
                          بالموافقة، أنت تقر بأنك قرأت وفهمت جميع البنود وتوافق على الالتزام بها بشكل كامل
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Action Buttons - Ultra Premium */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-5">
                    <motion.button
                      whileHover={{ scale: agreed ? 1.03 : 1 }}
                      whileTap={{ scale: agreed ? 0.97 : 1 }}
                      onClick={handleStartNegotiation}
                      disabled={!agreed || isStarting}
                      className={`flex-1 relative overflow-hidden group/btn ${
                        agreed
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      {agreed && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] via-[#8B5CF6] to-[#14B8A6] bg-[length:200%_auto] animate-gradient" />
                      )}
                      {!agreed && (
                        <div className="absolute inset-0 bg-gray-300" />
                      )}
                      
                      <div className="relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl shadow-xl">
                        {isStarting ? (
                          <>
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-white font-black text-xl">جاري التحضير...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-white font-black text-xl">ابدأ التفاوض الآن</span>
                            <ArrowRight className="w-6 h-6 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.back()}
                      className="px-8 py-5 rounded-2xl font-black text-xl border-3 border-gray-300 text-gray-700 hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-gray-50 transition-all duration-300 shadow-lg"
                    >
                      رجوع
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators - Premium Design */}
        <div className="bg-gradient-to-br from-teal-50 via-purple-50 to-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Shield, label: 'حماية متقدمة', value: 'SSL 256-bit', gradient: 'from-[#14B8A6] to-[#0F9D8F]' },
                { icon: Lock, label: 'تشفير كامل', value: 'End-to-End', gradient: 'from-[#8B5CF6] to-[#7C3AED]' },
                { icon: CheckCircle, label: 'موثوق', value: 'معتمد رسمياً', gradient: 'from-[#10B981] to-[#059669]' },
                { icon: Users, label: 'عملاء راضون', value: '2,500+', gradient: 'from-[#F59E0B] to-[#D97706]' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-5">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
                    <div className="relative p-5 rounded-2xl bg-white shadow-xl">
                      <item.icon className={`w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br ${item.gradient}`} style={{ WebkitTextStroke: '1px currentColor' }} />
                    </div>
                  </div>
                  <div className="font-black text-gray-900 text-xl mb-2">{item.value}</div>
                  <div className="text-gray-600 font-bold">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section - Premium Design */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6]">
              الأسئلة الشائعة
            </h2>
            <p className="text-gray-600 text-xl">
              إجابات على أكثر الأسئلة شيوعاً
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-right hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <span className="font-black text-gray-900 text-lg flex-1">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center mr-4"
                    >
                      <ChevronDown className="w-6 h-6 text-white" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed text-lg border-t border-gray-200 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14B8A6, #8B5CF6);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0F9D8F, #7C3AED);
        }
      `}</style>
    </div>
  );
}

export default function NegotiationStartPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    }>
      <NegotiationStartContent />
    </Suspense>
  );
}

