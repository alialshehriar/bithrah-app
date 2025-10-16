'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Upload, X, Plus, Minus,
  DollarSign, Calendar, FileText, Image as ImageIcon, Package,
  AlertCircle, Sparkles, Target, Clock, Users, TrendingUp
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface ProjectPackage {
  name: string;
  price: string;
  description: string;
  benefits: string[];
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    publicDescription: '', // Level 1: Public
    registeredDescription: '', // Level 2: Registered + NDA
    fullDescription: '', // Level 3: Negotiators only
    category: 'technology',
    fundingGoal: '',
    endDate: '',
    image: '',
    risks: '',
    packages: [] as ProjectPackage[],
    timeline: [] as { title: string; date: string; description: string }[],
    // New fields for mediation platform
    platformPackage: 'basic' as 'basic' | 'bithrah_plus',
    negotiationEnabled: false,
    negotiationDeposit: '',
  });

  const categories = [
    { value: 'technology', label: 'التقنية' },
    { value: 'health', label: 'الصحة' },
    { value: 'education', label: 'التعليم' },
    { value: 'environment', label: 'البيئة' },
    { value: 'art', label: 'الفن' },
    { value: 'business', label: 'الأعمال' },
  ];

  const steps = [
    { number: 1, title: 'المعلومات الأساسية', icon: FileText },
    { number: 2, title: 'التمويل والمدة', icon: DollarSign },
    { number: 3, label: 'الباقات والمكافآت', icon: Package },
    { number: 4, title: 'المراجعة والنشر', icon: Check },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { name: '', price: '', description: '', benefits: [''] }],
    }));
  };

  const removePackage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== index),
    }));
  };

  const updatePackage = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      ),
    }));
  };

  const addBenefit = (packageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex ? { ...pkg, benefits: [...pkg.benefits, ''] } : pkg
      ),
    }));
  };

  const removeBenefit = (packageIndex: number, benefitIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex
          ? { ...pkg, benefits: pkg.benefits.filter((_, bi) => bi !== benefitIndex) }
          : pkg
      ),
    }));
  };

  const updateBenefit = (packageIndex: number, benefitIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) =>
        i === packageIndex
          ? {
              ...pkg,
              benefits: pkg.benefits.map((b, bi) => (bi === benefitIndex ? value : b)),
            }
          : pkg
      ),
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { title: '', date: '', description: '' }],
    }));
  };

  const removeTimelineItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  };

  const updateTimelineItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.publicDescription && formData.category);
      case 2:
        return !!(formData.fundingGoal && formData.endDate);
      case 3:
        return true; // Packages are optional
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => Math.min(4, prev + 1));
    } else {
      setError('يرجى ملء جميع الحقول المطلوبة');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    setError('');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/projects/${data.project.id}`);
      } else {
        setError(data.error || 'حدث خطأ أثناء إنشاء المشروع');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">أنشئ مشروعك</h1>
          <p className="text-lg text-gray-600">
            شارك فكرتك مع العالم واحصل على التمويل الذي تحتاجه
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step.number
                        ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </motion.div>
                  <span className={`text-sm mt-2 font-medium ${
                    currentStep >= step.number ? 'text-teal-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 rounded transition-all ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-teal-500 to-purple-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان المشروع *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="أدخل عنواناً جذاباً لمشروعك"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الوصف *
                    </label>
                    <textarea
                      value={formData.publicDescription}
                      onChange={(e) => handleInputChange('publicDescription', e.target.value)}
                      placeholder="اشرح فكرة مشروعك بالتفصيل..."
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      التصنيف *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      رابط الصورة (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Funding & Duration */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      هدف التمويل (ر.س) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={formData.fundingGoal}
                        onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                        placeholder="100000"
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      تاريخ الانتهاء *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pr-12 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المخاطر والتحديات (اختياري)
                    </label>
                    <textarea
                      value={formData.risks}
                      onChange={(e) => handleInputChange('risks', e.target.value)}
                      placeholder="اذكر المخاطر والتحديات المحتملة..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Packages */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">باقات الدعم</h3>
                    <button
                      onClick={addPackage}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      إضافة باقة
                    </button>
                  </div>

                  {formData.packages.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لم تقم بإضافة أي باقات بعد</p>
                      <p className="text-sm text-gray-500 mt-2">الباقات اختيارية لكنها تساعد في جذب الداعمين</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.packages.map((pkg, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-xl p-6 relative">
                          <button
                            onClick={() => removePackage(index)}
                            className="absolute top-4 left-4 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                اسم الباقة
                              </label>
                              <input
                                type="text"
                                value={pkg.name}
                                onChange={(e) => updatePackage(index, 'name', e.target.value)}
                                placeholder="مثال: الداعم البرونزي"
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                السعر (ر.س)
                              </label>
                              <input
                                type="number"
                                value={pkg.price}
                                onChange={(e) => updatePackage(index, 'price', e.target.value)}
                                placeholder="500"
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                الوصف
                              </label>
                              <textarea
                                value={pkg.description}
                                onChange={(e) => updatePackage(index, 'description', e.target.value)}
                                placeholder="وصف الباقة..."
                                rows={2}
                                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors resize-none"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                  المميزات
                                </label>
                                <button
                                  onClick={() => addBenefit(index)}
                                  className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                                >
                                  <Plus className="w-4 h-4" />
                                  إضافة ميزة
                                </button>
                              </div>
                              <div className="space-y-2">
                                {pkg.benefits.map((benefit, benefitIndex) => (
                                  <div key={benefitIndex} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={benefit}
                                      onChange={(e) => updateBenefit(index, benefitIndex, e.target.value)}
                                      placeholder="ميزة..."
                                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none transition-colors"
                                    />
                                    <button
                                      onClick={() => removeBenefit(index, benefitIndex)}
                                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <Sparkles className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">مراجعة المشروع</h3>
                    <p className="text-gray-600">تأكد من صحة جميع المعلومات قبل النشر</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">المعلومات الأساسية</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">العنوان:</span>
                          <span className="font-semibold">{formData.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">التصنيف:</span>
                          <span className="font-semibold">
                            {categories.find(c => c.value === formData.category)?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">التمويل</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الهدف:</span>
                          <span className="font-semibold">{parseFloat(formData.fundingGoal).toLocaleString()} ر.س</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ الانتهاء:</span>
                          <span className="font-semibold">{new Date(formData.endDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>

                    {formData.packages.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-900 mb-4">الباقات</h4>
                        <div className="space-y-2 text-sm">
                          {formData.packages.map((pkg, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-gray-600">{pkg.name}:</span>
                              <span className="font-semibold">{parseFloat(pkg.price).toLocaleString()} ر.س</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
                السابق
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  التالي
                  <ArrowLeft className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      جاري النشر...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      نشر المشروع
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

