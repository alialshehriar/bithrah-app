import Link from 'next/link';

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
            منصة وساطة ذكية مدعومة بالذكاء الاصطناعي
          </p>
          
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            نربط أصحاب الأفكار المبتكرة بالداعمين والمستثمرين في بيئة آمنة وموثوقة
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              <span className="relative z-10">ابدأ رحلتك الآن</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">أفكار مبتكرة</h3>
              <p className="text-white/70 leading-relaxed">
                اكتشف مشاريع ريادية واعدة من رواد أعمال طموحين في السوق السعودي
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">حماية متقدمة</h3>
              <p className="text-white/70 leading-relaxed">
                نظام حماية ثلاثي المستويات مع اتفاقيات عدم إفشاء لضمان أمان أفكارك
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">ذكاء اصطناعي</h3>
              <p className="text-white/70 leading-relaxed">
                تقييم ذكي للأفكار وتوصيات مخصصة لضمان نجاح استثماراتك
              </p>
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

