'use client';
import { useState } from 'react';

export default function QuickLoginPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('Login button clicked!');
    
    if (!name.trim() || !email.trim()) {
      setError('الرجاء إدخال الاسم والبريد الإلكتروني');
      return;
    }
    
    console.log('Sending request to API...');
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/quick-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!response.ok) {
        setError(data.error || 'حدث خطأ، الرجاء المحاولة مرة أخرى');
        setLoading(false);
        return;
      }
      
      console.log('Success! Redirecting to /home');
      window.location.href = '/home';
    } catch (err) {
      console.error('Error:', err);
      setError('حدث خطأ، الرجاء المحاولة مرة أخرى');
      setLoading(false);
    }
  };
  
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
            <label htmlFor="userName" className="block text-right text-gray-700 font-semibold mb-2">
              الاسم
            </label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
              dir="rtl"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="userEmail" className="block text-right text-gray-700 font-semibold mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="userEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-right"
              dir="rtl"
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          لا حاجة لإنشاء حساب - فقط أدخل معلوماتك وابدأ
        </p>
      </div>
    </div>
  );
}

