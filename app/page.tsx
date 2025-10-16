import Link from 'next/link';
import { Brain, Sparkles, Shield, TrendingUp, Rocket, Users, Award, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">ب</span>
            </div>
            <span className="text-white text-2xl font-bold">بذرة</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-white/80 hover:text-white transition-colors px-4 py-2"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-teal-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <span className="text-white text-5xl font-bold">ب</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            منصة <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">بذرة</span>
          </h1>
          
          <p className="text-2xl text-white/80 mb-4 max-w-3xl mx-auto">
            منصة تمويل جماعي ذكية مدعومة بالذكاء الاصطناعي
          </p>
          
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            نربط أصحاب الأفكار المبتكرة بالداعمين والمستثمرين مع تقييم ذكي متقدم
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/evaluate"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-teal-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center gap-2"
            >
              <Brain className="w-6 h-6" />
              <span className="relative z-10">قيّم فكرتك بالذكاء الاصطناعي</span>
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
            >
              استكشف المشاريع
            </Link>
          </div>
        </div>
      </div>

      {/* AI Evaluation Highlight */}
      <div className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">الميزة الأساسية</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              تقييم الأفكار بالذكاء الاصطناعي
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              احصل على تقييم شامل ودقيق لفكرتك في دقائق معدودة باستخدام أحدث تقنيات الذكاء الاصطناعي
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">دقة عالية</h3>
              <p className="text-white/70">تقييم دقيق بنسبة 98% باستخدام نماذج ذكاء اصطناعي متقدمة</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تحليل شامل</h3>
              <p className="text-white/70">15+ معيار تقييم تشمل السوق والجدوى المالية والتنفيذ</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">سريع وفوري</h3>
              <p className="text-white/70">احصل على نتائج التقييم في أقل من 5 دقائق</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/evaluate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-900 font-bold rounded-xl hover:shadow-2xl hover:shadow-white/30 transition-all hover:scale-105"
            >
              <Brain className="w-6 h-6" />
              <span>ابدأ التقييم الآن</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            لماذا <span className="bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">بذرة</span>؟
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-teal-500/50 transition-all">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">مشاريع مبتكرة</h3>
              <p className="text-white/70 leading-relaxed">
                اكتشف مشاريع ريادية واعدة من رواد أعمال طموحين في السوق السعودي
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">حماية متقدمة</h3>
              <p className="text-white/70 leading-relaxed">
                نظام حماية ثلاثي المستويات مع اتفاقيات عدم إفشاء لضمان أمان أفكارك
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">مجتمع نشط</h3>
              <p className="text-white/70 leading-relaxed">
                انضم لمجتمع من رواد الأعمال والمستثمرين والداعمين المتحمسين
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/60">مشروع ممول</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">50M+</div>
              <div className="text-white/60">ريال تمويل</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">5000+</div>
              <div className="text-white/60">مستثمر نشط</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-white/60">رضا المستخدمين</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">ب</span>
            </div>
            <span className="text-white text-2xl font-bold">بذرة</span>
          </div>
          <p className="text-white/60 mb-6">منصة التمويل الجماعي الرائدة في السعودية</p>
          <div className="flex justify-center gap-8 text-white/60 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
            <Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

