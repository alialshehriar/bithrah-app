import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { negotiations, negotiationMessages, wallets, transactions } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

// GET - Get negotiation details with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const negotiationId = parseInt(params.id);
    const userId = parseInt(session.user.id);

    // Get negotiation
    const negotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
      with: {
        project: true,
        investor: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        projectOwner: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'المفاوضة غير موجودة' },
        { status: 404 }
      );
    }

    // Check if user is part of this negotiation
    if (negotiation.investorId !== userId && negotiation.projectOwnerId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول لهذه المفاوضة' },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await db.query.negotiationMessages.findMany({
      where: eq(negotiationMessages.negotiationId, negotiationId),
      orderBy: [negotiationMessages.createdAt],
      with: {
        sender: {
          columns: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Mark messages as read
    await db
      .update(negotiationMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(negotiationMessages.negotiationId, negotiationId),
          eq(negotiationMessages.receiverId, userId),
          eq(negotiationMessages.isRead, false)
        )
      );

    return NextResponse.json({
      success: true,
      negotiation,
      messages,
    });
  } catch (error) {
    console.error('Negotiation fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تفاصيل المفاوضة' },
      { status: 500 }
    );
  }
}

// PUT - Update negotiation status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const negotiationId = parseInt(params.id);
    const userId = parseInt(session.user.id);
    const body = await request.json();
    const { status, finalAmount, terms } = body;

    // Get negotiation
    const negotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: 'المفاوضة غير موجودة' },
        { status: 404 }
      );
    }

    // Check if user is part of this negotiation
    if (negotiation.investorId !== userId && negotiation.projectOwnerId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتحديث هذه المفاوضة' },
        { status: 403 }
      );
    }

    // Handle different status updates
    if (status === 'accepted') {
      // Both parties must agree
      if (userId === negotiation.projectOwnerId) {
        // Project owner accepts
        await db
          .update(negotiations)
          .set({
            ownerAccepted: true,
            updatedAt: new Date(),
          })
          .where(eq(negotiations.id, negotiationId));

        // Check if investor also accepted
        if (negotiation.investorAccepted) {
          await db
            .update(negotiations)
            .set({
              status: 'accepted',
              finalAmount: finalAmount?.toString() || null,
              terms: terms || null,
              updatedAt: new Date(),
            })
            .where(eq(negotiations.id, negotiationId));
        }
      } else {
        // Investor accepts
        await db
          .update(negotiations)
          .set({
            investorAccepted: true,
            updatedAt: new Date(),
          })
          .where(eq(negotiations.id, negotiationId));

        // Check if owner also accepted
        if (negotiation.ownerAccepted) {
          await db
            .update(negotiations)
            .set({
              status: 'accepted',
              finalAmount: finalAmount?.toString() || null,
              terms: terms || null,
              updatedAt: new Date(),
            })
            .where(eq(negotiations.id, negotiationId));
        }
      }
    } else if (status === 'rejected' || status === 'cancelled') {
      // Return deposit to investor
      const depositAmount = parseFloat(negotiation.depositAmount);
      
      await db
        .update(wallets)
        .set({
          balance: sql`${wallets.balance} + ${depositAmount}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, negotiation.investorId));

      // Create transaction record
      await db.insert(transactions).values({
        userId: negotiation.investorId,
        type: 'deposit_refund',
        amount: negotiation.depositAmount,
        status: 'completed',
        description: `استرداد المبلغ المسترد من التفاوض`,
        relatedId: negotiationId,
      });

      // Update negotiation status
      await db
        .update(negotiations)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(negotiations.id, negotiationId));
    }

    const updatedNegotiation = await db.query.negotiations.findFirst({
      where: eq(negotiations.id, negotiationId),
    });

    return NextResponse.json({
      success: true,
      negotiation: updatedNegotiation,
      message: 'تم تحديث حالة المفاوضة بنجاح',
    });
  } catch (error) {
    console.error('Negotiation update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المفاوضة' },
      { status: 500 }
    );
  }
}

