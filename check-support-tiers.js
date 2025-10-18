import { db } from './lib/db/index.js';
import { sql } from 'drizzle-orm';

async function checkTables() {
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('support_tiers', 'backings')
    `);

    console.log('Tables found:');
    if (result.rows.length === 0) {
      console.log('  No support_tiers or backings tables found');
    } else {
      result.rows.forEach(row => console.log('  -', row.table_name));
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTables();

