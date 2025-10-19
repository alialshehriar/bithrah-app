import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  required?: boolean;
  icon?: React.ReactNode;
  charCount?: {
    current: number;
    max: number;
  };
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, hint, required, icon, className = '', ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              ${icon ? 'pr-12' : ''}
              ${
                hasError
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : hasSuccess
                  ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                  : 'border-gray-200 bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10'
              }
              outline-none font-medium text-gray-900 placeholder:text-gray-400
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
            }
            {...props}
          />

          {/* Status Icon */}
          <AnimatePresence>
            {(hasError || hasSuccess) && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                {hasError ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id={`${props.id}-error`}
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.p>
          )}
          {success && !error && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-sm text-green-600 flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              {success}
            </motion.p>
          )}
          {hint && !error && !success && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id={`${props.id}-hint`}
              className="mt-2 text-sm text-gray-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, success, hint, required, charCount, className = '', ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-gray-700">
              {label}
              {required && <span className="text-red-500 mr-1">*</span>}
            </label>
            {charCount && (
              <span
                className={`text-xs font-medium ${
                  charCount.current > charCount.max
                    ? 'text-red-500'
                    : charCount.current > charCount.max * 0.9
                    ? 'text-yellow-500'
                    : 'text-gray-500'
                }`}
              >
                {charCount.current} / {charCount.max}
              </span>
            )}
          </div>
        )}

        {/* Textarea Container */}
        <div className="relative">
          <textarea
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
              ${
                hasError
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                  : hasSuccess
                  ? 'border-green-300 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                  : 'border-gray-200 bg-white focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10'
              }
              outline-none font-medium text-gray-900 placeholder:text-gray-400
              disabled:bg-gray-100 disabled:cursor-not-allowed
              resize-none
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined
            }
            {...props}
          />

          {/* Status Icon */}
          <AnimatePresence>
            {(hasError || hasSuccess) && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute left-3 top-3"
              >
                {hasError ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id={`${props.id}-error`}
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.p>
          )}
          {success && !error && (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 text-sm text-green-600 flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" />
              {success}
            </motion.p>
          )}
          {hint && !error && !success && (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              id={`${props.id}-hint`}
              className="mt-2 text-sm text-gray-500"
            >
              {hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

