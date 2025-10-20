import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, projects, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // Get project
    const [project] = await db
      .select({
        id: projects.id,
        title: projects.title,
        slug: projects.slug,
        fundingGoal: projects.fundingGoal,
        currentFunding: projects.currentFunding,
        ownerId: projects.creatorId,
        ownerName: users.name,
        ownerAvatar: users.avatar,
      })
      .from(projects)
      .leftJoin(users, eq(projects.creatorId, users.id))
      .where(eq(projects.slug, slug))
      .limit(1);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // TODO: Get current user ID from session
    const currentUserId = 1; // Temporary - should come from auth

    // Get active negotiation for this user and project
    const [negotiation] = await db
      .select()
      .from(negotiations)
      .where(
        and(
          eq(negotiations.projectId, project.id),
          eq(negotiations.investorId, currentUserId)
        )
      )
      .orderBy(desc(negotiations.createdAt))
      .limit(1);

    if (!negotiation) {
      return NextResponse.json(
        { success: false, error: 'لا توجد جلسة تفاوض نشطة' },
        { status: 404 }
      );
    }

    // Get messages
    const messagesData = await db
      .select({
        id: negotiationMessages.id,
        content: negotiationMessages.content,
        senderId: negotiationMessages.senderId,
        senderName: users.name,
        senderAvatar: users.avatar,
        createdAt: negotiationMessages.createdAt,
        status: negotiationMessages.status,
      })
      .from(negotiationMessages)
      .leftJoin(users, eq(negotiationMessages.senderId, users.id))
      .where(eq(negotiationMessages.negotiationId, negotiation.id))
      .orderBy(negotiationMessages.createdAt);

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        name: project.title,
        slug: project.slug,
        fundingGoal: Number(project.fundingGoal),
        currentAmount: Number(project.currentFunding),
        owner: {
          id: project.ownerId,
          name: project.ownerName,
          avatar: project.ownerAvatar,
        },
      },
      negotiation: {
        id: negotiation.id,
        uuid: negotiation.uuid,
        status: negotiation.status,
        startDate: negotiation.startDate,
        endDate: negotiation.endDate,
        depositAmount: Number(negotiation.depositAmount),
        depositStatus: negotiation.depositStatus,
        hasFullAccess: negotiation.hasFullAccess,
        agreedAmount: negotiation.agreedAmount ? Number(negotiation.agreedAmount) : null,
        agreementTerms: negotiation.agreementTerms,
        agreementReached: negotiation.agreementReached,
      },
      messages: messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar,
        createdAt: msg.createdAt,
        status: msg.status,
      })),
    });
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

