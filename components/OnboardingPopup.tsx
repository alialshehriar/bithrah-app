'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft,
  Check
} from 'lucide-react';

interface OnboardingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { username: string; interests: string[] }) => void;
}

const steps = [
  {
    id: 1,
    title: 'مرحباً بك في بذرة',
    description: 'منصة تربط أصحاب الأفكار الإبداعية بالمستثمرين والداعمين لتحويل الأحلام إلى واقع',
    icon: Sparkles,
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 2,
    title: 'كيف تعمل المنصة؟',
    description: 'شارك أفكارك ومشاريعك، احصل على تقييم بالذكاء الاصطناعي، واجذب المستثمرين والداعمين لتمويل مشروعك',
    icon: Lightbulb,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 3,
    title: 'انضم للمجتمع',
    description: 'تفاعل مع رواد الأعمال والمستثمرين، شارك في المناقشات، وابنِ شبكة علاقات قوية',
    icon: Users,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 4,
    title: 'تنافس واربح',
    description: 'اكسب نقاطاً، ارتقِ في المستويات، وتصدّر لوحة الصدارة من خلال نشاطك وإنجازاتك',
    icon: TrendingUp,
    color: 'from-teal-500 to-purple-600',
  },
];

const interests = [
  'التقنية',
  'الصحة',
  'التعليم',
  'التجارة الإلكترونية',
  'الطاقة المتجددة',
  'الذكاء الاصطناعي',
  'التمويل',
  'العقارات',
  'الترفيه',
  'الأغذية والمشروبات',
  'الموضة',
  'السياحة',
];

export default function OnboardingPopup({ isOpen, onClose, onComplete }: OnboardingPopupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState('');

  const isWelcomeSteps = currentStep < steps.length;
  const isUsernameStep = currentStep === steps.length;
  const isInterestsStep = currentStep === steps.length + 1;

  const handleNext = () => {
    if (isUsernameStep) {
      // Validate username
      if (!username.trim()) {
        setUsernameError('يرجى إدخال اسم المستخدم');
        return;
      }
      if (username.length < 3) {
        setUsernameError('يجب أن يكون اسم المستخدم 3 أحرف على الأقل');
        return;
      }
      setUsernameError('');
    }

    if (isInterestsStep) {
      // Complete onboarding
      onComplete({ username, interests: selectedInterests });
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUsernameError('');
    }
  };

  const handleSkip = () => {
    onComplete({ username: '', interests: [] });
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="relative p-6 border-b border-gray-100">
                <button
                  onClick={onClose}
                  className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex gap-1">
                    {[...Array(steps.length + 2)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          index <= currentStep
                            ? 'bg-gradient-to-r from-teal-500 to-purple-600'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    الخطوة {currentStep + 1} من {steps.length + 2}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {isWelcomeSteps && (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-block mb-6"
                      >
                        <div className={`w-24 h-24 bg-gradient-to-br ${steps[currentStep].color} rounded-3xl flex items-center justify-center mx-auto shadow-lg`}>
                          {steps[currentStep].icon && (
                            <steps[currentStep].icon className="w-12 h-12 text-white" />
                          )}
                        </div>
                      </motion.div>

                      {/* Title */}
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {steps[currentStep].title}
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
                        {steps[currentStep].description}
                      </p>
                    </motion.div>
                  )}

                  {isUsernameStep && (
                    <motion.div
                      key="username"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-md mx-auto"
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          اختر اسم المستخدم
                        </h2>
                        <p className="text-gray-600">
                          اختر اسماً فريداً يمثلك في المنصة
                        </p>
                      </div>

                      <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                          اسم المستخدم
                        </label>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setUsernameError('');
                          }}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-right"
                          placeholder="مثال: ahmed_ideas"
                          dir="ltr"
                        />
                        {usernameError && (
                          <p className="mt-2 text-sm text-red-600">{usernameError}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          يمكنك استخدام الحروف والأرقام والشرطة السفلية
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isInterestsStep && (
                    <motion.div
                      key="interests"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          ما هي اهتماماتك؟
                        </h2>
                        <p className="text-gray-600">
                          اختر المجالات التي تهمك (اختياري)
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                        {interests.map((interest) => (
                          <motion.button
                            key={interest}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleInterest(interest)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                              selectedInterests.includes(interest)
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className={`text-sm font-medium ${
                              selectedInterests.includes(interest)
                                ? 'text-teal-700'
                                : 'text-gray-700'
                            }`}>
                              {interest}
                            </span>
                            {selectedInterests.includes(interest) && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 left-2"
                              >
                                <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {currentStep > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>السابق</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {!isInterestsStep && (
                    <button
                      onClick={handleSkip}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      تخطي
                    </button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <span>{isInterestsStep ? 'ابدأ الآن' : 'التالي'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

