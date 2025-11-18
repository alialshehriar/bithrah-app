export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          سياسة الخصوصية
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <p className="text-lg mb-4">
              في <strong>بذرة</strong>، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. 
              هذه السياسة توضح كيفية جمع واستخدام وحماية معلوماتك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. المعلومات التي نجمعها</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2">أ. معلومات الحساب</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>الاسم الكامل</li>
                  <li>البريد الإلكتروني</li>
                  <li>رقم الهاتف</li>
                  <li>كلمة المرور (مشفرة)</li>
                  <li>الصورة الشخصية (اختياري)</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-r-4 border-green-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2">ب. معلومات المشاريع</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>تفاصيل المشروع (العنوان، الوصف، الفئة)</li>
                  <li>الميزانية والأهداف المالية</li>
                  <li>المستندات والصور المرفقة</li>
                  <li>التحديثات والتقارير</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-r-4 border-purple-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2">ج. معلومات الدفع</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>معلومات الدفع تُعالج عبر بوابة دفع آمنة (طرف ثالث)</li>
                  <li><strong>بذرة لا تحتفظ</strong> بتفاصيل البطاقات الائتمانية</li>
                  <li>نحتفظ فقط بسجل المعاملات (المبلغ، التاريخ، الحالة)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-r-4 border-yellow-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2">د. معلومات الاستخدام</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>عنوان IP</li>
                  <li>نوع المتصفح والجهاز</li>
                  <li>الصفحات التي تزورها</li>
                  <li>وقت ومدة الزيارة</li>
                  <li>التفاعلات مع المنصة</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. كيف نستخدم معلوماتك</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>تشغيل المنصة:</strong> توفير وتحسين خدماتنا
              </li>
              <li>
                <strong>إدارة الحسابات:</strong> إنشاء وإدارة حسابات المستخدمين
              </li>
              <li>
                <strong>معالجة المعاملات:</strong> تنفيذ عمليات الدعم والتمويل
              </li>
              <li>
                <strong>التواصل:</strong> إرسال إشعارات وتحديثات مهمة
              </li>
              <li>
                <strong>التحليل والتطوير:</strong> تحليل سلوك المستخدمين لتحسين المنصة
              </li>
              <li>
                <strong>الأمان:</strong> منع الاحتيال وحماية المنصة
              </li>
              <li>
                <strong>الامتثال القانوني:</strong> الالتزام بالقوانين والأنظمة
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. مشاركة المعلومات</h2>
            <div className="bg-red-50 border-r-4 border-red-500 p-6 rounded">
              <p className="font-bold mb-3">نحن لا نبيع معلوماتك الشخصية أبداً.</p>
              <p className="mb-3">قد نشارك معلوماتك في الحالات التالية فقط:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>مع أصحاب المشاريع:</strong> عند دعمك لمشروع، يتلقى صاحب المشروع اسمك وبريدك الإلكتروني
                </li>
                <li>
                  <strong>مع بوابة الدفع:</strong> لمعالجة المعاملات المالية
                </li>
                <li>
                  <strong>مع مزودي الخدمات:</strong> شركات الاستضافة، التحليلات، والبريد الإلكتروني
                </li>
                <li>
                  <strong>للامتثال القانوني:</strong> عند طلب السلطات المختصة
                </li>
                <li>
                  <strong>لحماية الحقوق:</strong> في حالة النزاعات القانونية
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. حماية البيانات</h2>
            <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded">
              <p className="font-bold mb-3">نستخدم إجراءات أمنية متقدمة لحماية بياناتك:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>التشفير:</strong> جميع البيانات الحساسة مشفرة (SSL/TLS)</li>
                <li><strong>كلمات المرور:</strong> مشفرة باستخدام خوارزميات قوية</li>
                <li><strong>الوصول المحدود:</strong> فقط الموظفون المصرح لهم يمكنهم الوصول للبيانات</li>
                <li><strong>النسخ الاحتياطي:</strong> نسخ احتياطية منتظمة لحماية البيانات</li>
                <li><strong>المراقبة:</strong> مراقبة مستمرة للأنشطة المشبوهة</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. حقوقك</h2>
            <p className="mb-3">لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>الوصول:</strong> طلب نسخة من بياناتك</li>
              <li><strong>التصحيح:</strong> تحديث أو تصحيح بياناتك</li>
              <li><strong>الحذف:</strong> طلب حذف حسابك وبياناتك</li>
              <li><strong>الاعتراض:</strong> الاعتراض على معالجة بياناتك</li>
              <li><strong>النقل:</strong> طلب نقل بياناتك لخدمة أخرى</li>
            </ul>
            <p className="mt-3 text-sm bg-yellow-50 p-3 rounded">
              <strong>ملاحظة:</strong> قد لا نتمكن من حذف بعض البيانات المطلوبة للامتثال القانوني أو لحل النزاعات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. الاحتفاظ بالبيانات</h2>
            <p className="mb-3">
              نحتفظ ببياناتك طالما كان حسابك نشطاً أو حسب الحاجة لتقديم الخدمات:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>الحسابات النشطة:</strong> طالما الحساب مفتوح</li>
              <li><strong>الحسابات المغلقة:</strong> حتى 10 سنوات للامتثال القانوني</li>
              <li><strong>سجلات المعاملات:</strong> 10 سنوات على الأقل</li>
              <li><strong>الوثائق القانونية:</strong> 10 سنوات على الأقل</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="mb-3">
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>ملفات أساسية:</strong> ضرورية لتشغيل المنصة</li>
              <li><strong>ملفات الأداء:</strong> لتحليل استخدام المنصة</li>
              <li><strong>ملفات التفضيلات:</strong> لحفظ إعداداتك</li>
            </ul>
            <p className="mt-3">
              يمكنك التحكم في ملفات تعريف الارتباط من إعدادات متصفحك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. خصوصية الأطفال</h2>
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded">
              <p className="font-bold">
                منصة بذرة غير مخصصة للأطفال دون سن 18 عاماً.
              </p>
              <p className="mt-2">
                لا نجمع عن قصد معلومات من الأطفال. إذا اكتشفنا أن طفلاً قدم معلومات شخصية، 
                سنحذفها فوراً.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. التغييرات على السياسة</h2>
            <p>
              قد نحدّث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>إشعار على المنصة</li>
              <li>بريد إلكتروني لجميع المستخدمين</li>
              <li>تحديث تاريخ "آخر تحديث" أسفل الصفحة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. الامتثال للأنظمة السعودية</h2>
            <p>
              هذه السياسة تلتزم بـ:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>نظام حماية البيانات الشخصية في المملكة العربية السعودية</li>
              <li>نظام التجارة الإلكترونية</li>
              <li>أنظمة هيئة الاتصالات وتقنية المعلومات</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. الاتصال بنا</h2>
            <p className="mb-3">
              لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك:
            </p>
            <div className="bg-blue-50 p-6 rounded-xl">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <strong>البريد الإلكتروني:</strong>
                    <a href="mailto:privacy@bithrahapp.com" className="text-blue-600 hover:underline mr-2">
                      privacy@bithrahapp.com
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <strong>واتساب:</strong>
                    <a href="https://wa.me/966592725341" className="text-blue-600 hover:underline mr-2" target="_blank">
                      +966 59 272 5341
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <strong>العنوان:</strong> المملكة العربية السعودية
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>آخر تحديث: 15 نوفمبر 2025</p>
            <p className="mt-2">© 2025 بذرة - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>
    </div>
  );
}
