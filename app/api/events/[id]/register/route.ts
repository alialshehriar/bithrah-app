import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { events, eventAttendees } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// POST /api/events/[id]/register - Register for event
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Get event
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json(
        { error: 'الفعالية غير موجودة' },
        { status: 404 }
      );
    }

    // Check if event is in the past
    if (new Date(event.endDate) < new Date()) {
      return NextResponse.json(
        { error: 'لا يمكن التسجيل في فعالية منتهية' },
        { status: 400 }
      );
    }

    // Check if already registered
    const existing = await db.query.eventAttendees.findFirst({
      where: and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, userId)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذه الفعالية' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxAttendees) {
      const attendeeCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(eventAttendees)
        .where(
          and(
            eq(eventAttendees.eventId, eventId),
            eq(eventAttendees.status, 'confirmed')
          )
        );

      if (attendeeCount[0]?.count >= event.maxAttendees) {
        return NextResponse.json(
          { error: 'الفعالية ممتلئة' },
          { status: 400 }
        );
      }
    }

    // Register user
    const [registration] = await db
      .insert(eventAttendees)
      .values({
        eventId,
        userId,
        status: 'confirmed',
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'تم التسجيل في الفعالية بنجاح',
      registration,
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل في الفعالية' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]/register - Cancel registration
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { id } = await context.params;
    const eventId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Find registration
    const registration = await db.query.eventAttendees.findFirst({
      where: and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, userId)
      ),
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'أنت غير مسجل في هذه الفعالية' },
        { status: 404 }
      );
    }

    // Delete registration
    await db
      .delete(eventAttendees)
      .where(eq(eventAttendees.id, registration.id));

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء التسجيل بنجاح',
    });
  } catch (error) {
    console.error('Error canceling registration:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إلغاء التسجيل' },
      { status: 500 }
    );
  }
}

