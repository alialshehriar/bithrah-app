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

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: 'مرحباً في بذرة! 🌱',
      icon: <Sparkles className="w-12 h-12 text-white" />,
      content: (
        <div className="space-y-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              مرحباً {userName || 'بك'}! 👋
            </h3>
            <p className="text-gray-600 text-lg">
              نحن سعداء بانضمامك إلى <span className="font-bold text-emerald-600">بذرة</span> - منصة التمويل الجماعي الأولى
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'مكافأة التسجيل المبكر 🎁',
      icon: <Gift className="w-12 h-12 text-white" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Gift className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">مبروك! 🎉</h3>
            <p className="text-gray-600 mb-6">
              حصلت على <span className="font-bold text-emerald-600">اشتراك مستثمر لمدة سنة كاملة مجاناً!</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <Crown className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div className="text-right">
                <h4 className="font-bold text-gray-900 mb-2">مميزات اشتراك المستثمر:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>أولوية في الاستثمار بالمشاريع الجديدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>تقارير تحليلية متقدمة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>دعم فني مباشر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>شارة مستثمر مميز</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {subscriptionEndDate && (
            <p className="text-center text-sm text-gray-500">
              صالح حتى: <span className="font-medium">{new Date(subscriptionEndDate).toLocaleDateString('ar-SA')}</span>
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'نظام الإحالة 🔗',
      icon: <Share2 className="w-12 h-12 text-white" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Share2 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">شارك واربح! 💰</h3>
            <p className="text-gray-600 mb-6">
              ادعُ أصدقاءك واحصل على <span className="font-bold text-emerald-600">سنة إضافية</span> لكل صديق يسجل!
            </p>
          </div>

          {referralCode && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-3 text-center">كود الإحالة الخاص بك:</h4>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-3xl font-black text-blue-600 tracking-wider mb-3">
                  {referralCode}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralCode);
                    alert('تم نسخ الكود!');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  📋 انسخ الكود
                </button>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Gift className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">كيف يعمل نظام الإحالة؟</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• شارك كود الإحالة مع أصدقائك</li>
                  <li>• عند تسجيلهم باستخدام الكود</li>
                  <li>• تحصل أنت وصديقك على سنة إضافية!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'ابدأ الآن! 🚀',
      icon: <Zap className="w-12 h-12 text-white" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">كل شيء جاهز! ✨</h3>
            <p className="text-gray-600 mb-8">
              يمكنك الآن البدء في استكشاف المشاريع، إنشاء مشروعك الخاص، أو الانضمام للمجتمعات
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <a
              href="/projects"
              className="block bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6 hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-lg">استكشف المشاريع</h4>
                    <p className="text-sm text-white/80">ادعم المشاريع الإبداعية</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>

            <a
              href="/create-project"
              className="block bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-lg text-gray-900">أنشئ مشروعك</h4>
                    <p className="text-sm text-gray-600">احصل على التمويل لفكرتك</p>
                  </div>
                </div>
                <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:translate-x-2 transition-transform" />
              </div>
            </a>

            <a
              href="/communities"
              className="block bg-white border-2 border-gray-200 hover:border-emerald-500 rounded-2xl p-6 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-lg text-gray-900">انضم للمجتمعات</h4>
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
              <a href="mailto:info@bithrahapp.com" className="text-emerald-600 font-bold hover:underline">
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
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Progress Indicator */}
              <div className="flex justify-center gap-2 mb-8">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-gradient-to-r from-emerald-500 to-teal-600'
                        : index < currentStep
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrev}
                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    السابق
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                    currentStep === 0 ? 'flex-1' : 'flex-1'
                  }`}
                >
                  {currentStep === steps.length - 1 ? 'ابدأ الآن!' : 'التالي'}
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
