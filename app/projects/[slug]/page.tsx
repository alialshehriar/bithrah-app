'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, Target, TrendingUp } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  backersCount: number;
  deadline: string;
  status: string;
  creator: {
    name: string;
    avatar: string | null;
  };
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">المشروع غير موجود</h2>
          <p className="text-gray-600 mb-6">عذراً، لم نتمكن من العثور على هذا المشروع</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للمشاريع
          </Link>
        </div>
      </div>
    );
  }

  const progress = (project.currentFunding / project.fundingGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">العودة للمشاريع</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Project Header */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
            <p className="text-gray-600 mb-6">{project.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-teal-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-600">الهدف</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{project.fundingGoal.toLocaleString()} ر.س</p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">المبلغ الحالي</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{project.currentFunding.toLocaleString()} ر.س</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">الداعمون</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{project.backersCount}</p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-gray-600">النسبة</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{progress.toFixed(0)}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Link
                href={`/projects/${slug}/negotiate`}
                className="flex-1 bg-[#14B8A6] hover:bg-[#0F9A8A] text-white font-semibold py-4 px-6 rounded-xl transition-all text-center"
              >
                بدء التفاوض
              </Link>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all">
                دعم المشروع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

