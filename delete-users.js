const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function deleteAllUsers() {
  try {
    console.log('🗑️  جاري حذف جميع المستخدمين...');
    
    // Delete all users
    const result = await sql`DELETE FROM users`;
    
    console.log('✅ تم حذف جميع المستخدمين بنجاح!');
    console.log(`📊 عدد المستخدمين المحذوفين: ${result.length}`);
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

deleteAllUsers();
