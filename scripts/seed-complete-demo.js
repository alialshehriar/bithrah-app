const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function seedCompleteDemo() {
  console.log('🌱 Starting complete demo content seeding...\n');

  try {
    // 1. إنشاء فعالية تجريبية
    console.log('📅 Creating demo event...');
    const event = await sql`
      INSERT INTO events (
        title, description, event_type, start_date, end_date,
        location, is_online, max_participants, is_demo, created_at
      ) VALUES (
        'معرض بذرة للمشاريع الناشئة 2025',
        'معرض شامل يجمع رواد الأعمال والمستثمرين لعرض أفضل المشاريع الناشئة في المملكة. فرصة فريدة للتواصل والتمويل والنمو.',
        'exhibition',
        NOW() + INTERVAL '7 days',
        NOW() + INTERVAL '10 days',
        'مركز الرياض الدولي للمؤتمرات والمعارض',
        false,
        500,
        true,
        NOW()
      )
      RETURNING id
    `;
    console.log('✅ Event created:', event[0].id);

    // 2. إنشاء منشورات في المجتمع التجريبي
    console.log('\n💬 Creating community posts...');
    const community = await sql`SELECT id FROM communities WHERE is_demo = true LIMIT 1`;
    
    if (community.length > 0) {
      const communityId = community[0].id;
      const users = await sql`SELECT id FROM users LIMIT 3`;
      
      const posts = [
        {
          title: 'كيف تبدأ مشروعك الناشئ بنجاح؟',
          content: 'مشاركة تجربتي في إطلاق مشروعي الأول. أهم الدروس المستفادة والنصائح للمبتدئين في عالم ريادة الأعمال.',
          author_id: users[0].id
        },
        {
          title: 'أفضل استراتيجيات التسويق للمشاريع الصغيرة',
          content: 'دليل شامل لأهم استراتيجيات التسويق الرقمي التي يمكن أن تساعد مشروعك على النمو بميزانية محدودة.',
          author_id: users[1].id
        },
        {
          title: 'تجربتي في الحصول على تمويل لمشروعي',
          content: 'رحلتي من الفكرة إلى التمويل. كيف أقنعت المستثمرين وما هي الأخطاء التي تجنبتها.',
          author_id: users[2].id
        }
      ];

      for (const post of posts) {
        await sql`
          INSERT INTO community_posts (
            community_id, author_id, title, content, 
            likes_count, comments_count, created_at
          ) VALUES (
            ${communityId}, ${post.author_id}, ${post.title}, ${post.content},
            ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 20)}, NOW()
          )
        `;
      }
      console.log('✅ Created 3 community posts');
    }

    // 3. إنشاء معاملات محفظة تجريبية
    console.log('\n💰 Creating wallet transactions...');
    const users = await sql`SELECT id FROM users`;
    
    for (const user of users) {
      // معاملة إيداع أولية
      await sql`
        INSERT INTO wallet_transactions (
          user_id, type, amount, status, description, created_at
        ) VALUES (
          ${user.id}, 'deposit', 100000, 'completed',
          'رصيد تجريبي مبدئي - استمتع بتجربة كاملة لجميع ميزات المنصة',
          NOW()
        )
      `;
      
      // معاملة دعم مشروع
      await sql`
        INSERT INTO wallet_transactions (
          user_id, type, amount, status, description, created_at
        ) VALUES (
          ${user.id}, 'investment', -5000, 'completed',
          'دعم مشروع: منصة تعليمية ذكية',
          NOW() - INTERVAL '2 days'
        )
      `;
    }
    console.log('✅ Created wallet transactions for all users');

    console.log('\n🎉 Complete demo seeding finished successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding demo content:', error);
    throw error;
  }
}

seedCompleteDemo();
