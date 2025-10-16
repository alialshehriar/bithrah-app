require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function updateSandboxFlags() {
  try {
    console.log('Updating sandbox flags for all dummy data...\n');
    
    const projects = await sql`UPDATE projects SET is_sandbox = true WHERE id > 0`;
    console.log('✓ Updated projects');
    
    const backings = await sql`UPDATE backings SET is_sandbox = true WHERE id > 0`;
    console.log('✓ Updated backings');
    
    const wallets = await sql`UPDATE wallets SET is_sandbox = true WHERE id > 0`;
    console.log('✓ Updated wallets');
    
    console.log('\n✅ Successfully updated all sandbox flags!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateSandboxFlags();
