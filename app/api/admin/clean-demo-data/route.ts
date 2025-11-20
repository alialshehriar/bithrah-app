import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { 
  users, projects, communities, backings, comments, likes, 
  messages, notifications, follows, referrals, communityMembers,
  communityPosts
} from '@/lib/db/schema';
import { eq, or, like, notInArray, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bithrah-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // Verify token and check if admin
    const { jwtVerify } = await import('jose');
    const JWT_SECRET = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'bithrah-super-secret-key-2025-production-v1'
    );
    
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as number;

    // Check if user is admin
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - يجب أن تكون مسؤولاً' },
        { status: 403 }
      );
    }

    // Start cleaning
    const results: any = {
      deletedUsers: 0,
      deletedProjects: 0,
      deletedCommunities: 0,
      deletedBackings: 0,
      deletedComments: 0,
      deletedLikes: 0,
      deletedMessages: 0,
      deletedNotifications: 0,
      deletedFollows: 0,
      deletedReferrals: 0,
      deletedCommunityMembers: 0,
      deletedCommunityPosts: 0,

    };

    // 1. Delete demo users
    const demoUsers = await db.delete(users)
      .where(
        or(
          eq(users.isDemo, true),
          like(users.email, '%@demo.%'),
          like(users.email, '%test%')
        )
      )
      .returning({ id: users.id });
    results.deletedUsers = demoUsers.length;

    // 2. Delete demo projects
    const demoProjects = await db.delete(projects)
      .where(eq(projects.isDemo, true))
      .returning({ id: projects.id });
    results.deletedProjects = demoProjects.length;

    // 3. Delete demo communities
    const demoCommunities = await db.delete(communities)
      .where(eq(communities.isDemo, true))
      .returning({ id: communities.id });
    results.deletedCommunities = demoCommunities.length;

    // 4. Clean orphaned data
    // Get valid user IDs
    const validUsers = await db.select({ id: users.id }).from(users);
    const validUserIds = validUsers.map(u => u.id);

    // Get valid project IDs
    const validProjects = await db.select({ id: projects.id }).from(projects);
    const validProjectIds = validProjects.map(p => p.id);

    // Get valid community IDs
    const validCommunities = await db.select({ id: communities.id }).from(communities);
    const validCommunityIds = validCommunities.map(c => c.id);

    // Delete orphaned backings
    if (validUserIds.length > 0 && validProjectIds.length > 0) {
      const orphanedBackings = await db.delete(backings)
        .where(
          or(
            notInArray(backings.userId, validUserIds),
            notInArray(backings.projectId, validProjectIds)
          )
        )
        .returning({ id: backings.id });
      results.deletedBackings = orphanedBackings.length;
    }

    // Delete orphaned comments
    if (validUserIds.length > 0) {
      const orphanedComments = await db.delete(comments)
        .where(notInArray(comments.userId, validUserIds))
        .returning({ id: comments.id });
      results.deletedComments = orphanedComments.length;
    }

    // Delete orphaned likes
    if (validUserIds.length > 0) {
      const orphanedLikes = await db.delete(likes)
        .where(notInArray(likes.userId, validUserIds))
        .returning({ id: likes.id });
      results.deletedLikes = orphanedLikes.length;
    }

    // Delete orphaned messages
    if (validUserIds.length > 0) {
      const orphanedMessages = await db.delete(messages)
        .where(
          or(
            notInArray(messages.senderId, validUserIds),
            notInArray(messages.recipientId, validUserIds)
          )
        )
        .returning({ id: messages.id });
      results.deletedMessages = orphanedMessages.length;
    }

    // Delete orphaned notifications
    if (validUserIds.length > 0) {
      const orphanedNotifications = await db.delete(notifications)
        .where(notInArray(notifications.userId, validUserIds))
        .returning({ id: notifications.id });
      results.deletedNotifications = orphanedNotifications.length;
    }

    // Delete orphaned follows
    if (validUserIds.length > 0) {
      const orphanedFollows = await db.delete(follows)
        .where(
          or(
            notInArray(follows.followerId, validUserIds),
            notInArray(follows.followingId, validUserIds)
          )
        )
        .returning({ id: follows.id });
      results.deletedFollows = orphanedFollows.length;
    }

    // Delete orphaned referrals
    if (validUserIds.length > 0) {
      const orphanedReferrals = await db.delete(referrals)
        .where(
          or(
            notInArray(referrals.referrerId, validUserIds),
            notInArray(referrals.referredId, validUserIds)
          )
        )
        .returning({ id: referrals.id });
      results.deletedReferrals = orphanedReferrals.length;
    }

    // Delete orphaned community members
    if (validUserIds.length > 0 && validCommunityIds.length > 0) {
      const orphanedMembers = await db.delete(communityMembers)
        .where(
          or(
            notInArray(communityMembers.userId, validUserIds),
            notInArray(communityMembers.communityId, validCommunityIds)
          )
        )
        .returning({ id: communityMembers.id });
      results.deletedCommunityMembers = orphanedMembers.length;
    }

    // Delete orphaned community posts
    if (validUserIds.length > 0 && validCommunityIds.length > 0) {
      const orphanedPosts = await db.delete(communityPosts)
        .where(
          or(
            notInArray(communityPosts.userId, validUserIds),
            notInArray(communityPosts.communityId, validCommunityIds)
          )
        )
        .returning({ id: communityPosts.id });
      results.deletedCommunityPosts = orphanedPosts.length;
    }



    return NextResponse.json({
      success: true,
      message: 'تم تنظيف البيانات الوهمية بنجاح',
      results,
    });
  } catch (error) {
    console.error('Error cleaning demo data:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء تنظيف البيانات' },
      { status: 500 }
    );
  }
}
