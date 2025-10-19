'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ArrowRight, ArrowLeft, Check, Sparkles, TrendingUp,
  Users, Award, Wallet, BarChart3, MessageSquare, Target
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image?: string;
  action?: {
    label: string;
    href: string;
  };
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'welcome',
    title: 'مرحباً بك في منصة بذرة',
    description: 'بيئة الوساطة الذكية الأولى في السعودية للتمويل الجماعي. نربط بين أصحاب المشاريع الواعدة والمستثمرين المهتمين.',
    icon: Sparkles,
  },
  {
    id: 'projects',
    title: 'استكشف المشاريع',
    description: 'تصفح مئات المشاريع الواعدة في مختلف المجالات. استثمر في المشاريع التي تؤمن بها وساهم في نجاحها.',
    icon: TrendingUp,
    action: {
      label: 'استكشف المشاريع',
      href: '/projects',
    },
  },
  {
    id: 'evaluate',
    title: 'قيّم فكرتك بالذكاء الاصطناعي',
    description: 'احصل على تقييم شامل ودقيق لفكرتك الاستثمارية مدعوم بتقنية GPT-4 من OpenAI. تحليل SWOT كامل وتوصيات عملية.',
    icon: Target,
    action: {
      label: 'قيّم فكرتك الآن',
      href: '/evaluate',
    },
  },
  {
    id: 'community',
    title: 'انضم للمجتمعات',
    description: 'تواصل مع رواد الأعمال والمستثمرين في مجتمعات متخصصة. شارك خبراتك واستفد من تجارب الآخرين.',
    icon: Users,
    action: {
      label: 'استكشف المجتمعات',
      href: '/communities',
    },
  },
  {
    id: 'wallet',
    title: 'محفظتك الرقمية',
    description: 'أدر أموالك بسهولة وأمان. تتبع استثماراتك، أرباحك، ومعاملاتك المالية في مكان واحد.',
    icon: Wallet,
    action: {
      label: 'افتح محفظتك',
      href: '/wallet',
    },
  },
  {
    id: 'leaderboard',
    title: 'تنافس واربح',
    description: 'اصعد في لوحة الصدارة واحصل على إنجازات حصرية. كل مشاركة ونشاط يقربك من القمة.',
    icon: Award,
    action: {
      label: 'شاهد لوحة الصدارة',
      href: '/leaderboard',
    },
  },
];

export default function Walkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(true);

  useEffect(() => {
    // Check if user has seen walkthrough before
    const seen = localStorage.getItem('hasSeenWalkthrough');
    if (!seen) {
      setHasSeenWalkthrough(false);
      // Show walkthrough after a short delay
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
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
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setHasSeenWalkthrough(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWalkthrough', 'true');
    setHasSeenWalkthrough(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const currentStepData = walkthroughSteps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100;

  return (
    <>
      {/* Trigger Button (for testing or re-showing) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 p-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          title="عرض الجولة التعريفية"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Walkthrough Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={handleSkip}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-600 to-teal-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={handleSkip}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Content */}
                <div className="p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      {/* Icon */}
                      <div className="inline-block mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-teal-100 rounded-3xl flex items-center justify-center">
                          <Icon className="w-12 h-12 text-purple-600" />
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {currentStepData.title}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        {currentStepData.description}
                      </p>

                      {/* Action Button (if available) */}
                      {currentStepData.action && (
                        <a
                          href={currentStepData.action.href}
                          onClick={handleComplete}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all mb-6"
                        >
                          {currentStepData.action.label}
                          <ArrowLeft className="w-5 h-5" />
                        </a>
                      )}

                      {/* Step Indicator */}
                      <div className="flex items-center justify-center gap-2 mt-8">
                        {walkthroughSteps.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentStep
                                ? 'w-8 bg-gradient-to-r from-purple-600 to-teal-600'
                                : 'w-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="px-12 pb-8 flex items-center justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      currentStep === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowRight className="w-5 h-5" />
                    السابق
                  </button>

                  <span className="text-sm text-gray-500">
                    {currentStep + 1} من {walkthroughSteps.length}
                  </span>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    {currentStep === walkthroughSteps.length - 1 ? (
                      <>
                        <Check className="w-5 h-5" />
                        إنهاء
                      </>
                    ) : (
                      <>
                        التالي
                        <ArrowLeft className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

