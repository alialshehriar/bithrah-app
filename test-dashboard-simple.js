const { neon } = require('@neondatabase/serverless');

async function testDashboard() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      console.log('DATABASE_URL not found in environment');
      return;
    }
    
    const sql = neon(DATABASE_URL);
    
    // Test query for user ID 16 (خالد أحمد العتيبي)
    const userId = 16;
    
    console.log('Testing Dashboard API for user:', userId);
    
    // Get user stats
    const users = await sql`
      SELECT id, name, points, level
      FROM users
      WHERE id = ${userId}
    `;
    
    console.log('\n=== User Data ===');
    console.log(users[0]);
    
    if (users.length === 0) {
      console.log('User not found!');
      return;
    }
    
    const user = users[0];
    
    console.log('\n=== Points from DB ===');
    console.log('Points:', user.points);
    console.log('Level:', user.level);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDashboard();
