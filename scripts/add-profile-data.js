const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addProfileData() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 إضافة بيانات المهارات والإنجازات ومحفظة الأعمال...\n');

    // Create tables if not exist
    await client.query(`
      -- Skills table
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        level INTEGER DEFAULT 50 CHECK (level >= 0 AND level <= 100),
        category VARCHAR(50) DEFAULT 'أخرى',
        endorsements INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Achievements table
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT 'trophy',
        rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
        max_progress INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- User Achievements (junction table)
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
        progress INTEGER DEFAULT 0,
        unlocked_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      );

      -- Portfolio table
      CREATE TABLE IF NOT EXISTS portfolio (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        image VARCHAR(500),
        url VARCHAR(500),
        github_url VARCHAR(500),
        tags TEXT[],
        achievements TEXT[],
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ تم إنشاء الجداول\n');

    // Get all users
    const usersResult = await client.query('SELECT id FROM users LIMIT 50');
    const users = usersResult.rows;

    console.log(`📊 إضافة بيانات لـ ${users.length} مستخدم...\n`);

    // Skills data
    const skillCategories = {
      'تقني': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Docker', 'AWS', 'TypeScript'],
      'تصميم': ['UI/UX', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Sketch'],
      'تسويق': ['SEO', 'التسويق الرقمي', 'وسائل التواصل', 'Google Ads', 'تحليلات'],
      'أعمال': ['إدارة المشاريع', 'التخطيط الاستراتيجي', 'التحليل المالي', 'ريادة الأعمال'],
      'قيادة': ['القيادة', 'إدارة الفريق', 'التواصل', 'حل المشكلات', 'التفاوض'],
    };

    // Add skills for each user
    for (const user of users) {
      const numSkills = Math.floor(Math.random() * 8) + 5; // 5-12 skills per user
      const userSkills = [];

      for (let i = 0; i < numSkills; i++) {
        const categories = Object.keys(skillCategories);
        const category = categories[Math.floor(Math.random() * categories.length)];
        const skills = skillCategories[category];
        const skillName = skills[Math.floor(Math.random() * skills.length)];
        
        // Avoid duplicates
        if (userSkills.includes(skillName)) continue;
        userSkills.push(skillName);

        const level = Math.floor(Math.random() * 60) + 40; // 40-100
        const endorsements = Math.floor(Math.random() * 50);

        await client.query(
          'INSERT INTO skills (user_id, name, level, category, endorsements) VALUES ($1, $2, $3, $4, $5)',
          [user.id, skillName, level, category, endorsements]
        );
      }
    }

    console.log('✅ تم إضافة المهارات\n');

    // Check if achievements table has data
    const existingAchievements = await client.query('SELECT COUNT(*) FROM achievements');
    
    if (parseInt(existingAchievements.rows[0].count) === 0) {
      // Create achievements (simplified - without icon and rarity if columns don't exist)
      const achievementsData = [
        { title: 'أول مشروع', description: 'أنشأ مشروعه الأول' },
        { title: 'مستثمر نشط', description: 'استثمر في 5 مشاريع' },
        { title: 'مبدع متميز', description: 'حصل على 100 إعجاب' },
        { title: 'قائد المجتمع', description: 'أنشأ مجتمعاً بـ 50 عضو' },
        { title: 'نجم صاعد', description: 'وصل للمستوى 10' },
        { title: 'رائد أعمال', description: 'جمع 100,000 ر.س' },
        { title: 'أسطورة المنصة', description: 'وصل للمستوى 50' },
        { title: 'المليونير', description: 'جمع مليون ريال' },
        { title: 'محترف التواصل', description: 'أرسل 1000 رسالة' },
        { title: 'خبير التقييم', description: 'قيّم 50 فكرة' },
        { title: 'المسوق الماهر', description: 'حقق 50 إحالة' },
        { title: 'صاحب الرؤية', description: 'نجح مشروعه في جمع التمويل الكامل' },
      ];

      for (const achievement of achievementsData) {
        await client.query(
          'INSERT INTO achievements (title, description) VALUES ($1, $2)',
          [achievement.title, achievement.description]
        );
      }
    }

    console.log('✅ تم إنشاء الإنجازات\n');

    // Assign random achievements to users
    const achievementsResult = await client.query('SELECT id FROM achievements');
    const achievements = achievementsResult.rows;

    for (const user of users) {
      const numAchievements = Math.floor(Math.random() * 6) + 3; // 3-8 achievements per user
      const selectedAchievements = achievements
        .sort(() => 0.5 - Math.random())
        .slice(0, numAchievements);

      for (const achievement of selectedAchievements) {
        const isUnlocked = Math.random() > 0.4; // 60% chance of being unlocked
        const progress = isUnlocked ? 100 : Math.floor(Math.random() * 100);
        const unlockedAt = isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;

        await client.query(
          'INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, achievement_id) DO NOTHING',
          [user.id, achievement.id, progress, unlockedAt]
        );
      }
    }

    console.log('✅ تم ربط الإنجازات بالمستخدمين\n');

    // Add portfolio items
    const portfolioTitles = [
      'تطبيق توصيل الطعام',
      'منصة التجارة الإلكترونية',
      'نظام إدارة المحتوى',
      'تطبيق الحجوزات',
      'منصة التعليم الإلكتروني',
      'نظام المحاسبة السحابي',
      'تطبيق اللياقة البدنية',
      'منصة التواصل الاجتماعي',
      'نظام إدارة المشاريع',
      'تطبيق المحفظة الرقمية',
    ];

    const tags = ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'Next.js', 'Flutter', 'Firebase'];
    const achievementsList = [
      'حصل على جائزة أفضل تطبيق',
      'تم تحميله أكثر من 10,000 مرة',
      'حقق إيرادات تزيد عن 50,000 ر.س',
      'حصل على تقييم 4.8 نجوم',
      'تم عرضه في مؤتمر تقني',
    ];

    for (const user of users) {
      const numPortfolio = Math.floor(Math.random() * 4) + 1; // 1-4 items per user

      for (let i = 0; i < numPortfolio; i++) {
        const title = portfolioTitles[Math.floor(Math.random() * portfolioTitles.length)];
        const description = `مشروع ${title} - تطبيق مبتكر يهدف إلى تحسين تجربة المستخدم وتقديم حلول فعالة`;
        const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
        const selectedAchievements = achievementsList.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
        const date = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

        await client.query(
          'INSERT INTO portfolio (user_id, title, description, tags, achievements, date) VALUES ($1, $2, $3, $4, $5, $6)',
          [user.id, title, description, selectedTags, selectedAchievements, date]
        );
      }
    }

    console.log('✅ تم إضافة محفظة الأعمال\n');

    // Stats
    const skillsCount = await client.query('SELECT COUNT(*) FROM skills');
    const achievementsCount = await client.query('SELECT COUNT(*) FROM achievements');
    const userAchievementsCount = await client.query('SELECT COUNT(*) FROM user_achievements');
    const portfolioCount = await client.query('SELECT COUNT(*) FROM portfolio');

    console.log('📊 الإحصائيات النهائية:');
    console.log(`   - ${skillsCount.rows[0].count} مهارة`);
    console.log(`   - ${achievementsCount.rows[0].count} إنجاز`);
    console.log(`   - ${userAchievementsCount.rows[0].count} إنجاز مستخدم`);
    console.log(`   - ${portfolioCount.rows[0].count} عمل في المحفظة`);
    console.log('\n✅ تم بنجاح!\n');

  } catch (error) {
    console.error('❌ خطأ:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

addProfileData();

