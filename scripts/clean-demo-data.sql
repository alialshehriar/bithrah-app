-- ============================================
-- CLEAN ALL DEMO DATA FROM BITHRAH PLATFORM
-- ============================================
-- This script removes all demo/test data to prepare for beta launch

-- Start transaction
BEGIN;

-- 1. Delete all demo users and their related data
DELETE FROM users WHERE is_demo = true OR email LIKE '%@demo.%' OR email LIKE '%test%';

-- 2. Delete all projects marked as demo
DELETE FROM projects WHERE is_demo = true;

-- 3. Delete all communities marked as demo
DELETE FROM communities WHERE is_demo = true;

-- 4. Delete orphaned backings (backings without valid user or project)
DELETE FROM backings 
WHERE user_id NOT IN (SELECT id FROM users)
   OR project_id NOT IN (SELECT id FROM projects);

-- 5. Delete orphaned comments
DELETE FROM comments 
WHERE user_id NOT IN (SELECT id FROM users);

-- 6. Delete orphaned likes
DELETE FROM likes 
WHERE user_id NOT IN (SELECT id FROM users);

-- 7. Delete orphaned messages
DELETE FROM messages 
WHERE sender_id NOT IN (SELECT id FROM users)
   OR recipient_id NOT IN (SELECT id FROM users);

-- 8. Delete orphaned notifications
DELETE FROM notifications 
WHERE user_id NOT IN (SELECT id FROM users);

-- 9. Delete orphaned follows
DELETE FROM follows 
WHERE follower_id NOT IN (SELECT id FROM users)
   OR following_id NOT IN (SELECT id FROM users);

-- 10. Delete orphaned referrals
DELETE FROM referrals 
WHERE referrer_id NOT IN (SELECT id FROM users)
   OR referred_id NOT IN (SELECT id FROM users);

-- 11. Delete orphaned community memberships
DELETE FROM community_members 
WHERE user_id NOT IN (SELECT id FROM users)
   OR community_id NOT IN (SELECT id FROM communities);

-- 12. Delete orphaned community posts
DELETE FROM community_posts 
WHERE user_id NOT IN (SELECT id FROM users)
   OR community_id NOT IN (SELECT id FROM communities);

-- 13. Delete orphaned project updates
DELETE FROM project_updates 
WHERE project_id NOT IN (SELECT id FROM projects);

-- 14. Delete orphaned marketing campaigns
DELETE FROM marketing_campaigns 
WHERE project_id NOT IN (SELECT id FROM projects)
   OR marketer_id NOT IN (SELECT id FROM users);

-- 15. Delete orphaned achievements
DELETE FROM user_achievements 
WHERE user_id NOT IN (SELECT id FROM users);

-- 16. Delete orphaned badges
DELETE FROM user_badges 
WHERE user_id NOT IN (SELECT id FROM users);

-- 17. Reset sequences if needed (optional)
-- This ensures IDs start from a clean state

-- Commit transaction
COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the cleanup

-- Count remaining users
SELECT COUNT(*) as total_users FROM users;

-- Count remaining projects
SELECT COUNT(*) as total_projects FROM projects;

-- Count remaining communities
SELECT COUNT(*) as total_communities FROM communities;

-- Show any remaining demo data (should be 0)
SELECT COUNT(*) as remaining_demo_users FROM users WHERE is_demo = true;
SELECT COUNT(*) as remaining_demo_projects FROM projects WHERE is_demo = true;
SELECT COUNT(*) as remaining_demo_communities FROM communities WHERE is_demo = true;
