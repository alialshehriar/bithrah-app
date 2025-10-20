-- ========================================
-- سكريبت إعادة بناء البيانات التجريبية لمنصة بذره
-- ========================================

-- 1. حذف البيانات القديمة
DELETE FROM community_posts;
DELETE FROM community_members;
DELETE FROM communities WHERE name NOT IN ('مجتمع التقنية والابتكار', 'مجتمع ريادة الأعمال', 'مجتمع التعليم والتدريب', 'مجتمع الاستثمار والتسويق');
DELETE FROM backings;
DELETE FROM projects WHERE title != 'مشروع بذره التجريبي الرسمي';

-- 2. إنشاء المجتمعات الأربعة
INSERT INTO communities (name, description, category, member_count, post_count, created_at, updated_at)
VALUES
  ('مجتمع التقنية والابتكار', 'مجتمع متخصص في التقنية والابتكار وريادة الأعمال التقنية', 'تقنية', 0, 0, NOW(), NOW()),
  ('مجتمع ريادة الأعمال', 'مجتمع لرواد الأعمال والمهتمين ببناء المشاريع الناشئة', 'ريادة أعمال', 0, 0, NOW(), NOW()),
  ('مجتمع التعليم والتدريب', 'مجتمع متخصص في التعليم والتدريب وتطوير المهارات', 'تعليم', 0, 0, NOW(), NOW()),
  ('مجتمع الاستثمار والتسويق', 'مجتمع للمستثمرين والمسوقين المهتمين بالفرص الاستثمارية', 'استثمار', 0, 0, NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = NOW();

-- 3. إضافة منشورات تجريبية لكل مجتمع
-- (سيتم إضافتها عبر API لضمان التوافق مع schema)

-- 4. تحديث عداد الأعضاء
UPDATE communities SET member_count = (
  SELECT COUNT(*) FROM community_members WHERE community_id = communities.id
);

-- 5. تحديث عداد المنشورات
UPDATE communities SET post_count = (
  SELECT COUNT(*) FROM community_posts WHERE community_id = communities.id
);

