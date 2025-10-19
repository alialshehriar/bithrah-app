const { neon } = require('@neondatabase/serverless');

async function cleanStart() {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('🌱 Starting CLEAN database setup...');
  console.log('⚠️  This will DELETE ALL DATA and start fresh');
  console.log('✅ Building everything from scratch with best practices');
  console.log('');
  
  try {
    // Clean ALL data using CASCADE (this will handle all foreign keys)
    console.log('🧹 Cleaning ALL data tables using CASCADE...');
    
    await sql`TRUNCATE TABLE users CASCADE`;
    await sql`TRUNCATE TABLE projects CASCADE`;
    await sql`TRUNCATE TABLE communities CASCADE`;
    await sql`TRUNCATE TABLE wallets CASCADE`;
    await sql`TRUNCATE TABLE transactions CASCADE`;
    await sql`TRUNCATE TABLE wallet_transactions CASCADE`;
    await sql`TRUNCATE TABLE notifications CASCADE`;
    await sql`TRUNCATE TABLE negotiations CASCADE`;
    await sql`TRUNCATE TABLE backings CASCADE`;
    
    console.log('✅ All data cleaned successfully');
    console.log('');
    
    // Create demo admin user
    console.log('👤 Creating demo admin user...');
    const demoUser = await sql`
      INSERT INTO users (
        email, password, username, name, bio, avatar,
        email_verified, role, created_at, updated_at
      ) VALUES (
        'demo@bithrah.com',
        '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemo',
        'demo-admin',
        'مدير بذرة',
        'حساب إداري لمنصة بذرة',
        '/images/demo-avatar.jpg',
        true,
        'admin',
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    
    const demoUserId = demoUser[0].id;
    console.log(`✅ Demo admin created with ID: ${demoUserId}`);
    
    // Create demo wallet for admin
    console.log('💰 Creating demo wallet...');
    await sql`
      INSERT INTO wallets (
        user_id, balance, currency, created_at, updated_at
      ) VALUES (
        ${demoUserId},
        0,
        'SAR',
        NOW(),
        NOW()
      )
    `;
    console.log('✅ Demo wallet created');
    
    // Create demo project
    console.log('📦 Creating demo project...');
    const demoProject = await sql`
      INSERT INTO projects (
        creator_id, title, slug, description, short_description,
        category, tags, image, cover_image, video,
        funding_goal, current_funding, currency,
        backers_count, deadline, status, visibility,
        featured, verified, is_sandbox, trending,
        negotiation_enabled, negotiation_deposit,
        created_at, updated_at, published_at
      ) VALUES (
        ${demoUserId},
        'مشروع بذرة التجريبي',
        'demo-bithrah-project',
        'مشروع تجريبي متكامل يوضح كيفية عمل منصة بذرة. يمكنك دعم هذا المشروع بالرصيد التجريبي لتجربة النظام بالكامل. هذا المشروع يحتوي على جميع الميزات المتاحة في المنصة بما في ذلك الباقات المتعددة، نظام التفاوض، وحماية الملكية الفكرية.',
        'مشروع تجريبي لتجربة جميع ميزات منصة بذرة',
        'technology',
        '["تجريبي", "تقنية", "ابتكار", "منصة"]'::jsonb,
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
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
        true,
        2000,
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    
    const demoProjectId = demoProject[0].id;
    console.log(`✅ Demo project created with ID: ${demoProjectId}`);
    
    // Create demo packages
    console.log('📦 Creating demo packages...');
    await sql`
      INSERT INTO support_packages (
        project_id, name, description, amount, features,
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
    
    console.log('✅ Demo packages created (3 packages)');
    
    // Create demo community
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
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        '["تجريبي", "تقنية", "ابتكار", "مجتمع"]'::jsonb,
        false,
        true
      )
      RETURNING id
    `;
    
    const demoCommunityId = demoCommunity[0].id;
    console.log(`✅ Demo community created with ID: ${demoCommunityId}`);
    
    // Create demo posts
    console.log('📝 Creating demo posts...');
    await sql`
      INSERT INTO community_posts (
        community_id, user_id, content, likes_count, comments_count, created_at, updated_at
      ) VALUES 
      (
        ${demoCommunityId},
        ${demoUserId},
        'مرحباً بكم في مجتمع بذرة التجريبي! 🎉 هنا يمكنكم تجربة ميزات المجتمعات والتفاعل مع المستخدمين الآخرين.',
        24,
        8,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '2 days'
      ),
      (
        ${demoCommunityId},
        ${demoUserId},
        'نصيحة: جرب دعم المشروع التجريبي بإحدى الباقات المتاحة. ستلاحظ كيف يتم خصم المبلغ من رصيدك التجريبي وإعادته تلقائياً. 💰',
        18,
        5,
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '1 day'
      ),
      (
        ${demoCommunityId},
        ${demoUserId},
        'هل جربت ميزة تقييم الأفكار بالذكاء الاصطناعي؟ إنها أداة قوية لتحليل أفكارك قبل إطلاقها! 💡',
        32,
        12,
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours'
      )
    `;
    
    console.log('✅ Demo posts created (3 posts)');
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 CLEAN START COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Database Summary:');
    console.log(`  ✅ 1 Admin User (ID: ${demoUserId})`);
    console.log(`  ✅ 1 Demo Project (ID: ${demoProjectId})`);
    console.log('  ✅ 3 Support Packages');
    console.log(`  ✅ 1 Demo Community (ID: ${demoCommunityId})`);
    console.log('  ✅ 3 Community Posts');
    console.log('  ✅ 1 Wallet');
    console.log('');
    console.log('🚀 Ready for demo mode with 100,000 SAR virtual credit!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error during clean start:', error);
    throw error;
  }
}

cleanStart()
  .then(() => {
    console.log('🎉 Clean start completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Clean start failed:', error);
    process.exit(1);
  });

