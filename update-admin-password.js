const { Pool } = require('pg');

async function updatePassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
  
  const hashedPassword = '$2a$10$gd4pqiknaz8Rf67HRMADnuRn3vAxOYZS0Pj6J6PmuWX9naY7R78Mq';
  
  try {
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email, role',
      [hashedPassword, 'ali.saeed202@hotmail.com']
    );
    console.log('Password updated successfully:', result.rows[0]);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await pool.end();
  }
}

updatePassword();
