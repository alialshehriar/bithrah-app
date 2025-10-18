import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, wallets, projects, transactions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Get wallet
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    // Get projects
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.creatorId, userId));

    // Get transactions
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        wallet: wallet || null,
        projects: userProjects,
        transactions: userTransactions,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المستخدم' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المستخدم غير صحيح' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // Delete user's wallet
    await db.delete(wallets).where(eq(wallets.userId, userId));

    // Delete user's transactions
    await db.delete(transactions).where(eq(transactions.userId, userId));

    // Note: In production, you might want to soft delete or handle projects differently
    // For now, we'll just delete the user
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المستخدم' },
      { status: 500 }
    );
  }
}

