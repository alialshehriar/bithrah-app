const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'wallets'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 بنية جدول wallets:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
    });
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
