import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { events, eventAttendees, users } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// GET /api/events/[id] - Get event details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const eventId = parseInt(id);

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

    // Get organizer
    const organizer = await db.query.users.findFirst({
      where: eq(users.id, event.organizerId),
    });

    // Get attendees
    const attendees = await db
      .select({
        id: eventAttendees.id,
        userId: eventAttendees.userId,
        status: eventAttendees.status,
        registeredAt: eventAttendees.registeredAt,
        user: users,
      })
      .from(eventAttendees)
      .innerJoin(users, eq(eventAttendees.userId, users.id))
      .where(eq(eventAttendees.eventId, eventId));

    // Get attendee count
    const attendeeCount = attendees.filter(a => a.status === 'confirmed').length;

    // Check if current user is attending
    const session = await auth();
    let isAttending = false;
    let userAttendance = null;

    if (session?.user?.id) {
      const userId = parseInt(session.user.id);
      userAttendance = attendees.find(a => a.userId === userId);
      isAttending = !!userAttendance && userAttendance.status === 'confirmed';
    }

    return NextResponse.json({
      success: true,
      event: {
        ...event,
        organizer,
        attendeeCount,
        spotsLeft: event.maxAttendees ? event.maxAttendees - attendeeCount : null,
        isAttending,
        userAttendance,
      },
      attendees: attendees.filter(a => a.status === 'confirmed'),
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الفعالية' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
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

    // Check if user is organizer
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json(
        { error: 'الفعالية غير موجودة' },
        { status: 404 }
      );
    }

    if (event.organizerId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح بتعديل هذه الفعالية' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      isOnline,
      meetingLink,
      maxAttendees,
      price,
      coverImage,
      tags,
      status,
    } = body;

    // Update event
    const [updatedEvent] = await db
      .update(events)
      .set({
        title: title || event.title,
        description: description || event.description,
        type: type || event.type,
        startDate: startDate ? new Date(startDate) : event.startDate,
        endDate: endDate ? new Date(endDate) : event.endDate,
        location: location !== undefined ? location : event.location,
        isOnline: isOnline !== undefined ? isOnline : event.isOnline,
        meetingLink: meetingLink !== undefined ? meetingLink : event.meetingLink,
        maxAttendees: maxAttendees !== undefined ? maxAttendees : event.maxAttendees,
        price: price !== undefined ? price : event.price,
        coverImage: coverImage !== undefined ? coverImage : event.coverImage,
        tags: tags !== undefined ? tags : event.tags,
        status: status || event.status,
      })
      .where(eq(events.id, eventId))
      .returning();

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الفعالية' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
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

    // Check if user is organizer
    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      return NextResponse.json(
        { error: 'الفعالية غير موجودة' },
        { status: 404 }
      );
    }

    if (event.organizerId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح بحذف هذه الفعالية' },
        { status: 403 }
      );
    }

    // Delete all attendees
    await db.delete(eventAttendees).where(eq(eventAttendees.eventId, eventId));

    // Delete event
    await db.delete(events).where(eq(events.id, eventId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف الفعالية بنجاح',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الفعالية' },
      { status: 500 }
    );
  }
}

