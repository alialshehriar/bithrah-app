import { NextRequest, NextResponse } from 'next/server';
import { sandboxCommunities, sandboxUsers } from '@/lib/sandbox/comprehensive-data';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const sandboxMode = cookieStore.get('sandboxMode')?.value === 'true';

    if (sandboxMode) {
      // Find community in sandbox data
      const community = sandboxCommunities.find(c => c.id === id);
      
      if (!community) {
        return NextResponse.json(
          { success: false, error: 'Community not found' },
          { status: 404 }
        );
      }

      // Get creator info
      const creator = sandboxUsers.find(u => u.id === community.creatorId);

      // Generate mock posts
      const mockPosts = [
        {
          id: 1,
          content: 'مرحباً بالجميع في هذا المجتمع الرائع! نتطلع للتعاون معكم',
          attachments: null,
          likesCount: 45,
          commentsCount: 12,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          author: {
            id: parseInt(community.creatorId),
            name: community.creatorName,
            username: creator?.username || 'user',
            avatar: null,
            level: creator?.level || 1,
          },
        },
        {
          id: 2,
          content: 'هل لديكم أي أفكار لمشاريع جديدة في هذا المجال؟',
          attachments: null,
          likesCount: 32,
          commentsCount: 8,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          author: {
            id: parseInt(community.creatorId),
            name: community.creatorName,
            username: creator?.username || 'user',
            avatar: null,
            level: creator?.level || 1,
          },
        },
      ];

      // Generate mock members
      const mockMembers = sandboxUsers.slice(0, 10).map((user, index) => ({
        id: parseInt(user.id),
        role: index === 0 ? 'admin' : 'member',
        points: Math.floor(Math.random() * 5000) + 100,
        joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        user: {
          id: parseInt(user.id),
          name: user.name,
          username: user.username,
          avatar: null,
          level: user.level,
        },
      })).sort((a, b) => b.points - a.points);

      const communityData = {
        id: parseInt(community.id),
        name: community.name,
        description: community.description,
        category: community.category,
        privacy: community.isPrivate ? 'private' : 'public',
        coverImage: community.image,
        rules: 'يرجى احترام جميع الأعضاء والالتزام بقواعد المجتمع',
        memberCount: community.memberCount,
        postCount: community.postsCount,
        createdAt: community.createdAt,
        creator: {
          id: parseInt(community.creatorId),
          name: community.creatorName,
          username: creator?.username || 'user',
          avatar: null,
        },
      };

      return NextResponse.json({
        success: true,
        community: communityData,
        posts: mockPosts,
        members: mockMembers,
        isMember: true,
        memberRole: 'member',
      });
    }

    // Real data mode - would connect to database
    return NextResponse.json(
      { success: false, error: 'Community not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch community' },
      { status: 500 }
    );
  }
}

