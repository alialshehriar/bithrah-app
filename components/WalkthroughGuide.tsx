'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Sparkles, Rocket, Wallet, Users, TrendingUp } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: 'مرحباً بك في بذرة',
    description: 'منصة متكاملة لدعم المشاريع الناشئة وربط رواد الأعمال بالمستثمرين. استكشف عالماً من الفرص والابتكار.',
    icon: <Sparkles className="w-12 h-12" />,
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 2,
    title: 'رصيدك التجريبي',
    description: 'حصلت على 100,000 ريال رصيد تجريبي! استخدمه لتجربة جميع ميزات المنصة: دعم المشاريع، التفاوض، والاشتراكات.',
    icon: <Wallet className="w-12 h-12" />,
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 3,
    title: 'اكتشف المشاريع',
    description: 'تصفح مئات المشاريع الناشئة في مختلف المجالات. ادعم المشاريع التي تؤمن بها وكن جزءاً من نجاحها.',
    icon: <Rocket className="w-12 h-12" />,
    gradient: 'from-orange-500 to-red-600'
  },
  {
    id: 4,
    title: 'انضم للمجتمع',
    description: 'تواصل مع رواد الأعمال والمستثمرين. شارك أفكارك، تعلم من الخبراء، وابنِ شبكة علاقات قوية.',
    icon: <Users className="w-12 h-12" />,
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 5,
    title: 'ابدأ رحلتك',
    description: 'جاهز للانطلاق؟ استكشف المشاريع، قيّم الأفكار، وابدأ في بناء مستقبلك الريادي الآن!',
    icon: <TrendingUp className="w-12 h-12" />,
    gradient: 'from-green-500 to-emerald-600'
  }
];

export default function WalkthroughGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed walkthrough
    const completed = localStorage.getItem('walkthrough_completed');
    if (!completed) {
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('walkthrough_completed', 'true');
    setIsOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem('walkthrough_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleSkip}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative max-w-2xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${step.gradient} p-12 text-white text-center relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
              <motion.div
                key={step.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="relative z-10 mb-6 inline-block"
              >
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
                  {step.icon}
                </div>
              </motion.div>

              <motion.h2
                key={`title-${step.id}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-4 relative z-10"
              >
                {step.title}
              </motion.h2>

              <motion.p
                key={`desc-${step.id}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-white/90 relative z-10 max-w-xl mx-auto"
              >
                {step.description}
              </motion.p>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center gap-2 py-6 bg-gray-50">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-gradient-to-r ' + step.gradient
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="p-6 flex items-center justify-between bg-white">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>

              <span className="text-sm text-gray-500 font-medium">
                {currentStep + 1} من {steps.length}
              </span>

              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 bg-gradient-to-r ${step.gradient}`}
              >
                {currentStep === steps.length - 1 ? 'ابدأ الآن' : 'التالي'}
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              تخطي الجولة
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

