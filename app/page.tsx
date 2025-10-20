'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Rocket, TrendingUp, Users, Sparkles, Shield, Award,
  Target, Heart, Zap, Crown, Star, ArrowLeft, CheckCircle,
  DollarSign, MessageCircle, BarChart3, Gift
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FeaturedProjects from '@/components/FeaturedProjects';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFunding: 0,
    activeUsers: 0,
    successRate: 0
  });

  useEffect(() => {
    // Check if user is logged in and fetch real stats
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsLoggedIn(true);
          }
        }

        // Use static demo data for now to avoid database connection issues
        setStats({
          totalProjects: 1,
          totalFunding: 45000,
          activeUsers: 2,
          successRate: 95
        });
        
        // TODO: Re-enable stats API after fixing database connection
        // const statsRes = await fetch('/api/stats/platform');
        // if (statsRes.ok) {
        //   const statsData = await statsRes.json();
        //   if (statsData.success) {
        //     setStats({
        //       totalProjects: statsData.stats.totalProjects || 0,
        //       totalFunding: statsData.stats.totalFunding || 0,
        //       activeUsers: statsData.stats.activeUsers || 0,
        //       successRate: statsData.stats.successRate || 0
        //     });
        //   }
        // }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

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

  const features = [
    {
      icon: Rocket,
      title: 'إطلاق مشاريعك',
      description: 'أطلق مشروعك بسهولة واحصل على التمويل من المجتمع',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: Users,
      title: 'مجتمع داعم',
      description: 'انضم إلى مجتمعات متخصصة وتواصل مع داعمين ومستثمرين',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      icon: Shield,
      title: 'آمن وموثوق',
      description: 'نظام دفع آمن ومحمي بأعلى معايير الأمان',
      color: 'from-[#14B8A6] to-[#0F9D8F]',
      bgColor: 'from-teal-50 to-teal-100'
    },
    {
      icon: BarChart3,
      title: 'تحليلات ذكية',
      description: 'تحليلات مدعومة بالذكاء الاصطناعي لتقييم المشاريع',
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      icon: Award,
      title: 'نظام المكافآت',
      description: 'اكسب نقاط ومكافآت مع كل مساهمة ودعم',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100'
    },
    {
      icon: MessageCircle,
      title: 'تواصل مباشر',
      description: 'تواصل مع أصحاب المشاريع والمستثمرين مباشرة',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100'
    }
  ];

  const aiAgentFeatures = [
    { 
      value: 'GPT-4', 
      label: 'مدعوم بـ OpenAI', 
      icon: Sparkles 
    },
    { 
      value: '6', 
      label: 'معايير تقييم شاملة', 
      icon: BarChart3 
    },
    { 
      value: 'SWOT', 
      label: 'تحليل استراتيجي', 
      icon: Target 
    },
    { 
      value: '100%', 
      label: 'تقرير مفصل فوري', 
      icon: CheckCircle 
    }
  ];

  const benefits = [
    'إطلاق مشاريع غير محدودة',
    'وصول إلى آلاف الداعمين والمستثمرين',
    'تحليلات ذكية مدعومة بالذكاء الاصطناعي',
    'نظام مكافآت وإنجازات',
    'مجتمعات متخصصة حسب المجال',
    'دعم فني على مدار الساعة',
    'نظام دفع آمن ومحمي',
    'تقارير وإحصائيات تفصيلية'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Main Heading */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] blur-3xl opacity-30" />
              <h1 className="relative text-6xl md:text-7xl lg:text-8xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] bg-clip-text text-transparent">
                  بذرة
                </span>
              </h1>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              بيئة الوساطة الذكية الأولى
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              حوّل أفكارك إلى واقع مع منصة بذرة. احصل على التمويل، بني مجتمعك، وحقق أحلامك
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth/register"
                className="group relative px-8 py-4 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-2xl px-8 py-4 text-white font-bold text-lg flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  ابدأ الآن مجاناً
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </Link>

              <Link
                href="/projects"
                className="px-8 py-4 bg-white border-2 border-gray-200 rounded-2xl font-bold text-lg text-gray-700 hover:border-[#14B8A6] hover:text-[#14B8A6] transition-all w-full sm:w-auto"
              >
                استكشف المشاريع
              </Link>
            </div>

            {/* AI Evaluation Agent Features */}
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14B8A6]/10 to-[#8B5CF6]/10 rounded-full border border-[#14B8A6]/20 mb-4">
                  <Sparkles className="w-5 h-5 text-[#14B8A6]" />
                  <span className="text-sm font-bold text-gray-700">وكيل تقييم الأفكار بالذكاء الاصطناعي</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                  احصل على تقييم احترافي لفكرتك في دقائق
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  وكيل ذكي متقدم يستخدم GPT-4 لتحليل فكرتك وتقديم تقرير شامل يغطي جميع جوانب مشروعك
                </p>
                <Link
                  href="/evaluate"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
                >
                  <Sparkles className="w-6 h-6" />
                  قيّم فكرتك الآن
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {aiAgentFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#7C3AED]/10 rounded-2xl blur-xl" />
                    <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
                      <feature.icon className="w-8 h-8 text-[#8B5CF6] mb-2 mx-auto" />
                      <div className="text-3xl font-black text-gray-900 mb-1">{feature.value}</div>
                      <div className="text-sm text-gray-600 font-bold">{feature.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              لماذا بذرة؟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نوفر لك كل ما تحتاجه لإطلاق مشروعك وتحقيق النجاح
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                
                <div className={`relative bg-gradient-to-br ${feature.bgColor} rounded-3xl p-8 border border-white/50 shadow-lg h-full`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                كل ما تحتاجه في مكان واحد
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                بذرة توفر لك منصة متكاملة لإطلاق وإدارة مشاريعك بكل سهولة واحترافية
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-gradient-to-br from-teal-50 to-purple-50 rounded-3xl p-12 border border-white/50 shadow-2xl">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">
                    انضم إلى بذرة اليوم
                  </h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    ابدأ رحلتك نحو تحقيق أحلامك مع آلاف المستخدمين الذين يثقون في بذرة
                  </p>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all"
                  >
                    <Sparkles className="w-6 h-6" />
                    سجل مجاناً الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              هل أنت مستعد لتحويل فكرتك إلى واقع؟
            </h2>
            <p className="text-xl text-white/90 mb-8">
              انضم إلى آلاف رواد الأعمال الذين حققوا أحلامهم مع بذرة
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#14B8A6] rounded-2xl font-black text-xl hover:shadow-2xl transition-all"
            >
              <Rocket className="w-7 h-7" />
              ابدأ رحلتك الآن
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

