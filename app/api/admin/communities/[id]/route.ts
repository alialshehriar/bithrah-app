import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// PATCH - Update community
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const communityId = parseInt(id);
    const body = await request.json();

    const updateData: any = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isPrivate !== undefined) updateData.isPrivate = body.isPrivate;

    const [updatedCommunity] = await db
      .update(communities)
      .set(updateData)
      .where(eq(communities.id, communityId))
      .returning();

    if (!updatedCommunity) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      community: updatedCommunity,
      message: 'Community updated successfully',
    });
  } catch (error) {
    console.error('Error updating community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update community' },
      { status: 500 }
    );
  }
}

// DELETE - Delete community
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const communityId = parseInt(id);

    const [deletedCommunity] = await db
      .delete(communities)
      .where(eq(communities.id, communityId))
      .returning();

    if (!deletedCommunity) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Community deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting community:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete community' },
      { status: 500 }
    );
  }
}

