const { neon } = require('@neondatabase/serverless');

async function populateSandboxData() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 بدء إضافة بيانات sandbox...\n');

    // 1. جلب جميع المستخدمين
    const users = await sql`SELECT id, name, email FROM users ORDER BY created_at DESC LIMIT 20`;
    console.log(`✅ تم جلب ${users.length} مستخدم\n`);

    // 2. تحديث نقاط ومستويات المستخدمين
    console.log('📊 تحديث نقاط ومستويات المستخدمين...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const points = 100 + (i * 250); // من 100 إلى 5000
      const level = Math.floor(points / 500) + 1; // من 1 إلى 11
      
      await sql`
        UPDATE users 
        SET points = ${points}, 
            level = ${level}
        WHERE id = ${user.id}
      `;
      console.log(`  ✓ ${user.name}: ${points} نقطة، المستوى ${level}`);
    }
    console.log('✅ تم تحديث جميع المستخدمين\n');

    // 3. إضافة تنبيهات لجميع المستخدمين
    console.log('🔔 إضافة تنبيهات للمستخدمين...');
    const notificationTypes = [
      { type: 'project_approved', title: 'مشروعك معتمد!', content: 'تم اعتماد مشروعك بنجاح وهو الآن متاح للدعم' },
      { type: 'project_supported', title: 'دعم جديد!', content: 'تلقيت دعماً بقيمة 500 ريال لمشروعك' },
      { type: 'referral_reward', title: 'مكافأة إحالة!', content: 'حصلت على 50 ريال مكافأة إحالة' },
      { type: 'community_post', title: 'منشور جديد', content: 'هناك منشور جديد في مجتمع رواد التقنية' },
      { type: 'achievement', title: 'إنجاز جديد!', content: 'حصلت على وسام "الداعم النشط"' }
    ];

    for (const user of users) {
      // إضافة 3-5 تنبيهات لكل مستخدم
      const notifCount = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < notifCount; i++) {
        const notif = notificationTypes[i % notificationTypes.length];
        await sql`
          INSERT INTO notifications (user_id, type, title, content, read, action_url)
          VALUES (
            ${user.id},
            ${notif.type},
            ${notif.title},
            ${notif.content},
            ${i > 1},
            '/home'
          )
        `;
      }
      console.log(`  ✓ ${user.name}: ${notifCount} تنبيه`);
    }
    console.log('✅ تم إضافة التنبيهات\n');

    // 4. إضافة مجتمعات إضافية إذا لم تكن موجودة
    console.log('👥 التحقق من المجتمعات...');
    const existingCommunities = await sql`SELECT COUNT(*) as count FROM communities`;
    if (existingCommunities[0].count < 5) {
      const communities = [
        { name: 'مجتمع رواد التقنية', description: 'مجتمع للمهتمين بالتعليم الرقمي والتقنيات التعليمية', type: 'public', category: 'تقنية', member_count: 856 },
        { name: 'مجتمع المستثمرين', description: 'مجتمع خاص للمستثمرين لمناقشة الفرص الاستثمارية', type: 'private', category: 'استثمار', member_count: 234 },
        { name: 'مجتمع التعليم الرقمي', description: 'مجتمع للمهتمين بالتعليم الرقمي', type: 'public', category: 'تعليم', member_count: 567 },
        { name: 'مجتمع الصحة والعافية', description: 'مجتمع للمهتمين بالصحة', type: 'public', category: 'صحة', member_count: 423 },
        { name: 'مجتمع ريادة الأعمال', description: 'مجتمع لرواد الأعمال', type: 'public', category: 'أعمال', member_count: 712 }
      ];

      for (const community of communities) {
        await sql`
          INSERT INTO communities (name, description, type, category, member_count, created_by, created_at)
          VALUES (
            ${community.name},
            ${community.description},
            ${community.type},
            ${community.category},
            ${community.member_count},
            ${users[0].id},
            NOW()
          )
          ON CONFLICT (name) DO NOTHING
        `;
      }
      console.log('✅ تم إضافة المجتمعات\n');
    } else {
      console.log('✅ المجتمعات موجودة بالفعل\n');
    }

    // 5. إحصائيات نهائية
    console.log('📊 الإحصائيات النهائية:');
    const stats = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE points > 0) as users_with_points,
        (SELECT COUNT(*) FROM notifications) as total_notifications,
        (SELECT COUNT(*) FROM communities) as total_communities
      FROM users
    `;
    console.log(`  ✓ مستخدمون بنقاط: ${stats[0].users_with_points}`);
    console.log(`  ✓ إجمالي التنبيهات: ${stats[0].total_notifications}`);
    console.log(`  ✓ إجمالي المجتمعات: ${stats[0].total_communities}`);

    console.log('\n🎉 تم إضافة جميع بيانات sandbox بنجاح!');
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
}

populateSandboxData();

