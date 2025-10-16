const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function applyMigration() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations/wallet-and-commission-system.sql'),
      'utf8'
    );
    
    console.log('🚀 تطبيق migration على قاعدة البيانات...');
    await client.query(sql);
    console.log('✅ تم تطبيق migration بنجاح!');
    
    // التحقق من الجداول المنشأة
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('wallets', 'transactions', 'referral_codes', 'referrals', 'commissions', 'withdrawal_requests')
      ORDER BY table_name;
    `);
    
    console.log('\n📊 الجداول المنشأة:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ خطأ في تطبيق migration:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigration();
