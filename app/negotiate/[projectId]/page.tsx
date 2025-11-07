'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function NegotiatePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/projects/slug/${projectId}`);
      const data = await res.json();
      
      if (data.success && data.project) {
        setProject(data.project);
      } else {
        setError('المشروع غير موجود');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error || 'المشروع غير موجود'}</p>
          <button
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600">
              الهدف: {project.fundingGoal?.toLocaleString()} ر.س
            </p>
            <p className="text-gray-600">
              المجموع: {project.currentFunding?.toLocaleString()} ر.س
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-purple-900 mb-2">
              نظام التفاوض قيد التطوير
            </h2>
            <p className="text-purple-700">
              سيتم تفعيل نظام التفاوض الذكي قريباً. يمكنك حالياً دعم المشروع مباشرة.
            </p>
          </div>

          <button
            onClick={() => router.push(`/projects/${project.slug || project.id}`)}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl"
          >
            العودة للمشروع
          </button>
        </div>
      </div>
    </div>
  );
}
