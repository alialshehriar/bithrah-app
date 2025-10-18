const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function testDashboard() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    
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
    
    // Get projects count
    const projectsCount = await sql`
      SELECT COUNT(*) as count
      FROM projects
      WHERE creator_id = ${userId}
    `;
    
    console.log('\n=== Projects Count ===');
    console.log(projectsCount[0]);
    
    // Get backings count and total
    const backingsData = await sql`
      SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total
      FROM backings
      WHERE user_id = ${userId}
    `;
    
    console.log('\n=== Backings Data ===');
    console.log(backingsData[0]);
    
    // Final stats
    const stats = {
      projectsCount: parseInt(projectsCount[0].count),
      backingsCount: parseInt(backingsData[0].count),
      totalBacked: parseFloat(backingsData[0].total),
      points: user.points || 0,
      level: user.level || 1,
    };
    
    console.log('\n=== Final Stats ===');
    console.log(stats);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testDashboard();
