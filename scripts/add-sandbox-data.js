const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function addSandboxData() {
  try {
    console.log('Adding sandbox data...');

    // 1. Add notifications for all users
    const users = await sql`SELECT id FROM users LIMIT 10`;
    
    for (const user of users) {
      // Add welcome notification
      try {
        await sql`
          INSERT INTO notifications (user_id, type, title, content, read, created_at)
          VALUES (
            ${user.id},
            'welcome',
            'مرحباً بك في بذرة! 🎉',
            'نحن سعداء بانضمامك إلينا. ابدأ باستكشاف المشاريع أو إنشاء مشروعك الخاص.',
            false,
            NOW() - INTERVAL '1 day'
          )
          ON CONFLICT DO NOTHING
        `;
      } catch (e) {
        console.log('Skipping welcome notification:', e.message);
      }

      // Add project approved notification
      try {
        await sql`
          INSERT INTO notifications (user_id, type, title, content, read, created_at)
          VALUES (
            ${user.id},
            'project_approved',
            'تم اعتماد مشروعك ✅',
            'تهانينا! تم اعتماد مشروعك وهو الآن متاح للجميع.',
            false,
            NOW() - INTERVAL '2 hours'
          )
          ON CONFLICT DO NOTHING
        `;
      } catch (e) {
        console.log('Skipping project approved notification:', e.message);
      }

      // Add backing notification
      try {
        await sql`
          INSERT INTO notifications (user_id, type, title, content, read, created_at)
          VALUES (
            ${user.id},
            'backing',
            'دعم جديد لمشروعك 💰',
            'تلقيت دعماً جديداً بقيمة 500 ريال لمشروعك.',
            false,
            NOW() - INTERVAL '5 hours'
          )
          ON CONFLICT DO NOTHING
        `;
      } catch (e) {
        console.log('Skipping backing notification:', e.message);
      }

      // Add referral notification
      try {
        await sql`
          INSERT INTO notifications (user_id, type, title, content, read, created_at)
          VALUES (
            ${user.id},
            'referral',
            'مكافأة إحالة جديدة 🎁',
            'حصلت على 50 ريال مكافأة إحالة!',
            true,
            NOW() - INTERVAL '1 week'
          )
          ON CONFLICT DO NOTHING
        `;
      } catch (e) {
        console.log('Skipping referral notification:', e.message);
      }
    }

    // 2. Add wallet balance for all users
    try {
      await sql`
        UPDATE wallets
        SET balance = 1000.00, updated_at = NOW()
        WHERE user_id IN (SELECT id FROM users LIMIT 10)
      `;
      console.log('✅ Updated wallet balances');
    } catch (e) {
      console.log('Skipping wallet balances:', e.message);
    }

    // 3. Add leaderboard data (update user points)
    try {
      await sql`
        UPDATE users
        SET 
          points = FLOOR(RANDOM() * 5000 + 500)::integer,
          level = FLOOR(RANDOM() * 10 + 1)::integer,
          updated_at = NOW()
        WHERE id IN (SELECT id FROM users LIMIT 20)
      `;
      console.log('✅ Updated user points and levels');
    } catch (e) {
      console.log('Error updating user points:', e.message);
    }

    console.log('✅ Sandbox data added successfully!');
  } catch (error) {
    console.error('Error adding sandbox data:', error);
  }
}

addSandboxData();

