'use client';

import { motion } from 'framer-motion';
import {
  Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target,
  CheckCircle, XCircle, ArrowLeft, Award, Users, DollarSign,
  Clock, Rocket, BookOpen, Zap
} from 'lucide-react';
import SubmitToBithrahButton from './SubmitToBithrahButton';
import { IdeaEvaluation } from '@/lib/ai/ideaEvaluator';

interface Props {
  evaluation: IdeaEvaluation;
  ideaTitle: string;
  onBack: () => void;
}

export default function EvaluationResults({ evaluation, ideaTitle, onBack }: Props) {
  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
            className={`${
              score >= 80 ? 'text-green-500' :
              score >= 60 ? 'text-blue-500' :
              score >= 40 ? 'text-yellow-500' :
              'text-red-500'
            } transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{score}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">{label}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mb-6">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            نتائج التقييم 🎉
          </h1>
          <p className="text-xl text-gray-600">
            تحليل شامل لفكرتك من 6 خبراء افتراضيين
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">التقييم الإجمالي</h2>
            <div className="flex justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - evaluation.overallScore / 100)}`}
                    className={`${
                      evaluation.overallScore >= 80 ? 'text-green-500' :
                      evaluation.overallScore >= 60 ? 'text-blue-500' :
                      evaluation.overallScore >= 40 ? 'text-yellow-500' :
                      'text-red-500'
                    } transition-all duration-1000`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold">{evaluation.overallScore}</span>
                  <span className="text-sm text-gray-600">من 100</span>
                </div>
              </div>
            </div>
            {evaluation.successProbability && (
              <p className="text-lg text-gray-700 mb-4">
                <span className="font-bold">احتمالية النجاح:</span> {evaluation.successProbability}%
              </p>
            )}
            {evaluation.investmentRecommendation && (
              <div className={`inline-block px-6 py-3 rounded-full font-bold ${
                evaluation.investmentRecommendation.includes('موصى به') ? 'bg-green-100 text-green-800' :
                evaluation.investmentRecommendation.includes('محتمل') ? 'bg-blue-100 text-blue-800' :
                evaluation.investmentRecommendation.includes('تطوير') ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {evaluation.investmentRecommendation}
              </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">التقييمات التفصيلية</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <ScoreCircle score={evaluation.strategicAnalyst?.score || 70} label="الاستراتيجية" />
            <ScoreCircle score={evaluation.financialExpert?.score || 70} label="المالية" />
            <ScoreCircle score={evaluation.saudiMarketExpert?.score || 70} label="السوق السعودي" />
            <ScoreCircle score={evaluation.operationsManager?.score || 70} label="العمليات" />
            <ScoreCircle score={evaluation.marketingExpert?.score || 70} label="التسويق" />
            <ScoreCircle score={evaluation.riskAnalyst?.score || 70} label="المخاطر" />
          </div>
        </motion.div>

        {/* Practical Solutions */}
        {evaluation.practicalSolutions && evaluation.practicalSolutions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">حلول عملية لتطوير فكرتك</h2>
            </div>
            <div className="space-y-3">
              {evaluation.practicalSolutions.map((solution, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-800 flex-1">{solution}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Implementation Plan */}
        {evaluation.implementationPlan && evaluation.implementationPlan.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Rocket className="w-8 h-8 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-900">خطة التنفيذ المقترحة</h2>
            </div>
            <div className="space-y-6">
              {evaluation.implementationPlan.map((phase, index) => (
                <div key={index} className="border-r-4 border-purple-500 pr-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                      <p className="text-sm text-gray-600">المدة: {phase.duration}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mr-13">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">الأهداف:</h4>
                      <ul className="space-y-1">
                        {phase.objectives.map((obj, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <Target className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">المخرجات:</h4>
                      <ul className="space-y-1">
                        {phase.deliverables.map((del, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">الموارد:</h4>
                      <ul className="space-y-1">
                        {phase.resources.map((res, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <Zap className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Successful Examples */}
        {evaluation.successfulExamples && evaluation.successfulExamples.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">أمثلة ناجحة مشابهة</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluation.successfulExamples.map((example, index) => (
                <div key={index} className="p-6 bg-green-50 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{example.name}</h3>
                  <p className="text-sm text-gray-700 mb-3">{example.description}</p>
                  <p className="text-xs text-green-700 font-semibold">
                    <span className="font-bold">الصلة بفكرتك:</span> {example.relevance}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Immediate Actions */}
        {evaluation.immediateActions && evaluation.immediateActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">إجراءات فورية</h2>
            </div>
            <div className="space-y-3">
              {evaluation.immediateActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-800">{action}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit to Bithrah Button */}
        <SubmitToBithrahButton
          ideaTitle={ideaTitle}
          overallScore={evaluation.overallScore}
        />

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>تقييم فكرة جديدة</span>
          </button>
        </div>
      </div>
    </div>
  );
}
