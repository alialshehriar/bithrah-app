const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Arabic names
const firstNames = [
  'محمد', 'أحمد', 'علي', 'حسن', 'خالد', 'عبدالله', 'سعد', 'فهد', 'عمر', 'يوسف',
  'فاطمة', 'نورة', 'سارة', 'مريم', 'عائشة', 'هند', 'ريم', 'لينا', 'دانة', 'جود',
  'عبدالرحمن', 'إبراهيم', 'سلطان', 'تركي', 'ناصر', 'راشد', 'مشعل', 'بندر', 'فيصل', 'سلمان',
  'منى', 'أمل', 'رنا', 'شهد', 'غادة', 'نوف', 'وعد', 'رهف', 'جواهر', 'لطيفة'
];

const lastNames = [
  'العتيبي', 'القحطاني', 'الغامدي', 'الدوسري', 'الشمري', 'الحربي', 'المطيري', 'العنزي', 'الزهراني', 'الأحمدي',
  'السبيعي', 'الشهري', 'العمري', 'الجهني', 'البلوي', 'الرشيدي', 'الخالدي', 'السلمي', 'العسيري', 'الفهد'
];

// Project categories and titles
const projectCategories = ['tech', 'health', 'education', 'environment', 'art', 'business'];
const projectTitles = [
  'منصة تعليمية ذكية', 'تطبيق صحي متكامل', 'نظام إدارة المشاريع', 'متجر إلكتروني مبتكر',
  'تطبيق توصيل طعام', 'منصة تواصل اجتماعي', 'نظام حجز مواعيد', 'تطبيق تعلم اللغات',
  'منصة استثمارية', 'تطبيق رياضي', 'نظام محاسبة سحابي', 'منصة عقارية',
  'تطبيق سياحي', 'نظام إدارة المخزون', 'منصة توظيف', 'تطبيق مالي',
  'نظام طبي ذكي', 'منصة تسويق رقمي', 'تطبيق لياقة بدنية', 'نظام أمن سيبراني',
  'منصة تجارة إلكترونية', 'تطبيق توصيل', 'نظام إدارة علاقات العملاء', 'منصة تعليم عن بعد',
  'تطبيق حجز فنادق', 'نظام نقاط بيع', 'منصة استشارات', 'تطبيق ألعاب تعليمية',
  'نظام إدارة المطاعم', 'منصة خدمات منزلية'
];

// Community names
const communityNames = [
  'مجتمع المطورين السعوديين', 'رواد الأعمال الشباب', 'مستثمرو التقنية', 'مجتمع الصحة والعافية',
  'المبدعون في التعليم', 'حماة البيئة', 'الفنانون والمصممون', 'قادة الأعمال',
  'مجتمع الذكاء الاصطناعي', 'المهتمون بالأمن السيبراني'
];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function generateUsers(client, count) {
  console.log(`\n📝 إنشاء ${count} مستخدم...`);
  const users = [];
  const password = await bcrypt.hash('123456', 10);
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const username = `${firstName}_${lastName}_${randomNumber(1, 999)}`;
    const email = `${username.toLowerCase().replace(/\s/g, '')}@test.com`;
    
    const result = await client.query(
      `INSERT INTO users (
        username, email, password, role, points, level,
        bio, avatar, is_sandbox, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, NOW())
      RETURNING id, username, email`,
      [
        username,
        email,
        password,
        randomElement(['user', 'investor', 'project_owner']),
        randomNumber(0, 10000),
        randomNumber(1, 10),
        `مرحباً! أنا ${firstName} ${lastName}، مهتم بالتقنية والابتكار.`,
        `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      ]
    );
    
    users.push(result.rows[0]);
    
    // Create wallet for each user
    await client.query(
      `INSERT INTO wallets (
        user_id, balance, pending_balance, total_earned, is_sandbox
      ) VALUES ($1, $2, $3, $4, true)`,
      [result.rows[0].id, randomNumber(0, 50000), randomNumber(0, 5000), randomNumber(0, 100000)]
    );
  }
  
  console.log(`✅ تم إنشاء ${users.length} مستخدم`);
  return users;
}

async function generateProjects(client, users, count) {
  console.log(`\n📝 إنشاء ${count} مشروع...`);
  const projects = [];
  
  for (let i = 0; i < count; i++) {
    const owner = randomElement(users);
    const title = randomElement(projectTitles);
    const fundingGoal = randomNumber(50000, 500000);
    const currentFunding = randomNumber(0, fundingGoal);
    
    const result = await client.query(
      `INSERT INTO projects (
        creator_id, title, description, category, funding_goal, current_funding,
        backers_count, status, image, is_sandbox, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
      RETURNING id, title`,
      [
        owner.id,
        title,
        `${title} - مشروع مبتكر يهدف إلى تحسين الخدمات وتقديم حلول ذكية للمستخدمين.`,
        randomElement(projectCategories),
        fundingGoal,
        currentFunding,
        randomNumber(0, 100),
        randomElement(['active', 'funding', 'completed']),
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      ]
    );
    
    projects.push(result.rows[0]);
    
    // Create negotiation gate for some projects
    if (Math.random() > 0.5) {
      await client.query(
        `INSERT INTO negotiation_gates (
          project_id, min_support_amount, deposit_amount, is_open,
          max_negotiators, current_negotiators, title, description
        ) VALUES ($1, $2, $3, true, $4, $5, $6, $7)`,
        [
          result.rows[0].id,
          randomNumber(10000, 50000),
          randomNumber(1000, 5000),
          randomNumber(5, 20),
          randomNumber(0, 5),
          'بوابة التفاوض المفتوحة',
          'نرحب بالمستثمرين الجادين للتفاوض حول شروط الاستثمار'
        ]
      );
    }
  }
  
  console.log(`✅ تم إنشاء ${projects.length} مشروع`);
  return projects;
}

async function generateCommunities(client, users, count) {
  console.log(`\n📝 إنشاء ${count} مجتمع...`);
  const communities = [];
  
  for (let i = 0; i < count; i++) {
    const creator = randomElement(users);
    const name = communityNames[i] || `مجتمع ${i + 1}`;
    
    const result = await client.query(
      `INSERT INTO communities (
        creator_id, name, slug, description, category, member_count,
        is_private, is_sandbox, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, false, true, NOW())
      RETURNING id, name`,
      [
        creator.id,
        name,
        name.toLowerCase().replace(/\s/g, '-'),
        `${name} - مجتمع نشط يجمع المهتمين بهذا المجال لتبادل الخبرات والأفكار.`,
        randomElement(['tech', 'business', 'health', 'education']),
        randomNumber(10, 500),
      ]
    );
    
    communities.push(result.rows[0]);
    
    // Add random members
    const memberCount = randomNumber(5, 15);
    for (let j = 0; j < memberCount; j++) {
      const member = randomElement(users);
      try {
        await client.query(
          `INSERT INTO community_members (
            community_id, user_id, role, points, level, joined_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT DO NOTHING`,
          [
            result.rows[0].id,
            member.id,
            j === 0 ? 'admin' : randomElement(['member', 'moderator']),
            randomNumber(0, 1000),
            randomNumber(1, 5),
          ]
        );
      } catch (e) {
        // Ignore duplicates
      }
    }
  }
  
  console.log(`✅ تم إنشاء ${communities.length} مجتمع`);
  return communities;
}

async function generateTransactions(client, users, count) {
  console.log(`\n📝 إنشاء ${count} معاملة...`);
  
  const types = ['deposit', 'withdrawal', 'investment', 'commission', 'reward'];
  
  for (let i = 0; i < count; i++) {
    const user = randomElement(users);
    const type = randomElement(types);
    const amount = randomNumber(100, 10000);
    
    await client.query(
      `INSERT INTO transactions (
        user_id, type, amount, status, description, created_at
      ) VALUES ($1, $2, $3, $4, $5, NOW())`,
      [
        user.id,
        type,
        amount,
        randomElement(['completed', 'pending', 'failed']),
        `معاملة ${type} بقيمة ${amount} ريال`,
      ]
    );
  }
  
  console.log(`✅ تم إنشاء ${count} معاملة`);
}

async function generateReferralCodes(client, users) {
  console.log(`\n📝 إنشاء أكواد إحالة...`);
  
  for (const user of users.slice(0, 20)) {
    const code = `REF${user.id}${randomNumber(1000, 9999)}`;
    
    try {
      await client.query(
        `INSERT INTO referral_codes (user_id, code) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [user.id, code]
      );
    } catch (e) {
      // Ignore errors
    }
  }
  
  console.log(`✅ تم إنشاء أكواد الإحالة`);
}

async function main() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 بدء إنشاء البيانات الوهمية...\n');
    
    await client.query('BEGIN');
    
    // Generate data
    const users = await generateUsers(client, 50);
    const projects = await generateProjects(client, users, 30);
    const communities = await generateCommunities(client, users, 10);
    await generateTransactions(client, users, 100);
    await generateReferralCodes(client, users);
    
    await client.query('COMMIT');
    
    console.log('\n✅ تم إنشاء جميع البيانات الوهمية بنجاح!');
    console.log('\n📊 الملخص:');
    console.log(`   - ${users.length} مستخدم`);
    console.log(`   - ${projects.length} مشروع`);
    console.log(`   - ${communities.length} مجتمع`);
    console.log(`   - 100 معاملة`);
    console.log(`   - 20 كود إحالة`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ خطأ:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);

