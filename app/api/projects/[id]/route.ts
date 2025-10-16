import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { projects, users, backings } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET - Get project details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const projectId = parseInt(id);

    // Get project with creator info
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // Get investment stats
    const investmentStats = await db
      .select({
        totalInvestors: sql<number>`COUNT(DISTINCT ${backings.userId})`,
        totalInvested: sql<string>`COALESCE(SUM(${backings.amount}), 0)`,
      })
      .from(backings)
      .where(eq(backings.projectId, projectId));

    const stats = investmentStats[0];

      // Views tracking removed - field doesn't exist in schema));

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        totalInvestors: stats.totalInvestors || 0,
        totalInvested: stats.totalInvested || '0',
      },
    });
  } catch (error) {
    console.error('Project fetch error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب تفاصيل المشروع' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const projectId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Check if user owns the project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    if (project.creatorId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بتعديل هذا المشروع' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      fundingGoal,
      endDate,
      image,
      packages,
      risks,
      timeline,
      status,
    } = body;

    // Update project
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(fundingGoal && { fundingGoal: fundingGoal.toString() }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(image !== undefined && { image }),
        ...(packages && { packages: JSON.stringify(packages) }),
        ...(risks !== undefined && { risks }),
        ...(timeline && { timeline: JSON.stringify(timeline) }),
        ...(status && { status }),
      })
      .where(eq(projects.id, projectId))
      .returning();

    return NextResponse.json({
      success: true,
      project: updatedProject,
      message: 'تم تحديث المشروع بنجاح',
    });
  } catch (error) {
    console.error('Project update error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المشروع' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const projectId = parseInt(id);
    const userId = parseInt(session.user.id);

    // Check if user owns the project
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });

    if (!project) {
      return NextResponse.json(
        { error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    if (project.creatorId !== userId) {
      return NextResponse.json(
        { error: 'غير مصرح لك بحذف هذا المشروع' },
        { status: 403 }
      );
    }

    // Delete project
    await db.delete(projects).where(eq(projects.id, projectId));

    return NextResponse.json({
      success: true,
      message: 'تم حذف المشروع بنجاح',
    });
  } catch (error) {
    console.error('Project deletion error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف المشروع' },
      { status: 500 }
    );
  }
}

