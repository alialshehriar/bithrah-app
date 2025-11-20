'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, Gift, Users, TrendingUp, Shield, Zap,
  CheckCircle, ArrowRight, ArrowLeft, Crown, Share2,
  Target, MessageSquare, Heart, Briefcase
} from 'lucide-react';

interface OnboardingPopupProps {
  userName?: string;
  referralCode?: string;
  subscriptionEndDate?: string;
}

export default function OnboardingPopup({ 
  userName, 
  referralCode,
  subscriptionEndDate 
}: OnboardingPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (!hasSeenOnboarding) {
      // Show popup after 1 second
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      icon: Sparkles,
      title: `مرحباً بك في بذرة، ${userName || 'صديقنا'}! 🌱`,
      description: 'بيئة الوساطة الذكية الأولى في السعودية لدعم المشاريع الإبداعية والمبتكرة',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-black text-gray-900">🚀 إطلاق تجريبي (Beta)</h4>
                <p className="text-sm text-gray-600">نحن في مرحلة الاختبار المبكر</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              أنت من المستخدمين الأوائل! ساعدنا في تحسين المنصة بملاحظاتك واقتراحاتك. 
              بعض الميزات قد تكون قيد التطوير، ونحن نعمل بجد لتحسين تجربتك.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
              <Briefcase className="w-8 h-8 text-teal-600 mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">أنشئ مشروعك</h5>
              <p className="text-xs text-gray-600">احصل على التمويل لفكرتك</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <Heart className="w-8 h-8 text-purple-600 mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">ادعم المبدعين</h5>
              <p className="text-xs text-gray-600">ساهم في تحقيق الأحلام</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">انضم للمجتمعات</h5>
              <p className="text-xs text-gray-600">تواصل مع المبدعين</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <h5 className="font-bold text-gray-900 mb-1">سوّق واربح</h5>
              <p className="text-xs text-gray-600">احصل على عمولات</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Crown,
      title: 'مكافأة التسجيل المبكر! 🎁',
      description: 'حصلت على اشتراك مستثمر مجاني لمدة سنة كاملة',
      content: (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-30" />
            <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-300">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">اشتراك مستثمر</h3>
                <p className="text-purple-600 font-bold text-lg">قيمة 1,200 ريال - مجاناً!</p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-4">
                <h4 className="font-bold text-gray-900 mb-4">✨ المزايا الحصرية:</h4>
                <div className="space-y-3">
                  {[
                    'وصول مبكر لجميع المشاريع الجديدة',
                    'باقات دعم حصرية بمزايا إضافية',
                    'بوابة التفاوض المباشر مع أصحاب المشاريع',
                    'أولوية في الدعم الفني',
                    'شارة مستثمر مميزة على ملفك الشخصي',
                    'تقارير تحليلية متقدمة',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {subscriptionEndDate && (
                <div className="bg-purple-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-purple-900">
                    <span className="font-bold">صالح حتى:</span> {new Date(subscriptionEndDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Gift,
      title: 'نظام الإحالة والتسويق 💰',
      description: 'اربح سنوات مجانية وعمولات من كل إحالة ناجحة',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-50 to-purple-50 rounded-2xl p-6 border-2 border-dashed border-[#14B8A6]">
            <div className="text-center mb-6">
              <Gift className="w-16 h-16 text-[#14B8A6] mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-2">كود الإحالة الخاص بك</h3>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 mb-2 block">كودك الخاص</label>
                  <code className="text-2xl font-black text-[#14B8A6] tracking-wider">{referralCode || 'LOADING...'}</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode || '');
                    alert('تم نسخ كود الإحالة!');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  نسخ
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-bold">رابطك:</span> https://bithrahapp.com?ref={referralCode}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900">🎯 كيف تستفيد؟</h4>
              
              <div className="bg-white rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">نظام الإحالة (للأصدقاء)</h5>
                    <p className="text-sm text-gray-600">شارك كودك مع أصدقائك. عند تسجيل كل شخص عبر رابطك:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        صديقك يحصل على اشتراك مستثمر لمدة سنة
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        أنت تحصل على سنة إضافية مجاناً
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h5 className="font-bold text-gray-900 mb-1">نظام التسويق (للمشاريع)</h5>
                    <p className="text-sm text-gray-600">سوّق للمشاريع واحصل على عمولة:</p>
                    <ul className="mt-2 space-y-1 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        عمولة على كل دعم يأتي عبر رابطك
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        متاح فقط لمشاريع بذرة بلس والحسابات المدفوعة
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        تتبع أرباحك في لوحة التحكم
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Target,
      title: 'جاهز للانطلاق! 🚀',
      description: 'ابدأ رحلتك الآن في عالم الإبداع والابتكار',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">كل شيء جاهز!</h3>
            <p className="text-gray-600 mb-8">يمكنك الآن البدء في استكشاف المشاريع، إنشاء مشروعك الخاص، أو الانضمام للمجتمعات</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a
              href="/projects"
              className="block bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-2xl p-6 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-lg">استكشف المشاريع</h4>
                    <p className="text-sm text-white/80">ادعم المشاريع الإبداعية</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>

            <a
              href="/projects/create"
              className="block bg-white border-2 border-gray-200 hover:border-[#14B8A6] rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#8B5CF6] flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-lg text-gray-900">أنشئ مشروعك</h4>
                    <p className="text-sm text-gray-600">احصل على التمويل لفكرتك</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>

            <a
              href="/communities"
              className="block bg-white border-2 border-gray-200 hover:border-[#14B8A6] rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-black text-lg text-gray-900">انضم للمجتمعات</h4>
                    <p className="text-sm text-gray-600">تواصل مع المبدعين</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-bold">هل لديك أسئلة؟</span>
            </p>
            <p className="text-sm text-gray-500">
              تواصل معنا على{' '}
              <a href="mailto:info@bithrahapp.com" className="text-[#14B8A6] font-bold hover:underline">
                info@bithrahapp.com
              </a>
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] p-8 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    {steps[currentStep].icon && <steps[currentStep].icon className="w-8 h-8" />}
                  </div>
                  <h2 className="text-2xl font-black mb-2">{steps[currentStep].title}</h2>
                  <p className="text-white/90">{steps[currentStep].description}</p>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? 'w-8 bg-white'
                          : index < currentStep
                          ? 'w-2 bg-white/60'
                          : 'w-2 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 max-h-[50vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {steps[currentStep].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                >
                  <ArrowRight className="w-5 h-5" />
                  السابق
                </button>

                <div className="text-sm text-gray-600 font-bold">
                  {currentStep + 1} / {steps.length}
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'ابدأ الآن' : 'التالي'}
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
