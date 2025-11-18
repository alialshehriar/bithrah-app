export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          كيف تعمل بذرة
        </h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-xl mb-8">
              <p className="text-xl text-center">
                دليلك الشامل لاستخدام منصة بذرة - من الفكرة إلى التنفيذ
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 رحلتك في بذرة</h2>
            <p className="mb-6">
              سواء كنت رائد أعمال لديك فكرة مبتكرة، أو داعماً يبحث عن مشاريع واعدة، 
              بذرة توفر لك رحلة متكاملة وسهلة:
            </p>
          </section>

          {/* For Project Owners */}
          <section className="bg-blue-50 p-8 rounded-xl border-r-4 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              👨‍💼 لأصحاب المشاريع والأفكار
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🤖 قيّم فكرتك بالذكاء الاصطناعي</h3>
                    <p className="mb-3">
                      ابدأ بتقييم فكرتك مجاناً باستخدام نظامنا الذكي المدعوم بـ GPT-4:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>اذهب إلى صفحة <strong>"تقييم الأفكار"</strong></li>
                      <li>أدخل تفاصيل فكرتك (الوصف، الفئة، المرحلة، الميزانية)</li>
                      <li>احصل على تقييم شامل في 10-15 ثانية</li>
                      <li>التقييم يشمل: نقاط القوة، التحديات، التوصيات، والنتيجة الإجمالية</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">📝 انشر مشروعك</h3>
                    <p className="mb-3">
                      بعد التقييم، انشر مشروعك على المنصة:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>أضف وصفاً تفصيلياً لمشروعك</li>
                      <li>حدد الفئة والمرحلة الحالية</li>
                      <li>اختر الميزانية المطلوبة</li>
                      <li>أضف صوراً ومستندات داعمة</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💰 اختر باقات الدعم</h3>
                    <p className="mb-3">
                      حدد باقات الدعم التي ستقدمها للداعمين (5 مستويات):
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li><strong>البذرة (100 ريال):</strong> شكر خاص + تحديثات حصرية</li>
                      <li><strong>الشتلة (500 ريال):</strong> منتج تجريبي + ورشة عمل</li>
                      <li><strong>الشجرة (2,000 ريال):</strong> منتج كامل + استشارة + شهادة تقدير</li>
                      <li><strong>الغابة (10,000 ريال):</strong> منتج مميز + استشارات + تدريب</li>
                      <li><strong>الواحة (50,000 ريال):</strong> باقة VIP شاملة</li>
                    </ul>
                    <p className="mt-3 text-sm bg-green-50 p-3 rounded">
                      <strong>ملاحظة:</strong> جميع الباقات تقدم منتجات وخدمات ملموسة فقط، 
                      بدون حصص أو شراكات (التزاماً بأنظمة هيئة السوق المالية).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🤝 استقبل طلبات التفاوض</h3>
                    <p className="mb-3">
                      عندما يهتم مستثمر أو شريك محتمل بمشروعك:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>ستستلم طلب تفاوض عبر بوابة التفاوض الآمنة</li>
                      <li>الطلب يتضمن عربوناً (يضمن جدية الطرف الآخر)</li>
                      <li>راجع الطلب واقرأ اتفاقية عدم الإفشاء (NDA)</li>
                      <li>اقبل أو ارفض الطلب خلال 14 يوم</li>
                      <li>إذا قبلت، ابدأ التفاوض المباشر مع الطرف الآخر</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">👥 انضم للمجتمعات</h3>
                    <p className="mb-3">
                      شارك في المجتمعات المتخصصة:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>انضم لمجتمعات التقنية، الصحة، أو التعليم</li>
                      <li>شارك تجاربك واطرح أسئلتك</li>
                      <li>تفاعل مع منشورات الآخرين</li>
                      <li>اكسب نقاطاً وتقدم في لوحة الصدارة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* For Supporters */}
          <section className="bg-green-50 p-8 rounded-xl border-r-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              💚 للداعمين والمستثمرين
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🔍 استكشف المشاريع</h3>
                    <p className="mb-3">
                      تصفح المشاريع المتاحة على المنصة:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>اذهب إلى صفحة <strong>"المشاريع"</strong></li>
                      <li>استعرض المشاريع حسب الفئة (تقنية، صحة، تعليم، إلخ)</li>
                      <li>اقرأ تفاصيل كل مشروع وتقييمه</li>
                      <li>شاهد باقات الدعم المتاحة</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💳 ادعم مشروعاً</h3>
                    <p className="mb-3">
                      اختر باقة دعم تناسبك:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>اختر إحدى الباقات الخمس (من 100 إلى 50,000 ريال)</li>
                      <li>اقرأ تفاصيل ما ستحصل عليه (منتجات، خدمات، تقدير)</li>
                      <li>أكمل عملية الدفع الآمنة</li>
                      <li>استلم تأكيد الدعم فوراً</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🤝 ابدأ التفاوض</h3>
                    <p className="mb-3">
                      إذا كنت مهتماً بشراكة أو استثمار أكبر:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>اضغط على <strong>"بوابة التفاوض"</strong> في صفحة المشروع</li>
                      <li>اقرأ اتفاقية عدم الإفشاء (NDA) ووافق عليها</li>
                      <li>ادفع العربون (قابل للاسترجاع إذا رُفض الطلب)</li>
                      <li>ادفع الرسوم الإدارية (غير قابلة للاسترجاع)</li>
                      <li>انتظر رد صاحب المشروع (خلال 14 يوم)</li>
                      <li>إذا قُبل الطلب، ابدأ التفاوض المباشر</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">👥 شارك في المجتمعات</h3>
                    <p className="mb-3">
                      تواصل مع رواد الأعمال والمستثمرين الآخرين:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                      <li>انضم للمجتمعات المتخصصة</li>
                      <li>شارك خبراتك ونصائحك</li>
                      <li>تعلم من تجارب الآخرين</li>
                      <li>بناء شبكة علاقات قوية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ الميزات الرئيسية</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-xl border-r-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔒 الأمان والخصوصية</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>اتفاقية عدم إفشاء (NDA) لحماية الأفكار</li>
                  <li>عربون يضمن جدية الأطراف</li>
                  <li>معاملات مالية آمنة ومشفرة</li>
                  <li>حماية البيانات الشخصية</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border-r-4 border-yellow-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">⚡ السرعة والكفاءة</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>تقييم فوري للأفكار (10-15 ثانية)</li>
                  <li>نشر مشروعك في دقائق</li>
                  <li>تفاعل مباشر مع الداعمين</li>
                  <li>إشعارات فورية بالتحديثات</li>
                </ul>
              </div>

              <div className="bg-cyan-50 p-6 rounded-xl border-r-4 border-cyan-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 الشفافية</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>تقييمات واضحة ومفصلة</li>
                  <li>شروط واضحة لكل باقة دعم</li>
                  <li>عملية تفاوض منظمة وموثقة</li>
                  <li>سياسات استرجاع واضحة</li>
                </ul>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border-r-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">⚖️ الامتثال القانوني</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>التزام كامل بأنظمة هيئة السوق المالية</li>
                  <li>لا حصص أو شراكات (منتجات وخدمات فقط)</li>
                  <li>شروط وأحكام واضحة</li>
                  <li>حماية حقوق جميع الأطراف</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Important Notes */}
          <section className="bg-yellow-50 p-6 rounded-xl border-r-4 border-yellow-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ ملاحظات مهمة</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>المنصة في مرحلة MVP:</strong> نحن في مرحلة تجريبية ونعمل على التحسين المستمر
              </li>
              <li>
                <strong>باقات الدعم:</strong> جميع الباقات تقدم منتجات وخدمات ملموسة فقط، بدون حصص أو شراكات
              </li>
              <li>
                <strong>سياسة الاسترجاع:</strong> الباقات غير قابلة للاسترجاع إلا في حالات استثنائية (راجع سياسة الاسترجاع)
              </li>
              <li>
                <strong>بوابة التفاوض:</strong> العربون قابل للاسترجاع إذا رُفض الطلب، لكن الرسوم الإدارية غير قابلة للاسترجاع
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="text-center">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">💬 هل لديك أسئلة؟</h3>
              <p className="text-lg mb-6">
                فريقنا جاهز لمساعدتك في أي وقت!
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a 
                  href="mailto:info@bithrahapp.com" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                >
                  📧 info@bithrahapp.com
                </a>
                <a 
                  href="https://wa.me/966592725341" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                  target="_blank"
                >
                  📱 +966 59 272 5341
                </a>
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 بذرة - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
