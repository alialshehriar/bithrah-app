export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          عن بذرة
        </h1>
        
        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-6 rounded-xl mb-8">
              <p className="text-xl font-semibold text-center">
                منصة سعودية شاملة لتقييم المشاريع، التمويل الجماعي، التفاوض، والمجتمعات الريادية
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌱 ما هي بذرة؟</h2>
            <p>
              <strong>بذرة</strong> هي منصة سعودية مبتكرة تهدف إلى دعم رواد الأعمال والمبتكرين في تحويل أفكارهم إلى مشاريع ناجحة. 
              نوفر نظاماً متكاملاً يجمع بين التقييم الذكي للأفكار، التمويل الجماعي، بوابة التفاوض المباشر، والمجتمعات التفاعلية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 رؤيتنا</h2>
            <p>
              أن نكون المنصة الرائدة في المملكة العربية السعودية لدعم الابتكار وريادة الأعمال، 
              ونساهم في تحقيق رؤية المملكة 2030 من خلال تمكين الشباب السعودي من تحويل أفكارهم إلى واقع ملموس.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 مهمتنا</h2>
            <p>
              تسهيل رحلة رائد الأعمال من الفكرة إلى التنفيذ من خلال:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>توفير أدوات تقييم ذكية مدعومة بالذكاء الاصطناعي</li>
              <li>ربط أصحاب الأفكار بالداعمين والمستثمرين</li>
              <li>تسهيل عمليات التفاوض والتواصل المباشر</li>
              <li>بناء مجتمعات تفاعلية تدعم التعلم والنمو</li>
              <li>الالتزام الكامل بأنظمة هيئة السوق المالية السعودية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ ما يميز بذرة</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border-r-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🤖 تقييم ذكي</h3>
                <p>
                  نظام تقييم متقدم مدعوم بالذكاء الاصطناعي (GPT-4) يحلل أفكارك ومشاريعك 
                  ويقدم تقييماً شاملاً في 10-15 ثانية فقط.
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl border-r-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">💼 باقات دعم متنوعة</h3>
                <p>
                  5 مستويات من باقات الدعم (البذرة، الشتلة، الشجرة، الغابة، الواحة) 
                  تناسب جميع احتياجات المشاريع والداعمين.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border-r-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🤝 بوابة التفاوض</h3>
                <p>
                  نظام تفاوض آمن ومنظم يتضمن اتفاقية عدم إفشاء (NDA) وعربون لضمان 
                  جدية الأطراف وحماية حقوق الجميع.
                </p>
              </div>

              <div className="bg-yellow-50 p-6 rounded-xl border-r-4 border-yellow-500">
                <h3 className="text-xl font-bold text-gray-900 mb-3">👥 مجتمعات تفاعلية</h3>
                <p>
                  مجتمعات متخصصة (التقنية، الصحة، التعليم) مع منشورات، تفاعلات، 
                  ولوحات صدارة تحفز المشاركة والتعلم.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚖️ الالتزام بالأنظمة السعودية</h2>
            <div className="bg-green-50 border-r-4 border-green-500 p-6 rounded-xl">
              <p className="mb-4">
                نلتزم بشكل كامل بأنظمة <strong>هيئة السوق المالية السعودية</strong>:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>باقات الدعم تقدم <strong>منتجات وخدمات ملموسة فقط</strong></li>
                <li><strong>لا نقدم حصص أو شراكات</strong> في المشاريع</li>
                <li>جميع العوائد على شكل منتجات، خدمات، أو تقدير معنوي</li>
                <li>نلتزم بقوانين التمويل الجماعي والتجارة الإلكترونية</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏗️ المرحلة الحالية: MVP</h2>
            <div className="bg-yellow-50 border-r-4 border-yellow-500 p-6 rounded-xl">
              <p className="font-bold mb-3">المنصة حالياً في مرحلة MVP (Minimum Viable Product):</p>
              <ul className="list-disc list-inside space-y-2">
                <li>تم تطويرها لأغراض العرض والاختبار</li>
                <li>جميع الميزات الأساسية متاحة وجاهزة للتجربة</li>
                <li>نعمل بشكل مستمر على التحسين والتطوير</li>
                <li>نرحب بملاحظاتكم واقتراحاتكم لتحسين المنصة</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍💻 من وراء بذرة</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
              <p className="mb-4">
                <strong>بذرة</strong> تم تطويرها بالكامل بواسطة <strong>علي سعيد الشهري</strong>، 
                مطور ورائد أعمال سعودي شغوف بالتقنية والابتكار.
              </p>
              <p>
                المنصة هي نتاج رؤية واضحة لدعم رواد الأعمال السعوديين وتوفير أدوات حديثة 
                تساعدهم في تحويل أفكارهم إلى مشاريع ناجحة.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 الإحصائيات الحالية</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-cyan-50 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">4</div>
                <div className="text-gray-700">مشاريع تجريبية</div>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-700">باقات دعم</div>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
                <div className="text-gray-700">مجتمعات نشطة</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📞 تواصل معنا</h2>
            <p className="mb-4">
              نحن دائماً سعداء بالاستماع إليك! سواء كانت لديك أسئلة، اقتراحات، أو ترغب في التعاون:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <strong>البريد الإلكتروني:</strong>
                    <a href="mailto:info@bithrahapp.com" className="text-blue-600 hover:underline mr-2">
                      info@bithrahapp.com
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
                  <span className="text-2xl">💼</span>
                  <div>
                    <strong>LinkedIn:</strong>
                    <a href="https://www.linkedin.com/in/ali-saeed-alshehri-ar" className="text-blue-600 hover:underline mr-2" target="_blank">
                      علي سعيد الشهري
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="text-center pt-8">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">🌟 انضم إلى رحلة بذرة</h3>
              <p className="text-lg mb-6">
                كن جزءاً من مجتمع رواد الأعمال السعوديين واجعل فكرتك واقعاً!
              </p>
              <a 
                href="/projects" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                استكشف المشاريع
              </a>
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
