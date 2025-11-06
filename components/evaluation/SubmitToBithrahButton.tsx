'use client';

import { motion } from 'framer-motion';
import { Rocket, Lock, Sparkles } from 'lucide-react';

interface Props {
  ideaTitle: string;
  overallScore: number;
}

export default function SubmitToBithrahButton({ ideaTitle, overallScore }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative"
    >
      {/* Coming Soon Badge */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-6 py-2 rounded-full shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">قريباً</span>
          </div>
        </div>
      </div>

      {/* Main Button (Locked) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 border-4 border-dashed border-purple-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Side - Info */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  ارفع مشروعك على بذرة
                </h3>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                حوّل فكرتك إلى مشروع حقيقي واحصل على التمويل من المستثمرين
                <br />
                <span className="text-purple-600 font-semibold">
                  ابدأ رحلتك الريادية الآن!
                </span>
              </p>
            </div>

            {/* Right Side - Locked Button */}
            <div className="flex-shrink-0">
              <button
                disabled
                className="relative group cursor-not-allowed"
              >
                <div className="flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 font-bold rounded-2xl shadow-lg transition-all">
                  <Lock className="w-6 h-6" />
                  <span className="text-xl">مقفل مؤقتاً</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap">
                    سيتم تفعيل هذه الميزة قريباً
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-8 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">عرض احترافي</h4>
                <p className="text-sm text-gray-600">صفحة مشروع متكاملة بكل التفاصيل</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">وصول للمستثمرين</h4>
                <p className="text-sm text-gray-600">آلاف المستثمرين يبحثون عن أفكار</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">دعم ومتابعة</h4>
                <p className="text-sm text-gray-600">فريق بذرة يساعدك في كل خطوة</p>
              </div>
            </div>
          </div>

          {/* Score Badge (if high score) */}
          {overallScore >= 70 && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full border-2 border-green-300">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold">
                  فكرتك حصلت على {overallScore}% - مؤهلة للنشر! 🎉
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          💡 <span className="font-semibold">نصيحة:</span> احفظ نتائج التقييم، ستحتاجها عند تفعيل هذه الميزة
        </p>
      </div>
    </motion.div>
  );
}
