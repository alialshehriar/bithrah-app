'use client';

export default function QuickLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl text-white font-bold">ب</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          مرحباً بك في بذرة
        </h1>
        <p className="text-center text-gray-600 mb-8">
          أدخل معلوماتك للدخول مباشرة
        </p>

        {/* Form */}
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">
              الاسم
            </label>
            <input
              type="text"
              id="userName"
              placeholder="أدخل اسمك"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
              dir="rtl"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-right text-gray-700 font-semibold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="userEmail"
              placeholder="example@email.com"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
              dir="rtl"
            />
          </div>

          {/* Error */}
          <div id="errorMessage" className="hidden bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
          </div>

          {/* Submit Button */}
          <button
            type="button"
            id="loginButton"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            دخول
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          لا حاجة لإنشاء حساب - فقط أدخل معلوماتك وابدأ
        </p>
      </div>

      {/* Inline Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          (function() {
            console.log('Quick login script loaded');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initQuickLogin);
            } else {
              initQuickLogin();
            }
            
            function initQuickLogin() {
              console.log('Initializing quick login');
              const button = document.getElementById('loginButton');
              const nameInput = document.getElementById('userName');
              const emailInput = document.getElementById('userEmail');
              const errorDiv = document.getElementById('errorMessage');
              
              if (!button || !nameInput || !emailInput) {
                console.error('Elements not found');
                return;
              }
              
              console.log('Elements found, attaching event listener');
              
              button.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Button clicked!');
                
                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                
                if (!name || !email) {
                  showError('الرجاء إدخال الاسم والبريد الإلكتروني');
                  return;
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
                    showError(data.error || 'حدث خطأ، الرجاء المحاولة مرة أخرى');
                    button.disabled = false;
                    button.textContent = 'دخول';
                    return;
                  }
                  
                  console.log('Success! Redirecting to /home');
                  window.location.href = '/home';
                } catch (error) {
                  console.error('Error:', error);
                  showError('حدث خطأ، الرجاء المحاولة مرة أخرى');
                  button.disabled = false;
                  button.textContent = 'دخول';
                }
              });
              
              function showError(message) {
                errorDiv.textContent = message;
                errorDiv.classList.remove('hidden');
              }
            }
          })();
        `
      }} />
    </div>
  );
}

