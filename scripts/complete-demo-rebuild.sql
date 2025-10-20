-- ============================================
-- بذره - سكريبت تنظيف وإعادة بناء البيانات الكامل
-- ============================================

-- المرحلة 1: تنظيف شامل للبيانات الوهمية
-- ============================================

-- حذف البيانات المرتبطة أولاً (لتجنب مشاكل Foreign Keys)
DELETE FROM community_posts WHERE community_id IN (SELECT id FROM communities WHERE is_demo = true);
DELETE FROM community_members WHERE community_id IN (SELECT id FROM communities WHERE is_demo = true);
DELETE FROM event_registrations WHERE event_id IN (SELECT id FROM events WHERE is_demo = true);
DELETE FROM project_updates WHERE project_id IN (SELECT id FROM projects WHERE is_demo = true);
DELETE FROM backings WHERE project_id IN (SELECT id FROM projects WHERE is_demo = true);
DELETE FROM evaluations WHERE project_id IN (SELECT id FROM projects WHERE is_demo = true);
DELETE FROM transactions WHERE user_id IN (SELECT id FROM users WHERE is_demo = true);
DELETE FROM wallets WHERE user_id IN (SELECT id FROM users WHERE is_demo = true);

-- حذف الجداول الرئيسية
DELETE FROM projects WHERE is_demo = true OR title LIKE '%مشروع تقني مبتكر%';
DELETE FROM communities WHERE is_demo = true;
DELETE FROM events WHERE is_demo = true;
DELETE FROM users WHERE is_demo = true;
DELETE FROM leaderboard WHERE is_demo = true;

-- المرحلة 2: إنشاء بيانات ديمو واقعية
-- ============================================

-- 1. إنشاء 5 مستخدمين ديمو
INSERT INTO users (
  name, email, username, password_hash, role, is_demo, created_at
) VALUES
  ('أحمد المالك', 'owner@demo.bithrah.com', 'project_owner_demo', '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha', 'user', true, NOW()),
  ('سارة المستثمرة', 'investor@demo.bithrah.com', 'investor_demo', '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha', 'user', true, NOW()),
  ('خالد المسوق', 'marketer@demo.bithrah.com', 'marketer_demo', '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha', 'user', true, NOW()),
  ('فاطمة المشرفة', 'moderator@demo.bithrah.com', 'moderator_demo', '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha', 'moderator', true, NOW()),
  ('عمر الزائر', 'visitor@demo.bithrah.com', 'visitor_demo', '$2a$10$demohashdemohashdemohashdemohashdemohashdemohashdemoha', 'user', true, NOW());

-- 2. إنشاء محافظ للمستخدمين (100,000 ر.س)
INSERT INTO wallets (user_id, balance, created_at)
SELECT id, 100000.00, NOW()
FROM users
WHERE is_demo = true;

-- 3. إنشاء مشروع ديمو رسمي واحد
INSERT INTO projects (
  title, description, category, goal_amount, current_amount,
  owner_id, status, is_featured, is_demo, created_at
)
SELECT
  'مشروع بذره التجريبي الرسمي',
  'مشروع تجريبي شامل يعرض جميع مميزات منصة بذره للتمويل الجماعي والاستثمار الذكي',
  'technology',
  500000.00,
  125000.00,
  id,
  'active',
  true,
  true,
  NOW()
FROM users
WHERE username = 'project_owner_demo'
LIMIT 1;

-- 4. إنشاء 3 مجتمعات فقط
INSERT INTO communities (
  name, description, category, member_count, is_demo, created_at
) VALUES
  (
    'مجتمع بذره التجريبي',
    'مجتمع أساسي للتفاعل والاختبار ومشاركة التجارب',
    'general',
    15,
    true,
    NOW()
  ),
  (
    'مجتمع التقنية والابتكار',
    'مجتمع متخصص في التقنية والابتكار والذكاء الاصطناعي',
    'technology',
    28,
    true,
    NOW()
  ),
  (
    'مجتمع ريادة الأعمال',
    'مجتمع رواد الأعمال والمستثمرين وأصحاب المشاريع',
    'entrepreneurship',
    42,
    true,
    NOW()
  );

-- 5. إنشاء فعالية واحدة
INSERT INTO events (
  title, description, event_type, start_date, end_date,
  location, max_participants, current_participants, is_demo, created_at
) VALUES
  (
    'ورشة عمل تعريفية ببذره',
    'ورشة عمل شاملة للتعريف بمنصة بذره ومميزاتها وكيفية استخدامها',
    'workshop',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '7 days' + INTERVAL '2 hours',
    'أونلاين',
    100,
    23,
    true,
    NOW()
  );

-- 6. إضافة أعضاء للمجتمعات
INSERT INTO community_members (community_id, user_id, role, joined_at)
SELECT c.id, u.id, 'member', NOW()
FROM communities c
CROSS JOIN users u
WHERE c.is_demo = true AND u.is_demo = true;

-- 7. إضافة منشورات للمجتمعات
INSERT INTO community_posts (community_id, user_id, content, likes_count, created_at)
SELECT
  c.id,
  u.id,
  'مرحباً بكم في مجتمع بذره التجريبي! نتطلع للتفاعل معكم',
  5,
  NOW()
FROM communities c
CROSS JOIN users u
WHERE c.name = 'مجتمع بذره التجريبي' AND u.username = 'moderator_demo'
LIMIT 1;

-- 8. إضافة معاملات تجريبية
INSERT INTO transactions (
  user_id, type, amount, description, status, created_at
)
SELECT
  id,
  'deposit',
  100000.00,
  'رصيد تجريبي ابتدائي',
  'completed',
  NOW()
FROM users
WHERE is_demo = true;

-- 9. إضافة سجلات لوحة الصدارة
INSERT INTO leaderboard (user_id, points, rank, is_demo, updated_at)
SELECT
  id,
  FLOOR(RANDOM() * 1000 + 100),
  ROW_NUMBER() OVER (ORDER BY RANDOM()),
  true,
  NOW()
FROM users
WHERE is_demo = true;

-- تأكيد النجاح
SELECT 'تم تنظيف وإعادة بناء البيانات بنجاح!' AS status;

