const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'negotiation_gates'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 بنية جدول negotiation_gates:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    // Check negotiations table
    const negotiationsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'negotiations'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 بنية جدول negotiations:');
    negotiationsResult.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
