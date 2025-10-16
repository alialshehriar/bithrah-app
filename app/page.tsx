import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 to-purple-600">
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        {/* Logo */}
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
            <span className="text-7xl font-bold">ب</span>
          </div>
          <h1 className="text-6xl font-bold mb-4">بذرة</h1>
          <p className="text-2xl opacity-90 mb-2">منصة التمويل الجماعي الرائدة في السعودية</p>
          <p className="text-lg opacity-75">منصة وساطة ذكية مدعومة بالذكاء الاصطناعي</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            ابدأ الآن
          </Link>
          <Link
            href="/auth/signin"
            className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all border-2 border-white/50"
          >
            تسجيل الدخول
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold mb-2">أفكار مبتكرة</h3>
            <p className="text-sm opacity-80">اكتشف مشاريع ريادية واعدة</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">تمويل آمن</h3>
            <p className="text-sm opacity-80">استثمر بثقة مع حماية كاملة</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">نمو سريع</h3>
            <p className="text-sm opacity-80">حقق أهدافك مع مجتمع داعم</p>
          </div>
        </div>
      </div>
    </div>
  );
}

