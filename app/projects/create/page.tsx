'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Rocket, DollarSign, Target, Calendar, Package, Plus, X } from 'lucide-react';

interface PackageData {
  title: string;
  description: string;
  price: number;
  benefits: string[];
}

function CreateProjectPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'bithrah_plus'>('basic');
  
  useEffect(() => {
    const packageParam = searchParams.get('package') as 'basic' | 'bithrah_plus' | null;
    if (packageParam) {
      setSelectedPackage(packageParam);
    } else {
      // Redirect to package selection if no package selected
      router.push('/projects/create/select-package');
    }
  }, [searchParams, router]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technology',
    goalAmount: '',
    endDate: '',
    image: '',
  });
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [newPackage, setNewPackage] = useState<PackageData>({
    title: '',
    description: '',
    price: 0,
    benefits: [''],
  });

  const categories = [
    { value: 'technology', label: 'التقنية' },
    { value: 'education', label: 'التعليم' },
    { value: 'health', label: 'الصحة' },
    { value: 'finance', label: 'المالية' },
    { value: 'ecommerce', label: 'التجارة الإلكترونية' },
    { value: 'social', label: 'التواصل الاجتماعي' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          goalAmount: parseFloat(formData.goalAmount),
          packages,
          platformPackage: selectedPackage,
          platformCommission: selectedPackage === 'basic' ? 6.5 : 3.0,
          platformPartnership: selectedPackage === 'basic' ? 0 : 2.0,
          referralEnabled: selectedPackage === 'bithrah_plus',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/projects/${data.project.id}`);
      } else {
        alert('حدث خطأ في إنشاء المشروع');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('حدث خطأ في إنشاء المشروع');
    } finally {
      setLoading(false);
    }
  };

  const addPackage = () => {
    if (newPackage.title && newPackage.price > 0) {
      setPackages([...packages, newPackage]);
      setNewPackage({
        title: '',
        description: '',
        price: 0,
        benefits: [''],
      });
    }
  };

  const removePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    setNewPackage({
      ...newPackage,
      benefits: [...newPackage.benefits, ''],
    });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...newPackage.benefits];
    newBenefits[index] = value;
    setNewPackage({ ...newPackage, benefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    setNewPackage({
      ...newPackage,
      benefits: newPackage.benefits.filter((_, i) => i !== index),
    });
  };

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-12 h-12 text-teal-500" />
            <h1 className="text-4xl font-bold gradient-text">إنشاء مشروع جديد</h1>
          </div>
          <p className="text-gray-600 text-lg">شارك فكرتك مع المجتمع واحصل على التمويل</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="card-luxury">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات المشروع</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  عنوان المشروع *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-luxury"
                  placeholder="أدخل عنواناً جذاباً لمشروعك"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-luxury"
                  rows={6}
                  placeholder="اشرح فكرة مشروعك بالتفصيل..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    التصنيف *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-luxury"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline ml-1" />
                    هدف التمويل (ريال) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.goalAmount}
                    onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                    className="input-luxury"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline ml-1" />
                  تاريخ الانتهاء *
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="input-luxury"
                />
              </div>
            </div>
          </div>

          {/* Packages */}
          <div className="card-luxury">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <Package className="w-6 h-6 inline ml-2" />
              باقات الدعم
            </h2>

            {packages.length > 0 && (
              <div className="space-y-3 mb-6">
                {packages.map((pkg, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{pkg.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                      <p className="text-lg font-bold text-teal-600">{pkg.price.toLocaleString()} ريال</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePackage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4 p-4 bg-teal-50 rounded-xl">
              <h3 className="font-bold text-gray-900">إضافة باقة جديدة</h3>
              
              <input
                type="text"
                value={newPackage.title}
                onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                className="input-luxury"
                placeholder="اسم الباقة"
              />

              <textarea
                value={newPackage.description}
                onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                className="input-luxury"
                rows={2}
                placeholder="وصف الباقة"
              />

              <input
                type="number"
                value={newPackage.price || ''}
                onChange={(e) => setNewPackage({ ...newPackage, price: parseFloat(e.target.value) || 0 })}
                className="input-luxury"
                placeholder="السعر (ريال)"
              />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">المزايا</label>
                {newPackage.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="input-luxury flex-1"
                      placeholder="ميزة"
                    />
                    {newPackage.benefits.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="btn-secondary text-sm"
                >
                  <Plus className="w-4 h-4 ml-1" />
                  إضافة ميزة
                </button>
              </div>

              <button
                type="button"
                onClick={addPackage}
                className="btn-primary w-full"
              >
                <Plus className="w-5 h-5 ml-2" />
                إضافة الباقة
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء المشروع'}
            </button>
          </div>
        </form>
      </div>
  );
}

export default function CreateProjectPage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-xl">جاري التحميل...</div></div>}>
        <CreateProjectPageContent />
      </Suspense>
    </MainLayout>
  );
}
