export default function FastEntry() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>دخول سريع - بذرة</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl text-white font-bold">ب</span>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            مرحباً بك في بذرة
          </h1>
          <p className="text-center text-gray-600 mb-8">
            أدخل معلوماتك للدخول مباشرة
          </p>

          <form id="quickLoginForm" className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-right text-gray-700 font-semibold mb-2">
                الاسم
              </label>
              <input
                type="text"
                id="userName"
                name="name"
                required
                placeholder="أدخل اسمك"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
                dir="rtl"
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-right text-gray-700 font-semibold mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="userEmail"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
                dir="rtl"
              />
            </div>

            <div id="errorMessage" className="hidden bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right"></div>

            <button
              type="submit"
              id="loginButton"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              دخول
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            لا حاجة لإنشاء حساب - فقط أدخل معلوماتك وابدأ
          </p>
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('Fast Entry page loaded!');
                
                function initForm() {
                  const form = document.getElementById('quickLoginForm');
                  const button = document.getElementById('loginButton');
                  const errorDiv = document.getElementById('errorMessage');
                  
                  if (!form) {
                    console.error('Form not found!');
                    return;
                  }
                  
                  form.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Form submitted!');
                    
                    const name = document.getElementById('userName').value.trim();
                    const email = document.getElementById('userEmail').value.trim();
                    
                    if (!name || !email) {
                      errorDiv.textContent = 'الرجاء إدخال الاسم والبريد الإلكتروني';
                      errorDiv.classList.remove('hidden');
                      return false;
                    }
                    
                    console.log('Sending request to API...');
                    button.disabled = true;
                    button.textContent = 'جاري الدخول...';
                    errorDiv.classList.add('hidden');
                    
                    try {
                      const response = await fetch('/api/auth/quick-entry', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, email }),
                      });
                      
                      const data = await response.json();
                      console.log('API Response:', data);
                      
                      if (!response.ok) {
                        errorDiv.textContent = data.error || 'حدث خطأ، الرجاء المحاولة مرة أخرى';
                        errorDiv.classList.remove('hidden');
                        button.disabled = false;
                        button.textContent = 'دخول';
                        return false;
                      }
                      
                      console.log('Success! Redirecting to /home');
                      window.location.href = '/home';
                    } catch (error) {
                      console.error('Error:', error);
                      errorDiv.textContent = 'حدث خطأ، الرجاء المحاولة مرة أخرى';
                      errorDiv.classList.remove('hidden');
                      button.disabled = false;
                      button.textContent = 'دخول';
                    }
                    
                    return false;
                  });
                  
                  console.log('Event listener attached successfully!');
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', initForm);
                } else {
                  initForm();
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

