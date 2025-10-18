import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiationMessages, negotiations, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

// Simple content monitoring patterns
const FORBIDDEN_PATTERNS = [
  /\b\d{10}\b/, // Phone numbers (10 digits)
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone numbers with separators
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
  /\b(whatsapp|واتساب|واتس|telegram|تلغرام|تليجرام)\b/i, // Messaging apps
  /\b(twitter|تويتر|instagram|انستقرام|انستا|snapchat|سناب)\b/i, // Social media
  /\b(call me|اتصل|تواصل معي|راسلني)\b/i, // Contact requests
];

function checkForbiddenContent(content: string): boolean {
  return FORBIDDEN_PATTERNS.some((pattern) => pattern.test(content));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const negotiationId = parseInt(id);
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Check if negotiation exists and is active
    const negotiationData = await db
      .select()
      .from(negotiations)
      .where(
        and(
          eq(negotiations.id, negotiationId),
          eq(negotiations.status, 'active')
        )
      )
      .limit(1);

    if (negotiationData.length === 0) {
      return NextResponse.json({ error: 'Negotiation not found or expired' }, { status: 404 });
    }

    // Check if user is part of this negotiation
    const negotiation = negotiationData[0];
    const isParticipant =
      negotiation.investorId === session.id;

    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check for forbidden content
    const isFlagged = checkForbiddenContent(content);

    // Insert message
    const [newMessage] = await db
      .insert(negotiationMessages)
      .values({
        negotiationId,
        senderId: session.id,
        content,
      })
      .returning();

    // Get sender name
    const sender = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1);

    // If flagged, could trigger additional actions (email admin, etc.)
    if (isFlagged) {
      console.warn(`Flagged message in negotiation ${negotiationId} by user ${session.id}`);
      // TODO: Implement admin notification
    }

    return NextResponse.json({
      id: newMessage.id,
      senderId: newMessage.senderId,
      senderName: sender[0]?.name || 'Unknown',
      content: newMessage.content,
      timestamp: newMessage.createdAt,
      flagged: newMessage.flagged,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

