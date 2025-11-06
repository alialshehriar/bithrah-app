import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, projects } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { negotiateAsProjectOwner, NegotiationMessage } from '@/lib/ai/negotiationAgent';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const negotiationId = parseInt(params.id);
    const { message, userId } = await request.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'معلومات غير كاملة' },
        { status: 400 }
      );
    }

    // Get negotiation details
    const negotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
      with: {
        project: {
          with: {
            owner: true
          }
        }
      }
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'التفاوض غير موجود' },
        { status: 404 }
      );
    }

    // Check if negotiation is still active
    if (negotiation.status !== 'active') {
      return NextResponse.json(
        { error: 'التفاوض غير نشط' },
        { status: 400 }
      );
    }

    // Check if expired
    if (negotiation.expiresAt && new Date() > negotiation.expiresAt) {
      await db.update(negotiations)
        .set({ status: 'expired' })
        .where(eq(negotiations.id, negotiationId));
      
      return NextResponse.json(
        { error: 'انتهت مدة التفاوض' },
        { status: 400 }
      );
    }

    // Save investor message
    await db.insert(negotiationMessages).values({
      negotiationId,
      senderId: userId,
      message,
      isAiGenerated: false
    });

    // Get conversation history
    const history = await db.query.negotiationMessages.findMany({
      where: eq(negotiationMessages.negotiationId, negotiationId),
      orderBy: [desc(negotiationMessages.createdAt)],
      limit: 20
    });

    // Convert to conversation format
    const conversationHistory: NegotiationMessage[] = history
      .reverse()
      .map(msg => ({
        role: msg.senderId === userId ? 'user' as const : 'assistant' as const,
        content: msg.message
      }));

    // Get AI response
    const context = {
      projectId: negotiation.project.id,
      projectTitle: negotiation.project.title,
      projectDescription: negotiation.project.description,
      category: negotiation.project.category,
      fundingGoal: negotiation.project.fundingGoal,
      currentFunding: negotiation.project.currentFunding,
      ownerName: negotiation.project.owner?.name || 'صاحب المشروع',
      timeline: negotiation.project.timeline || '12 شهر',
      teamSize: negotiation.project.teamSize,
      existingTraction: negotiation.project.existingTraction
    };

    const aiResponse = await negotiateAsProjectOwner(
      context,
      conversationHistory,
      message
    );

    // Save AI response
    await db.insert(negotiationMessages).values({
      negotiationId,
      senderId: negotiation.ownerId,
      message: aiResponse.message,
      isAiGenerated: true
    });

    // If agreement reached, update negotiation status
    if (aiResponse.agreementReached) {
      await db.update(negotiations)
        .set({
          status: 'agreement_reached',
          agreementReached: true,
          suggestedTerms: aiResponse.suggestedTerms
        })
        .where(eq(negotiations.id, negotiationId));
    }

    return NextResponse.json({
      message: aiResponse.message,
      suggestedTerms: aiResponse.suggestedTerms,
      agreementReached: aiResponse.agreementReached
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const negotiationId = parseInt(params.id);

    // Get all messages
    const messages = await db.query.negotiationMessages.findMany({
      where: eq(negotiationMessages.negotiationId, negotiationId),
      orderBy: [negotiationMessages.createdAt]
    });

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسائل' },
      { status: 500 }
    );
  }
}
