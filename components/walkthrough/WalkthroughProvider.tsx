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
    color: 'from-purple-600 via-fuchsia-600 to-pink-600',
    position: 'center'
  },
  {
    id: 'projects',
    title: 'استكشف المشاريع',
    description: 'تصفح المشاريع الريادية، ادعم الأفكار التي تؤمن بها، واختر باقات الدعم المناسبة. يمكنك أيضاً فتح باب التفاوض مع أصحاب المشاريع.',
    icon: Rocket,
    color: 'from-blue-600 via-indigo-600 to-purple-600',
    position: 'center'
  },
  {
    id: 'evaluate',
    title: 'قيّم أفكارك بالذكاء الاصطناعي',
    description: 'احصل على تقييم احترافي لفكرتك بواسطة الذكاء الاصطناعي. يحلل النظام فكرتك في 5 محاور رئيسية ويقدم توصيات مفصلة.',
    icon: Lightbulb,
    color: 'from-amber-500 via-orange-500 to-red-500',
    position: 'center'
  },
  {
    id: 'communities',
    title: 'انضم للمجتمعات',
    description: 'شارك في مجتمعات بذرة، تبادل الخبرات، وتعلم من رواد الأعمال الآخرين. المجتمعات الذهبية متاحة للمشتركين.',
    icon: Users,
    color: 'from-emerald-600 via-teal-600 to-cyan-600',
    position: 'center'
  },
  {
    id: 'subscriptions',
    title: 'اختر باقة الاشتراك المناسبة',
    description: 'احصل على مزايا حصرية مع باقات الاشتراك (فضي، ذهبي، بلاتيني). إشعارات مبكرة، تحليلات AI، وخصومات على رسوم التفاوض.',
    icon: Crown,
    color: 'from-yellow-500 via-amber-500 to-orange-500',
    position: 'center'
  },
  {
    id: 'wallet',
    title: 'محفظتك التجريبية',
    description: 'تم إضافة 100,000 ريال تجريبي لمحفظتك. استخدمها لتجربة جميع ميزات المنصة. جميع المبالغ تُسترد تلقائياً.',
    icon: Wallet,
    color: 'from-green-600 via-emerald-600 to-teal-600',
    position: 'center'
  },
  {
    id: 'protection',
    title: 'حماية الملكية الفكرية',
    description: 'أفكارك محمية بنظام ذكي يضمن سريتها. جميع المشاريع مسجلة زمنياً ومحفوظة في قاعدة بيانات مشفرة.',
    icon: Shield,
    color: 'from-indigo-600 via-purple-600 to-pink-600',
    position: 'center'
  },
  {
    id: 'leaderboard',
    title: 'تنافس واربح',
    description: 'اكسب نقاط من خلال نشاطك، وارتقِ في لوحة الصدارة، واحصل على مكافآت حصرية. المنصة مصممة لتكون ممتعة وتنافسية.',
    icon: Trophy,
    color: 'from-orange-600 via-red-600 to-pink-600',
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
            {/* Luxury Overlay with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70 backdrop-blur-md z-[9998]"
              onClick={skipWalkthrough}
            />

            {/* Luxury Walkthrough Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ 
                type: 'spring', 
                damping: 20, 
                stiffness: 200,
                duration: 0.5
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[92%] max-w-3xl"
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${step.color} blur-3xl opacity-40 rounded-[3rem]`} />
              
              <div className="relative bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)] overflow-hidden border border-white/20">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <motion.div
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3), transparent 50%)',
                      backgroundSize: '200% 200%',
                    }}
                  />
                </div>

                {/* Luxury Header with Gradient */}
                <div className={`relative bg-gradient-to-br ${step.color} p-10 text-white overflow-hidden`}>
                  {/* Animated Orbs */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl"
                  />
                  <motion.div
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      {/* Icon with Luxury Animation */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: 'spring',
                          damping: 15,
                          delay: 0.2
                        }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl" />
                        <div className="relative w-20 h-20 bg-white/25 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
                          {Icon && (
                            <motion.div
                              animate={{
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <Icon size={40} strokeWidth={2.5} />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>

                      {/* Close Button */}
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={skipWalkthrough}
                        className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all shadow-lg border border-white/30"
                      >
                        <X size={22} strokeWidth={2.5} />
                      </motion.button>
                    </div>

                    {/* Title with Animation */}
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl md:text-4xl font-black mb-4 leading-tight drop-shadow-lg"
                    >
                      {step.title}
                    </motion.h2>

                    {/* Description with Animation */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/95 text-lg md:text-xl leading-relaxed font-medium drop-shadow-md"
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </div>

                {/* Luxury Progress Section */}
                <div className="px-10 pt-8 pb-6 bg-gradient-to-b from-gray-50/50 to-white/50">
                  <div className="flex items-center gap-2.5 mb-4">
                    {walkthroughSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="h-2.5 flex-1 rounded-full overflow-hidden bg-gray-200/80 shadow-inner"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: index <= currentStep ? '100%' : '0%'
                          }}
                          transition={{ 
                            duration: 0.5,
                            ease: 'easeOut'
                          }}
                          className={`h-full bg-gradient-to-r ${step.color} shadow-lg`}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-gray-700">
                      الخطوة {currentStep + 1} من {walkthroughSteps.length}
                    </span>
                    <span className={`bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {Math.round(((currentStep + 1) / walkthroughSteps.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Luxury Actions */}
                <div className="p-10 pt-6 flex items-center justify-between gap-6 bg-white/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={skipWalkthrough}
                    className="px-6 py-3.5 text-gray-600 hover:text-gray-900 font-bold transition-all hover:bg-gray-100/50 rounded-xl"
                  >
                    تخطي الجولة
                  </motion.button>

                  <div className="flex items-center gap-4">
                    {currentStep > 0 && (
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevStep}
                        className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-xl border border-gray-300/50"
                      >
                        <ArrowRight size={24} className="text-gray-700" strokeWidth={2.5} />
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      className={`relative px-10 py-4 bg-gradient-to-r ${step.color} text-white rounded-2xl font-black text-lg flex items-center gap-3 shadow-2xl hover:shadow-3xl transition-all overflow-hidden group`}
                    >
                      {/* Button Shine Effect */}
                      <motion.div
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                      
                      {currentStep === walkthroughSteps.length - 1 ? (
                        <>
                          <Check size={24} strokeWidth={3} />
                          <span>ابدأ التجربة</span>
                        </>
                      ) : (
                        <>
                          <span>التالي</span>
                          <ArrowLeft size={24} strokeWidth={3} />
                        </>
                      )}
                    </motion.button>
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

