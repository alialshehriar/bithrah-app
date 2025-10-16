const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkUser() {
  try {
    const result = await pool.query(
      "SELECT id, name, email, password, email_verified FROM users WHERE email = $1 LIMIT 1",
      ['ahmed.test@example.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ المستخدم غير موجود في قاعدة البيانات');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ المستخدم موجود:');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Has Password:', !!user.password);
    console.log('Email Verified:', user.email_verified);
    
    if (user.password) {
      const isMatch = await bcrypt.compare('Test123456', user.password);
      console.log('Password Match:', isMatch);
      
      if (!isMatch) {
        console.log('\n❌ كلمة المرور غير متطابقة!');
        console.log('سأقوم بتحديث كلمة المرور...');
        
        const hashedPassword = await bcrypt.hash('Test123456', 10);
        await pool.query(
          'UPDATE users SET password = $1 WHERE email = $2',
          [hashedPassword, 'ahmed.test@example.com']
        );
        
        console.log('✅ تم تحديث كلمة المرور بنجاح!');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkUser();

