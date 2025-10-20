'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'projects',
    title: 'استكشف المشاريع',
    description: 'تصفح المشاريع الريادية، ادعم الأفكار التي تؤمن بها، واختر باقات الدعم المناسبة. يمكنك أيضاً فتح باب التفاوض مع أصحاب المشاريع.',
    icon: Rocket,
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 'evaluate',
    title: 'قيّم أفكارك بالذكاء الاصطناعي',
    description: 'احصل على تقييم احترافي لفكرتك بواسطة الذكاء الاصطناعي. يحلل النظام فكرتك في 5 محاور رئيسية ويقدم توصيات مفصلة.',
    icon: Lightbulb,
    color: 'from-amber-500 to-red-500',
  },
  {
    id: 'communities',
    title: 'انضم للمجتمعات',
    description: 'شارك في مجتمعات بذرة، تبادل الخبرات، وتعلم من رواد الأعمال الآخرين. المجتمعات الذهبية متاحة للمشتركين.',
    icon: Users,
    color: 'from-emerald-600 to-cyan-600',
  },
  {
    id: 'subscriptions',
    title: 'اختر باقة الاشتراك المناسبة',
    description: 'احصل على مزايا حصرية مع باقات الاشتراك (فضي، ذهبي، بلاتيني). إشعارات مبكرة، تحليلات AI، وخصومات على رسوم التفاوض.',
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'wallet',
    title: 'محفظتك التجريبية',
    description: 'تم إضافة 100,000 ريال تجريبي لمحفظتك. استخدمها لتجربة جميع ميزات المنصة. جميع المبالغ تُسترد تلقائياً.',
    icon: Wallet,
    color: 'from-green-600 to-teal-600',
  },
  {
    id: 'protection',
    title: 'حماية الملكية الفكرية',
    description: 'أفكارك محمية بنظام ذكي يضمن سريتها. جميع المشاريع مسجلة زمنياً ومحفوظة في قاعدة بيانات مشفرة.',
    icon: Shield,
    color: 'from-indigo-600 to-purple-600',
  },
  {
    id: 'leaderboard',
    title: 'تنافس واربح',
    description: 'اكسب نقاط من خلال نشاطك، وارتقِ في لوحة الصدارة، واحصل على مكافآت حصرية. المنصة مصممة لتكون ممتعة وتنافسية.',
    icon: Trophy,
    color: 'from-orange-600 to-pink-600',
  }
];

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if user has seen the walkthrough
    try {
      const seen = localStorage.getItem('bithrah_walkthrough_seen');
      if (!seen) {
        // Show walkthrough after a short delay
        const timer = setTimeout(() => {
          setIsActive(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, [mounted]);

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
    try {
      localStorage.setItem('bithrah_walkthrough_seen', 'true');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const completeWalkthrough = () => {
    setIsActive(false);
    try {
      localStorage.setItem('bithrah_walkthrough_seen', 'true');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const step = walkthroughSteps[currentStep];
  const Icon = step?.icon;
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100;

  // Don't render anything until mounted (avoid SSR issues)
  if (!mounted) {
    return <>{children}</>;
  }

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

      {/* Simple Walkthrough Modal - No heavy animations */}
      {isActive && step && (
        <>
          {/* Simple Overlay */}
          <div
            className="fixed inset-0 bg-black/60 z-[9998] transition-opacity duration-300"
            onClick={skipWalkthrough}
            style={{ opacity: isActive ? 1 : 0 }}
          />

          {/* Walkthrough Card */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-4">
            <div className="w-full max-w-2xl">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Progress Bar */}
                <div className="h-2 bg-gray-200">
                  <div
                    className={`h-full bg-gradient-to-r ${step.color} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Header */}
                <div className={`relative bg-gradient-to-r ${step.color} p-8 text-white`}>
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      {Icon && <Icon size={32} strokeWidth={2.5} />}
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={skipWalkthrough}
                      className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <X size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {step.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/90 text-base md:text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Footer Navigation */}
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    {/* Previous Button */}
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                        currentStep === 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ArrowRight size={20} />
                      السابق
                    </button>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2">
                      {walkthroughSteps.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStep(index)}
                          className={`h-2 rounded-full transition-all ${
                            index === currentStep
                              ? 'w-8 bg-gradient-to-r ' + step.color
                              : 'w-2 bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Next/Complete Button */}
                    <button
                      onClick={nextStep}
                      className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${step.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                    >
                      {currentStep === walkthroughSteps.length - 1 ? (
                        <>
                          <Check size={20} />
                          إنهاء
                        </>
                      ) : (
                        <>
                          التالي
                          <ArrowLeft size={20} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Counter */}
                  <div className="text-center mt-4 text-sm text-gray-500">
                    {currentStep + 1} من {walkthroughSteps.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </WalkthroughContext.Provider>
  );
}

