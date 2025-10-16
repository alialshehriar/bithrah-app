import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { events, eventAttendees } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = db.select().from(events);

    // Filter by type
    if (type !== 'all') {
      query = query.where(eq(events.type, type as any));
    }

    // Filter by status
    const now = new Date();
    if (status === 'upcoming') {
      query = query.where(gte(events.startDate, now));
    } else if (status === 'past') {
      query = query.where(lte(events.endDate, now));
    } else if (status === 'ongoing') {
      query = query.where(
        and(
          lte(events.startDate, now),
          gte(events.endDate, now)
        )
      );
    }

    const eventsList = await query
      .orderBy(desc(events.startDate))
      .limit(limit);

    // Get attendee counts for each event
    const eventsWithCounts = await Promise.all(
      eventsList.map(async (event) => {
        const attendeeCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(eventAttendees)
          .where(eq(eventAttendees.eventId, event.id));

        return {
          ...event,
          attendeeCount: attendeeCount[0]?.count || 0,
          spotsLeft: event.maxAttendees ? event.maxAttendees - (attendeeCount[0]?.count || 0) : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      events: eventsWithCounts,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الفعاليات' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
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
    } = body;

    // Validation
    if (!title || !description || !type || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return NextResponse.json(
        { error: 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية' },
        { status: 400 }
      );
    }

    // Create event
    const [newEvent] = await db
      .insert(events)
      .values({
        organizerId: userId,
        title,
        description,
        type,
        startDate: start,
        endDate: end,
        location: location || null,
        isOnline: isOnline || false,
        meetingLink: meetingLink || null,
        maxAttendees: maxAttendees || null,
        price: price || 0,
        coverImage: coverImage || null,
        tags: tags || null,
        status: 'upcoming',
      })
      .returning();

    return NextResponse.json({
      success: true,
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الفعالية' },
      { status: 500 }
    );
  }
}

