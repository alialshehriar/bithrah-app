const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
  const client = await pool.connect();
  try {
    // Check communities table
    const communitiesResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'communities'
      ORDER BY ordinal_position;
    `);
    
    console.log('📊 جدول communities:');
    if (communitiesResult.rows.length > 0) {
      communitiesResult.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.log('  ❌ الجدول غير موجود');
    }
    
    // Check community_members table
    const membersResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'community_members'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 جدول community_members:');
    if (membersResult.rows.length > 0) {
      membersResult.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.log('  ❌ الجدول غير موجود');
    }
    
    // Check community_posts table
    const postsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'community_posts'
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📊 جدول community_posts:');
    if (postsResult.rows.length > 0) {
      postsResult.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    } else {
      console.log('  ❌ الجدول غير موجود');
    }
    
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema();
