const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function updateSandboxData() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 تحديث البيانات الوهمية...');
    
    // تحديث المستخدمين (ما عدا test@bithrah.com)
    await client.query(`
      UPDATE users 
      SET is_sandbox = true 
      WHERE email != 'test@bithrah.com'
    `);
    console.log('✅ تم تحديث المستخدمين');
    
    // تحديث المشاريع
    await client.query(`
      UPDATE projects 
      SET is_sandbox = true
    `);
    console.log('✅ تم تحديث المشاريع');
    
    // تحديث المجتمعات
    await client.query(`
      UPDATE communities 
      SET is_sandbox = true
    `);
    console.log('✅ تم تحديث المجتمعات');
    
    // تحديث المحافظ
    await client.query(`
      UPDATE wallets 
      SET is_sandbox = true
      WHERE user_id IN (SELECT id FROM users WHERE is_sandbox = true)
    `);
    console.log('✅ تم تحديث المحافظ');
    
    // تحديث المعاملات
    await client.query(`
      UPDATE transactions 
      SET is_sandbox = true
      WHERE user_id IN (SELECT id FROM users WHERE is_sandbox = true)
    `);
    console.log('✅ تم تحديث المعاملات');
    
    console.log('🎉 تم تحديث جميع البيانات الوهمية بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateSandboxData();
