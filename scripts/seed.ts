import { db } from '../lib/db';
import { users, projects, communities, wallets } from '../lib/db/schema';
import { hash } from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash password for all users
    const passwordHash = await hash('password123', 10);

    // Insert users
    console.log('📝 Inserting users...');
    const insertedUsers = await db.insert(users).values([
      {
        name: 'محمد العتيبي',
        username: 'mohammed_alotaibi',
        email: 'mohammed@example.com',
        password: passwordHash,
        bio: 'رائد أعمال سعودي مهتم بالتقنية والابتكار',
        level: 5,
        points: 1250,
        totalBacked: 3,
        totalProjects: 2,
      },
      {
        name: 'فاطمة الأحمد',
        username: 'fatima_ahmad',
        email: 'fatima@example.com',
        password: passwordHash,
        bio: 'مستثمرة في المشاريع الناشئة ومهتمة بالتعليم',
        level: 4,
        points: 890,
        totalBacked: 5,
        totalProjects: 0,
      },
      {
        name: 'عبدالله السالم',
        username: 'abdullah_salem',
        email: 'abdullah@example.com',
        password: passwordHash,
        bio: 'مطور تطبيقات ومؤسس شركة ناشئة',
        level: 6,
        points: 1680,
        totalBacked: 2,
        totalProjects: 3,
      },
      {
        name: 'نورة القحطاني',
        username: 'noura_alqahtani',
        email: 'noura@example.com',
        password: passwordHash,
        bio: 'مصممة جرافيك ومهتمة بالفن الرقمي',
        level: 3,
        points: 520,
        totalBacked: 4,
        totalProjects: 1,
      },
      {
        name: 'خالد المطيري',
        username: 'khaled_almutairi',
        email: 'khaled@example.com',
        password: passwordHash,
        bio: 'مستشار أعمال ومدرب ريادة أعمال',
        level: 7,
        points: 2150,
        totalBacked: 1,
        totalProjects: 4,
      },
      {
        name: 'سارة الدوسري',
        username: 'sara_aldosari',
        email: 'sara@example.com',
        password: passwordHash,
        bio: 'طبيبة ومهتمة بالصحة الرقمية',
        level: 4,
        points: 780,
        totalBacked: 3,
        totalProjects: 1,
      },
      {
        name: 'أحمد الشمري',
        username: 'ahmed_alshamari',
        email: 'ahmed@example.com',
        password: passwordHash,
        bio: 'مهندس برمجيات ومطور ألعاب',
        level: 5,
        points: 1100,
        totalBacked: 2,
        totalProjects: 2,
      },
      {
        name: 'مريم الحربي',
        username: 'maryam_alharbi',
        email: 'maryam@example.com',
        password: passwordHash,
        bio: 'معلمة ومهتمة بتطوير التعليم',
        level: 3,
        points: 450,
        totalBacked: 2,
        totalProjects: 0,
      },
      {
        name: 'يوسف النمر',
        username: 'youssef_alnemer',
        email: 'youssef@example.com',
        password: passwordHash,
        bio: 'محلل مالي ومستثمر',
        level: 6,
        points: 1850,
        totalBacked: 4,
        totalProjects: 1,
      },
      {
        name: 'لينا العمري',
        username: 'lina_alamri',
        email: 'lina@example.com',
        password: passwordHash,
        bio: 'كاتبة ومدونة تقنية',
        level: 4,
        points: 680,
        totalBacked: 3,
        totalProjects: 1,
      },
    ]).returning();

    console.log(`✅ Inserted ${insertedUsers.length} users`);

    // Insert projects
    console.log('📝 Inserting projects...');
    const now = new Date();
    const insertedProjects = await db.insert(projects).values([
      {
        title: 'منصة تعليمية تفاعلية بالذكاء الاصطناعي',
        description: 'منصة تعليمية متقدمة تستخدم الذكاء الاصطناعي لتخصيص تجربة التعلم لكل طالب بناءً على مستواه وأسلوب تعلمه. تهدف المنصة إلى تحسين جودة التعليم في المملكة وجعله أكثر تفاعلية وفعالية.',
        category: 'education',
        fundingGoal: 500000,
        currentFunding: 332000,
        backersCount: 156,
        deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[0].id,
        status: 'active',
      },
      {
        title: 'تطبيق صحي لمتابعة الأمراض المزمنة',
        description: 'تطبيق ذكي يساعد المرضى على متابعة حالتهم الصحية وأدويتهم بشكل يومي، مع إمكانية التواصل مع الأطباء والحصول على استشارات طبية عن بعد. يستهدف التطبيق مرضى السكري والضغط بشكل خاص.',
        category: 'health',
        fundingGoal: 300000,
        currentFunding: 185000,
        backersCount: 89,
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[5].id,
        status: 'active',
      },
      {
        title: 'منصة تجارة إلكترونية للمنتجات المحلية',
        description: 'منصة تربط المنتجين المحليين بالمستهلكين مباشرة، مما يساعد على دعم الاقتصاد المحلي وتوفير منتجات طازجة وعالية الجودة. تشمل المنصة نظام توصيل سريع وآمن.',
        category: 'business',
        fundingGoal: 400000,
        currentFunding: 268000,
        backersCount: 124,
        deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[2].id,
        status: 'active',
      },
      {
        title: 'تطبيق لتعلم البرمجة للأطفال',
        description: 'تطبيق تعليمي ممتع يعلم الأطفال أساسيات البرمجة من خلال الألعاب والتحديات التفاعلية. يستخدم التطبيق أسلوب التعلم باللعب لجعل البرمجة سهلة ومثيرة للأطفال من عمر 7-14 سنة.',
        category: 'education',
        fundingGoal: 250000,
        currentFunding: 195000,
        backersCount: 112,
        deadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[6].id,
        status: 'active',
      },
      {
        title: 'منصة للربط بين المستقلين والشركات',
        description: 'منصة تربط المحترفين المستقلين في السعودية بالشركات التي تحتاج خدماتهم، مع نظام تقييم شفاف وآمن للدفع. تهدف المنصة إلى دعم اقتصاد العمل الحر في المملكة.',
        category: 'business',
        fundingGoal: 350000,
        currentFunding: 142000,
        backersCount: 67,
        deadline: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[4].id,
        status: 'active',
      },
      {
        title: 'تطبيق للياقة البدنية والتغذية الصحية',
        description: 'تطبيق شامل يوفر برامج تمارين مخصصة وخطط تغذية صحية بناءً على أهداف المستخدم وحالته الصحية. يتضمن التطبيق متابعة يومية ونصائح من مدربين محترفين.',
        category: 'health',
        fundingGoal: 200000,
        currentFunding: 156000,
        backersCount: 94,
        deadline: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[8].id,
        status: 'active',
      },
      {
        title: 'منصة لحجز الملاعب والصالات الرياضية',
        description: 'منصة تسهل حجز الملاعب والصالات الرياضية في جميع أنحاء المملكة، مع إمكانية الدفع الإلكتروني وتقييم المرافق. تهدف المنصة إلى تشجيع الرياضة وتسهيل الوصول للمرافق الرياضية.',
        category: 'other',
        fundingGoal: 180000,
        currentFunding: 98000,
        backersCount: 52,
        deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[3].id,
        status: 'active',
      },
      {
        title: 'تطبيق لتعلم اللغات بالذكاء الاصطناعي',
        description: 'تطبيق يستخدم الذكاء الاصطناعي لتعليم اللغات بطريقة تفاعلية ومخصصة، مع التركيز على المحادثة والممارسة العملية. يدعم التطبيق العديد من اللغات ويوفر محادثات مع بوت ذكي.',
        category: 'education',
        fundingGoal: 280000,
        currentFunding: 224000,
        backersCount: 138,
        deadline: new Date(now.getTime() + 55 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[9].id,
        status: 'active',
      },
      {
        title: 'منصة للتبرعات الخيرية الشفافة',
        description: 'منصة تستخدم تقنية البلوكشين لضمان شفافية التبرعات الخيرية وتتبع وصولها للمستفيدين. تهدف المنصة إلى زيادة الثقة في العمل الخيري وتشجيع المزيد من التبرعات.',
        category: 'other',
        fundingGoal: 320000,
        currentFunding: 176000,
        backersCount: 81,
        deadline: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[1].id,
        status: 'active',
      },
      {
        title: 'تطبيق لإدارة المشاريع الصغيرة',
        description: 'تطبيق يساعد أصحاب المشاريع الصغيرة على إدارة مشاريعهم بكفاءة، من متابعة المبيعات والمخزون إلى إدارة الموظفين والعملاء. يوفر التطبيق تقارير تحليلية مفصلة.',
        category: 'business',
        fundingGoal: 220000,
        currentFunding: 132000,
        backersCount: 73,
        deadline: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000),
        creatorId: insertedUsers[7].id,
        status: 'active',
      },
    ]).returning();

    console.log(`✅ Inserted ${insertedProjects.length} projects`);

    // Note: Support packages are stored as JSON in projects table

    // Insert communities
    console.log('📝 Inserting communities...');
    const insertedCommunities = await db.insert(communities).values([
      {
        name: 'مجتمع رواد التقنية',
        description: 'مجتمع لمناقشة أحدث التقنيات والابتكارات في المملكة',
        category: 'technology',
        membersCount: 1247,
        postsCount: 856,
        isPrivate: false,
        isGolden: false,
        creatorId: insertedUsers[0].id,
      },
      {
        name: 'مجتمع المستثمرين',
        description: 'مجتمع خاص للمستثمرين لمناقشة الفرص الاستثمارية',
        category: 'business',
        membersCount: 342,
        postsCount: 234,
        isPrivate: true,
        isGolden: true,
        creatorId: insertedUsers[4].id,
      },
      {
        name: 'مجتمع التعليم الرقمي',
        description: 'مجتمع للمهتمين بالتعليم الرقمي والتقنيات التعليمية',
        category: 'education',
        membersCount: 892,
        postsCount: 567,
        isPrivate: false,
        isGolden: false,
        creatorId: insertedUsers[2].id,
      },
      {
        name: 'مجتمع الصحة والعافية',
        description: 'مجتمع لمناقشة الصحة واللياقة البدنية والتغذية',
        category: 'health',
        membersCount: 654,
        postsCount: 423,
        isPrivate: false,
        isGolden: false,
        creatorId: insertedUsers[5].id,
      },
      {
        name: 'مجتمع ريادة الأعمال',
        description: 'مجتمع لرواد الأعمال لتبادل الخبرات والنصائح',
        category: 'business',
        membersCount: 1089,
        postsCount: 712,
        isPrivate: false,
        isGolden: true,
        creatorId: insertedUsers[8].id,
      },
    ]).returning();

    console.log(`✅ Inserted ${insertedCommunities.length} communities`);

    // Note: Achievements are user-specific and will be created when users earn them

    // Insert wallets for all users
    console.log('📝 Inserting wallets...');
    const walletsData = insertedUsers.map((user, i) => ({
      userId: user.id,
      balance: 1000 + i * 500,
      totalEarned: 2000 + i * 1000,
      totalSpent: 1000 + i * 500,
    }));

    await db.insert(wallets).values(walletsData);
    console.log(`✅ Inserted ${walletsData.length} wallets`);

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

