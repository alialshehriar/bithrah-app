import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    // Update project
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({
      success: true,
      project: updatedProject,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المشروع' },
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
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع غير صحيح' },
        { status: 400 }
      );
    }

    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المشروع' },
      { status: 500 }
    );
  }
}

