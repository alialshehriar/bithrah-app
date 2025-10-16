'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Sparkles, TrendingUp,
  Users, Shield, Award, Zap, Target, Heart, Star,
  Rocket, CheckCircle2, ArrowRight
} from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
}

const tourSteps = [
  {
    id: 1,
    title: 'مرحباً بك في منصة بذرة',
    subtitle: 'منصة التمويل الجماعي الرائدة في المملكة',
    description: 'نجمع بين التمويل الجماعي والتواصل الاجتماعي الاحترافي مع ذكاء اصطناعي متقدم',
    icon: Sparkles,
    gradient: 'from-teal-600 to-cyan-600',
    features: [
      'تمويل جماعي احترافي',
      'تواصل اجتماعي فاخر',
      'تقييم ذكي بالـ AI',
      'بوابة تفاوض متقدمة'
    ]
  },
  {
    id: 2,
    title: 'كيف تعمل المنصة؟',
    subtitle: 'رحلة سلسة من الفكرة إلى النجاح',
    description: 'نوفر لك بيئة متكاملة لتحويل أفكارك إلى مشاريع ناجحة',
    icon: Target,
    gradient: 'from-purple-600 to-pink-600',
    steps: [
      { icon: Rocket, text: 'ارفع مشروعك', desc: 'اختر باقة وأنشئ صفحة مشروعك' },
      { icon: Star, text: 'احصل على تقييم AI', desc: 'تقييم ذكي شامل لمشروعك' },
      { icon: Users, text: 'اجذب الداعمين', desc: 'عرض باقات دعم جذابة' },
      { icon: TrendingUp, text: 'ابدأ التفاوض', desc: 'تفاوض مع المستثمرين' }
    ]
  },
  {
    id: 3,
    title: 'المزايا الرئيسية',
    subtitle: 'تجربة عالمية فاخرة',
    description: 'نقدم لك أدوات احترافية لنجاح مشروعك',
    icon: Award,
    gradient: 'from-orange-600 to-red-600',
    features: [
      {
        icon: Zap,
        title: 'تقييم بالذكاء الاصطناعي',
        desc: 'تقييم شامل ومفصل لمشروعك باستخدام GPT-4'
      },
      {
        icon: Shield,
        title: 'بوابة التفاوض',
        desc: 'نظام تفاوض ذكي بين المستثمرين وأصحاب المشاريع'
      },
      {
        icon: Heart,
        title: 'باقات الدعم',
        desc: 'أنشئ باقات دعم جذابة لمشروعك'
      },
      {
        icon: Users,
        title: 'مجتمع تفاعلي',
        desc: 'تواصل مع المستثمرين ورواد الأعمال'
      }
    ]
  },
  {
    id: 4,
    title: 'جاهز للبدء؟',
    subtitle: 'ابدأ رحلتك الآن',
    description: 'انضم إلى آلاف رواد الأعمال والمستثمرين',
    icon: CheckCircle2,
    gradient: 'from-green-600 to-teal-600',
    cta: true
  }
];

export default function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  const step = tourSteps[currentStep];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onComplete();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${step.gradient} p-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          <button
            onClick={skipTour}
            className="absolute top-4 left-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4"
            >
              <Icon className="w-10 h-10" />
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
            <p className="text-xl opacity-90">{step.subtitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <p className="text-lg text-gray-600 text-center mb-8">
                {step.description}
              </p>

              {/* Step 1: Features List */}
              {step.id === 1 && step.features && (
                <div className="grid grid-cols-2 gap-4">
                  {step.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl"
                    >
                      <CheckCircle2 className="w-6 h-6 text-teal-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 2: Process Steps */}
              {step.id === 2 && step.steps && (
                <div className="space-y-4">
                  {step.steps.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="flex items-start gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <item.icon className="w-5 h-5 text-purple-600" />
                          <h4 className="font-bold text-gray-900">{item.text}</h4>
                        </div>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 3: Features Grid */}
              {step.id === 3 && step.features && (
                <div className="grid grid-cols-2 gap-6">
                  {step.features.map((feature: any, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl hover:shadow-xl transition-all"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-white mb-4">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Step 4: CTA */}
              {step.id === 4 && (
                <div className="text-center space-y-6">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                      <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
                      <div className="text-gray-600">مشروع ممول</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                      <div className="text-4xl font-bold text-green-600 mb-2">5000+</div>
                      <div className="text-gray-600">مستخدم نشط</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl">
                      <div className="text-4xl font-bold text-green-600 mb-2">50M+</div>
                      <div className="text-gray-600">ريال تمويل</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onComplete}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
                  >
                    ابدأ الآن
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex gap-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-teal-600 to-purple-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                السابق
              </button>
            )}
            
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-gradient-to-r from-teal-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              {currentStep === tourSteps.length - 1 ? 'ابدأ' : 'التالي'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

