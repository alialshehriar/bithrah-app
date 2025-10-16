const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'users' ORDER BY ordinal_position;
    `);
    console.log('Columns in users table:');
    result.rows.forEach(row => console.log(`  - ${row.column_name}`));
  } finally {
    client.release();
    await pool.end();
  }
}
check();
