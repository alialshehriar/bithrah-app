-- ============================================
-- المرحلة 1: تنظيف المنصة وإعادة ضبط بيانات الديمو
-- ============================================

-- 1. حذف المشاريع القديمة والإبقاء على مشروع ديمو رئيسي واحد
DELETE FROM backings WHERE project_id NOT IN (
  SELECT id FROM projects WHERE title = 'مشروع بذره التجريبي الرسمي'
);

DELETE FROM projects WHERE title != 'مشروع بذره التجريبي الرسمي';

-- إنشاء مشروع ديمو رئيسي إذا لم يكن موجوداً
INSERT INTO projects (
  creator_id,
  title,
  slug,
  description,
  short_description,
  category,
  sub_category,
  tags,
  image,
  cover_image,
  funding_goal,
  current_funding,
  minimum_funding,
  currency,
  backers_count,
  deadline,
  status,
  visibility,
  featured,
  trending,
  verified,
  platform_package,
  public_description,
  registered_description,
  full_description,
  negotiation_enabled,
  negotiation_deposit,
  funding_duration,
  funding_start_date,
  funding_end_date,
  created_at,
  updated_at,
  published_at
) VALUES (
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'مشروع بذره التجريبي الرسمي',
  'official-bithrah-demo-project',
  'مشروع تجريبي شامل يوضح جميع إمكانيات منصة بذره من تمويل جماعي، تقييم ذكي، ونظام دعم متكامل',
  'اكتشف كيف تعمل منصة بذره من خلال هذا المشروع التجريبي الشامل',
  'technology',
  'ai',
  '["ذكاء اصطناعي", "تقنية", "ابتكار", "ديمو"]'::jsonb,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
  500000.00,
  125000.00,
  50000.00,
  'SAR',
  12,
  NOW() + INTERVAL '45 days',
  'active',
  'public',
  true,
  true,
  true,
  'bithrah_plus',
  'منصة ذكية تستخدم الذكاء الاصطناعي لتحليل وتقييم الأفكار والمشاريع الناشئة',
  'نظام متكامل يوفر تقييم دقيق للأفكار باستخدام 7 نماذج عالمية معتمدة، مع نظام دعم تفاعلي وباقات متنوعة',
  'منصة بذره هي أول منصة عربية تجمع بين التمويل الجماعي والتقييم الذكي للأفكار. نستخدم نماذج عالمية معتمدة من MIT وMcKinsey وPwC لتحليل الأفكار بدقة تصل إلى 95٪. النظام يوفر باقات دعم متنوعة، مجتمعات تفاعلية، ونظام تفاوض احترافي.',
  true,
  5000.00,
  60,
  NOW(),
  NOW() + INTERVAL '60 days',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  current_funding = EXCLUDED.current_funding,
  backers_count = EXCLUDED.backers_count,
  updated_at = NOW();

-- 2. حذف المجتمعات القديمة وإنشاء ثلاث مجتمعات رئيسية
DELETE FROM community_members;
DELETE FROM community_posts;
DELETE FROM communities;

-- مجتمع أصحاب المشاريع
INSERT INTO communities (
  creator_id,
  name,
  slug,
  description,
  short_description,
  category,
  tags,
  image,
  cover_image,
  tier,
  is_private,
  requires_approval,
  member_count,
  status,
  verified,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'أصحاب المشاريع',
  'startup-founders',
  'مجتمع حصري لأصحاب المشاريع الناشئة والرياديين لتبادل الخبرات والتواصل',
  'انضم لمجتمع رواد الأعمال والمبتكرين',
  'entrepreneurship',
  '["ريادة أعمال", "مشاريع ناشئة", "ابتكار"]'::jsonb,
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
  'gold',
  false,
  false,
  45,
  'active',
  true,
  NOW(),
  NOW()
);

-- مجتمع المستثمرين
INSERT INTO communities (
  creator_id,
  name,
  slug,
  description,
  short_description,
  category,
  tags,
  image,
  cover_image,
  tier,
  is_private,
  requires_approval,
  member_count,
  status,
  verified,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'المستثمرين',
  'investors',
  'مجتمع المستثمرين والداعمين لاكتشاف الفرص الاستثمارية الواعدة',
  'اكتشف أفضل الفرص الاستثمارية',
  'investment',
  '["استثمار", "تمويل", "فرص"]'::jsonb,
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
  'gold',
  false,
  false,
  38,
  'active',
  true,
  NOW(),
  NOW()
);

-- مجتمع المسوقين
INSERT INTO communities (
  creator_id,
  name,
  slug,
  description,
  short_description,
  category,
  tags,
  image,
  cover_image,
  tier,
  is_private,
  requires_approval,
  member_count,
  status,
  verified,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
  'المسوقين',
  'marketers',
  'مجتمع المسوقين والمؤثرين للترويج للمشاريع وكسب العمولات',
  'اربح من خلال التسويق بالعمولة',
  'marketing',
  '["تسويق", "عمولة", "ترويج"]'::jsonb,
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
  'silver',
  false,
  false,
  52,
  'active',
  true,
  NOW(),
  NOW()
);

-- 3. إنشاء مستخدمين تجريبيين يمثلون كل فئة
-- سنستخدم المستخدمين الموجودين ونضيف لهم بيانات metadata لتمييزهم كديمو

UPDATE users SET 
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{is_demo}',
    'true'::jsonb
  )
WHERE email IN ('demo@bithrah.com', 'test@bithrahapp.com');

-- 4. إنشاء محافظ تجريبية برصيد 100,000 ريال
INSERT INTO wallets (
  user_id,
  balance,
  currency,
  total_deposited,
  total_withdrawn,
  total_earned,
  total_spent,
  status,
  created_at,
  updated_at
)
SELECT 
  id,
  100000.00,
  'SAR',
  100000.00,
  0.00,
  0.00,
  0.00,
  'active',
  NOW(),
  NOW()
FROM users
WHERE metadata->>'is_demo' = 'true'
ON CONFLICT (user_id) DO UPDATE SET
  balance = 100000.00,
  total_deposited = 100000.00,
  updated_at = NOW();

