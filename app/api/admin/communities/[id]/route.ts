import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const communityId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(communityId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المجتمع غير صحيح' },
        { status: 400 }
      );
    }

    const [updatedCommunity] = await db
      .update(communities)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(communities.id, communityId))
      .returning();

    return NextResponse.json({
      success: true,
      community: updatedCommunity,
    });
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المجتمع' },
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
    const communityId = parseInt(id, 10);

    if (isNaN(communityId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المجتمع غير صحيح' },
        { status: 400 }
      );
    }

    await db.delete(communities).where(eq(communities.id, communityId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المجتمع بنجاح',
    });
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المجتمع' },
      { status: 500 }
    );
  }
}

