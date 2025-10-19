const { neon } = require('@neondatabase/serverless');

async function seedDemoData() {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('🌱 Starting demo data seeding...');
  
  try {
    // Clean existing data
    console.log('🧹 Cleaning existing data...');
    await sql`TRUNCATE TABLE projects CASCADE`;
    await sql`TRUNCATE TABLE communities CASCADE`;
    await sql`TRUNCATE TABLE community_posts CASCADE`;
    await sql`TRUNCATE TABLE backings CASCADE`;
    await sql`TRUNCATE TABLE negotiations CASCADE`;
    await sql`TRUNCATE TABLE wallet_transactions CASCADE`;
    
    console.log('✅ Data cleaned successfully');
    
    // First, create a demo user if not exists
    console.log('👤 Creating demo admin user...');
    const demoUser = await sql`
      INSERT INTO users (
        username, email, password_hash, role, full_name, bio, 
        avatar, verified, created_at, updated_at
      ) VALUES (
        'demo-admin',
        'demo@bithrah.com',
        '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemo',
        'admin',
        'مدير بذرة التجريبي',
        'حساب تجريبي لإدارة المحتوى التجريبي في منصة بذرة',
        '/images/demo-avatar.jpg',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
      RETURNING id
    `;
    
    const demoUserId = demoUser[0].id;
    console.log(`✅ Demo user created with ID: ${demoUserId}`);
    
    // Insert Demo Project
    console.log('📦 Creating demo project...');
    const demoProject = await sql`
      INSERT INTO projects (
        creator_id, title, slug, description, short_description,
        category, tags, image, cover_image, video,
        funding_goal, current_funding, currency,
        backers_count, deadline, status, visibility,
        featured, verified, is_sandbox, trending,
        created_at, updated_at, published_at
      ) VALUES (
        ${demoUserId},
        'مشروع بذرة التجريبي',
        'demo-bithrah-project',
        'مشروع تجريبي متكامل يوضح كيفية عمل منصة بذرة. يمكنك دعم هذا المشروع بالرصيد التجريبي لتجربة النظام بالكامل. هذا المشروع يحتوي على جميع الميزات المتاحة في المنصة بما في ذلك الباقات المتعددة، نظام التفاوض، وحماية الملكية الفكرية.',
        'مشروع تجريبي لتجربة جميع ميزات منصة بذرة',
        'technology',
        '["تجريبي", "تقنية", "ابتكار", "منصة"]'::jsonb,
        '/images/demo-project.jpg',
        '/images/demo-project-cover.jpg',
        'https://www.youtube.com/watch?v=demo',
        100000,
        45000,
        'SAR',
        24,
        NOW() + INTERVAL '30 days',
        'active',
        'public',
        true,
        true,
        true,
        true,
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    
    const demoProjectId = demoProject[0].id;
    console.log(`✅ Demo project created with ID: ${demoProjectId}`);
    
    // Insert Demo Project Packages
    console.log('📦 Creating demo packages...');
    await sql`
      INSERT INTO support_packages (
        project_id, title, description, amount, benefits,
        max_backers, current_backers, created_at
      ) VALUES 
      (
        ${demoProjectId},
        'باقة الداعم',
        'دعم أساسي للمشروع التجريبي',
        50,
        '["شكر خاص", "اسمك في قائمة الداعمين"]'::jsonb,
        100,
        12,
        NOW()
      ),
      (
        ${demoProjectId},
        'باقة المميز',
        'دعم متوسط مع مزايا إضافية',
        500,
        '["شكر خاص", "اسمك في قائمة الداعمين", "تحديثات حصرية", "دعوة لحدث الإطلاق"]'::jsonb,
        50,
        8,
        NOW()
      ),
      (
        ${demoProjectId},
        'باقة الشريك',
        'دعم كامل مع شراكة استراتيجية',
        5000,
        '["شكر خاص", "اسمك في قائمة الداعمين", "تحديثات حصرية", "دعوة لحدث الإطلاق", "لقاء مع الفريق", "شراكة استراتيجية"]'::jsonb,
        10,
        2,
        NOW()
      )
    `;
    
    console.log('✅ Demo packages created');
    
    // Insert Demo Community
    console.log('👥 Creating demo community...');
    const demoCommunity = await sql`
      INSERT INTO communities (
        name, slug, description, category, creator_id,
        member_count, created_at, updated_at, image, tags,
        is_private, verified
      ) VALUES (
        'مجتمع بذرة التفاعلي',
        'demo-bithrah-community',
        'مجتمع تجريبي لتجربة ميزات المجتمعات في بذرة. شارك أفكارك وتفاعل مع المستخدمين الآخرين.',
        'technology',
        ${demoUserId},
        156,
        NOW(),
        NOW(),
        '/images/demo-community.jpg',
        '["تجريبي", "تقنية", "ابتكار", "مجتمع"]'::jsonb,
        false,
        true
      )
      RETURNING id
    `;
    
    const demoCommunityId = demoCommunity[0].id;
    console.log(`✅ Demo community created with ID: ${demoCommunityId}`);
    
    // Insert Demo Community Posts
    console.log('📝 Creating demo posts...');
    await sql`
      INSERT INTO community_posts (
        community_id, user_id, content, likes_count, comments_count, created_at, updated_at
      ) VALUES 
      (
        ${demoCommunityId},
        ${demoUserId},
        'مرحباً بكم في مجتمع بذرة التجريبي! هنا يمكنكم تجربة ميزات المجتمعات والتفاعل مع المستخدمين الآخرين.',
        24,
        8,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
      ),
      (
        ${demoCommunityId},
        ${demoUserId},
        'نصيحة: جرب دعم المشروع التجريبي بإحدى الباقات المتاحة. ستلاحظ كيف يتم خصم المبلغ من رصيدك التجريبي وإعادته تلقائياً.',
        18,
        5,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
      ),
      (
        ${demoCommunityId},
        ${demoUserId},
        'هل جربت ميزة تقييم الأفكار بالذكاء الاصطناعي؟ إنها أداة قوية لتحليل أفكارك قبل إطلاقها!',
        32,
        12,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours'
      )
    `;
    
    console.log('✅ Demo posts created');
    
    console.log('');
    console.log('✅ Demo data seeded successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`  - 1 Demo User (ID: ${demoUserId})`);
    console.log(`  - 1 Demo Project (ID: ${demoProjectId})`);
    console.log('  - 3 Demo Packages');
    console.log(`  - 1 Demo Community (ID: ${demoCommunityId})`);
    console.log('  - 3 Demo Posts');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

seedDemoData()
  .then(() => {
    console.log('🎉 Seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });

