'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      setError('الرجاء إدخال الاسم والبريد الإلكتروني');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/quick-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim() 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success! Use window.location for full page reload to pick up cookie
        window.location.href = '/home';
      } else {
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء الاتصال بالخادم');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-4xl font-bold">ب</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحباً بك في بذرة</h1>
          <p className="text-gray-600">أدخل معلوماتك للبدء مباشرة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-gray-800"
              placeholder="أدخل اسمك"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none transition-colors text-gray-800"
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-sm text-gray-500 text-center">
            لا حاجة لإنشاء حساب - فقط أدخل معلوماتك وابدأ!
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الدخول...
              </>
            ) : (
              'دخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

