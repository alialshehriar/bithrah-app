import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, users, projects } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const projectId = parseInt(id);

    // Get active negotiation session for this project and user
    const negotiationData = await db
      .select({
        id: negotiations.id,
        projectId: negotiations.projectId,
        investorId: negotiations.investorId,
        status: negotiations.status,
        startDate: negotiations.startDate,
        endDate: negotiations.endDate,
        depositAmount: negotiations.depositAmount,
        depositStatus: negotiations.depositStatus,
        projectTitle: projects.title,
        creatorName: users.name,
      })
      .from(negotiations)
      .leftJoin(projects, eq(negotiations.projectId, projects.id))
      .leftJoin(users, eq(projects.creatorId, users.id))
      .where(
        and(
          eq(negotiations.projectId, projectId),
          eq(negotiations.investorId, session.id),
          eq(negotiations.status, 'active')
        )
      )
      .limit(1);

    if (negotiationData.length === 0) {
      return NextResponse.json({ error: 'No active negotiation found' }, { status: 404 });
    }

    const negotiation = negotiationData[0];

    // Get messages for this negotiation
    const messages = await db
      .select({
        id: negotiationMessages.id,
        senderId: negotiationMessages.senderId,
        content: negotiationMessages.content,
        timestamp: negotiationMessages.createdAt,
        flagged: negotiationMessages.flagged,
        senderName: users.name,
      })
      .from(negotiationMessages)
      .leftJoin(users, eq(negotiationMessages.senderId, users.id))
      .where(eq(negotiationMessages.negotiationId, negotiation.id))
      .orderBy(negotiationMessages.createdAt);

    // Get current user name
    const currentUser = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    return NextResponse.json({
      id: negotiation.id,
      projectId: negotiation.projectId,
      projectTitle: negotiation.projectTitle,
      creatorName: negotiation.creatorName,
      backerName: currentUser[0]?.name || 'أنت',
      status: negotiation.status,
      startDate: negotiation.startDate,
      endDate: negotiation.endDate,
      depositAmount: negotiation.depositAmount,
      depositStatus: negotiation.depositStatus,
      messages: messages.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        content: msg.content,
        timestamp: msg.timestamp,
        flagged: msg.flagged,
      })),
    });
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch negotiation' },
      { status: 500 }
    );
  }
}

