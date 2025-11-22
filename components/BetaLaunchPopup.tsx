'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Sparkles, Gift, Rocket, Crown, CheckCircle, 
  ArrowLeft, Star, Zap, Users, TrendingUp, Shield,
  Calendar, Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BetaLaunchPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user has seen the beta popup
    const hasSeenBetaPopup = localStorage.getItem('hasSeenBetaPopup');
    
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          // User not logged in, show popup
          if (!hasSeenBetaPopup) {
            setTimeout(() => {
              setIsOpen(true);
            }, 2000);
          }
        }
      } catch (error) {
        // Error checking auth, show popup
        if (!hasSeenBetaPopup) {
          setTimeout(() => {
            setIsOpen(true);
          }, 2000);
        }
      }
    };

    checkAuth();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenBetaPopup', 'true');
  };

  const handleSignup = () => {
    handleClose();
    router.push('/auth/register');
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSignup();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: 'مرحباً بك في بذرة! 🌱',
      content: (
        <div className="space-y-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-3xl opacity-30 animate-pulse" />
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              الإطلاق التجريبي لمنصة بذرة! 🚀
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              أول منصة تمويل جماعي متكاملة تجمع بين <span className="font-bold text-emerald-600">الأفكار</span>، 
              <span className="font-bold text-emerald-600"> المشاريع</span>، و
              <span className="font-bold text-emerald-600"> المجتمعات</span> في مكان واحد
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
              <Sparkles className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900">تقييم الأفكار</p>
              <p className="text-xs text-gray-600 mt-1">بالذكاء الاصطناعي</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900">تمويل المشاريع</p>
              <p className="text-xs text-gray-600 mt-1">بطرق مبتكرة</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-900">مجتمعات حية</p>
              <p className="text-xs text-gray-600 mt-1">للمبدعين</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'مكافأة التسجيل المبكر 🎁',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl">
                <Gift className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900 mt-6 mb-4">
              سجّل الآن واحصل على هدية! 🎉
            </h3>
            <div className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-xl mb-4">
              <p className="text-sm font-medium mb-1">اشتراك مستثمر مجاني</p>
              <p className="text-4xl font-black">سنة كاملة</p>
            </div>
            <p className="text-gray-600 text-lg">
              قيمة <span className="font-bold line-through">2,388 ر.س</span> - 
              <span className="font-bold text-emerald-600"> مجاناً تماماً!</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
            <div className="flex items-start gap-4 mb-4">
              <Crown className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div className="text-right flex-1">
                <h4 className="font-bold text-gray-900 mb-3">مميزات اشتراك المستثمر:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>أولوية في الاستثمار بالمشاريع الجديدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>تقييم غير محدود للأفكار بالذكاء الاصطناعي</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>تقارير تحليلية متقدمة لكل مشروع</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>وصول حصري للمجتمعات المميزة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>دعم فني مباشر على مدار الساعة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>شارة مستثمر مميز على حسابك</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              <span className="font-bold">ينتهي العرض قريباً!</span> سجّل الآن قبل انتهاء فترة الإطلاق التجريبي
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'نظام الإحالة 🔗',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Users className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900 mt-6 mb-4">
              ادعُ أصدقاءك واربح! 💰
            </h3>
            <p className="text-gray-600 text-lg">
              احصل على <span className="font-bold text-emerald-600">سنة إضافية مجانية</span> لكل صديق يسجل عبر رابطك!
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-4 text-center">كيف يعمل نظام الإحالة؟</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 mb-1">سجّل حسابك</h5>
                  <p className="text-sm text-gray-600">احصل على كود إحالة خاص بك فوراً بعد التسجيل</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                  2
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 mb-1">شارك الكود</h5>
                  <p className="text-sm text-gray-600">أرسل كود الإحالة لأصدقائك عبر واتساب أو تويتر</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                  3
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 mb-1">اربح سنة إضافية!</h5>
                  <p className="text-sm text-gray-600">عند تسجيل كل صديق، تحصل أنت وصديقك على سنة إضافية مجاناً</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white text-center">
            <Award className="w-12 h-12 mx-auto mb-3" />
            <p className="font-bold text-lg mb-1">مكافآت غير محدودة!</p>
            <p className="text-sm text-white/90">لا يوجد حد أقصى لعدد الإحالات - كلما دعوت أكثر، كلما ربحت أكثر!</p>
          </div>
        </div>
      ),
    },
    {
      title: 'ابدأ رحلتك الآن! 🚀',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
                <Zap className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-gray-900 mt-6 mb-4">
              انضم لمجتمع بذرة الآن! ✨
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              كن من أوائل المستخدمين واستمتع بجميع المميزات الحصرية
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-gray-900">تسجيل سريع</h4>
                  <p className="text-sm text-gray-600">دقيقة واحدة فقط للبدء</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-gray-900">آمن ومحمي</h4>
                  <p className="text-sm text-gray-600">بياناتك محمية بأعلى معايير الأمان</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h4 className="font-bold text-gray-900">دعم متواصل</h4>
                  <p className="text-sm text-gray-600">فريقنا جاهز لمساعدتك في أي وقت</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
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
                    <span>السابق</span>
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                    currentStep === 0 ? 'flex-1' : 'flex-1'
                  }`}
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <span>سجّل الآن مجاناً!</span>
                      <Rocket className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span>التالي</span>
                      <ArrowLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip Link */}
              <div className="text-center mt-4">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  سأسجل لاحقاً
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
