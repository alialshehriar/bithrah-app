const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'achievements'
      ORDER BY ordinal_position
    `);
    console.log('Achievements table columns:');
    result.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type}`));
  } finally {
    client.release();
    await pool.end();
  }
}
check();
