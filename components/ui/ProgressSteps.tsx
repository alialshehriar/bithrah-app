import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 right-0 left-0 h-1 bg-gray-200 -z-10">
          <motion.div
            initial={{ width: '0%' }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] rounded-full"
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isUpcoming = currentStep < step.number;

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                className="relative"
              >
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                    transition-all duration-300 relative z-10
                    ${
                      isCompleted
                        ? 'bg-gradient-to-r from-[#14B8A6] to-[#8B5CF6] text-white shadow-lg'
                        : isCurrent
                        ? 'bg-white border-4 border-[#14B8A6] text-[#14B8A6] shadow-lg'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>

                {/* Pulse Effect for Current Step */}
                {isCurrent && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    className="absolute inset-0 rounded-full bg-[#14B8A6]"
                  />
                )}
              </motion.div>

              {/* Step Info */}
              <div className="mt-3 text-center">
                <div
                  className={`
                    font-bold text-sm mb-1 transition-colors
                    ${
                      isCompleted || isCurrent
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div
                    className={`
                      text-xs transition-colors
                      ${
                        isCompleted || isCurrent
                          ? 'text-gray-600'
                          : 'text-gray-400'
                      }
                    `}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

