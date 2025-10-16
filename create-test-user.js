const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL;
const sql = neon(DATABASE_URL);

async function createTestUser() {
  try {
    console.log('🔐 جاري تشفير كلمة المرور...');
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    console.log('👤 جاري إنشاء المستخدم التجريبي...');
    
    const result = await sql`
      INSERT INTO users (
        name, 
        email, 
        password, 
        role, 
        email_verified, 
        username,
        created_at,
        updated_at
      ) VALUES (
        'مستخدم تجريبي',
        'test@bithrah.com',
        ${hashedPassword},
        'user',
        true,
        'testuser',
        NOW(),
        NOW()
      ) RETURNING id, name, email, username, role
    `;
    
    console.log('✅ تم إنشاء المستخدم التجريبي بنجاح!');
    console.log('📊 بيانات المستخدم:', result[0]);
    console.log('\n🔑 بيانات تسجيل الدخول:');
    console.log('   البريد الإلكتروني: test@bithrah.com');
    console.log('   كلمة المرور: 123456');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

createTestUser();
