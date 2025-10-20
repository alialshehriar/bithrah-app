import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, communityMembers, communityPosts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Fetch community by slug
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug))
      .limit(1);

    if (!community) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    // Fetch creator
    const [creator] = await db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        avatar: users.avatar,
      })
      .from(users)
      .where(eq(users.id, community.creatorId))
      .limit(1);

    // Fetch posts with authors
    const postsData = await db
      .select({
        id: communityPosts.id,
        content: communityPosts.content,
        attachments: communityPosts.attachments,
        likesCount: communityPosts.likesCount,
        commentsCount: communityPosts.commentsCount,
        createdAt: communityPosts.createdAt,
        authorId: users.id,
        authorName: users.name,
        authorUsername: users.username,
        authorAvatar: users.avatar,
        authorLevel: users.level,
      })
      .from(communityPosts)
      .leftJoin(users, eq(communityPosts.userId, users.id))
      .where(eq(communityPosts.communityId, community.id))
      .orderBy(communityPosts.createdAt)
      .limit(20);

    // Fetch members with user data
    const membersData = await db
      .select({
        id: communityMembers.id,
        role: communityMembers.role,
        points: communityMembers.points,
        joinedAt: communityMembers.joinedAt,
        userId: users.id,
        userName: users.name,
        userUsername: users.username,
        userAvatar: users.avatar,
        userLevel: users.level,
      })
      .from(communityMembers)
      .leftJoin(users, eq(communityMembers.userId, users.id))
      .where(eq(communityMembers.communityId, community.id))
      .limit(50);

    return NextResponse.json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        description: community.description,
        category: community.category,
        privacy: community.tier,
        coverImage: community.coverImage,
        rules: community.rules,
        memberCount: community.memberCount,
        postCount: community.postsCount,
        createdAt: community.createdAt,
        creator: creator,
      },
      posts: postsData.map(post => ({
        id: post.id,
        content: post.content,
        attachments: post.attachments,
        likesCount: post.likesCount,
        commentsCount: post.commentsCount,
        createdAt: post.createdAt,
        author: {
          id: post.authorId,
          name: post.authorName,
          username: post.authorUsername,
          avatar: post.authorAvatar,
          level: post.authorLevel,
        },
      })),
      members: membersData.map(member => ({
        id: member.id,
        role: member.role,
        points: member.points,
        joinedAt: member.joinedAt,
        user: {
          id: member.userId,
          name: member.userName,
          username: member.userUsername,
          avatar: member.userAvatar,
          level: member.userLevel,
        },
      })),
      isMember: false,
      memberRole: null,
    });
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

