-- ============================================
-- بذره - المرحلة 1: تنظيف شامل وإعادة ضبط البيانات
-- ============================================
-- الهدف: حذف كل البيانات الوهمية وإنشاء بيانات ديمو واقعية فقط
-- ============================================

BEGIN;

-- ============================================
-- الخطوة 1: حذف البيانات الوهمية (بالترتيب الصحيح لتجنب مشاكل Foreign Keys)
-- ============================================

-- حذف البيانات المرتبطة بالمشاريع
DELETE FROM backings WHERE project_id IN (
  SELECT id FROM projects 
  WHERE title LIKE '%مشروع تقني مبتكر%' 
  OR title LIKE '%test%' 
  OR title LIKE '%demo%'
  OR title LIKE '%وهمي%'
);

DELETE FROM ai_evaluations WHERE project_id IN (
  SELECT id FROM projects 
  WHERE title LIKE '%مشروع تقني مبتكر%' 
  OR title LIKE '%test%' 
  OR title LIKE '%demo%'
  OR title LIKE '%وهمي%'
);

DELETE FROM idea_evaluations WHERE project_id IN (
  SELECT id FROM projects 
  WHERE title LIKE '%مشروع تقني مبتكر%' 
  OR title LIKE '%test%' 
  OR title LIKE '%demo%'
  OR title LIKE '%وهمي%'
);

DELETE FROM negotiations WHERE project_id IN (
  SELECT id FROM projects 
  WHERE title LIKE '%مشروع تقني مبتكر%' 
  OR title LIKE '%test%' 
  OR title LIKE '%demo%'
  OR title LIKE '%وهمي%'
);

DELETE FROM support_packages WHERE project_id IN (
  SELECT id FROM projects 
  WHERE title LIKE '%مشروع تقني مبتكر%' 
  OR title LIKE '%test%' 
  OR title LIKE '%demo%'
  OR title LIKE '%وهمي%'
);

-- حذف البيانات المرتبطة بالمجتمعات
DELETE FROM community_posts WHERE community_id IN (
  SELECT id FROM communities 
  WHERE name LIKE '%test%' 
  OR name LIKE '%demo%'
  OR name LIKE '%وهمي%'
);

DELETE FROM post_comments WHERE post_id IN (
  SELECT id FROM community_posts 
  WHERE community_id IN (
    SELECT id FROM communities 
    WHERE name LIKE '%test%' 
    OR name LIKE '%demo%'
    OR name LIKE '%وهمي%'
  )
);

DELETE FROM community_members WHERE community_id IN (
  SELECT id FROM communities 
  WHERE name LIKE '%test%' 
  OR name LIKE '%demo%'
  OR name LIKE '%وهمي%'
);

-- حذف المجتمعات المكررة (الاحتفاظ بواحد فقط من كل نوع)
DELETE FROM communities 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM communities 
  GROUP BY name
)
AND (
  name LIKE '%test%' 
  OR name LIKE '%demo%'
  OR name LIKE '%وهمي%'
);

-- حذف المشاريع الوهمية والمكررة
DELETE FROM projects 
WHERE title LIKE '%مشروع تقني مبتكر%' 
OR title LIKE '%test%' 
OR title LIKE '%demo%'
OR title LIKE '%وهمي%';

-- حذف المستخدمين الوهميين (ما عدا المستخدمين الحقيقيين)
DELETE FROM transactions WHERE user_id IN (
  SELECT id FROM users 
  WHERE email LIKE '%test%' 
  OR email LIKE '%demo%'
  OR email LIKE '%fake%'
);

DELETE FROM wallets WHERE user_id IN (
  SELECT id FROM users 
  WHERE email LIKE '%test%' 
  OR email LIKE '%demo%'
  OR email LIKE '%fake%'
);

DELETE FROM users 
WHERE email LIKE '%test%' 
OR email LIKE '%demo%'
OR email LIKE '%fake%';

-- ============================================
-- الخطوة 2: إنشاء 5 مستخدمين ديمو واقعيين
-- ============================================

INSERT INTO users (
  email, password, name, username, role, avatar, bio, 
  level, points, created_at, updated_at
) VALUES
  (
    'owner@demo.bithrah.com',
    '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha',
    'أحمد المالك',
    'project_owner_demo',
    'user',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
    'صاحب مشروع بذره التجريبي، مهتم بالتقنية والابتكار',
    5,
    1250,
    NOW(),
    NOW()
  ),
  (
    'investor@demo.bithrah.com',
    '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha',
    'سارة المستثمرة',
    'investor_demo',
    'user',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    'مستثمرة في المشاريع التقنية الناشئة',
    7,
    2100,
    NOW(),
    NOW()
  ),
  (
    'marketer@demo.bithrah.com',
    '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha',
    'خالد المسوق',
    'marketer_demo',
    'user',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=khaled',
    'مسوق محترف متخصص في التسويق الرقمي',
    4,
    890,
    NOW(),
    NOW()
  ),
  (
    'moderator@demo.bithrah.com',
    '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha',
    'فاطمة المشرفة',
    'moderator_demo',
    'moderator',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    'مشرفة مجتمعات بذره',
    6,
    1580,
    NOW(),
    NOW()
  ),
  (
    'visitor@demo.bithrah.com',
    '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha',
    'عمر الزائر',
    'visitor_demo',
    'user',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=omar',
    'مستخدم جديد يستكشف منصة بذره',
    1,
    50,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- الخطوة 3: إنشاء محافظ للمستخدمين (100,000 ر.س)
-- ============================================

INSERT INTO wallets (user_id, balance, currency, created_at, updated_at)
SELECT 
  id, 
  100000.00, 
  'SAR',
  NOW(),
  NOW()
FROM users
WHERE email IN (
  'owner@demo.bithrah.com',
  'investor@demo.bithrah.com',
  'marketer@demo.bithrah.com',
  'moderator@demo.bithrah.com',
  'visitor@demo.bithrah.com'
)
ON CONFLICT (user_id) DO UPDATE SET balance = 100000.00;

-- ============================================
-- الخطوة 4: إنشاء معاملات إيداع أولية
-- ============================================

INSERT INTO transactions (
  user_id, type, amount, currency, description, status, created_at
)
SELECT
  id,
  'deposit',
  100000.00,
  'SAR',
  'رصيد تجريبي ابتدائي',
  'completed',
  NOW()
FROM users
WHERE email IN (
  'owner@demo.bithrah.com',
  'investor@demo.bithrah.com',
  'marketer@demo.bithrah.com',
  'moderator@demo.bithrah.com',
  'visitor@demo.bithrah.com'
);

-- ============================================
-- الخطوة 5: إنشاء مشروع ديمو رسمي واحد
-- ============================================

INSERT INTO projects (
  creator_id,
  title,
  slug,
  description,
  short_description,
  category,
  sub_category,
  image,
  cover_image,
  funding_goal,
  current_funding,
  currency,
  backers_count,
  status,
  visibility,
  featured,
  trending,
  verified,
  negotiation_enabled,
  negotiation_deposit,
  deadline,
  created_at,
  updated_at,
  published_at
)
SELECT
  u.id,
  'مشروع بذره التجريبي الرسمي',
  'bithrah-official-demo-project',
  'مشروع تجريبي شامل يعرض جميع مميزات منصة بذره للتمويل الجماعي والاستثمار الذكي. يهدف المشروع إلى تطوير منصة متكاملة تجمع بين رواد الأعمال والمستثمرين في بيئة آمنة وموثوقة. المشروع يتضمن نظام تقييم ذكي للأفكار، نظام تفاوض متقدم، باقات دعم متنوعة، ومجتمعات تفاعلية.',
  'منصة تمويل جماعي ذكية تجمع رواد الأعمال والمستثمرين',
  'technology',
  'fintech',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
  500000.00,
  125000.00,
  'SAR',
  23,
  'active',
  'public',
  true,
  true,
  true,
  true,
  5000.00,
  NOW() + INTERVAL '45 days',
  NOW(),
  NOW(),
  NOW()
FROM users u
WHERE u.username = 'project_owner_demo'
LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- الخطوة 6: إنشاء 3 باقات دعم للمشروع
-- ============================================

INSERT INTO support_packages (
  project_id,
  title,
  description,
  amount,
  currency,
  benefits,
  available_quantity,
  claimed_count,
  is_active,
  created_at
)
SELECT
  p.id,
  'باقة الشكر',
  'شكر علني وانضمام للمجتمع الخاص بالمشروع',
  50.00,
  'SAR',
  '["شكر علني على صفحة المشروع", "انضمام لمجتمع المشروع الخاص", "تحديثات حصرية عن المشروع"]',
  100,
  12,
  true,
  NOW()
FROM projects p
WHERE p.slug = 'bithrah-official-demo-project'
UNION ALL
SELECT
  p.id,
  'باقة الوصول الخاص',
  'وصول خاص للتحديثات الداخلية والمحتوى الحصري',
  250.00,
  'SAR',
  '["جميع مزايا باقة الشكر", "وصول مبكر للتحديثات", "محتوى حصري خلف الكواليس", "جلسة أسئلة وأجوبة شهرية"]',
  50,
  7,
  true,
  NOW()
FROM projects p
WHERE p.slug = 'bithrah-official-demo-project'
UNION ALL
SELECT
  p.id,
  'باقة الدعم المميز',
  'دعم مميز وتفاعل مباشر مع صاحب المشروع',
  1000.00,
  'SAR',
  '["جميع مزايا الباقات السابقة", "تفاعل مباشر مع صاحب المشروع", "استشارة شخصية (30 دقيقة)", "ذكر خاص في صفحة الشكر", "دعوة لحدث الإطلاق الخاص"]',
  20,
  4,
  true,
  NOW()
FROM projects p
WHERE p.slug = 'bithrah-official-demo-project';

-- ============================================
-- الخطوة 7: إنشاء 3 مجتمعات فقط
-- ============================================

-- حذف جميع المجتمعات الموجودة أولاً
DELETE FROM community_members;
DELETE FROM community_posts;
DELETE FROM communities;

INSERT INTO communities (
  creator_id,
  name,
  slug,
  description,
  short_description,
  category,
  image,
  cover_image,
  tier,
  is_private,
  member_count,
  posts_count,
  status,
  verified,
  created_at,
  updated_at
)
SELECT
  u.id,
  'مجتمع بذره التجريبي',
  'bithrah-demo-community',
  'مجتمع أساسي للتفاعل والاختبار ومشاركة التجارب. هذا المجتمع مخصص لجميع مستخدمي منصة بذره للتواصل وتبادل الخبرات والأفكار.',
  'مجتمع أساسي للتفاعل والاختبار',
  'general',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
  'public',
  false,
  15,
  8,
  'active',
  true,
  NOW(),
  NOW()
FROM users u
WHERE u.username = 'moderator_demo'
LIMIT 1
UNION ALL
SELECT
  u.id,
  'مجتمع التقنية والابتكار',
  'tech-innovation-community',
  'مجتمع متخصص في التقنية والابتكار والذكاء الاصطناعي. ينضم إليه المطورون والمبتكرون وعشاق التكنولوجيا لمناقشة أحدث الاتجاهات والمشاريع التقنية.',
  'مجتمع متخصص في التقنية والابتكار',
  'technology',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
  'public',
  false,
  28,
  15,
  'active',
  true,
  NOW(),
  NOW()
FROM users u
WHERE u.username = 'moderator_demo'
LIMIT 1
UNION ALL
SELECT
  u.id,
  'مجتمع ريادة الأعمال',
  'entrepreneurship-community',
  'مجتمع رواد الأعمال والمستثمرين وأصحاب المشاريع. مكان للتواصل وتبادل الخبرات والحصول على الدعم والإرشاد في رحلة ريادة الأعمال.',
  'مجتمع رواد الأعمال والمستثمرين',
  'entrepreneurship',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200',
  'public',
  false,
  42,
  23,
  'active',
  true,
  NOW(),
  NOW()
FROM users u
WHERE u.username = 'moderator_demo'
LIMIT 1;

-- ============================================
-- الخطوة 8: إضافة أعضاء للمجتمعات
-- ============================================

INSERT INTO community_members (community_id, user_id, role, points, level, status, created_at)
SELECT 
  c.id,
  u.id,
  CASE 
    WHEN u.username = 'moderator_demo' THEN 'admin'
    ELSE 'member'
  END,
  FLOOR(RANDOM() * 500 + 50)::INTEGER,
  FLOOR(RANDOM() * 5 + 1)::INTEGER,
  'active',
  NOW()
FROM communities c
CROSS JOIN users u
WHERE u.email IN (
  'owner@demo.bithrah.com',
  'investor@demo.bithrah.com',
  'marketer@demo.bithrah.com',
  'moderator@demo.bithrah.com',
  'visitor@demo.bithrah.com'
);

-- ============================================
-- الخطوة 9: إضافة منشورات للمجتمعات
-- ============================================

INSERT INTO community_posts (
  community_id,
  user_id,
  content,
  likes_count,
  comments_count,
  created_at
)
SELECT
  c.id,
  u.id,
  'مرحباً بكم في ' || c.name || '! نتطلع للتفاعل معكم ومشاركة الأفكار والخبرات. دعونا نبني معاً مجتمعاً نشطاً ومفيداً للجميع.',
  FLOOR(RANDOM() * 20 + 5)::INTEGER,
  FLOOR(RANDOM() * 10 + 2)::INTEGER,
  NOW()
FROM communities c
CROSS JOIN users u
WHERE u.username = 'moderator_demo';

-- إضافة منشورات إضافية
INSERT INTO community_posts (
  community_id,
  user_id,
  content,
  likes_count,
  comments_count,
  created_at
)
SELECT
  c.id,
  u.id,
  CASE 
    WHEN c.slug = 'bithrah-demo-community' THEN 'سعيد بالانضمام لهذا المجتمع الرائع! أتطلع لمشاركة تجربتي مع منصة بذره.'
    WHEN c.slug = 'tech-innovation-community' THEN 'ما هي أحدث التقنيات التي تتابعونها؟ أنا مهتم بالذكاء الاصطناعي وتطبيقاته في ريادة الأعمال.'
    ELSE 'أبحث عن نصائح لبدء مشروعي الأول. هل من تجارب ملهمة؟'
  END,
  FLOOR(RANDOM() * 15 + 3)::INTEGER,
  FLOOR(RANDOM() * 8 + 1)::INTEGER,
  NOW() - INTERVAL '2 hours'
FROM communities c
CROSS JOIN users u
WHERE u.username = 'owner_demo';

-- ============================================
-- الخطوة 10: إضافة دعم للمشروع من المستثمرين
-- ============================================

INSERT INTO backings (
  project_id,
  user_id,
  package_id,
  amount,
  currency,
  status,
  message,
  created_at
)
SELECT
  p.id,
  u.id,
  sp.id,
  sp.amount,
  'SAR',
  'completed',
  'متحمس جداً لدعم هذا المشروع الرائع! أتمنى لكم كل التوفيق.',
  NOW() - INTERVAL '5 days'
FROM projects p
CROSS JOIN users u
CROSS JOIN support_packages sp
WHERE p.slug = 'bithrah-official-demo-project'
AND u.username = 'investor_demo'
AND sp.title = 'باقة الدعم المميز'
LIMIT 1;

INSERT INTO backings (
  project_id,
  user_id,
  package_id,
  amount,
  currency,
  status,
  message,
  created_at
)
SELECT
  p.id,
  u.id,
  sp.id,
  sp.amount,
  'SAR',
  'completed',
  'فكرة ممتازة، أتطلع لرؤية المشروع ينجح!',
  NOW() - INTERVAL '3 days'
FROM projects p
CROSS JOIN users u
CROSS JOIN support_packages sp
WHERE p.slug = 'bithrah-official-demo-project'
AND u.username = 'marketer_demo'
AND sp.title = 'باقة الوصول الخاص'
LIMIT 1;

-- ============================================
-- الخطوة 11: تحديث معاملات المحافظ
-- ============================================

INSERT INTO transactions (
  user_id,
  type,
  amount,
  currency,
  description,
  status,
  reference_type,
  reference_id,
  created_at
)
SELECT
  b.user_id,
  'project_backing',
  -b.amount,
  'SAR',
  'دعم مشروع: ' || p.title,
  'completed',
  'backing',
  b.id,
  b.created_at
FROM backings b
JOIN projects p ON p.id = b.project_id;

-- تحديث أرصدة المحافظ
UPDATE wallets w
SET balance = balance - (
  SELECT COALESCE(SUM(amount), 0)
  FROM backings b
  WHERE b.user_id = w.user_id
  AND b.status = 'completed'
)
WHERE user_id IN (
  SELECT id FROM users WHERE email IN (
    'investor@demo.bithrah.com',
    'marketer@demo.bithrah.com'
  )
);

-- ============================================
-- النتيجة النهائية
-- ============================================

SELECT 
  '✅ تم تنظيف وإعادة بناء البيانات بنجاح!' AS status,
  (SELECT COUNT(*) FROM users WHERE email LIKE '%demo.bithrah.com%') AS demo_users,
  (SELECT COUNT(*) FROM projects WHERE slug = 'bithrah-official-demo-project') AS demo_projects,
  (SELECT COUNT(*) FROM communities) AS communities,
  (SELECT COUNT(*) FROM support_packages) AS support_packages,
  (SELECT COUNT(*) FROM backings) AS backings,
  (SELECT COUNT(*) FROM community_posts) AS community_posts,
  (SELECT SUM(balance) FROM wallets WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%demo.bithrah.com%')) AS total_wallet_balance;

COMMIT;

