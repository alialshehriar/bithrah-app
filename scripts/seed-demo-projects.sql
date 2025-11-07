-- Seed Demo Projects for Bithrah Platform
-- Run this on production database to add demo projects

-- First, ensure we have a demo user (creator)
INSERT INTO users (name, email, password, avatar, created_at, updated_at)
VALUES 
  ('مدير بذرة', 'demo-admin@bithrah.com', '$2a$10$dummyhashedpassword', NULL, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Get the demo user ID
DO $$
DECLARE
  demo_user_id INTEGER;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo-admin@bithrah.com';
  
  -- Insert Demo Project 1: AI Platform
  INSERT INTO projects (
    title, slug, short_description, description, category, status,
    funding_goal, current_funding, backers_count,
    deadline, image, cover_image, creator_id,
    created_at, updated_at
  ) VALUES (
    'مشروع بذره التجريبي (ديمو)',
    'demo-ai-platform',
    'اكتشف كيف تعمل منصة بذره من خلال هذا المشروع التجريبي الشامل',
    E'هذا مشروع تجريبي لعرض إمكانيات منصة بذره.\n\n**الوصف:**\nمنصة ذكية تجمع رواد الأعمال والمستثمرين في بيئة آمنة وموثوقة.\n\n**المميزات:**\n- تقييم AI للمشاريع\n- نظام تفاوض ذكي\n- محفظة رقمية\n- تقارير تحليلية\n\n**الهدف:**\nتسهيل عملية التمويل الجماعي في السعودية.',
    'تقنية',
    'active',
    500000,
    0,
    0,
    (NOW() + INTERVAL '28 days')::DATE,
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    demo_user_id,
    NOW(),
    NOW()
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

  -- Insert Demo Project 2: Analytics Dashboard
  INSERT INTO projects (
    title, slug, short_description, description, category, status,
    funding_goal, current_funding, backers_count,
    deadline, image, cover_image, creator_id,
    created_at, updated_at
  ) VALUES (
    'مشروع بذره التجريبي (ديمو)',
    'demo-analytics-dashboard',
    'منصة تمويل جماعي ذكية تجمع رواد الأعمال والمستثمرين',
    E'مشروع تجريبي آخر لاختبار النظام.\n\n**الفكرة:**\nلوحة تحكم تحليلية متقدمة للشركات الناشئة.\n\n**التقنيات:**\n- React & Next.js\n- AI & Machine Learning\n- Real-time Analytics\n- Cloud Infrastructure\n\n**السوق المستهدف:**\nالشركات الناشئة في السعودية والخليج.',
    'تقنية',
    'active',
    750000,
    0,
    0,
    (NOW() + INTERVAL '28 days')::DATE,
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    demo_user_id,
    NOW(),
    NOW()
  ) ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    updated_at = NOW();

END $$;

-- Verify projects were created
SELECT id, title, slug, funding_goal, status, creator_id 
FROM projects 
WHERE slug LIKE 'demo-%'
ORDER BY id DESC;
