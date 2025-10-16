const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addFields() {
  const client = await pool.connect();
  try {
    console.log('🚀 إضافة الحقول الناقصة...');
    
    await client.query(`
      ALTER TABLE wallets 
      ADD COLUMN IF NOT EXISTS pending_balance NUMERIC(12, 2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS total_earned NUMERIC(12, 2) DEFAULT 0.00,
      ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN DEFAULT false;
    `);
    
    console.log('✅ تم إضافة الحقول بنجاح!');
    
    // إنشاء محفظة للمستخدم التجريبي إذا لم تكن موجودة
    const walletCheck = await client.query('SELECT id FROM wallets WHERE user_id = 17');
    if (walletCheck.rows.length === 0) {
      await client.query(`
        INSERT INTO wallets (user_id, balance, currency, status)
        VALUES (17, 0.00, 'SAR', 'active')
      `);
      console.log('✅ تم إنشاء محفظة للمستخدم التجريبي');
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

addFields();
