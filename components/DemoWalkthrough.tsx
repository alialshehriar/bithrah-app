'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { DEMO_CONFIG } from '@/lib/demo/config';

interface DemoWalkthroughProps {
  userId?: number;
  onComplete?: () => void;
}

export default function DemoWalkthrough({ userId, onComplete }: DemoWalkthroughProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const steps = DEMO_CONFIG.WALKTHROUGH.STEPS;

  useEffect(() => {
    // تحميل حالة الجولة التعريفية من الخادم
    const checkWalkthroughStatus = async () => {
      try {
        const res = await fetch('/api/user/walkthrough');
        const data = await res.json();
        
        if (data.success && !data.completed) {
          // إظهار الجولة بعد تحميل الصفحة بثانية واحدة لتجنب الكراش
          setTimeout(() => {
            setIsVisible(true);
            setCurrentStep(data.step || 0);
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking walkthrough status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      checkWalkthroughStatus();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // حفظ التقدم
      await saveProgress(nextStep);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await handleComplete();
  };

  const handleComplete = async () => {
    try {
      await fetch('/api/user/walkthrough', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      });
      
      setIsVisible(false);
      onComplete?.();
    } catch (error) {
      console.error('Error completing walkthrough:', error);
    }
  };

  const saveProgress = async (step: number) => {
    try {
      await fetch('/api/user/walkthrough', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  if (isLoading || !isVisible) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">جولة تعريفية</h2>
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="تخطي"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2 text-sm">
            <span>الخطوة {currentStep + 1} من {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {currentStep === 0 && '🌱'}
              {currentStep === 1 && '🚀'}
              {currentStep === 2 && '👥'}
              {currentStep === 3 && '🤖'}
              {currentStep === 4 && '💰'}
              {currentStep === 5 && '⭐'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Demo Mode Notice */}
          {currentStep === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm text-center">
                <strong>ملاحظة:</strong> هذه نسخة تجريبية كاملة تتيح لك تجربة بذرة قبل الإطلاق.
                جميع المعاملات هنا افتراضية ولا تُخصم فعليًا.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
              <span>السابق</span>
            </button>

            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'bg-teal-500 w-8'
                      : index < currentStep
                      ? 'bg-teal-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <span>التالي</span>
                <ChevronLeft size={20} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Check size={20} />
                <span>إنهاء</span>
              </button>
            )}
          </div>

          {/* Skip Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
            >
              تخطي الجولة التعريفية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

