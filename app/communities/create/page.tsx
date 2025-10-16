'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, ArrowLeft, Loader2, Globe, Lock, Image as ImageIcon,
  Sparkles, Zap, Briefcase, Heart, BookOpen, Target
} from 'lucide-react';

const categories = [
  { value: 'technology', label: 'التقنية', icon: Zap },
  { value: 'business', label: 'الأعمال', icon: Briefcase },
  { value: 'health', label: 'الصحة', icon: Heart },
  { value: 'education', label: 'التعليم', icon: BookOpen },
  { value: 'other', label: 'أخرى', icon: Target },
];

export default function CreateCommunityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    coverImage: '',
    rules: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.description || !formData.category) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/communities/${data.community.id}`);
      } else {
        setError(data.error || 'حدث خطأ أثناء إنشاء المجتمع');
      }
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء المجتمع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 via-purple-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/communities"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>العودة للمجتمعات</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">إنشاء مجتمع جديد</h1>
            <p className="text-xl text-white/90">اجمع رواد الأعمال والمستثمرين حول اهتماماتك</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المجتمع <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="مثال: مجتمع رواد الأعمال التقنيين"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                الوصف <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="اكتب وصفاً مختصراً عن المجتمع وأهدافه..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        formData.category === cat.value
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${
                        formData.category === cat.value ? 'text-teal-600' : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        formData.category === cat.value ? 'text-teal-700' : 'text-gray-700'
                      }`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الخصوصية
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, privacy: 'public' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.privacy === 'public'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Globe className={`w-5 h-5 ${
                    formData.privacy === 'public' ? 'text-teal-600' : 'text-gray-400'
                  }`} />
                  <div className="text-right">
                    <p className={`font-medium ${
                      formData.privacy === 'public' ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      عام
                    </p>
                    <p className="text-xs text-gray-500">يمكن للجميع الانضمام</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, privacy: 'private' })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.privacy === 'private'
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Lock className={`w-5 h-5 ${
                    formData.privacy === 'private' ? 'text-teal-600' : 'text-gray-400'
                  }`} />
                  <div className="text-right">
                    <p className={`font-medium ${
                      formData.privacy === 'private' ? 'text-teal-700' : 'text-gray-700'
                    }`}>
                      خاص
                    </p>
                    <p className="text-xs text-gray-500">يتطلب موافقة للانضمام</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                صورة الغلاف (اختياري)
              </label>
              <div className="relative">
                <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="coverImage"
                  name="coverImage"
                  type="url"
                  value={formData.coverImage}
                  onChange={handleChange}
                  className="block w-full pr-12 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Rules */}
            <div>
              <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-2">
                قواعد المجتمع (اختياري)
              </label>
              <textarea
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                placeholder="اكتب قواعد المجتمع التي يجب على الأعضاء الالتزام بها..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    إنشاء المجتمع
                  </>
                )}
              </button>
              
              <Link
                href="/communities"
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                إلغاء
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

