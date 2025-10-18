import { neon } from '@neondatabase/serverless';

async function checkSchema() {
  const sql = neon(process.env.DATABASE_URL!);
  
  const result = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'support_tiers'
    ORDER BY ordinal_position
  `;
  
  console.log('Columns in support_tiers table:');
  result.forEach(col => console.log(`- ${col.column_name}: ${col.data_type}`));
}

checkSchema();

