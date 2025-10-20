-- Script to seed demo data for Bithrah app
-- Date: 2025-10-20

-- 1. Create demo transactions
INSERT INTO transactions (user_id, type, amount, description, status, created_at) VALUES
(27, 'credit', 100000.00, 'رصيد تجريبي أولي', 'completed', NOW() - INTERVAL '30 days'),
(27, 'debit', 500.00, 'دعم مشروع تجريبي', 'completed', NOW() - INTERVAL '5 days'),
(27, 'credit', 50.00, 'عمولة إحالة', 'completed', NOW() - INTERVAL '3 days'),
(27, 'debit', 1000.00, 'اشتراك باقة مميز', 'completed', NOW() - INTERVAL '2 days'),
(27, 'credit', 200.00, 'مكافأة تسويق', 'completed', NOW() - INTERVAL '1 day');

-- 2. Create demo AI evaluations
INSERT INTO ai_evaluations (user_id, project_title, project_description, category, evaluation_score, strengths, weaknesses, recommendations, market_potential, financial_viability, team_assessment, risk_analysis, overall_rating, created_at) VALUES
(27, 'منصة تعليمية ذكية', 'منصة تعليمية تستخدم الذكاء الاصطناعي لتخصيص المحتوى', 'تقنية', 85, '["فكرة مبتكرة", "سوق واعد", "تقنية حديثة"]'::jsonb, '["منافسة عالية", "يحتاج فريق تقني قوي"]'::jsonb, '["التركيز على التسويق", "بناء شراكات استراتيجية"]'::jsonb, 'عالي', 'جيد', 'يحتاج تعزيز', 'متوسط', 'A', NOW() - INTERVAL '7 days'),
(27, 'تطبيق توصيل صحي', 'تطبيق لتوصيل الوجبات الصحية والعضوية', 'صحة', 78, '["طلب متزايد", "نمط حياة صحي"]'::jsonb, '["تكاليف تشغيل عالية", "لوجستيات معقدة"]'::jsonb, '["التوسع التدريجي", "شراكات مع المطاعم"]'::jsonb, 'جيد', 'متوسط', 'جيد', 'متوسط', 'B+', NOW() - INTERVAL '5 days'),
(27, 'منصة تجارة إلكترونية محلية', 'منصة لدعم المنتجات المحلية والحرفية', 'تجارة', 82, '["دعم الاقتصاد المحلي", "منتجات فريدة"]'::jsonb, '["صعوبة التوسع", "جودة متفاوتة"]'::jsonb, '["معايير جودة صارمة", "برنامج تدريب للحرفيين"]'::jsonb, 'جيد جداً', 'جيد', 'جيد', 'منخفض', 'A-', NOW() - INTERVAL '3 days');

-- 3. Create demo referrals
INSERT INTO referrals (referrer_id, referred_id, status, commission_earned, created_at) VALUES
(27, 28, 'completed', 50.00, NOW() - INTERVAL '10 days'),
(27, 29, 'completed', 50.00, NOW() - INTERVAL '8 days'),
(27, 30, 'pending', 0.00, NOW() - INTERVAL '2 days');

-- 4. Create demo user activities
INSERT INTO user_activities (user_id, activity_type, activity_data, ip_address, user_agent, created_at) VALUES
(27, 'login', '{"method": "email", "success": true}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '1 hour'),
(27, 'project_view', '{"project_id": 22, "duration": 120}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '50 minutes'),
(27, 'project_support', '{"project_id": 22, "amount": 500}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '45 minutes'),
(27, 'evaluation_request', '{"project_title": "مشروع جديد"}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '30 minutes'),
(27, 'community_join', '{"community_id": 1}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '20 minutes'),
(27, 'profile_update', '{"fields": ["bio", "avatar"]}'::jsonb, '192.168.1.1', 'Mozilla/5.0', NOW() - INTERVAL '10 minutes');

-- 5. Create demo negotiations
INSERT INTO negotiations (project_id, investor_id, owner_id, status, investment_amount, equity_offered, message, created_at) VALUES
(22, 27, 27, 'pending', 50000.00, 10.00, 'مهتم بالاستثمار في هذا المشروع الواعد', NOW() - INTERVAL '5 days'),
(22, 27, 27, 'accepted', 25000.00, 5.00, 'أود المشاركة بمبلغ أقل', NOW() - INTERVAL '3 days');

-- 6. Create demo events
INSERT INTO events (creator_id, title, slug, description, category, event_type, start_date, end_date, location, max_attendees, attendees_count, status, is_featured, created_at) VALUES
(27, 'ورشة عمل: كيف تطلق مشروعك على بذرة', 'demo-workshop-launch-project', 'ورشة عمل تفاعلية لتعلم كيفية إطلاق مشروعك بنجاح على منصة بذرة', 'ورشة عمل', 'online', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '2 hours', 'أونلاين - Zoom', 200, 89, 'upcoming', true, NOW() - INTERVAL '14 days'),
(27, 'لقاء المستثمرين الشهري', 'monthly-investors-meetup', 'لقاء شهري لمناقشة الفرص الاستثمارية الجديدة', 'لقاء', 'hybrid', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '3 hours', 'الرياض + أونلاين', 100, 45, 'upcoming', true, NOW() - INTERVAL '10 days');

-- 7. Create demo backings
INSERT INTO backings (user_id, project_id, amount, package_id, status, created_at) VALUES
(27, 22, 500.00, NULL, 'completed', NOW() - INTERVAL '5 days'),
(27, 22, 1000.00, NULL, 'completed', NOW() - INTERVAL '3 days'),
(27, 22, 2000.00, NULL, 'completed', NOW() - INTERVAL '1 day');

-- 8. Update wallet balance
UPDATE wallets SET balance = 98500.00, updated_at = NOW() WHERE user_id = 27;

-- 9. Create demo community
INSERT INTO communities (creator_id, name, slug, description, category, member_count, posts_count, status, is_demo, created_at) 
VALUES (27, 'مجتمع بذرة التجريبي', 'demo-bithrah-community', 'مرحبًا بك في مجتمع بذرة التجريبي! هذا مجتمع تفاعلي يوضح لك كيفية التفاعل مع الأعضاء ومشاركة الأفكار.', 'ريادة أعمال', 1234, 5, 'active', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- 10. Create demo community posts
INSERT INTO community_posts (community_id, author_id, content, likes_count, comments_count, created_at) VALUES
((SELECT id FROM communities WHERE slug = 'demo-bithrah-community' LIMIT 1), 27, 'ما هي أفضل الممارسات لإطلاق مشروع ناجح على بذرة؟', 24, 8, NOW() - INTERVAL '1 day'),
((SELECT id FROM communities WHERE slug = 'demo-bithrah-community' LIMIT 1), 27, 'شاركت تجربتي في التمويل الجماعي، تعلمت الكثير!', 18, 5, NOW() - INTERVAL '2 days');

