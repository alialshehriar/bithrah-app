

export default function LoginPage() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>بذرة - دخول سريع</title>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 50%, #8b5cf6 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
          .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 450px;
            width: 100%;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #14b8a6, #8b5cf6);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: white;
            margin: 0 auto 20px;
          }
          
          h1 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 28px;
          }
          
          .subtitle {
            text-align: center;
            color: #6b7280;
            margin-bottom: 30px;
            font-size: 14px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          label {
            display: block;
            color: #374151;
            font-weight: 500;
            margin-bottom: 8px;
            font-size: 14px;
          }
          
          input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            transition: all 0.3s;
            font-family: inherit;
          }
          
          input:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          }
          
          .info-text {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            margin: 20px 0;
          }
          
          button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #14b8a6, #8b5cf6);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3);
          }
          
          button:active {
            transform: translateY(0);
          }
          
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          
          .error {
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
            display: none;
          }
          
          .error.show {
            display: block;
          }
          
          .loading {
            display: none;
          }
          
          .loading.show {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-left: 10px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="logo">ب</div>
          <h1>مرحباً بك في بذرة</h1>
          <p className="subtitle">أدخل معلوماتك للدخول مباشرة</p>
          
          <div id="error" className="error"></div>
          
          <div id="loginForm">
            <div className="form-group">
              <label htmlFor="name">الاسم</label>
              <input type="text" id="name" name="name" placeholder="أدخل اسمك" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني</label>
              <input type="email" id="email" name="email" placeholder="example@email.com" required />
            </div>
            
            <p className="info-text">لا حاجة لإنشاء حساب - فقط أدخل معلوماتك وابدأ</p>
            
            <button type="button" id="submitBtn" onclick="(async function() { const name = document.getElementById('name').value.trim(); const email = document.getElementById('email').value.trim(); const submitBtn = document.getElementById('submitBtn'); const btnText = document.getElementById('btnText'); const loading = document.getElementById('loading'); const errorDiv = document.getElementById('error'); console.log('Button clicked!', {name, email}); if (!name || !email) { errorDiv.textContent = 'الرجاء إدخال الاسم والبريد الإلكتروني'; errorDiv.classList.add('show'); return false; } submitBtn.disabled = true; btnText.textContent = 'جاري الدخول...'; loading.classList.add('show'); errorDiv.classList.remove('show'); try { console.log('Sending request...'); const response = await fetch('/api/auth/quick-entry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email }) }); const data = await response.json(); console.log('Response:', data); if (response.ok && data.success) { console.log('Success! Redirecting...'); window.location.href = '/home'; } else { errorDiv.textContent = data.error || 'حدث خطأ'; errorDiv.classList.add('show'); submitBtn.disabled = false; btnText.textContent = 'دخول'; loading.classList.remove('show'); } } catch (error) { console.error('Error:', error); errorDiv.textContent = 'حدث خطأ أثناء الاتصال'; errorDiv.classList.add('show'); submitBtn.disabled = false; btnText.textContent = 'دخول'; loading.classList.remove('show'); } return false; })(); return false;">
              <span id="btnText">دخول</span>
              <span id="loading" className="loading"></span>
            </button>
          </div>
        </div>
        

        
      </body>
    </html>
  );
}

