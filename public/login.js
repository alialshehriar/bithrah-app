console.log('Login script loaded!');

// Define global function for onclick
window.handleQuickLogin = async function() {
  console.log('handleQuickLogin called!');
  
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  
  console.log('Form data:', { name, email });
  
  if (!name || !email) {
    showError('الرجاء إدخال الاسم والبريد الإلكتروني');
    return false;
  }
  
  submitBtn.disabled = true;
  btnText.textContent = 'جاري الدخول...';
  loading.classList.add('show');
  errorDiv.classList.remove('show');
  
  try {
    console.log('Sending request to API...');
    const response = await fetch('/api/auth/quick-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email })
    });
    
    const data = await response.json();
    console.log('API response:', data);
    
    if (response.ok && data.success) {
      console.log('Success! Redirecting to /home');
      window.location.href = '/home';
    } else {
      showError(data.error || 'حدث خطأ أثناء تسجيل الدخول');
      resetButton();
    }
  } catch (error) {
    console.error('Login error:', error);
    showError('حدث خطأ أثناء الاتصال بالخادم');
    resetButton();
  }
  
  return false;
  
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
  }
  
  function resetButton() {
    submitBtn.disabled = false;
    btnText.textContent = 'دخول';
    loading.classList.remove('show');
  }
};

console.log('handleQuickLogin function defined!');

