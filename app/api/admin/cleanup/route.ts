import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, projects, communities, backings, comments, likes, messages, notifications, follows, referrals, communityMembers, communityPosts } from '@/lib/db/schema';
import { eq, or, like, notInArray, sql } from 'drizzle-orm';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'cleanup') {
      // Step 1: Get all demo/test user IDs
      const demoUsers = await db
        .select({ id: users.id })
        .from(users)
        .where(
          or(
            like(users.email, '%test%'),
            like(users.email, '%demo%'),
            like(users.email, '%example%'),
            eq(users.isDemo, true)
          )
        );

      const demoUserIds = demoUsers.map(u => u.id);

      if (demoUserIds.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No demo users found',
          stats: {
            deletedUsers: 0,
            deletedProjects: 0,
            deletedCommunities: 0,
          }
        });
      }

      // Step 2: Delete all data related to demo users
      
      // Delete backings
      await db.delete(backings).where(
        or(
          sql`${backings.userId} IN (${sql.join(demoUserIds, sql`, `)})`,
          sql`${backings.projectId} IN (SELECT id FROM ${projects} WHERE ${projects.userId} IN (${sql.join(demoUserIds, sql`, `)}))`
        )
      );

      // Delete comments
      await db.delete(comments).where(
        sql`${comments.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete likes
      await db.delete(likes).where(
        sql`${likes.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete messages
      await db.delete(messages).where(
        or(
          sql`${messages.senderId} IN (${sql.join(demoUserIds, sql`, `)})`,
          sql`${messages.receiverId} IN (${sql.join(demoUserIds, sql`, `)})`
        )
      );

      // Delete notifications
      await db.delete(notifications).where(
        sql`${notifications.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete follows
      await db.delete(follows).where(
        or(
          sql`${follows.followerId} IN (${sql.join(demoUserIds, sql`, `)})`,
          sql`${follows.followingId} IN (${sql.join(demoUserIds, sql`, `)})`
        )
      );

      // Delete referrals
      await db.delete(referrals).where(
        or(
          sql`${referrals.referrerId} IN (${sql.join(demoUserIds, sql`, `)})`,
          sql`${referrals.referredId} IN (${sql.join(demoUserIds, sql`, `)})`
        )
      );

      // Delete community members
      await db.delete(communityMembers).where(
        sql`${communityMembers.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete community posts
      await db.delete(communityPosts).where(
        sql`${communityPosts.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete projects
      const deletedProjects = await db.delete(projects).where(
        sql`${projects.userId} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete communities
      const deletedCommunities = await db.delete(communities).where(
        sql`${communities.createdBy} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Delete users
      const deletedUsers = await db.delete(users).where(
        sql`${users.id} IN (${sql.join(demoUserIds, sql`, `)})`
      );

      // Step 3: Clean orphaned data
      
      // Get all valid user IDs
      const validUsers = await db.select({ id: users.id }).from(users);
      const validUserIds = validUsers.map(u => u.id);

      if (validUserIds.length > 0) {
        // Delete orphaned backings
        await db.delete(backings).where(
          sql`${backings.userId} NOT IN (${sql.join(validUserIds, sql`, `)})`
        );

        // Delete orphaned comments
        await db.delete(comments).where(
          sql`${comments.userId} NOT IN (${sql.join(validUserIds, sql`, `)})`
        );

        // Delete orphaned likes
        await db.delete(likes).where(
          sql`${likes.userId} NOT IN (${sql.join(validUserIds, sql`, `)})`
        );

        // Delete orphaned messages
        await db.delete(messages).where(
          or(
            sql`${messages.senderId} NOT IN (${sql.join(validUserIds, sql`, `)})`,
            sql`${messages.receiverId} NOT IN (${sql.join(validUserIds, sql`, `)})`
          )
        );

        // Delete orphaned notifications
        await db.delete(notifications).where(
          sql`${notifications.userId} NOT IN (${sql.join(validUserIds, sql`, `)})`
        );

        // Delete orphaned follows
        await db.delete(follows).where(
          or(
            sql`${follows.followerId} NOT IN (${sql.join(validUserIds, sql`, `)})`,
            sql`${follows.followingId} NOT IN (${sql.join(validUserIds, sql`, `)})`
          )
        );

        // Delete orphaned referrals
        await db.delete(referrals).where(
          or(
            sql`${referrals.referrerId} NOT IN (${sql.join(validUserIds, sql`, `)})`,
            sql`${referrals.referredId} NOT IN (${sql.join(validUserIds, sql`, `)})`
          )
        );
      }

      // Get final stats
      const remainingUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
      const remainingProjects = await db.select({ count: sql<number>`count(*)` }).from(projects);
      const remainingCommunities = await db.select({ count: sql<number>`count(*)` }).from(communities);
      const unverifiedUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.emailVerified, false));

      return NextResponse.json({
        success: true,
        message: 'Database cleaned successfully',
        stats: {
          deletedUsers: demoUserIds.length,
          remainingUsers: remainingUsers[0].count,
          remainingProjects: remainingProjects[0].count,
          remainingCommunities: remainingCommunities[0].count,
          unverifiedUsers: unverifiedUsers[0].count,
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to clean database' },
      { status: 500 }
    );
  }
}

// GET endpoint to check cleanup status
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get demo users count
    const demoUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        or(
          like(users.email, '%test%'),
          like(users.email, '%demo%'),
          like(users.email, '%example%'),
          eq(users.isDemo, true)
        )
      );

    // Get total counts
    const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalProjects = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const totalCommunities = await db.select({ count: sql<number>`count(*)` }).from(communities);
    const unverifiedUsers = await db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.emailVerified, false));

    return NextResponse.json({
      demoUsers: demoUsers[0].count,
      totalUsers: totalUsers[0].count,
      totalProjects: totalProjects[0].count,
      totalCommunities: totalCommunities[0].count,
      unverifiedUsers: unverifiedUsers[0].count,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
