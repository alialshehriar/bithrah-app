'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Upload, X, Plus, Minus,
  DollarSign, Calendar, FileText, Image as ImageIcon, Package,
  AlertCircle, Sparkles, Target, Clock, Users, TrendingUp, Shield, Crown, Gift
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface SupportTier {
  title: string;
  amount: string;
  description: string;
  rewards: string[];
  maxBackers?: string;
  deliveryDate?: string;
  shippingIncluded: boolean;
}

interface PlatformPackage {
  id: string;
  name: string;
  type: string;
  commission_percentage: number;
  equity_percentage?: number;
  features: string[];
  color: string;
  icon: string;
  badge: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platformPackages, setPlatformPackages] = useState<PlatformPackage[]>([]);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    publicDescription: '',
    registeredDescription: '',
    fullDescription: '',
    category: 'technology',
    fundingGoal: '',
    endDate: '',
    image: '',
    risks: '',
    platformPackageId: 'basic',
    supportTiers: [] as SupportTier[],
    timeline: [] as { title: string; date: string; description: string }[],
  });

  useEffect(() => {
    fetchPlatformPackages();
  }, []);

  const fetchPlatformPackages = async () => {
    try {
      const response = await fetch('/api/platform-packages');
      const data = await response.json();
      if (data.success) {
        setPlatformPackages(data.packages);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

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
    { number: 2, title: 'باقة المنصة', icon: Crown },
    { number: 3, title: 'باقات الدعم', icon: Gift },
    { number: 4, title: 'التمويل والمدة', icon: DollarSign },
    { number: 5, title: 'المراجعة والنشر', icon: Check },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSupportTier = () => {
    setFormData(prev => ({
      ...prev,
      supportTiers: [...prev.supportTiers, {
        title: '',
        amount: '',
        description: '',
        rewards: [''],
        shippingIncluded: false
      }],
    }));
  };

  const removeSupportTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportTiers: prev.supportTiers.filter((_, i) => i !== index),
    }));
  };

  const updateSupportTier = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      supportTiers: prev.supportTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      ),
    }));
  };

  const addReward = (tierIndex: number) => {
    setFormData(prev => ({
      ...prev,
      supportTiers: prev.supportTiers.map((tier, i) =>
        i === tierIndex ? { ...tier, rewards: [...tier.rewards, ''] } : tier
      ),
    }));
  };

  const removeReward = (tierIndex: number, rewardIndex: number) => {
    setFormData(prev => ({
      ...prev,
      supportTiers: prev.supportTiers.map((tier, i) =>
        i === tierIndex ? {
          ...tier,
          rewards: tier.rewards.filter((_, ri) => ri !== rewardIndex)
        } : tier
      ),
    }));
  };

  const updateReward = (tierIndex: number, rewardIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      supportTiers: prev.supportTiers.map((tier, i) =>
        i === tierIndex ? {
          ...tier,
          rewards: tier.rewards.map((r, ri) => ri === rewardIndex ? value : r)
        } : tier
      ),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Create project
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          platform_package_id: formData.platformPackageId,
        }),
      });

      const projectData = await projectResponse.json();

      if (!projectData.success) {
        throw new Error(projectData.error || 'Failed to create project');
      }

      const projectId = projectData.project.id;

      // Create support tiers
      for (const tier of formData.supportTiers) {
        await fetch('/api/support-tiers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            ...tier,
          }),
        });
      }

      router.push(`/projects/${projectId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectedPackage = platformPackages.find(p => p.id === formData.platformPackageId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">إنشاء مشروع جديد</h1>
          <p className="text-gray-600">أطلق فكرتك واحصل على التمويل من المجتمع</p>
        </div>

        {/* Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-purple-600 text-white shadow-lg'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${isActive ? 'text-purple-600' : 'text-gray-600'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-4 transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">المعلومات الأساسية</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المشروع</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      placeholder="اسم مشروعك المميز"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الوصف العام (المستوى 1 - للجميع)
                    </label>
                    <textarea
                      value={formData.publicDescription}
                      onChange={(e) => handleInputChange('publicDescription', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      placeholder="وصف عام لفكرتك..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الوصف التفصيلي (المستوى 2 - للمسجلين + NDA)
                    </label>
                    <textarea
                      value={formData.registeredDescription}
                      onChange={(e) => handleInputChange('registeredDescription', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      placeholder="تفاصيل أكثر عن المشروع..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الوصف الكامل (المستوى 3 - للمفاوضين فقط)
                    </label>
                    <textarea
                      value={formData.fullDescription}
                      onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      placeholder="المعلومات الكاملة والحساسة..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Platform Package */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">اختر باقة المنصة</h2>
                <p className="text-gray-600 mb-6">اختر الباقة المناسبة لمشروعك</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {platformPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleInputChange('platformPackageId', pkg.id)}
                      className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.platformPackageId === pkg.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {formData.platformPackageId === pkg.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: pkg.color }}>
                          {pkg.icon === 'shield' ? <Shield className="w-6 h-6 text-white" /> : <Crown className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                          <span className="text-sm text-gray-600">{pkg.badge}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-3xl font-bold" style={{ color: pkg.color }}>
                          {pkg.commission_percentage}%
                          {pkg.equity_percentage && ` + ${pkg.equity_percentage}%`}
                        </div>
                        <div className="text-sm text-gray-600">
                          {pkg.equity_percentage ? 'عمولة + شراكة' : 'عمولة فقط'}
                        </div>
                      </div>

                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {selectedPackage && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-bold mb-1">ملاحظة مهمة:</p>
                        <p>
                          {selectedPackage.type === 'bithrah_plus'
                            ? `باختيارك لباقة Bithrah Plus، ستحصل على عمولة منخفضة ${selectedPackage.commission_percentage}% مقابل شراكة ${selectedPackage.equity_percentage}% في المشروع. هذا يعني أن بذرة ستكون شريكاً استراتيجياً في نجاح مشروعك.`
                            : `باختيارك لباقة Basic، ستدفع عمولة ${selectedPackage.commission_percentage}% فقط بدون أي شراكة أو حصص ملكية.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Support Tiers */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">باقات الدعم</h2>
                <p className="text-gray-600 mb-6">أنشئ باقات دعم مختلفة للداعمين (مثل Kickstarter)</p>

                <div className="space-y-6">
                  {formData.supportTiers.map((tier, tierIndex) => (
                    <div key={tierIndex} className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">باقة #{tierIndex + 1}</h3>
                        <button
                          onClick={() => removeSupportTier(tierIndex)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">اسم الباقة</label>
                          <input
                            type="text"
                            value={tier.title}
                            onChange={(e) => updateSupportTier(tierIndex, 'title', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                            placeholder="مثال: الداعم البرونزي"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ (ريال)</label>
                          <input
                            type="number"
                            value={tier.amount}
                            onChange={(e) => updateSupportTier(tierIndex, 'amount', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                            placeholder="100"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">وصف الباقة</label>
                        <textarea
                          value={tier.description}
                          onChange={(e) => updateSupportTier(tierIndex, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                          placeholder="ماذا سيحصل الداعم مقابل هذا المبلغ؟"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">المكافآت</label>
                        {tier.rewards.map((reward, rewardIndex) => (
                          <div key={rewardIndex} className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={reward}
                              onChange={(e) => updateReward(tierIndex, rewardIndex, e.target.value)}
                              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                              placeholder="مثال: نسخة من المنتج + شكر خاص"
                            />
                            {tier.rewards.length > 1 && (
                              <button
                                onClick={() => removeReward(tierIndex, rewardIndex)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addReward(tierIndex)}
                          className="mt-2 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة مكافأة</span>
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">عدد الداعمين المحدود (اختياري)</label>
                          <input
                            type="number"
                            value={tier.maxBackers || ''}
                            onChange={(e) => updateSupportTier(tierIndex, 'maxBackers', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                            placeholder="مثال: 50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ التسليم المتوقع</label>
                          <input
                            type="date"
                            value={tier.deliveryDate || ''}
                            onChange={(e) => updateSupportTier(tierIndex, 'deliveryDate', e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tier.shippingIncluded}
                            onChange={(e) => updateSupportTier(tierIndex, 'shippingIncluded', e.target.checked)}
                            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700">يتضمن الشحن</span>
                        </label>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addSupportTier}
                    className="w-full py-4 border-2 border-dashed border-purple-300 rounded-2xl text-purple-600 font-bold hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>إضافة باقة دعم جديدة</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Funding & Timeline */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">التمويل والمدة</h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">هدف التمويل (ريال)</label>
                      <input
                        type="number"
                        value={formData.fundingGoal}
                        onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                        placeholder="500000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الانتهاء</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">المخاطر والتحديات</label>
                    <textarea
                      value={formData.risks}
                      onChange={(e) => handleInputChange('risks', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                      placeholder="ما هي المخاطر المحتملة وكيف ستتعامل معها؟"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">مراجعة المشروع</h2>

                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <h3 className="font-bold text-gray-900 mb-2">{formData.title}</h3>
                    <p className="text-gray-600 mb-4">{formData.publicDescription}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>الهدف: {formData.fundingGoal} ريال</span>
                      <span>•</span>
                      <span>الباقة: {selectedPackage?.name}</span>
                      <span>•</span>
                      <span>باقات الدعم: {formData.supportTiers.length}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span>السابق</span>
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <span>التالي</span>
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري النشر...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>نشر المشروع</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

