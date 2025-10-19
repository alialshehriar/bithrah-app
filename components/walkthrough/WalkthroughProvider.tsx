'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket, Users, Lightbulb, Crown, Trophy, Wallet,
  Shield, X, ArrowRight, ArrowLeft, Check, Sparkles
} from 'lucide-react';

interface WalkthroughContextType {
  isActive: boolean;
  currentStep: number;
  startWalkthrough: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipWalkthrough: () => void;
  completeWalkthrough: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(undefined);

export const useWalkthrough = () => {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within WalkthroughProvider');
  }
  return context;
};

const walkthroughSteps = [
  {
    id: 'welcome',
    title: 'مرحباً بك في تجربة بذرة التفاعلية!',
    description: 'هذه نسخة ديمو تساعدك تفهم المنصة قبل الإطلاق الرسمي. تم إضافة رصيد تجريبي 100,000 ريال لمحفظتك لتجربة دعم المشاريع والتفاوض والاشتراكات. جميع العمليات تجريبية وليست مالية فعلية.',
    icon: Sparkles,
    color: 'from-purple-600 to-teal-600',
    position: 'center'
  },
  {
    id: 'projects',
    title: 'استكشف المشاريع',
    description: 'تصفح المشاريع الريادية، ادعم الأفكار التي تؤمن بها، واختر باقات الدعم المناسبة. يمكنك أيضاً فتح باب التفاوض مع أصحاب المشاريع.',
    icon: Rocket,
    color: 'from-blue-600 to-purple-600',
    position: 'center'
  },
  {
    id: 'evaluate',
    title: 'قيّم أفكارك بالذكاء الاصطناعي',
    description: 'احصل على تقييم احترافي لفكرتك بواسطة الذكاء الاصطناعي. يحلل النظام فكرتك في 5 محاور رئيسية ويقدم توصيات مفصلة.',
    icon: Lightbulb,
    color: 'from-amber-600 to-orange-600',
    position: 'center'
  },
  {
    id: 'communities',
    title: 'انضم للمجتمعات',
    description: 'شارك في مجتمعات بذرة، تبادل الخبرات، وتعلم من رواد الأعمال الآخرين. المجتمعات الذهبية متاحة للمشتركين.',
    icon: Users,
    color: 'from-teal-600 to-green-600',
    position: 'center'
  },
  {
    id: 'subscriptions',
    title: 'اختر باقة الاشتراك المناسبة',
    description: 'احصل على مزايا حصرية مع باقات الاشتراك (فضي، ذهبي، بلاتيني). إشعارات مبكرة، تحليلات AI، وخصومات على رسوم التفاوض.',
    icon: Crown,
    color: 'from-amber-500 to-yellow-600',
    position: 'center'
  },
  {
    id: 'wallet',
    title: 'محفظتك التجريبية',
    description: 'تم إضافة 100,000 ريال تجريبي لمحفظتك. استخدمها لتجربة جميع ميزات المنصة. جميع المبالغ تُسترد تلقائياً.',
    icon: Wallet,
    color: 'from-green-600 to-teal-600',
    position: 'center'
  },
  {
    id: 'protection',
    title: 'حماية الملكية الفكرية',
    description: 'أفكارك محمية بنظام ذكي يضمن سريتها. جميع المشاريع مسجلة زمنياً ومحفوظة في قاعدة بيانات مشفرة.',
    icon: Shield,
    color: 'from-indigo-600 to-purple-600',
    position: 'center'
  },
  {
    id: 'leaderboard',
    title: 'تنافس واربح',
    description: 'اكسب نقاط من خلال نشاطك، وارتقِ في لوحة الصدارة، واحصل على مكافآت حصرية. المنصة مصممة لتكون ممتعة وتنافسية.',
    icon: Trophy,
    color: 'from-orange-600 to-red-600',
    position: 'center'
  }
];

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenWalkthrough, setHasSeenWalkthrough] = useState(false);

  useEffect(() => {
    // Check if user has seen the walkthrough
    const seen = localStorage.getItem('bithrah_walkthrough_seen');
    if (!seen) {
      // Show walkthrough after a short delay
      setTimeout(() => {
        setIsActive(true);
      }, 1000);
    } else {
      setHasSeenWalkthrough(true);
    }
  }, []);

  const startWalkthrough = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeWalkthrough();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipWalkthrough = () => {
    setIsActive(false);
    localStorage.setItem('bithrah_walkthrough_seen', 'true');
    setHasSeenWalkthrough(true);
  };

  const completeWalkthrough = () => {
    setIsActive(false);
    localStorage.setItem('bithrah_walkthrough_seen', 'true');
    setHasSeenWalkthrough(true);
  };

  const step = walkthroughSteps[currentStep];
  const Icon = step?.icon;

  return (
    <WalkthroughContext.Provider
      value={{
        isActive,
        currentStep,
        startWalkthrough,
        nextStep,
        prevStep,
        skipWalkthrough,
        completeWalkthrough
      }}
    >
      {children}

      <AnimatePresence>
        {isActive && step && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
              onClick={skipWalkthrough}
            />

            {/* Walkthrough Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-2xl"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${step.color} p-8 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('/patterns/dots.svg')]"></div>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        {Icon && <Icon size={32} />}
                      </div>
                      <button
                        onClick={skipWalkthrough}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                    <p className="text-white/90 text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-6">
                  <div className="flex items-center gap-2">
                    {walkthroughSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          index <= currentStep
                            ? 'bg-gradient-to-r from-purple-600 to-teal-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                    <span>الخطوة {currentStep + 1} من {walkthroughSteps.length}</span>
                    <span>{Math.round(((currentStep + 1) / walkthroughSteps.length) * 100)}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-8 flex items-center justify-between gap-4">
                  <button
                    onClick={skipWalkthrough}
                    className="px-6 py-3 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
                  >
                    تخطي الجولة
                  </button>

                  <div className="flex items-center gap-3">
                    {currentStep > 0 && (
                      <button
                        onClick={prevStep}
                        className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                      >
                        <ArrowRight size={20} className="text-gray-700" />
                      </button>
                    )}
                    <button
                      onClick={nextStep}
                      className={`px-8 py-3 bg-gradient-to-r ${step.color} text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all`}
                    >
                      {currentStep === walkthroughSteps.length - 1 ? (
                        <>
                          <Check size={20} />
                          <span>ابدأ التجربة</span>
                        </>
                      ) : (
                        <>
                          <span>التالي</span>
                          <ArrowLeft size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </WalkthroughContext.Provider>
  );
}

