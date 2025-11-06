'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Loader2, Edit3, Check,
  Lightbulb, Target, Users, TrendingUp, DollarSign, Clock
} from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { ExpandedIdeaDetails } from '@/lib/ai/quickIdeaExpander';

interface Props {
  expandedDetails: ExpandedIdeaDetails;
  onBack: () => void;
  onConfirm: (details: ExpandedIdeaDetails) => void;
  loading?: boolean;
}

export default function ExpandedIdeaReview({ 
  expandedDetails, 
  onBack, 
  onConfirm,
  loading = false 
}: Props) {
  const [details, setDetails] = useState<ExpandedIdeaDetails>(expandedDetails);
  const [editingField, setEditingField] = useState<string | null>(null);

  const fields = [
    {
      key: 'title',
      label: 'عنوان الفكرة',
      icon: Lightbulb,
      color: 'purple',
      type: 'input' as const,
    },
    {
      key: 'description',
      label: 'وصف الفكرة',
      icon: Sparkles,
      color: 'pink',
      type: 'textarea' as const,
    },
    {
      key: 'problem',
      label: 'المشكلة',
      icon: Target,
      color: 'red',
      type: 'textarea' as const,
    },
    {
      key: 'solution',
      label: 'الحل المقترح',
      icon: Check,
      color: 'green',
      type: 'textarea' as const,
    },
    {
      key: 'targetMarket',
      label: 'السوق المستهدف',
      icon: Users,
      color: 'blue',
      type: 'textarea' as const,
    },
    {
      key: 'competitiveAdvantage',
      label: 'الميزة التنافسية',
      icon: TrendingUp,
      color: 'orange',
      type: 'textarea' as const,
    },
    {
      key: 'businessModel',
      label: 'نموذج العمل',
      icon: DollarSign,
      color: 'cyan',
      type: 'textarea' as const,
    },
    {
      key: 'estimatedFunding',
      label: 'التمويل المقدر',
      icon: DollarSign,
      color: 'emerald',
      type: 'input' as const,
    },
    {
      key: 'timeframe',
      label: 'الإطار الزمني',
      icon: Clock,
      color: 'indigo',
      type: 'input' as const,
    },
  ];

  const handleFieldChange = (key: string, value: string) => {
    setDetails({ ...details, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            راجع تفاصيل فكرتك ✨
          </h1>
          <p className="text-lg text-gray-600">
            الذكاء الاصطناعي قام بتطوير فكرتك! راجع التفاصيل وعدّل ما تريد
          </p>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-green-900 mb-2">
                تم توليد التفاصيل بنجاح! 🎉
              </h3>
              <p className="text-sm text-green-800">
                راجع جميع التفاصيل أدناه. يمكنك تعديل أي حقل بالضغط على أيقونة التعديل.
                عندما تكون جاهزاً، اضغط على "تقييم الفكرة" للحصول على التقييم الشامل.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fields */}
        <div className="space-y-4 mb-8">
          {fields.map((field, index) => {
            const Icon = field.icon;
            const value = details[field.key as keyof ExpandedIdeaDetails] || '';
            const isEditing = editingField === field.key;

            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 bg-${field.color}-100 rounded-xl`}>
                      <Icon className={`w-5 h-5 text-${field.color}-600`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {field.label}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingField(isEditing ? null : field.key)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                      ${isEditing 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {isEditing ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-sm font-semibold">حفظ</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-semibold">تعديل</span>
                      </>
                    )}
                  </button>
                </div>

                {isEditing ? (
                  field.type === 'textarea' ? (
                    <Textarea
                      value={value}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      rows={4}
                      className="text-base"
                    />
                  ) : (
                    <Input
                      value={value}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className="text-base"
                    />
                  )
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {value}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>رجوع</span>
          </button>

          <button
            onClick={() => onConfirm(details)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>جاري التقييم...</span>
              </>
            ) : (
              <>
                <span>تقييم الفكرة</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
