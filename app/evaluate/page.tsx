'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Zap, FileText, ArrowRight, Clock, CheckCircle
} from 'lucide-react';
import QuickEvaluationForm from '@/components/evaluation/QuickEvaluationForm';
import ExpandedIdeaReview from '@/components/evaluation/ExpandedIdeaReview';
import DetailedEvaluationForm from '@/components/evaluation/DetailedEvaluationForm';
import EvaluationResults from '@/components/evaluation/EvaluationResults';
import { ExpandedIdeaDetails } from '@/lib/ai/quickIdeaExpander';
import { IdeaEvaluation } from '@/lib/ai/ideaEvaluator';

type EvaluationMode = 'quick' | 'detailed' | null;
type QuickStep = 'form' | 'review' | 'results';
type DetailedStep = 'form' | 'results';

export default function EvaluatePage() {
  const [mode, setMode] = useState<EvaluationMode>(null);
  const [quickStep, setQuickStep] = useState<QuickStep>('form');
  const [detailedStep, setDetailedStep] = useState<DetailedStep>('form');
  const [expandedDetails, setExpandedDetails] = useState<ExpandedIdeaDetails | null>(null);
  const [evaluation, setEvaluation] = useState<IdeaEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Evaluation Handlers
  const handleQuickSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      // Call API to expand idea
      const response = await fetch('/api/evaluate/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setExpandedDetails(data.expandedDetails);
        setQuickStep('review');
      } else {
        throw new Error(data.error || 'Failed to expand idea');
      }
    } catch (error) {
      console.error('Quick evaluation error:', error);
      alert('حدث خطأ أثناء تحليل الفكرة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandedDetailsConfirm = async (details: ExpandedIdeaDetails) => {
    setIsLoading(true);
    try {
      // Call regular evaluation API with expanded details
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: details.title,
          category: 'general',
          description: details.description,
          problem: details.problem,
          solution: details.solution,
          targetMarket: details.targetMarket,
          competitiveAdvantage: details.competitiveAdvantage,
          businessModel: details.businessModel,
          fundingNeeded: details.estimatedFunding,
          timeline: details.timeframe,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.evaluation);
        setQuickStep('results');
      } else {
        throw new Error(data.error || 'Failed to evaluate idea');
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      alert('حدث خطأ أثناء التقييم. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // Detailed Evaluation Handlers
  const handleDetailedSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setEvaluation(data.evaluation);
        setDetailedStep('results');
      } else {
        throw new Error(data.error || 'Failed to evaluate idea');
      }
    } catch (error) {
      console.error('Detailed evaluation error:', error);
      alert('حدث خطأ أثناء التقييم. يرجى المحاولة مرة أخرى.');
    }
  };

  // Reset handlers
  const handleBackToModeSelection = () => {
    setMode(null);
    setQuickStep('form');
    setDetailedStep('form');
    setExpandedDetails(null);
    setEvaluation(null);
  };

  const handleBackToQuickForm = () => {
    setQuickStep('form');
    setExpandedDetails(null);
  };

  // Render based on mode and step
  if (mode === 'quick') {
    if (quickStep === 'form') {
      return (
        <QuickEvaluationForm
          onBack={handleBackToModeSelection}
          onSubmit={handleQuickSubmit}
        />
      );
    }
    
    if (quickStep === 'review' && expandedDetails) {
      return (
        <ExpandedIdeaReview
          expandedDetails={expandedDetails}
          onBack={handleBackToQuickForm}
          onConfirm={handleExpandedDetailsConfirm}
          loading={isLoading}
        />
      );
    }
    
    if (quickStep === 'results' && evaluation) {
      return (
        <EvaluationResults
          evaluation={evaluation}
          ideaTitle={expandedDetails?.title || 'فكرتك'}
          onBack={handleBackToModeSelection}
        />
      );
    }
  }

  if (mode === 'detailed') {
    if (detailedStep === 'form') {
      return (
        <DetailedEvaluationForm
          onBack={handleBackToModeSelection}
          onSubmit={handleDetailedSubmit}
        />
      );
    }
    
    if (detailedStep === 'results' && evaluation) {
      return (
        <EvaluationResults
          evaluation={evaluation}
          ideaTitle="فكرتك"
          onBack={handleBackToModeSelection}
        />
      );
    }
  }

  // Mode Selection Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-3xl mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            تقييم الفكرة بالذكاء الاصطناعي
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على تقييم شامل ودقيق لفكرتك الاستثمارية
            <br />
            <span className="text-purple-600 font-semibold">مدعوم بتقنية GPT-4 من OpenAI</span>
          </p>
        </motion.div>

        {/* Mode Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Quick Evaluation Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
              الأسرع ⚡
            </div>
            
            <button
              onClick={() => setMode('quick')}
              className="w-full h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-right border-4 border-transparent hover:border-purple-200"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                تقييم سريع
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                عندك فكرة بسيطة؟ <span className="font-bold text-purple-600">احنا نكمل الباقي!</span>
                <br />
                الذكاء الاصطناعي يحلل فكرتك ويطورها ويعطيك تقييم شامل
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>3-4 أسئلة بسيطة فقط</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>AI يكمل التفاصيل تلقائياً</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>تقييم شامل مع حلول عملية</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-purple-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">2 دقيقة فقط</span>
                </div>
                <div className="flex items-center gap-2 text-purple-600 font-bold">
                  <span>ابدأ الآن</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Detailed Evaluation Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
              الأدق 🎯
            </div>
            
            <button
              onClick={() => setMode('detailed')}
              className="w-full h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 text-right border-4 border-transparent hover:border-cyan-200"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                تقييم تفصيلي
              </h2>

              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                عندك تفاصيل كاملة عن فكرتك؟
                <br />
                احصل على <span className="font-bold text-cyan-600">تقييم دقيق ومفصل</span> من 6 خبراء افتراضيين
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>نموذج تفصيلي شامل</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>تحليل من 6 منظورات مختلفة</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>توصيات استراتيجية متقدمة</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-cyan-600">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">5-7 دقائق</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-600 font-bold">
                  <span>ابدأ الآن</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-3xl mx-auto shadow-lg">
            <p className="text-gray-700 text-lg">
              <span className="font-bold text-purple-600">💡 نصيحة:</span>
              {' '}
              إذا كانت فكرتك لا تزال في مرحلة مبكرة، اختر <span className="font-bold">التقييم السريع</span>.
              <br />
              إذا كنت قد أعددت دراسة أولية، اختر <span className="font-bold">التقييم التفصيلي</span> للحصول على تحليل أعمق.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
