'use server';

import { db } from '@/lib/db';
import { communities, communityMembers, communityPosts, users } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function getCommunityById(id: number) {
  try {
    // Get community
    const community = await db.query.communities.findFirst({
      where: eq(communities.id, id),
    });

    if (!community) {
      return { error: 'Community not found' };
    }

    // Get creator info
    const creator = await db.query.users.findFirst({
      where: eq(users.id, community.creatorId),
    });

    // Get member count
    const memberCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityMembers)
      .where(eq(communityMembers.communityId, id));
    
    const memberCount = Number(memberCountResult[0]?.count || 0);

    // Get post count
    const postCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityPosts)
      .where(eq(communityPosts.communityId, id));
    
    const postCount = Number(postCountResult[0]?.count || 0);

    // Get posts with author info
    const posts = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        userId: communityPosts.userId,
        createdAt: communityPosts.createdAt,
        authorName: users.name,
        authorUsername: users.username,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .where(eq(communityPosts.communityId, id))
      .orderBy(desc(communityPosts.createdAt))
      .limit(20);

    // Get top members
    const members = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        points: users.points,
      })
      .from(communityMembers)
      .leftJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, id))
      .orderBy(desc(users.points))
      .limit(10);

    return {
      id: community.id,
      name: community.name,
      description: community.description,
      category: community.category,
      creatorId: community.creatorId,
      creatorName: creator?.name || 'Unknown',
      creatorUsername: creator?.username || 'unknown',
      memberCount,
      postCount,
      createdAt: community.createdAt.toISOString(),
      posts: posts.map(p => ({
        id: p.id,
        content: p.content,
        userId: p.userId,
        authorName: p.authorName || 'Unknown',
        authorUsername: p.authorUsername || 'unknown',
        createdAt: p.createdAt.toISOString(),
        likesCount: 0,
        commentsCount: 0,
      })),
      members: members.map(m => ({
        id: m.id!,
        name: m.name || 'Unknown',
        username: m.username || 'unknown',
        points: m.points || 0,
      })),
    };
  } catch (error) {
    console.error('Error fetching community:', error);
    return { error: 'Failed to fetch community' };
  }
}

export async function createCommunityPost(communityId: number, content: string, userId: number) {
  try {
    await db.insert(communityPosts).values({
      communityId,
      userId: userId,
      content,
      createdAt: new Date(),
    } as any);

    return { success: true };
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: 'Failed to create post' };
  }
}

