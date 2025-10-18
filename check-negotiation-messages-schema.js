import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(() => {
  return client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'negotiation_messages'
    ORDER BY ordinal_position
  `);
}).then(result => {
  console.log('Columns in negotiation_messages table:');
  result.rows.forEach(row => {
    console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
  });
  client.end();
}).catch(err => {
  console.error('Error:', err.message);
  client.end();
});
