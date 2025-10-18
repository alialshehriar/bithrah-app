import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, like, or, and, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.select().from(users);

    // Apply filters
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.username, `%${search}%`)
        )
      );
    }

    if (role && role !== 'all') {
      conditions.push(eq(users.role, role));
    }

    if (status && status !== 'all') {
      conditions.push(eq(users.status, status));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    query = query.orderBy(desc(users.createdAt)).limit(limit) as any;

    const allUsers = await query;

    return NextResponse.json({
      success: true,
      users: allUsers,
      total: allUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users',
        users: [],
      },
      { status: 500 }
    );
  }
}

