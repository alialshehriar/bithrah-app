-- ====================================
-- Bithrah App - Demo Seeds
-- ====================================
-- This file contains demo data for the Bithrah platform
-- All data is marked with is_demo=true for easy identification

-- Clean existing data (except users table for safety)
TRUNCATE TABLE projects CASCADE;
TRUNCATE TABLE communities CASCADE;
TRUNCATE TABLE community_posts CASCADE;
TRUNCATE TABLE backings CASCADE;
TRUNCATE TABLE negotiations CASCADE;
TRUNCATE TABLE wallet_transactions CASCADE;

-- Insert Demo Project
INSERT INTO projects (
  id,
  title,
  description,
  category,
  goal_amount,
  current_amount,
  owner_id,
  status,
  is_demo,
  created_at,
  updated_at,
  image_url,
  video_url,
  tags,
  end_date
) VALUES (
  'demo-project-001',
  'مشروع بذرة التجريبي',
  'مشروع تجريبي متكامل يوضح كيفية عمل منصة بذرة. يمكنك دعم هذا المشروع بالرصيد التجريبي لتجربة النظام بالكامل.',
  'technology',
  100000,
  45000,
  'demo-admin',
  'active',
  true,
  NOW(),
  NOW(),
  '/images/demo-project.jpg',
  'https://www.youtube.com/watch?v=demo',
  ARRAY['تجريبي', 'تقنية', 'ابتكار'],
  NOW() + INTERVAL '30 days'
);

-- Insert Demo Project Packages
INSERT INTO support_packages (
  id,
  project_id,
  title,
  description,
  amount,
  benefits,
  max_backers,
  current_backers,
  created_at
) VALUES 
(
  'demo-package-basic',
  'demo-project-001',
  'باقة الداعم',
  'دعم أساسي للمشروع التجريبي',
  50,
  ARRAY['شكر خاص', 'اسمك في قائمة الداعمين'],
  100,
  12,
  NOW()
),
(
  'demo-package-premium',
  'demo-project-001',
  'باقة المميز',
  'دعم متوسط مع مزايا إضافية',
  500,
  ARRAY['شكر خاص', 'اسمك في قائمة الداعمين', 'تحديثات حصرية', 'دعوة لحدث الإطلاق'],
  50,
  8,
  NOW()
),
(
  'demo-package-vip',
  'demo-project-001',
  'باقة الشريك',
  'دعم كامل مع شراكة استراتيجية',
  5000,
  ARRAY['شكر خاص', 'اسمك في قائمة الداعمين', 'تحديثات حصرية', 'دعوة لحدث الإطلاق', 'لقاء مع الفريق', 'شراكة استراتيجية'],
  10,
  2,
  NOW()
);

-- Insert Demo Community
INSERT INTO communities (
  id,
  name,
  description,
  category,
  owner_id,
  is_demo,
  member_count,
  created_at,
  updated_at,
  image_url,
  tags
) VALUES (
  'demo-community-001',
  'مجتمع بذرة التفاعلي',
  'مجتمع تجريبي لتجربة ميزات المجتمعات في بذرة. شارك أفكارك وتفاعل مع المستخدمين الآخرين.',
  'technology',
  'demo-admin',
  true,
  156,
  NOW(),
  NOW(),
  '/images/demo-community.jpg',
  ARRAY['تجريبي', 'تقنية', 'ابتكار', 'مجتمع']
);

-- Insert Demo Community Posts
INSERT INTO community_posts (
  id,
  community_id,
  user_id,
  content,
  likes_count,
  comments_count,
  created_at,
  updated_at
) VALUES 
(
  'demo-post-001',
  'demo-community-001',
  'demo-admin',
  'مرحباً بكم في مجتمع بذرة التجريبي! 🎉 هنا يمكنكم تجربة ميزات المجتمعات والتفاعل مع المستخدمين الآخرين.',
  24,
  8,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  'demo-post-002',
  'demo-community-001',
  'demo-admin',
  'نصيحة: جرب دعم المشروع التجريبي بإحدى الباقات المتاحة. ستلاحظ كيف يتم خصم المبلغ من رصيدك التجريبي وإعادته تلقائياً.',
  18,
  5,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  'demo-post-003',
  'demo-community-001',
  'demo-admin',
  'هل جربت ميزة تقييم الأفكار بالذكاء الاصطناعي؟ إنها أداة قوية لتحليل أفكارك قبل إطلاقها! 💡',
  32,
  12,
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '3 hours'
);

-- Note: Admin user should be created via environment variables
-- ADMIN_EMAIL and ADMIN_PASSWORD in .env.local

