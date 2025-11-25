-- =====================================================
-- Bithrah Platform Database Cleanup Script
-- Purpose: Remove all demo/test data and keep only real user accounts
-- =====================================================

-- Step 1: Delete all demo/test users
-- Users with demo emails or test emails
DELETE FROM users 
WHERE email LIKE '%test%' 
   OR email LIKE '%demo%' 
   OR email LIKE '%example%'
   OR "isDemo" = true;

-- Step 2: Delete orphaned data (data without valid user references)

-- Delete backings without valid user or project
DELETE FROM backings 
WHERE "userId" NOT IN (SELECT id FROM users)
   OR "projectId" NOT IN (SELECT id FROM projects);

-- Delete comments without valid user
DELETE FROM comments 
WHERE "userId" NOT IN (SELECT id FROM users);

-- Delete likes without valid user
DELETE FROM likes 
WHERE "userId" NOT IN (SELECT id FROM users);

-- Delete messages without valid sender or receiver
DELETE FROM messages 
WHERE "senderId" NOT IN (SELECT id FROM users)
   OR "receiverId" NOT IN (SELECT id FROM users);

-- Delete notifications without valid user
DELETE FROM notifications 
WHERE "userId" NOT IN (SELECT id FROM users);

-- Delete follows without valid follower or following
DELETE FROM follows 
WHERE "followerId" NOT IN (SELECT id FROM users)
   OR "followingId" NOT IN (SELECT id FROM users);

-- Delete referrals without valid referrer or referred
DELETE FROM referrals 
WHERE "referrerId" NOT IN (SELECT id FROM users)
   OR "referredId" NOT IN (SELECT id FROM users);

-- Delete community members without valid user or community
DELETE FROM community_members 
WHERE "userId" NOT IN (SELECT id FROM users)
   OR "communityId" NOT IN (SELECT id FROM communities);

-- Delete community posts without valid user or community
DELETE FROM community_posts 
WHERE "userId" NOT IN (SELECT id FROM users)
   OR "communityId" NOT IN (SELECT id FROM communities);

-- Step 3: Delete projects without valid owner
DELETE FROM projects 
WHERE "userId" NOT IN (SELECT id FROM users);

-- Step 4: Delete communities without valid creator
DELETE FROM communities 
WHERE "createdBy" NOT IN (SELECT id FROM users);

-- Step 5: Update statistics
-- This will be done automatically by the application

-- =====================================================
-- Verification Queries
-- =====================================================

-- Count remaining users
SELECT COUNT(*) as total_users FROM users;

-- Count users without email verification
SELECT COUNT(*) as unverified_users FROM users WHERE "emailVerified" = false;

-- Count projects
SELECT COUNT(*) as total_projects FROM projects;

-- Count communities
SELECT COUNT(*) as total_communities FROM communities;

-- =====================================================
-- END OF CLEANUP SCRIPT
-- =====================================================
