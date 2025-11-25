'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Save, X, User, Mail, Phone, MapPin, Globe, Twitter, Linkedin, Github, Instagram, FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    city: '',
    country: '',
    phone: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: '',
    instagram: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();

      if (!data.success) {
        router.push('/auth/signin?redirect=/profile/edit');
        return;
      }

      setUser(data.user);
      setFormData({
        name: data.user.name || '',
        bio: data.user.bio || '',
        city: data.user.city || '',
        country: data.user.country || '',
        phone: data.user.phone || '',
        website: data.user.website || '',
        twitter: data.user.twitter || '',
        linkedin: data.user.linkedin || '',
        github: data.user.github || '',
        instagram: data.user.instagram || '',
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      router.push('/auth/signin?redirect=/profile/edit');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/user/profile/edit', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('تم تحديث الملف الشخصي بنجاح!');
        router.push('/profile');
      } else {
        alert(data.error || 'فشل تحديث الملف الشخصي');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('فشل تحديث الملف الشخصي');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, avatar: data.avatarUrl });
        alert('تم رفع الصورة بنجاح!');
      } else {
        alert(data.error || 'فشل رفع الصورة');
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      alert('فشل رفع الصورة');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20" dir="rtl">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">تعديل الملف الشخصي</h1>
                <p className="text-gray-600">قم بتحديث معلوماتك الشخصية</p>
              </div>

              <button
                onClick={() => router.push('/profile')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0F9D8F] flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#14B8A6] hover:bg-[#0F9D8F] rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
                >
                  {uploadingAvatar ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              <div>
                <p className="font-bold text-gray-900 mb-1">الصورة الشخصية</p>
                <p className="text-sm text-gray-600 mb-2">JPG, PNG أو GIF (حد أقصى 5MB)</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="text-[#14B8A6] hover:text-[#0F9D8F] font-bold text-sm disabled:opacity-50"
                >
                  {uploadingAvatar ? 'جاري الرفع...' : 'تغيير الصورة'}
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <User className="w-5 h-5 inline ml-2" />
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="أحمد محمد"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Phone className="w-5 h-5 inline ml-2" />
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="+966 5X XXX XXXX"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 font-bold mb-2">
                  <FileText className="w-5 h-5 inline ml-2" />
                  نبذة عنك
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors resize-none"
                  placeholder="اكتب نبذة مختصرة عنك..."
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">الموقع</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <MapPin className="w-5 h-5 inline ml-2" />
                    المدينة
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="الرياض"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Globe className="w-5 h-5 inline ml-2" />
                    الدولة
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="السعودية"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">الروابط الاجتماعية</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">
                    <Globe className="w-5 h-5 inline ml-2" />
                    الموقع الإلكتروني
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      <Twitter className="w-5 h-5 inline ml-2" />
                      تويتر
                    </label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      <Linkedin className="w-5 h-5 inline ml-2" />
                      لينكد إن
                    </label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      <Github className="w-5 h-5 inline ml-2" />
                      جيت هاب
                    </label>
                    <input
                      type="text"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                      placeholder="username"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-2">
                      <Instagram className="w-5 h-5 inline ml-2" />
                      إنستغرام
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#14B8A6] focus:outline-none transition-colors"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#14B8A6] to-[#0F9D8F] hover:from-[#0F9D8F] hover:to-[#0D8B7F] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ التغييرات
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-4 px-8 rounded-xl transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
